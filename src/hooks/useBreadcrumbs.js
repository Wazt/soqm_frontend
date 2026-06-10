import { useLocation } from "react-router-dom"

const ROUTE_LABELS = {
  "":           "Dashboard",
  "dashboard":  "Dashboard",
  "departments": "Departments",
  "employees":  "Employees & Roles",
  "components": "SOQM Components",
  "objectives": "Quality Objectives",
  "processes":  "Processes",
  "procedures": "Procedures",
  "risks":      "Risks & Responses",
  "monitoring": "Evidence & Monitoring",
  "eqr":        "EQR Reviews",
  "findings":   "Findings & Remediations",
  "tasks":      "Tasks",
  "alerts":     "Quality Alerts",
  "reports":    "Weekly Reports",
  "documents":  "Document Library",
  "chatbot":    "SOQM Chatbot",
}

export function useBreadcrumbs() {
  const { pathname } = useLocation()

  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) {
    return [{ label: "Dashboard", href: "/" }]
  }

  return segments.map((segment, index) => ({
    label: ROUTE_LABELS[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1),
    href: "/" + segments.slice(0, index + 1).join("/"),
  }))
}