import { Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useComponents } from "@/hooks/useComponents"
import { ROUTES } from "@/router/routes"
import { PageHeader } from "@/components/common/PageHeader"
import { StatCard } from "@/components/common/StatCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Layers,
  Gauge,
  Flag,
  FileCheck2,
  FileSearch,
  ShieldCheck,
  BellRing,
  UploadCloud,
  MessageSquareText,
} from "lucide-react"

// Deterministic sample readiness % per component index (no live metric yet).
const SAMPLE_READINESS = [86, 72, 94, 63, 78, 81, 57, 69]

const SAMPLE_ACTIVITY = [
  {
    id: "act-1",
    icon: FileCheck2,
    chipBg: "bg-[#EDE9F8]",
    chipText: "text-[#3B1F6A]",
    title: "Document reviewed",
    detail:
      "Independence Confirmation — Cevital SPA 2025.pdf approved by Amina Bouchareb",
    time: "12 min ago",
  },
  {
    id: "act-2",
    icon: Flag,
    chipBg: "bg-[#FDE8F0]",
    chipText: "text-[#7A1E3E]",
    title: "Finding raised",
    detail:
      "F-2026-014 · Incomplete EQCR sign-off on Statutory Audit — Sonatrach Group 2025",
    time: "1 h ago",
  },
  {
    id: "act-3",
    icon: ShieldCheck,
    chipBg: "bg-[#EAF3EE]",
    chipText: "text-[#1A4731]",
    title: "EQR completed",
    detail:
      "Engagement quality review signed off for Statutory Audit — Air Algérie 2025 by Karim Benali",
    time: "3 h ago",
  },
  {
    id: "act-4",
    icon: BellRing,
    chipBg: "bg-[#FDF3E7]",
    chipText: "text-[#7A3E0A]",
    title: "Alert triggered",
    detail:
      "Client continuance reassessment due for NCA Rouiba SPA within 14 days",
    time: "Yesterday",
  },
  {
    id: "act-5",
    icon: UploadCloud,
    chipBg: "bg-[#E8F0FB]",
    chipText: "text-[#1E3A6E]",
    title: "Document ingested",
    detail:
      "Acceptance Questionnaire — Danone Djurdjura Algérie 2026.docx · INGESTED (1.8 MB)",
    time: "2 days ago",
  },
  {
    id: "act-6",
    icon: FileSearch,
    chipBg: "bg-[#E8F5F5]",
    chipText: "text-[#1A4747]",
    title: "Document reviewed",
    detail:
      "Group Audit Instructions — Lafarge Holcim Algérie 2025.pdf reviewed by Sofia Hadj-Ali",
    time: "3 days ago",
  },
]

const QUICK_ACTIONS = [
  {
    to: ROUTES.DOCUMENTS,
    icon: UploadCloud,
    title: "Upload a document for review",
    description: "Send an engagement file into the quality review queue.",
    cta: "Go to documents",
  },
  {
    to: ROUTES.CHATBOT,
    icon: MessageSquareText,
    title: "Ask the SOQM Chatbot",
    description: "Get answers grounded in your firm's quality policies.",
    cta: "Open chatbot",
  },
  {
    to: ROUTES.COMPONENTS,
    icon: Layers,
    title: "Browse SOQM components",
    description: "Explore the 8 ISQM 1 components and their objectives.",
    cta: "View components",
  },
]

function SampleTag() {
  return <StatusBadge tone="muted">Sample</StatusBadge>
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { components, loading, error } = useComponents()

  const roleLabel = user?.role ? user.role.replace(/_/g, " ") : null
  const greeting = user?.email
    ? `Welcome back — signed in as ${user.email}${roleLabel ? ` · ${roleLabel}` : ""}`
    : "Welcome back to your System of Quality Management overview."

  return (
    <div className="space-y-6">
      <PageHeader title="Quality Dashboard" description={greeting} />

      {/* Stat row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="SOQM Components"
          value={
            loading ? (
              <Skeleton className="h-8 w-12" />
            ) : error ? (
              "—"
            ) : (
              components.length
            )
          }
          hint={error ? "Couldn't reach the API" : "Live from the SOQM API"}
          icon={Layers}
          tone="purple"
        />
        <StatCard
          label="Overall Quality Score"
          value="87%"
          hint="+2 pts vs. last quarter"
          icon={Gauge}
          tone="success"
        >
          <div>
            <SampleTag />
          </div>
        </StatCard>
        <StatCard
          label="Open Findings"
          value="6"
          hint="2 high severity"
          icon={Flag}
          tone="warning"
        >
          <div>
            <SampleTag />
          </div>
        </StatCard>
        <StatCard
          label="Documents Reviewed"
          value="124"
          hint="18 this month"
          icon={FileCheck2}
          tone="info"
        >
          <div>
            <SampleTag />
          </div>
        </StatCard>
      </div>

      {/* Two-column section */}
      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        {/* Component Readiness */}
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-sm font-semibold text-[#1E0A3C]">
                Component Readiness
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Design and implementation progress across the ISQM 1 components
              </p>
            </div>
            <SampleTag />
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Couldn't load components from the API
            </p>
          ) : (
            <div className="space-y-4">
              {components.map((component, index) => {
                const readiness =
                  SAMPLE_READINESS[index % SAMPLE_READINESS.length]
                return (
                  <div key={component.id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm text-[#1E0A3C] truncate">
                          {component.name}
                        </span>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#EDE9F8] text-[#3B1F6A] shrink-0">
                          {component.isqm_reference}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-[#3B1F6A] tabular-nums shrink-0">
                        {readiness}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#EDE9F8] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#7B3FBE]"
                        style={{ width: `${readiness}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Quality Activity */}
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h2 className="text-sm font-semibold text-[#1E0A3C]">
                Recent Quality Activity
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Latest events across the firm's SOQM
              </p>
            </div>
            <SampleTag />
          </div>

          <div className="divide-y divide-border">
            {SAMPLE_ACTIVITY.map((event) => (
              <div key={event.id} className="flex items-start gap-3 py-3 last:pb-0">
                <div
                  className={`flex size-8 items-center justify-center rounded-lg shrink-0 ${event.chipBg}`}
                >
                  <event.icon className={`size-4 ${event.chipText}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-medium text-[#1E0A3C]">
                      {event.title}
                    </p>
                    <span className="text-[11px] text-muted-foreground shrink-0">
                      {event.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {event.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Quick Actions
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group relative flex flex-col gap-3 rounded-xl border border-border bg-white p-5 hover:border-[#C4B0E8] hover:shadow-md transition-all duration-200"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#EDE9F8]">
                <action.icon className="size-5 text-[#7B3FBE]" />
              </div>
              <div className="space-y-1 pb-4">
                <h3 className="text-sm font-medium text-[#1E0A3C]">
                  {action.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {action.description}
                </p>
              </div>
              <div className="absolute bottom-4 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[11px] text-[#7B3FBE] font-medium">
                  {action.cta} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
