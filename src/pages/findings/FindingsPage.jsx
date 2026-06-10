import { PageHeader } from "@/components/common/PageHeader"
import { PreviewBanner } from "@/components/common/PreviewBanner"
import { StatCard } from "@/components/common/StatCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { DataTable } from "@/components/common/DataTable"
import { FileWarning, Flame, Wrench, CheckCircle2 } from "lucide-react"

const SEVERITY_TONES = {
  High: "danger",
  Medium: "warning",
  Low: "info",
}

const REMEDIATION_TONES = {
  "Not started": { tone: "muted", withDot: false },
  "In progress": { tone: "warning", withDot: true },
  Closed: { tone: "success", withDot: false },
}

const SAMPLE_FINDINGS = [
  {
    id: "F-2026-003",
    title: "Independence confirmations incomplete",
    detail:
      "Four team members on the Cevital SPA audit had not filed their annual independence declarations.",
    severity: "High",
    source: "EQR",
    component: "Relevant Ethical Requirements",
    remediation: "In progress",
    owner: "Amel Haddad",
    dueDate: "2026-06-30",
  },
  {
    id: "F-2026-005",
    title: "Client acceptance screening gap",
    detail:
      "Background and integrity screening missing from the acceptance file of a new PIE client.",
    severity: "High",
    source: "Internal monitoring",
    component:
      "Acceptance and Continuance of Client Relationships and Specific Engagements",
    remediation: "In progress",
    owner: "Sofiane Merabet",
    dueDate: "2026-07-15",
  },
  {
    id: "F-2026-007",
    title: "Archiving deadline exceeded",
    detail:
      "Three audit files exceeded the 60-day assembly limit following the report date.",
    severity: "Medium",
    source: "Internal monitoring",
    component: "Engagement Performance",
    remediation: "Closed",
    owner: "Nadia Bouchareb",
    dueDate: "2026-04-30",
  },
  {
    id: "F-2026-009",
    title: "EQR sign-off after report date",
    detail:
      "Engagement quality review on Alliance Assurances SPA was signed off after the auditor's report was dated.",
    severity: "High",
    source: "External inspection",
    component: "Engagement Performance",
    remediation: "In progress",
    owner: "Karim Benmoussa",
    dueDate: "2026-06-20",
  },
  {
    id: "F-2026-012",
    title: "CPD hours below firm minimum",
    detail:
      "Six audit staff recorded fewer than the required 40 hours of continuing professional development in 2025.",
    severity: "Medium",
    source: "Internal monitoring",
    component: "Resources",
    remediation: "Not started",
    owner: "Salima Ferhat",
    dueDate: "2026-09-30",
  },
  {
    id: "F-2026-014",
    title: "Quality alert distribution incomplete",
    detail:
      "Two engagement teams did not receive the Q1 methodology alert on revenue recognition.",
    severity: "Low",
    source: "Internal monitoring",
    component: "Information and Communication",
    remediation: "Closed",
    owner: "Claire Fontaine",
    dueDate: "2026-05-15",
  },
  {
    id: "F-2026-016",
    title: "Root-cause analysis not documented",
    detail:
      "No documented root-cause analysis for the deficiencies raised in the 2025 external inspection.",
    severity: "Medium",
    source: "External inspection",
    component: "Monitoring and Remediation Process",
    remediation: "In progress",
    owner: "Rachid Ziani",
    dueDate: "2026-07-31",
  },
  {
    id: "F-2026-018",
    title: "Risk register not refreshed",
    detail:
      "Quality risk register was not updated after the launch of the sustainability assurance service line.",
    severity: "Low",
    source: "EQR",
    component: "Firm's Risk Assessment Process",
    remediation: "Not started",
    owner: "Yacine Cherif",
    dueDate: "2026-08-28",
  },
]

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const COLUMNS = [
  {
    key: "id",
    header: "Ref",
    render: (row) => (
      <span className="font-mono text-xs font-medium text-[#3B1F6A] whitespace-nowrap">
        {row.id}
      </span>
    ),
  },
  {
    key: "title",
    header: "Finding",
    render: (row) => (
      <div className="min-w-[260px] max-w-md">
        <p className="font-medium text-[#1E0A3C]">{row.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
          {row.detail}
        </p>
      </div>
    ),
  },
  {
    key: "severity",
    header: "Severity",
    render: (row) => (
      <StatusBadge tone={SEVERITY_TONES[row.severity]}>{row.severity}</StatusBadge>
    ),
  },
  {
    key: "source",
    header: "Source",
    render: (row) => <StatusBadge tone="muted">{row.source}</StatusBadge>,
  },
  {
    key: "component",
    header: "Linked component",
    render: (row) => (
      <StatusBadge tone="purple" className="max-w-[220px] whitespace-normal! text-left">
        {row.component}
      </StatusBadge>
    ),
  },
  {
    key: "remediation",
    header: "Remediation",
    render: (row) => {
      const r = REMEDIATION_TONES[row.remediation]
      return (
        <StatusBadge tone={r.tone} withDot={r.withDot}>
          {row.remediation}
        </StatusBadge>
      )
    },
  },
  {
    key: "owner",
    header: "Owner",
    render: (row) => (
      <span className="text-[#1E0A3C] whitespace-nowrap">{row.owner}</span>
    ),
  },
  {
    key: "dueDate",
    header: "Due date",
    render: (row) => (
      <span className="text-muted-foreground whitespace-nowrap">
        {formatDate(row.dueDate)}
      </span>
    ),
  },
]

export default function FindingsPage() {
  const open = SAMPLE_FINDINGS.filter((f) => f.remediation !== "Closed").length
  const high = SAMPLE_FINDINGS.filter((f) => f.severity === "High").length
  const inProgress = SAMPLE_FINDINGS.filter(
    (f) => f.remediation === "In progress"
  ).length
  const closed = SAMPLE_FINDINGS.filter((f) => f.remediation === "Closed").length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Findings & Remediations"
        description="Deficiencies identified through EQR, internal monitoring and external inspections, with their remediation plans."
        badge={`${SAMPLE_FINDINGS.length} findings`}
      />

      <PreviewBanner />

      {/* Stat strip */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Open findings"
          value={open}
          hint="Awaiting full remediation"
          icon={FileWarning}
          tone="purple"
        />
        <StatCard
          label="High severity"
          value={high}
          hint="Require partner-level attention"
          icon={Flame}
          tone="danger"
        />
        <StatCard
          label="Remediations in progress"
          value={inProgress}
          hint="Action plans underway"
          icon={Wrench}
          tone="warning"
        />
        <StatCard
          label="Closed this quarter"
          value={closed}
          hint="Q2 2026 to date"
          icon={CheckCircle2}
          tone="success"
        />
      </div>

      {/* Findings table */}
      <DataTable
        columns={COLUMNS}
        rows={SAMPLE_FINDINGS}
        footer={
          <p className="text-xs text-muted-foreground">
            Findings are evaluated for severity and pervasiveness, and root
            causes investigated, per ISQM 1 paragraphs 41–42.
          </p>
        }
      />
    </div>
  )
}
