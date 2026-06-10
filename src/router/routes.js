export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/",

  // Organization
  DEPARTMENTS: "/departments",
  EMPLOYEES: "/employees",

  // ISQM 1 Compliance
  COMPONENTS: "/components",
  OBJECTIVES: "/objectives",

  // Operations
  PROCESSES: "/processes",
  PROCEDURES: "/procedures",

  // Risk Management
  RISKS: "/risks",
  MONITORING: "/monitoring",

  // Monitoring & Findings
  EQR: "/eqr",
  FINDINGS: "/findings",

  // Supporting Systems
  TASKS: "/tasks",
  ALERTS: "/alerts",
  REPORTS: "/reports",
  DOCUMENTS: "/documents",
  DOCUMENT_REVIEW: "/documents/:documentId",

  // AI Assistant
  CHATBOT: "/chatbot",
}

export const documentReviewPath = (documentId) => `/documents/${documentId}`
