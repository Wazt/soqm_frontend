// Demo mode — used for backend-less test deployments (e.g. Vercel previews).
// Active when VITE_DEMO_MODE=true, or automatically in production builds that
// have no VITE_API_BASE_URL configured (i.e. nowhere real to point at).
//
// It simulates the real soqm_backend contract so every implemented backend
// feature can be exercised from the deployed UI:
//   - login validates credentials and rejects unknown ones with the backend's
//     exact error shape (403 {message: "Invalid Credentials", details: {}})
//   - one test account per backend role (src/core/roles.py)
//   - GET /components honors the seeded role→permission matrix
//     (src/infra/db/seed/seed_role_permissions.py): roles without
//     component:read get 403 {message: "Access Denied"} like the real API
export const IS_DEMO =
  import.meta.env.VITE_DEMO_MODE === "true" ||
  (import.meta.env.PROD && !import.meta.env.VITE_API_BASE_URL)

export const DEMO_PASSWORD = "demo1234"

// One account per real backend role
export const DEMO_USERS = [
  { email: "superadmin@gt.dz", role: "SUPER_ADMIN", name: "Abdelatif Aitouche" },
  { email: "admin@gt.dz", role: "ADMIN", name: "Sara Benali" },
  { email: "manager@gt.dz", role: "MANAGER", name: "Karim Haddad" },
  { email: "reviewer@gt.dz", role: "REVIEWER", name: "Amina Bouchareb" },
  { email: "operator@gt.dz", role: "OPERATOR", name: "Yacine Merbah" },
  { email: "champion@gt.dz", role: "QUALITY_CHAMPION", name: "Lina Cherif" },
  { email: "viewer@gt.dz", role: "VIEWER", name: "Mehdi Saadi" },
]

// Mirrors the seeded role→permission mapping in soqm_backend:
// SUPER_ADMIN/ADMIN = everything; MANAGER/OPERATOR can read components;
// REVIEWER, QUALITY_CHAMPION and VIEWER are seeded with NO permissions.
const COMPONENT_READ_ROLES = ["SUPER_ADMIN", "ADMIN", "MANAGER", "OPERATOR"]

// Shape mirrors GET /api/v1/components → [{ id, name, isqm_reference }]
export const DEMO_COMPONENTS = [
  { id: "c1a1b1d1-0000-4000-8000-000000000001", name: "Firm's Risk Assessment Process", isqm_reference: "ISQM1.25-27" },
  { id: "c1a1b1d1-0000-4000-8000-000000000002", name: "Governance and Leadership", isqm_reference: "ISQM1.28-29" },
  { id: "c1a1b1d1-0000-4000-8000-000000000003", name: "Relevant Ethical Requirements", isqm_reference: "ISQM1.30-31" },
  { id: "c1a1b1d1-0000-4000-8000-000000000004", name: "Acceptance and Continuance of Client Relationships and Specific Engagements", isqm_reference: "ISQM1.32-33" },
  { id: "c1a1b1d1-0000-4000-8000-000000000005", name: "Engagement Performance", isqm_reference: "ISQM1.34-35" },
  { id: "c1a1b1d1-0000-4000-8000-000000000006", name: "Resources", isqm_reference: "ISQM1.36-37" },
  { id: "c1a1b1d1-0000-4000-8000-000000000007", name: "Information and Communication", isqm_reference: "ISQM1.38-39" },
  { id: "c1a1b1d1-0000-4000-8000-000000000008", name: "Monitoring and Remediation Process", isqm_reference: "ISQM1.40-47" },
]

const SESSION_KEY = "demo_session"

// Builds a rejection shaped exactly like an axios error from the real API,
// so error-handling code paths behave identically in demo and real mode.
function apiError(status, message) {
  const err = new Error(message)
  err.response = { status, data: { message, details: {} } }
  return err
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function demoLogin(email, password) {
  await delay(450)
  const account = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === String(email).trim().toLowerCase()
  )
  // Same 403 + message for unknown email and wrong password, like the backend
  if (!account || password !== DEMO_PASSWORD) {
    throw apiError(403, "Invalid Credentials")
  }
  // Shape mirrors the real access-token claims: { sub, email, role }
  const user = {
    sub: `00000000-0000-4000-8000-00000000000${DEMO_USERS.indexOf(account) + 1}`,
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

export async function demoGetComponents() {
  await delay(400)
  const user = getDemoSession()
  if (!user) throw apiError(403, "Not Authenticated")
  // Permission enforcement like require_permissions(ComponentPermissions.READ)
  if (!COMPONENT_READ_ROLES.includes(user.role)) {
    throw apiError(403, "Access Denied")
  }
  return DEMO_COMPONENTS
}
