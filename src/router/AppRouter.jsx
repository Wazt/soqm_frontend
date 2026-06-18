import { BrowserRouter, Routes, Route } from "react-router-dom"
import PrivateRoute from "./PrivateRoute"
import PublicRoute from "./PublicRoute"
import { ROUTES } from "./routes"
import AppLayout from "@/layouts/AppLayout"
import AuthLayout from "@/layouts/AuthLayout"
import LoginPage from "@/pages/auth/login"
import DashboardPage from "@/pages/dashboard/dashboard"
import NotFoundPage from "@/pages/NotFoundPage"
import IsqmComponents from "@/pages/isqm_components/IsqmComponents"
import DepartmentsPage from "@/pages/departments/DepartmentsPage"
import UsersPage from "@/pages/users/UsersPage"
import EmployeesPage from "@/pages/employees/EmployeesPage"
import ObjectivesPage from "@/pages/objectives/ObjectivesPage"
import ObjectiveDetailsPage from "@/pages/objectives/ObjectiveDetailsPage"
import ProcessesPage from "@/pages/processes/ProcessesPage"
import ProceduresPage from "@/pages/procedures/ProceduresPage"
import RisksPage from "@/pages/risks/RisksPage"
import MonitoringPage from "@/pages/monitoring/MonitoringPage"
import EqrReviewsPage from "@/pages/eqr/EqrReviewsPage"
import FindingsPage from "@/pages/findings/FindingsPage"
import TasksPage from "@/pages/tasks/TasksPage"
import AlertsPage from "@/pages/alerts/AlertsPage"
import ReportsPage from "@/pages/reports/ReportsPage"
import DocumentsPage from "@/pages/documents/DocumentsPage"
import DocumentReviewPage from "@/pages/documents/DocumentReviewPage"
import ChatbotPage from "@/pages/chatbot/ChatbotPage"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public only (redirect to / if already logged in) */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          </Route>
        </Route>

        {/* Protected */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

            {/* Organization */}
            <Route path={ROUTES.DEPARTMENTS} element={<DepartmentsPage />} />
            <Route path={ROUTES.USERS} element={<UsersPage />} />
            <Route path={ROUTES.EMPLOYEES} element={<EmployeesPage />} />

            {/* ISQM 1 Compliance */}
            <Route path={ROUTES.COMPONENTS} element={<IsqmComponents />} />
            <Route path={ROUTES.OBJECTIVES} element={<ObjectivesPage />} />
            <Route path={ROUTES.OBJECTIVE_DETAIL} element={<ObjectiveDetailsPage />} />

            {/* Operations */}
            <Route path={ROUTES.PROCESSES} element={<ProcessesPage />} />
            <Route path={ROUTES.PROCEDURES} element={<ProceduresPage />} />

            {/* Risk Management */}
            <Route path={ROUTES.RISKS} element={<RisksPage />} />
            <Route path={ROUTES.MONITORING} element={<MonitoringPage />} />

            {/* Monitoring & Findings */}
            <Route path={ROUTES.EQR} element={<EqrReviewsPage />} />
            <Route path={ROUTES.FINDINGS} element={<FindingsPage />} />

            {/* Supporting Systems */}
            <Route path={ROUTES.TASKS} element={<TasksPage />} />
            <Route path={ROUTES.ALERTS} element={<AlertsPage />} />
            <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
            <Route path={ROUTES.DOCUMENTS} element={<DocumentsPage />} />
            <Route path={ROUTES.DOCUMENT_REVIEW} element={<DocumentReviewPage />} />

            {/* AI Assistant */}
            <Route path={ROUTES.CHATBOT} element={<ChatbotPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
