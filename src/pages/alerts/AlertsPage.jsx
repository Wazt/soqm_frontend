import { useState } from "react"
import { PageHeader } from "@/components/common/PageHeader"
import { PreviewBanner } from "@/components/common/PreviewBanner"
import { StatusBadge } from "@/components/common/StatusBadge"
import { StatCard } from "@/components/common/StatCard"
import { Button } from "@/components/ui/button"
import {
  BellRing,
  CalendarDays,
  CheckCheck,
  Clock,
  Info,
  OctagonAlert,
  TriangleAlert,
} from "lucide-react"

const SEVERITIES = {
  danger: { icon: OctagonAlert, chip: "bg-[#FDE8F0]", text: "text-[#7A1E3E]" },
  warning: { icon: TriangleAlert, chip: "bg-[#FDF3E7]", text: "text-[#7A3E0A]" },
  info: { icon: Info, chip: "bg-[#E8F0FB]", text: "text-[#1E3A6E]" },
}

const SAMPLE_ALERTS = [
  {
    id: "ALR-2026-118",
    severity: "danger",
    title: "EQR sign-off overdue — Statutory Audit Cevital SPA 2025",
    detail: "Engagement quality review approval was due 8 Jun 2026 and is blocking report release.",
    module: "EQR",
    time: "2 h ago",
    thisWeek: true,
    resolved: false,
    unread: true,
  },
  {
    id: "ALR-2026-117",
    severity: "danger",
    title: "Document ingestion failed — Independence_Confirmations_2026.pdf",
    detail: "Pipeline returned status FAILED after 3 retries (4.2 MB, uploaded by N. Cherif).",
    module: "Documents",
    time: "5 h ago",
    thisWeek: true,
    resolved: false,
    unread: true,
  },
  {
    id: "ALR-2026-116",
    severity: "warning",
    title: "Monitoring sample deadline approaching — Q2 2026 cycle",
    detail: "Sample selection for 4 in-flight engagements must be locked by 19 Jun 2026.",
    module: "Monitoring",
    time: "Yesterday",
    thisWeek: true,
    resolved: false,
    unread: true,
  },
  {
    id: "ALR-2026-115",
    severity: "warning",
    title: "New finding raised — F-2026-019 archiving delay",
    detail: "Assembly of the NCA Rouiba 2025 audit file exceeded the 60-day archiving window.",
    module: "Findings",
    time: "Yesterday",
    thisWeek: true,
    resolved: false,
    unread: true,
  },
  {
    id: "ALR-2026-114",
    severity: "warning",
    title: "Ethics declarations pending for 3 staff members",
    detail: "Annual confirmations outstanding from the Oran office ahead of the 30 Jun deadline.",
    module: "Ethics",
    time: "2 days ago",
    thisWeek: true,
    resolved: false,
    unread: false,
  },
  {
    id: "ALR-2026-113",
    severity: "info",
    title: "Risk register updated — IT system migration rescored to High",
    detail: "Quality risk QR-2026-07 was rescored after the control walkthrough on 5 Jun 2026.",
    module: "Risks",
    time: "3 days ago",
    thisWeek: true,
    resolved: false,
    unread: false,
  },
  {
    id: "ALR-2026-112",
    severity: "info",
    title: "Weekly quality report published — Week 23, 2026",
    detail: "47 documents reviewed, 3 new findings. Distributed to the leadership group.",
    module: "Reports",
    time: "5 days ago",
    thisWeek: false,
    resolved: true,
    unread: false,
  },
  {
    id: "ALR-2026-111",
    severity: "info",
    title: "Continuance approved — Lafarge Algérie group reporting 2026",
    detail: "Acceptance and continuance questionnaire signed off by the engagement partner.",
    module: "Acceptance",
    time: "Last week",
    thisWeek: false,
    resolved: true,
    unread: false,
  },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(SAMPLE_ALERTS)

  const toggleRead = (id) =>
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, unread: !alert.unread } : alert))
    )

  const unreadCount = alerts.filter((alert) => alert.unread).length
  const criticalCount = alerts.filter((alert) => alert.severity === "danger").length
  const thisWeekCount = alerts.filter((alert) => alert.thisWeek).length
  const resolvedCount = alerts.filter((alert) => alert.resolved).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quality Alerts"
        description="Notifications raised by the system of quality management across all modules."
        badge={`${unreadCount} unread`}
      />

      <PreviewBanner />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Unread" value={unreadCount} hint="Awaiting acknowledgement" icon={BellRing} tone="purple" />
        <StatCard label="Critical" value={criticalCount} hint="Require immediate action" icon={OctagonAlert} tone="danger" />
        <StatCard label="This week" value={thisWeekCount} hint="Raised in the last 7 days" icon={CalendarDays} tone="info" />
        <StatCard label="Resolved" value={resolvedCount} hint="Closed without escalation" icon={CheckCheck} tone="success" />
      </div>

      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-white">
        {alerts.map((alert) => {
          const severity = SEVERITIES[alert.severity]
          const Icon = severity.icon
          return (
            <div
              key={alert.id}
              className="flex items-start gap-3 px-4 py-4 hover:bg-[#F7F4FC] transition-colors"
            >
              <span
                className={`mt-4 size-1.5 shrink-0 rounded-full ${
                  alert.unread ? "bg-[#7B3FBE]" : "bg-transparent"
                }`}
              />

              <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${severity.chip}`}>
                <Icon className={`size-4 ${severity.text}`} />
              </div>

              <div className="min-w-0 flex-1 space-y-1.5">
                <p
                  className={`text-sm leading-snug ${
                    alert.unread ? "font-semibold text-[#1E0A3C]" : "font-medium text-[#1E0A3C]/80"
                  }`}
                >
                  {alert.title}
                </p>
                <p className="text-[13px] leading-relaxed text-muted-foreground">{alert.detail}</p>
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <StatusBadge tone="purple">{alert.module}</StatusBadge>
                  {alert.resolved && (
                    <StatusBadge tone="success" withDot>
                      Resolved
                    </StatusBadge>
                  )}
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {alert.time}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 text-[#7B3FBE] hover:text-[#3B1F6A]"
                onClick={() => toggleRead(alert.id)}
              >
                {alert.unread ? "Mark read" : "Mark unread"}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
