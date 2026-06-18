// Single source of truth for the domain vocabulary that the UI shares with the
// backend enums + state machines. Tones map onto StatusBadge / StatCard tones.

// --- Components (status_machine.py) ----------------------------------------
export const COMPONENT_STATUS = {
  ACTIVE: { label: "Active", tone: "success" },
  IN_ACTIVE: { label: "Inactive", tone: "muted" },
  ARCHIVED: { label: "Archived", tone: "warning" },
}
export const COMPONENT_TRANSITIONS = {
  ACTIVE: ["IN_ACTIVE", "ARCHIVED"],
  IN_ACTIVE: ["ACTIVE", "ARCHIVED"],
  ARCHIVED: [],
}

// --- Quality objectives (domain/objective.py) ------------------------------
export const OBJECTIVE_STATUS = {
  draft: { label: "Draft", tone: "muted" },
  approved: { label: "Approved", tone: "info" },
  active: { label: "Active", tone: "success" },
  under_review: { label: "Under Review", tone: "warning" },
  revised: { label: "Revised", tone: "purple" },
  achieved: { label: "Achieved", tone: "teal" },
  superseded: { label: "Superseded", tone: "warning" },
  suspended: { label: "Suspended", tone: "danger" },
  archived: { label: "Archived", tone: "muted" },
}
export const OBJECTIVE_TRANSITIONS = {
  draft: ["approved"],
  approved: ["active"],
  active: ["under_review", "suspended"],
  under_review: ["revised", "active"],
  revised: ["active"],
  suspended: ["active", "archived"],
  achieved: [],
  superseded: [],
  archived: [],
}
// Verb used on the action button for each target transition.
export const OBJECTIVE_ACTION_LABEL = {
  approved: "Approve",
  active: "Activate",
  under_review: "Start review",
  revised: "Mark revised",
  suspended: "Suspend",
  archived: "Archive",
}

// --- Risks (enums/risk_states.py) ------------------------------------------
export const RISK_STATUS = {
  identified: { label: "Identified", tone: "info" },
  assessed: { label: "Assessed", tone: "purple" },
  treatment_planned: { label: "Treatment planned", tone: "warning" },
  mitigated: { label: "Mitigated", tone: "teal" },
  accepted: { label: "Accepted", tone: "success" },
  closed: { label: "Closed", tone: "muted" },
  under_review: { label: "Under review", tone: "warning" },
}
export const RISK_LEVEL = { 1: "Low", 2: "Medium", 3: "High" }

// Risk heat-map zone from occurence × significance (score 1–9).
export function riskZone(occurence, significance) {
  const score = (occurence || 0) * (significance || 0)
  if (score >= 6) return "critical"
  if (score >= 3) return "high"
  return "low"
}
export const RISK_ZONE = {
  critical: { label: "Critical", tone: "danger", cell: "bg-[#FDE8E8] dark:bg-[#4a1d1d]/40", dot: "bg-[#E24B4A]", text: "text-[#B23535]" },
  high: { label: "High", tone: "warning", cell: "bg-[#FDF3E7] dark:bg-[#4a3417]/40", dot: "bg-[#D4820A]", text: "text-[#9A5E08]" },
  low: { label: "Low", tone: "success", cell: "bg-[#EAF7EF] dark:bg-[#163a28]/40", dot: "bg-[#2E9E6B]", text: "text-[#1E7A50]" },
}

export function statusMeta(map, key) {
  return map[key] ?? { label: key ?? "—", tone: "muted" }
}
