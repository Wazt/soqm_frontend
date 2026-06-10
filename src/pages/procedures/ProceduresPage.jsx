import { PageHeader } from "@/components/common/PageHeader"
import { PreviewBanner } from "@/components/common/PreviewBanner"
import { StatCard } from "@/components/common/StatCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { DataTable } from "@/components/common/DataTable"
import { ClipboardList, CheckCircle2, PenLine, CalendarClock } from "lucide-react"

const STATUS_TONE = {
  Effective: "success",
  Superseded: "muted",
  "In drafting": "warning",
}

const SAMPLE_PROCEDURES = [
  {
    id: "PR-003",
    title: "Client background and integrity checks",
    process: "Client Acceptance & Continuance Screening",
    version: "v3.0",
    effectiveDate: "2026-01-22",
    owner: "Karim Benali",
    reviewCycle: "Annual",
    status: "Effective",
    dueForReview: false,
  },
  {
    id: "PR-004",
    title: "Engagement risk scoring and approval thresholds",
    process: "Client Acceptance & Continuance Screening",
    version: "v2.1",
    effectiveDate: "2025-09-15",
    owner: "Karim Benali",
    reviewCycle: "Annual",
    status: "Effective",
    dueForReview: true,
  },
  {
    id: "PR-007",
    title: "Staff allocation and independence cross-check",
    process: "Engagement Team Assignment",
    version: "v1.4",
    effectiveDate: "2026-03-09",
    owner: "Amel Haddad",
    reviewCycle: "Biannual",
    status: "Effective",
    dueForReview: false,
  },
  {
    id: "PR-009",
    title: "Documentation of consultations and conclusions",
    process: "Consultation on Contentious Matters",
    version: "v2.0",
    effectiveDate: "2026-07-15",
    owner: "Sofiane Merbah",
    reviewCycle: "Annual",
    status: "In drafting",
    dueForReview: false,
  },
  {
    id: "PR-011",
    title: "60-day file assembly and archive lock",
    process: "Engagement Archiving & Retention",
    version: "v1.2",
    effectiveDate: "2026-02-18",
    owner: "Yasmine Cherif",
    reviewCycle: "Annual",
    status: "Effective",
    dueForReview: false,
  },
  {
    id: "PR-012",
    title: "Retention schedule and secure disposal",
    process: "Engagement Archiving & Retention",
    version: "v1.0",
    effectiveDate: "2024-06-30",
    owner: "Yasmine Cherif",
    reviewCycle: "Biannual",
    status: "Superseded",
    dueForReview: false,
  },
  {
    id: "PR-014",
    title: "Annual independence declarations collection",
    process: "Independence Confirmation Cycle",
    version: "v2.3",
    effectiveDate: "2026-04-02",
    owner: "Nadia Bouzid",
    reviewCycle: "Annual",
    status: "Effective",
    dueForReview: false,
  },
  {
    id: "PR-016",
    title: "CPD hours recording and shortfall escalation",
    process: "CPD Tracking & Technical Training",
    version: "v1.1",
    effectiveDate: "2025-08-20",
    owner: "Thomas Keller",
    reviewCycle: "Annual",
    status: "Effective",
    dueForReview: true,
  },
  {
    id: "PR-018",
    title: "EQR eligibility assessment and reviewer appointment",
    process: "EQR Triggering Criteria",
    version: "v0.9",
    effectiveDate: "2026-09-30",
    owner: "Lamia Saidi",
    reviewCycle: "Annual",
    status: "In drafting",
    dueForReview: false,
  },
]

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const COLUMNS = [
  {
    key: "id",
    header: "Ref",
    className: "w-24",
    render: (row) => (
      <span className="text-xs font-semibold text-[#3B1F6A] tracking-wide">{row.id}</span>
    ),
  },
  {
    key: "title",
    header: "Procedure",
    render: (row) => (
      <div className="min-w-[220px]">
        <p className="text-sm font-medium text-[#1E0A3C] leading-snug">{row.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{row.process}</p>
      </div>
    ),
  },
  {
    key: "version",
    header: "Version",
    render: (row) => (
      <span className="inline-flex items-center text-[11px] font-medium bg-[#EDE9F8] text-[#3B1F6A] px-2.5 py-1 rounded-full">
        {row.version}
      </span>
    ),
  },
  {
    key: "effectiveDate",
    header: "Effective date",
    render: (row) => (
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {formatDate(row.effectiveDate)}
      </span>
    ),
  },
  {
    key: "owner",
    header: "Owner",
    render: (row) => <span className="text-sm text-[#1E0A3C]">{row.owner}</span>,
  },
  {
    key: "reviewCycle",
    header: "Review cycle",
    render: (row) => <span className="text-sm text-muted-foreground">{row.reviewCycle}</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <StatusBadge tone={STATUS_TONE[row.status]} withDot={row.status === "Effective"}>
        {row.status}
      </StatusBadge>
    ),
  },
]

export default function ProceduresPage() {
  const total = SAMPLE_PROCEDURES.length
  const effective = SAMPLE_PROCEDURES.filter((p) => p.status === "Effective").length
  const inDrafting = SAMPLE_PROCEDURES.filter((p) => p.status === "In drafting").length
  const dueForReview = SAMPLE_PROCEDURES.filter((p) => p.dueForReview).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Procedures"
        description="Versioned written procedures implementing each documented firm process."
        badge={`${total} Procedures`}
      />

      <PreviewBanner />

      {/* Stat strip */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total" value={total} hint="Across all firm processes" icon={ClipboardList} tone="purple" />
        <StatCard label="Effective" value={effective} hint="Currently in force" icon={CheckCircle2} tone="success" />
        <StatCard label="In drafting" value={inDrafting} hint="Pending approval" icon={PenLine} tone="warning" />
        <StatCard label="Due for review" value={dueForReview} hint="Within the next 90 days" icon={CalendarClock} tone="info" />
      </div>

      {/* Procedures register */}
      <DataTable
        columns={COLUMNS}
        rows={SAMPLE_PROCEDURES}
        footer={
          <p className="text-xs text-muted-foreground">
            Showing {total} procedures — review cycles run from each effective date.
          </p>
        }
      />
    </div>
  )
}
