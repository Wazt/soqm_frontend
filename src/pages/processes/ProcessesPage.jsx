import { PageHeader } from "@/components/common/PageHeader"
import { PreviewBanner } from "@/components/common/PreviewBanner"
import { StatCard } from "@/components/common/StatCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import {
  Workflow,
  CheckCircle2,
  FileSearch,
  Link2,
  UserCheck,
  Users,
  MessagesSquare,
  Archive,
  ShieldCheck,
  GraduationCap,
  SearchCheck,
  CalendarCheck,
  CalendarClock,
} from "lucide-react"

const STATUS_TONE = {
  Active: "success",
  "Under review": "warning",
  Draft: "muted",
}

const SAMPLE_PROCESSES = [
  {
    id: "PRC-001",
    name: "Client Acceptance & Continuance Screening",
    purpose: "Background, integrity and risk screening before accepting or continuing any client relationship or engagement.",
    owner: "Karim Benali",
    ownerRole: "Risk Management Partner",
    component: "Acceptance and Continuance of Client Relationships and Specific Engagements",
    status: "Active",
    lastReviewed: "2026-01-22",
    nextReviewDue: "2027-01-22",
    icon: UserCheck,
  },
  {
    id: "PRC-002",
    name: "Engagement Team Assignment",
    purpose: "Allocation of partners and staff to engagements based on competence, capacity and independence clearance.",
    owner: "Amel Haddad",
    ownerRole: "Resourcing Manager",
    component: "Resources",
    status: "Active",
    lastReviewed: "2026-03-09",
    nextReviewDue: "2027-03-09",
    icon: Users,
  },
  {
    id: "PRC-003",
    name: "Consultation on Contentious Matters",
    purpose: "Mandatory consultation, documentation and sign-off path for difficult or contentious technical matters.",
    owner: "Sofiane Merbah",
    ownerRole: "Technical Standards Partner",
    component: "Engagement Performance",
    status: "Under review",
    lastReviewed: "2025-11-14",
    nextReviewDue: "2026-07-15",
    icon: MessagesSquare,
  },
  {
    id: "PRC-004",
    name: "Engagement Archiving & Retention",
    purpose: "Assembly of final engagement files within 60 days, archive locking and retention over the statutory period.",
    owner: "Yasmine Cherif",
    ownerRole: "Quality & Methodology Manager",
    component: "Information and Communication",
    status: "Active",
    lastReviewed: "2026-02-18",
    nextReviewDue: "2027-02-18",
    icon: Archive,
  },
  {
    id: "PRC-005",
    name: "Independence Confirmation Cycle",
    purpose: "Annual independence declarations from all partners and staff, with follow-up of exceptions and breaches.",
    owner: "Nadia Bouzid",
    ownerRole: "Ethics & Independence Partner",
    component: "Relevant Ethical Requirements",
    status: "Active",
    lastReviewed: "2026-04-02",
    nextReviewDue: "2027-04-02",
    icon: ShieldCheck,
  },
  {
    id: "PRC-006",
    name: "CPD Tracking & Technical Training",
    purpose: "Monitoring of continuing professional development hours and delivery of the annual technical training plan.",
    owner: "Thomas Keller",
    ownerRole: "Learning & Development Lead",
    component: "Resources",
    status: "Under review",
    lastReviewed: "2025-12-05",
    nextReviewDue: "2026-08-31",
    icon: GraduationCap,
  },
  {
    id: "PRC-007",
    name: "EQR Triggering Criteria",
    purpose: "Criteria and workflow for determining which engagements require an engagement quality review and appointing the reviewer.",
    owner: "Lamia Saidi",
    ownerRole: "Quality Champion",
    component: "Engagement Performance",
    status: "Draft",
    lastReviewed: "2026-05-20",
    nextReviewDue: "2026-09-30",
    icon: SearchCheck,
  },
]

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function ProcessesPage() {
  const total = SAMPLE_PROCESSES.length
  const active = SAMPLE_PROCESSES.filter((p) => p.status === "Active").length
  const underReview = SAMPLE_PROCESSES.filter((p) => p.status === "Under review").length
  const linkedComponents = new Set(SAMPLE_PROCESSES.map((p) => p.component)).size

  return (
    <div className="space-y-6">
      <PageHeader
        title="Processes"
        description="Documented firm processes supporting the System of Quality Management."
        badge={`${total} Processes`}
      />

      <PreviewBanner />

      {/* Stat strip */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total processes" value={total} hint="Documented in the SOQM" icon={Workflow} tone="purple" />
        <StatCard label="Active" value={active} hint="Operating as designed" icon={CheckCircle2} tone="success" />
        <StatCard label="Under review" value={underReview} hint="Revision in progress" icon={FileSearch} tone="warning" />
        <StatCard label="Linked components" value={`${linkedComponents} / 8`} hint="ISQM 1 components covered" icon={Link2} tone="info" />
      </div>

      {/* Process list */}
      <div className="space-y-3">
        {SAMPLE_PROCESSES.map((process) => {
          const Icon = process.icon
          return (
            <div
              key={process.id}
              className="group rounded-xl border border-border bg-white p-5 hover:border-[#C4B0E8] hover:shadow-md transition-all"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                {/* Identity */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#EDE9F8]">
                    <Icon className="size-5 text-[#3B1F6A]" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        {process.id}
                      </span>
                      <StatusBadge tone={STATUS_TONE[process.status]} withDot>
                        {process.status}
                      </StatusBadge>
                    </div>
                    <h3 className="text-sm font-medium text-[#1E0A3C] leading-snug">
                      {process.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {process.purpose}
                    </p>
                  </div>
                </div>

                {/* Owner */}
                <div className="shrink-0 lg:text-right lg:pl-6">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Owner
                  </p>
                  <p className="text-sm font-medium text-[#1E0A3C] mt-1">{process.owner}</p>
                  <p className="text-xs text-muted-foreground">{process.ownerRole}</p>
                </div>
              </div>

              {/* Meta row */}
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-4">
                <span className="inline-flex items-center text-[11px] font-medium bg-[#EDE9F8] text-[#3B1F6A] px-2.5 py-1 rounded-full">
                  {process.component}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarCheck className="size-4 text-[#7B3FBE]" />
                  Last reviewed {formatDate(process.lastReviewed)}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarClock className="size-4 text-[#7B3FBE]" />
                  Next review due {formatDate(process.nextReviewDue)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
