// Demo mode — a faithful in-memory simulator of the refactored soqm_backend.
// ---------------------------------------------------------------------------
// Active when VITE_DEMO_MODE=true, or automatically in production builds with
// no VITE_API_BASE_URL configured (i.e. nowhere real to point at — e.g. the
// Vercel deploy). It mirrors the real /api/v1 contract closely enough that
// every implemented feature can be exercised end-to-end from the deployed UI:
//
//   - login validates credentials, rejecting unknown ones with the backend's
//     exact error shape ({ message, code, details })
//   - one test account per backend role (src/core/roles.py), plus extra users
//   - permission enforcement mirrors seed_role_permissions.py (e.g. roles
//     without component:read get 403 on GET /components, like the real API)
//   - components enforce the status state machine, the max-8 rule and
//     delete-only-when-ARCHIVED
//   - objectives enforce the 9-state workflow (edit/delete only while draft)
//   - risks compute score = occurence × significance
//   - departments expose the parent/children hierarchy
//
// The data below doubles as the "dataset + users to test" for the deployment.

import { COMPONENT_TRANSITIONS, OBJECTIVE_TRANSITIONS } from "@/lib/status"

export const IS_DEMO =
  import.meta.env.VITE_DEMO_MODE === "true" ||
  (import.meta.env.PROD && !import.meta.env.VITE_API_BASE_URL)

export const DEMO_PASSWORD = "demo1234"

// --- IDs (stable, UUID-shaped) ---------------------------------------------
const uid = (p, n) => `${p}-0000-4000-8000-${String(n).padStart(12, "0")}`
const ROLE = {
  SUPER_ADMIN: uid("r0000001", 1),
  ADMIN: uid("r0000002", 2),
  MANAGER: uid("r0000003", 3),
  REVIEWER: uid("r0000004", 4),
  OPERATOR: uid("r0000005", 5),
  QUALITY_CHAMPION: uid("r0000006", 6),
  VIEWER: uid("r0000007", 7),
}

// GET /auth/roles → [{ id, name }]
export const DEMO_ROLES = Object.entries(ROLE).map(([name, id]) => ({ id, name }))
const roleNameById = (id) => DEMO_ROLES.find((r) => r.id === id)?.name ?? null

// --- Permission matrix (mirror of seed_role_permissions.py) ----------------
// resource:action strings. Roles not listed are seeded with NO permissions.
const PERMISSIONS = {
  SUPER_ADMIN: ["*"],
  ADMIN: ["*"],
  MANAGER: ["auth:read", "auth:read_own", "component:read"],
  OPERATOR: ["auth:read_own", "component:read"],
  REVIEWER: [],
  QUALITY_CHAMPION: [],
  VIEWER: [],
}
function can(role, perm) {
  const list = PERMISSIONS[role] ?? []
  return list.includes("*") || list.includes(perm)
}

// --- Test accounts (one per role, password demo1234) -----------------------
export const DEMO_USERS = [
  { email: "superadmin@gt.dz", role: "SUPER_ADMIN", name: "Abdelatif Aitouche" },
  { email: "admin@gt.dz", role: "ADMIN", name: "Sara Benali" },
  { email: "manager@gt.dz", role: "MANAGER", name: "Karim Haddad" },
  { email: "reviewer@gt.dz", role: "REVIEWER", name: "Amina Bouchareb" },
  { email: "operator@gt.dz", role: "OPERATOR", name: "Yacine Merbah" },
  { email: "champion@gt.dz", role: "QUALITY_CHAMPION", name: "Lina Cherif" },
  { email: "viewer@gt.dz", role: "VIEWER", name: "Mehdi Saadi" },
]

// =====================  Seed dataset (mutable store)  =======================
const C = (n) => uid("c1a1b1d1", n)
const O = (n) => uid("0b1ec71e", n)
const U = (n) => uid("00000001", n)
const D = (n) => uid("dep70000", n)
const R = (n) => uid("415c0000", n)

const now = () => new Date()
const daysFromNow = (d) => {
  const x = new Date()
  x.setDate(x.getDate() + d)
  return x.toISOString()
}
const dateOnly = (iso) => iso.slice(0, 10)

// --- Components (ISQM 1 — 8 components, status enum) ------------------------
const seedComponents = [
  { id: C(1), name: "Firm's Risk Assessment Process", description: "Establishing quality objectives, identifying and assessing quality risks, and designing responses.", isqm_reference: "ISQM1.25-27", status: "ACTIVE", display_order: 1 },
  { id: C(2), name: "Governance and Leadership", description: "The firm's culture, leadership responsibility and accountability for quality.", isqm_reference: "ISQM1.28-29", status: "ACTIVE", display_order: 2 },
  { id: C(3), name: "Relevant Ethical Requirements", description: "Fulfilment of responsibilities in accordance with relevant ethical requirements, including independence.", isqm_reference: "ISQM1.30-31", status: "ACTIVE", display_order: 3 },
  { id: C(4), name: "Acceptance and Continuance", description: "Acceptance and continuance of client relationships and specific engagements.", isqm_reference: "ISQM1.32-33", status: "ACTIVE", display_order: 4 },
  { id: C(5), name: "Engagement Performance", description: "Engagements performed in accordance with professional standards and legal requirements.", isqm_reference: "ISQM1.34-35", status: "ACTIVE", display_order: 5 },
  { id: C(6), name: "Resources", description: "Appropriate human, technological and intellectual resources to operate the system of quality management.", isqm_reference: "ISQM1.36-37", status: "ACTIVE", display_order: 6 },
  { id: C(7), name: "Information and Communication", description: "The information system and communication that supports the system of quality management.", isqm_reference: "ISQM1.38-39", status: "IN_ACTIVE", display_order: 7 },
  { id: C(8), name: "Monitoring and Remediation", description: "Monitoring the system of quality management and remediating deficiencies.", isqm_reference: "ISQM1.40-47", status: "ARCHIVED", display_order: 8 },
]

// --- Quality objectives (across the 9-state workflow) ----------------------
const seedObjectives = [
  { id: O(1), objective_text: "Maintain a robust firm-level risk assessment refreshed at least annually.", description: "Quality objectives, risks and responses reviewed every fiscal year and on significant change.", review_date: daysFromNow(120), component_id: C(1), status: "active", updated_at: daysFromNow(-14) },
  { id: O(2), objective_text: "Leadership demonstrates commitment to quality through actions and resourcing.", description: "Tone at the top reinforced via quarterly leadership communications.", review_date: daysFromNow(90), component_id: C(2), status: "active", updated_at: daysFromNow(-8) },
  { id: O(3), objective_text: "All partners and staff comply with IESBA independence requirements.", description: "Annual independence confirmations collected and exceptions remediated.", review_date: daysFromNow(45), component_id: C(3), status: "under_review", updated_at: daysFromNow(-3) },
  { id: O(4), objective_text: "Client acceptance evaluates integrity, competence and capacity before engagement.", description: "Risk-rated acceptance checklist completed for every new engagement.", review_date: daysFromNow(200), component_id: C(4), status: "approved", updated_at: daysFromNow(-30) },
  { id: O(5), objective_text: "Engagement teams apply appropriate professional scepticism and judgement.", description: "EQR coverage for all listed and high-risk engagements.", review_date: daysFromNow(60), component_id: C(5), status: "active", updated_at: daysFromNow(-6) },
  { id: O(6), objective_text: "Staff possess the competence and capabilities to perform quality engagements.", description: "Annual CPD targets met and tracked per professional.", review_date: daysFromNow(150), component_id: C(6), status: "draft", updated_at: null },
  { id: O(7), objective_text: "Information needed to operate the SOQM is reliable and timely.", description: "Quality dashboards refreshed weekly from source systems.", review_date: daysFromNow(75), component_id: C(1), status: "draft", updated_at: null },
  { id: O(8), objective_text: "Deficiencies identified through monitoring are remediated on a timely basis.", description: "Root-cause analysis performed for all severe deficiencies.", review_date: daysFromNow(30), component_id: C(5), status: "suspended", updated_at: daysFromNow(-20) },
  { id: O(9), objective_text: "Legacy independence tracking migrated to the new platform.", description: "Superseded by the firm-wide GRC rollout.", review_date: daysFromNow(-10), component_id: C(3), status: "achieved", updated_at: daysFromNow(-60) },
  { id: O(10), objective_text: "Decommission the spreadsheet-based engagement register.", description: "Archived after platform go-live.", review_date: daysFromNow(-40), component_id: C(4), status: "archived", updated_at: daysFromNow(-90) },
]

// --- Users (richer than the role chips; mirrors UserRead) -------------------
const seedUsers = [
  { id: U(1), first_name: "Abdelatif", last_name: "Aitouche", email: "superadmin@gt.dz", is_active: true, roles: ["SUPER_ADMIN"] },
  { id: U(2), first_name: "Sara", last_name: "Benali", email: "admin@gt.dz", is_active: true, roles: ["ADMIN"] },
  { id: U(3), first_name: "Karim", last_name: "Haddad", email: "manager@gt.dz", is_active: true, roles: ["MANAGER"] },
  { id: U(4), first_name: "Amina", last_name: "Bouchareb", email: "reviewer@gt.dz", is_active: true, roles: ["REVIEWER"] },
  { id: U(5), first_name: "Yacine", last_name: "Merbah", email: "operator@gt.dz", is_active: true, roles: ["OPERATOR"] },
  { id: U(6), first_name: "Lina", last_name: "Cherif", email: "champion@gt.dz", is_active: true, roles: ["QUALITY_CHAMPION"] },
  { id: U(7), first_name: "Mehdi", last_name: "Saadi", email: "viewer@gt.dz", is_active: true, roles: ["VIEWER"] },
  { id: U(8), first_name: "Nadia", last_name: "Belkacem", email: "nadia.belkacem@gt.dz", is_active: true, roles: ["MANAGER"] },
  { id: U(9), first_name: "Omar", last_name: "Khelifi", email: "omar.khelifi@gt.dz", is_active: true, roles: ["REVIEWER"] },
  { id: U(10), first_name: "Yasmine", last_name: "Toumi", email: "yasmine.toumi@gt.dz", is_active: false, roles: ["OPERATOR"] },
  { id: U(11), first_name: "Riad", last_name: "Bouzid", email: "riad.bouzid@gt.dz", is_active: true, roles: ["VIEWER"] },
  { id: U(12), first_name: "Selma", last_name: "Hamdi", email: "selma.hamdi@gt.dz", is_active: false, roles: ["REVIEWER"] },
]

// --- Departments (org hierarchy) -------------------------------------------
const seedDepartments = [
  { id: D(1), name: "Grant Thornton Algeria", parent_dept: null },
  { id: D(2), name: "Audit & Assurance", parent_dept: D(1) },
  { id: D(3), name: "Advisory", parent_dept: D(1) },
  { id: D(4), name: "Tax", parent_dept: D(1) },
  { id: D(5), name: "Operations & Support", parent_dept: D(1) },
  { id: D(6), name: "Financial Statement Audit", parent_dept: D(2) },
  { id: D(7), name: "IT Audit", parent_dept: D(2) },
  { id: D(8), name: "Risk Advisory", parent_dept: D(3) },
  { id: D(9), name: "Transaction Advisory", parent_dept: D(3) },
  { id: D(10), name: "Quality & Compliance", parent_dept: D(5) },
  { id: D(11), name: "Human Resources", parent_dept: D(5) },
  { id: D(12), name: "Information Technology", parent_dept: D(5) },
]

// --- Risks (spread across the 3×3 occurence × significance matrix) ---------
const seedRisks = [
  { id: R(1), objective_id: O(3), component_id: C(3), risk_ref: "R-001", risk_discription: "Undisclosed financial interest in an assurance client breaches independence.", occurence: 2, significance: 3, date_identified: dateOnly(daysFromNow(-40)), status: "assessed" },
  { id: R(2), objective_id: O(5), component_id: C(5), risk_ref: "R-002", risk_discription: "EQR not completed before the audit report is dated on a listed engagement.", occurence: 2, significance: 3, date_identified: dateOnly(daysFromNow(-30)), status: "treatment_planned" },
  { id: R(3), objective_id: O(1), component_id: C(1), risk_ref: "R-003", risk_discription: "Firm risk assessment not refreshed for a significant regulatory change.", occurence: 1, significance: 3, date_identified: dateOnly(daysFromNow(-25)), status: "identified" },
  { id: R(4), objective_id: O(4), component_id: C(4), risk_ref: "R-004", risk_discription: "High-risk client accepted without adequate background checks.", occurence: 3, significance: 3, date_identified: dateOnly(daysFromNow(-60)), status: "mitigated" },
  { id: R(5), objective_id: O(6), component_id: C(6), risk_ref: "R-005", risk_discription: "Insufficient staff capacity during peak audit season impacts quality.", occurence: 3, significance: 2, date_identified: dateOnly(daysFromNow(-20)), status: "treatment_planned" },
  { id: R(6), objective_id: O(2), component_id: C(2), risk_ref: "R-006", risk_discription: "Quality not embedded in partner performance evaluation criteria.", occurence: 2, significance: 2, date_identified: dateOnly(daysFromNow(-50)), status: "accepted" },
  { id: R(7), objective_id: O(8), component_id: C(5), risk_ref: "R-007", risk_discription: "Monitoring deficiencies not remediated within target timeframe.", occurence: 2, significance: 2, date_identified: dateOnly(daysFromNow(-15)), status: "under_review" },
  { id: R(8), objective_id: O(7), component_id: C(1), risk_ref: "R-008", risk_discription: "Quality dashboard data sourced from an unreconciled system.", occurence: 1, significance: 2, date_identified: dateOnly(daysFromNow(-10)), status: "identified" },
  { id: R(9), objective_id: O(1), component_id: C(1), risk_ref: "R-009", risk_discription: "Engagement-level scaling of firm responses inconsistently applied.", occurence: 3, significance: 1, date_identified: dateOnly(daysFromNow(-12)), status: "assessed" },
  { id: R(10), objective_id: O(3), component_id: C(3), risk_ref: "R-010", risk_discription: "Annual independence confirmations submitted late by some staff.", occurence: 2, significance: 1, date_identified: dateOnly(daysFromNow(-8)), status: "closed" },
  { id: R(11), objective_id: O(5), component_id: C(5), risk_ref: "R-011", risk_discription: "Minor documentation gaps in working-paper review notes.", occurence: 1, significance: 1, date_identified: dateOnly(daysFromNow(-5)), status: "accepted" },
  { id: R(12), objective_id: O(6), component_id: C(6), risk_ref: "R-012", risk_discription: "CPD records occasionally lag the central training register.", occurence: 1, significance: 1, date_identified: dateOnly(daysFromNow(-3)), status: "identified" },
]

// Live store — cloned from seeds so resets are easy and seeds stay pristine.
const clone = (x) => JSON.parse(JSON.stringify(x))
const store = {
  components: clone(seedComponents),
  objectives: clone(seedObjectives),
  users: clone(seedUsers),
  departments: clone(seedDepartments),
  risks: clone(seedRisks),
}

// =====================  Helpers  ===========================================
const SESSION_KEY = "demo_session"
const delay = (ms = 320) => new Promise((r) => setTimeout(r, ms))
let counter = 100
const newId = (prefix) => uid(prefix, ++counter)

// Builds a rejection shaped like an axios error from the real API, so the
// frontend's error handling behaves identically in demo and live mode.
function apiError(status, message, code = "ERROR") {
  const err = new Error(message)
  err.response = { status, data: { message, code, details: {} } }
  return err
}

function requireSession() {
  const user = getDemoSession()
  if (!user) throw apiError(401, "Invalid Token", "AUTH_TOKEN_INVALID")
  return user
}
function requirePermission(perm) {
  const user = requireSession()
  if (!can(user.role, perm)) throw apiError(403, "Access Denied", "AUTH_FORBIDDEN")
  return user
}

// Component + objective state machines are imported from lib/status.js (the
// single source of truth shared with the UI).

// =====================  Auth  ==============================================
export async function demoLogin(email, password) {
  await delay(420)
  const account = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === String(email).trim().toLowerCase()
  )
  if (!account || password !== DEMO_PASSWORD) {
    throw apiError(401, "Invalid Credentials", "AUTH_INVALID_CREDENTIALS")
  }
  const record = store.users.find((u) => u.email === account.email)
  const user = {
    sub: record?.id ?? newId("00000001"),
    email: account.email,
    role: account.role,
    name: account.name,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}
export function getDemoSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
export function clearDemoSession() {
  localStorage.removeItem(SESSION_KEY)
}

// =====================  Demo API namespaces  ===============================
export const demoApi = {
  // ---- Components --------------------------------------------------------
  components: {
    async list() {
      await delay()
      requirePermission("component:read")
      return clone(store.components).sort((a, b) => a.display_order - b.display_order)
    },
    async get(id) {
      await delay()
      requirePermission("component:read")
      const c = store.components.find((x) => x.id === id)
      if (!c) throw apiError(404, "Resource not found", "NOT_FOUND")
      return clone(c)
    },
    async create(data) {
      await delay()
      requirePermission("component:create")
      if (store.components.length >= 8) {
        throw apiError(400, "A maximum of 8 components is allowed.", "VALIDATION_ERROR")
      }
      if (store.components.some((c) => c.name.toLowerCase() === data.name?.trim().toLowerCase())) {
        throw apiError(400, "A component with this name already exists.", "VALIDATION_ERROR")
      }
      const order = Number(data.display_order)
      if (!(order >= 1 && order <= 8)) {
        throw apiError(400, "Display order must be between 1 and 8.", "VALIDATION_ERROR")
      }
      if (store.components.some((c) => c.display_order === order)) {
        throw apiError(400, "Display order must be unique across components.", "VALIDATION_ERROR")
      }
      const c = {
        id: newId("c1a1b1d1"),
        name: data.name.trim(),
        description: data.description ?? "",
        isqm_reference: data.isqm_reference?.trim() ?? "",
        status: "ACTIVE",
        display_order: order,
      }
      store.components.push(c)
      return clone(c)
    },
    async update(id, data) {
      await delay()
      requirePermission("component:update")
      const c = store.components.find((x) => x.id === id)
      if (!c) throw apiError(404, "Resource not found", "NOT_FOUND")
      if (data.status && data.status !== c.status) {
        const allowed = COMPONENT_TRANSITIONS[c.status] ?? []
        if (!allowed.includes(data.status)) {
          throw apiError(400, `Invalid transition ${c.status} → ${data.status}.`, "TRANSITION_ERROR")
        }
        c.status = data.status
      }
      for (const k of ["name", "description", "isqm_reference"]) {
        if (data[k] != null) c[k] = data[k]
      }
      return clone(c)
    },
    async remove(id) {
      await delay()
      requirePermission("component:delete")
      const c = store.components.find((x) => x.id === id)
      if (!c) throw apiError(404, "Resource not found", "NOT_FOUND")
      if (c.status !== "ARCHIVED") {
        throw apiError(400, "Only ARCHIVED components can be deleted.", "VALIDATION_ERROR")
      }
      store.components = store.components.filter((x) => x.id !== id)
      return null
    },
  },

  // ---- Objectives (backend: no auth required) ---------------------------
  objectives: {
    async list({ page = 1, limit = 10 } = {}) {
      await delay()
      requireSession()
      const all = clone(store.objectives).sort(
        (a, b) => new Date(b.updated_at ?? 0) - new Date(a.updated_at ?? 0)
      )
      const start = limit * (page - 1)
      return all.slice(start, start + limit)
    },
    async get(id) {
      await delay()
      requireSession()
      const o = store.objectives.find((x) => x.id === id)
      if (!o) throw apiError(404, "Resource not found", "NOT_FOUND")
      return clone(o)
    },
    async create(data) {
      await delay()
      requireSession()
      const comp = store.components.find((c) => c.id === data.component_id)
      if (!comp) throw apiError(404, "Component not found", "NOT_FOUND")
      if (comp.status !== "ACTIVE") {
        throw apiError(400, "Objectives can only be created for ACTIVE components.", "VALIDATION_ERROR")
      }
      if (new Date(data.review_date) <= now()) {
        throw apiError(400, "Review date must be in the future.", "VALIDATION_ERROR")
      }
      const o = {
        id: newId("0b1ec71e"),
        objective_text: data.objective_text,
        description: data.description ?? "",
        review_date: new Date(data.review_date).toISOString(),
        component_id: data.component_id,
        status: "draft",
        updated_at: new Date().toISOString(),
      }
      store.objectives.unshift(o)
      return clone(o)
    },
    async update(id, data) {
      await delay()
      requireSession()
      const o = store.objectives.find((x) => x.id === id)
      if (!o) throw apiError(404, "Resource not found", "NOT_FOUND")
      // Status transitions are always allowed (validated by the workflow map);
      // content edits only while the objective is still a draft.
      if (data.status && data.status !== o.status) {
        const allowed = OBJECTIVE_TRANSITIONS[o.status] ?? []
        if (!allowed.includes(data.status)) {
          throw apiError(400, `Invalid transition ${o.status} → ${data.status}.`, "TRANSITION_ERROR")
        }
        o.status = data.status
      }
      const contentKeys = ["objective_text", "description", "review_date", "component_id"]
      const editsContent = contentKeys.some((k) => data[k] != null)
      if (editsContent) {
        if (o.status !== "draft") {
          throw apiError(400, "Only draft objectives can be edited.", "VALIDATION_ERROR")
        }
        if (data.review_date && new Date(data.review_date) <= now()) {
          throw apiError(400, "Review date must be in the future.", "VALIDATION_ERROR")
        }
        for (const k of contentKeys) {
          if (data[k] != null) {
            o[k] = k === "review_date" ? new Date(data[k]).toISOString() : data[k]
          }
        }
      }
      o.updated_at = new Date().toISOString()
      return clone(o)
    },
    async remove(id) {
      await delay()
      requireSession()
      const o = store.objectives.find((x) => x.id === id)
      if (!o) throw apiError(404, "Resource not found", "NOT_FOUND")
      if (o.status !== "draft") {
        throw apiError(400, "Only draft objectives can be deleted — archive instead.", "VALIDATION_ERROR")
      }
      store.objectives = store.objectives.filter((x) => x.id !== id)
      return null
    },
  },

  // ---- Users / auth -----------------------------------------------------
  users: {
    async list({ page = 1, limit = 10 } = {}) {
      await delay()
      requirePermission("auth:read")
      const all = clone(store.users)
      const start = limit * (page - 1)
      return all.slice(start, start + limit)
    },
    async roles() {
      await delay(180)
      return clone(DEMO_ROLES)
    },
    async register(data) {
      await delay()
      requirePermission("auth:create")
      if (store.users.some((u) => u.email.toLowerCase() === data.email?.trim().toLowerCase())) {
        throw apiError(400, "A user with this email already exists.", "VALIDATION_ERROR")
      }
      const role = roleNameById(data.role_id)
      if (!role) throw apiError(400, "Invalid role.", "VALIDATION_ERROR")
      const u = {
        id: newId("00000001"),
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email.trim(),
        is_active: true,
        roles: [role],
      }
      store.users.push(u)
      return clone(u)
    },
    // Backend exposes one-way PATCH /{id}/block/. For a usable test harness the
    // demo toggles is_active so the action can be exercised both ways.
    async block(id) {
      await delay()
      requirePermission("auth:block")
      const u = store.users.find((x) => x.id === id)
      if (!u) throw apiError(404, "Resource not found", "NOT_FOUND")
      u.is_active = !u.is_active
      return clone(u)
    },
    async assignRole(id, roleId) {
      await delay()
      requirePermission("auth:create")
      const u = store.users.find((x) => x.id === id)
      if (!u) throw apiError(404, "Resource not found", "NOT_FOUND")
      const role = roleNameById(roleId)
      if (!role) throw apiError(400, "Invalid role.", "VALIDATION_ERROR")
      u.roles = [role]
      return clone(u)
    },
  },

  // ---- Departments (backend: no auth required) --------------------------
  departments: {
    async list() {
      await delay()
      requireSession()
      return clone(store.departments).map((d) => ({
        ...d,
        children_dept: store.departments
          .filter((c) => c.parent_dept === d.id)
          .map((c) => ({ id: c.id, name: c.name })),
      }))
    },
    async get(id) {
      await delay()
      requireSession()
      const d = store.departments.find((x) => x.id === id)
      if (!d) throw apiError(404, "Resource not found", "NOT_FOUND")
      return {
        ...clone(d),
        children_dept: store.departments
          .filter((c) => c.parent_dept === d.id)
          .map((c) => ({ id: c.id, name: c.name })),
      }
    },
    async create(data) {
      await delay()
      requireSession()
      if (store.departments.some((d) => d.name.toLowerCase() === data.name?.trim().toLowerCase())) {
        throw apiError(400, "A department with this name already exists.", "VALIDATION_ERROR")
      }
      const d = {
        id: newId("dep70000"),
        name: data.name.trim(),
        parent_dept: data.parent_dept || null,
      }
      store.departments.push(d)
      return { ...clone(d), children_dept: [] }
    },
  },

  // ---- Risks (backend: POST only; demo also serves a listing) -----------
  risks: {
    async list() {
      await delay()
      requireSession()
      return clone(store.risks).map((r) => ({ ...r, score: r.occurence * r.significance }))
    },
    async create(data) {
      await delay()
      requireSession()
      const comp = store.components.find((c) => c.id === data.component_id)
      if (!comp) throw apiError(404, "Component not found", "NOT_FOUND")
      if (comp.status !== "ACTIVE") {
        throw apiError(400, "Risks can only be created for ACTIVE components.", "VALIDATION_ERROR")
      }
      const obj = store.objectives.find((o) => o.id === data.objective_id)
      if (!obj) throw apiError(404, "Objective not found", "NOT_FOUND")
      const occ = Number(data.occurence)
      const sig = Number(data.significance)
      if (![1, 2, 3].includes(occ) || ![1, 2, 3].includes(sig)) {
        throw apiError(400, "Occurrence and significance must each be 1, 2 or 3.", "VALIDATION_ERROR")
      }
      const r = {
        id: newId("415c0000"),
        objective_id: data.objective_id,
        component_id: data.component_id,
        risk_ref: data.risk_ref?.trim() || `R-${String(store.risks.length + 1).padStart(3, "0")}`,
        risk_discription: data.risk_discription ?? "",
        occurence: occ,
        significance: sig,
        date_identified: data.date_identified || dateOnly(new Date().toISOString()),
        status: data.status || "identified",
        score: occ * sig,
      }
      store.risks.push(r)
      return clone(r)
    },
  },
}
