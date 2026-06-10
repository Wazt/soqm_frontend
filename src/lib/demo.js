// Demo mode — used for backend-less test deployments (e.g. Vercel previews).
// Active when VITE_DEMO_MODE=true, or automatically in production builds that
// have no VITE_API_BASE_URL configured (i.e. nowhere real to point at).
// Login accepts any credentials and the components API resolves locally.
export const IS_DEMO =
  import.meta.env.VITE_DEMO_MODE === "true" ||
  (import.meta.env.PROD && !import.meta.env.VITE_API_BASE_URL)

// Shape mirrors the real access-token claims: { sub, email, role }
export const DEMO_USER = {
  sub: "00000000-0000-4000-8000-000000000000",
  email: "demo@gt.dz",
  role: "SUPER_ADMIN",
}

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
