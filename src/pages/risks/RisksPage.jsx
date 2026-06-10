import { PageHeader } from "@/components/common/PageHeader"
import { PreviewBanner } from "@/components/common/PreviewBanner"
import { StatCard } from "@/components/common/StatCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { DataTable } from "@/components/common/DataTable"
import { ShieldAlert, Flame, ListChecks, CalendarClock } from "lucide-react"

// ISQM-1 quality risk register — sample data (no backend endpoint yet).
const SAMPLE_RISKS = [
  {
    id: "R-001",
    title: "Undetected independence breach on listed clients",
    detail: "Personal financial interests of partners or staff in restricted entities not declared or detected before assignment.",
    component: "Relevant Ethical Requirements",
    likelihood: "Possible",
    impact: "Severe",
    severity: "High",
    response: "Monthly reconciliation of holdings against the network restricted entity list; pre-assignment independence confirmation.",
    owner: "Lydia Mansouri",
    status: "Open",
  },
  {
    id: "R-002",
    title: "Insufficient engagement documentation at archiving",
    detail: "Engagement files for statutory audits assembled after the 60-day deadline or missing key review evidence.",
    component: "Engagement Performance",
    likelihood: "Likely",
    impact: "Major",
    severity: "High",
    response: "Automated archiving alerts at day 45; quality champion sign-off before file lockdown.",
    owner: "Rachid Belkacem",
    status: "Open",
  },
  {
    id: "R-003",
    title: "Resource shortage during busy season",
    detail: "Concurrent year-end audits (Cevital SPA, Sonatrach subsidiaries, Air Algérie) exceed available senior staff capacity in Q1.",
    component: "Resources",
    likelihood: "Likely",
    impact: "Major",
    severity: "High",
    response: "Capacity model refreshed each November; cross-border secondments agreed with the network; staggered deadlines negotiated.",
    owner: "Samir Ghoul",
    status: "Mitigated",
  },
  {
    id: "R-004",
    title: "Acceptance of clients with integrity red flags",
    detail: "AML and background screening skipped or performed after the engagement letter is signed for time-pressured proposals.",
    component: "Acceptance and Continuance of Client Relationships and Specific Engagements",
    likelihood: "Possible",
    impact: "Severe",
    severity: "High",
    response: "Engagement letter generation blocked in the workflow tool until screening is documented and approved.",
    owner: "Mehdi Larbi",
    status: "Mitigated",
  },
  {
    id: "R-005",
    title: "Audit software outage during peak reporting period",
    detail: "Failure of the engagement platform or data analytics environment with no tested fallback during January-March.",
    component: "Resources",
    likelihood: "Unlikely",
    impact: "Major",
    severity: "Medium",
    response: "Disaster recovery plan tested annually; offline working procedure documented; vendor SLA reviewed.",
    owner: "Thomas Weiss",
    status: "Mitigated",
  },
  {
    id: "R-006",
    title: "Monitoring plan does not cover all service lines",
    detail: "Completed-file inspections concentrated on audit, leaving review and other assurance engagements untested for two cycles.",
    component: "Monitoring and Remediation Process",
    likelihood: "Possible",
    impact: "Moderate",
    severity: "Medium",
    response: "Three-year rotation plan covering every service line and every partner at least once.",
    owner: "Farid Osmani",
    status: "Open",
  },
  {
    id: "R-007",
    title: "Quality-relevant information not reaching engagement teams",
    detail: "Methodology alerts and regulator findings communicated by email only, with no confirmation of receipt or reading.",
    component: "Information and Communication",
    likelihood: "Likely",
    impact: "Moderate",
    severity: "Medium",
    response: "Mandatory acknowledgement workflow in the portal; quarterly quality briefings with attendance tracking.",
    owner: "Amina Zerrouki",
    status: "Open",
  },
  {
    id: "R-008",
    title: "Consultation requirements bypassed on contentious matters",
    detail: "Difficult judgements (going concern, impairment) concluded without the required technical desk consultation.",
    component: "Engagement Performance",
    likelihood: "Unlikely",
    impact: "Severe",
    severity: "Medium",
    response: "Report release checklist requires evidence of consultation for flagged matters; EQR scope extended.",
    owner: "Ines Touati",
    status: "Accepted",
  },
  {
    id: "R-009",
    title: "Leadership messaging undermines quality culture",
    detail: "Commercial targets communicated without balancing quality expectations, weakening tone at the top.",
    component: "Governance and Leadership",
    likelihood: "Unlikely",
    impact: "Moderate",
    severity: "Low",
    response: "Quality KPIs included in every partner communication; annual culture survey with follow-up actions.",
    owner: "Karim Benhamed",
    status: "Accepted",
  },
]

const LIKELIHOOD_TONES = {
  Unlikely: "muted",
  Possible: "info",
  Likely: "warning",
}

const IMPACT_TONES = {
  Moderate: "info",
  Major: "warning",
  Severe: "danger",
}

const SEVERITY_TONES = {
  High: "danger",
  Medium: "warning",
  Low: "success",
}

const RISK_STATUS_TONES = {
  Open: "warning",
  Mitigated: "success",
  Accepted: "muted",
}

const COLUMNS = [
  {
    key: "id",
    header: "Ref",
    className: "w-16",
    render: (row) => (
      <span className="font-mono text-xs text-muted-foreground">{row.id}</span>
    ),
  },
  {
    key: "title",
    header: "Risk",
    className: "min-w-[260px]",
    render: (row) => (
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-[#1E0A3C] leading-snug">{row.title}</p>
        <p className="text-xs text-muted-foreground leading-snug">{row.detail}</p>
      </div>
    ),
  },
  {
    key: "component",
    header: "Component",
    className: "min-w-[160px]",
    render: (row) => (
      <span className="inline-flex text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#EDE9F8] text-[#3B1F6A] leading-snug">
        {row.component}
      </span>
    ),
  },
  {
    key: "likelihood",
    header: "Likelihood",
    render: (row) => (
      <StatusBadge tone={LIKELIHOOD_TONES[row.likelihood]}>{row.likelihood}</StatusBadge>
    ),
  },
  {
    key: "impact",
    header: "Impact",
    render: (row) => (
      <StatusBadge tone={IMPACT_TONES[row.impact]}>{row.impact}</StatusBadge>
    ),
  },
  {
    key: "severity",
    header: "Severity",
    render: (row) => (
      <StatusBadge tone={SEVERITY_TONES[row.severity]} withDot>
        {row.severity}
      </StatusBadge>
    ),
  },
  {
    key: "response",
    header: "Response strategy",
    className: "min-w-[220px]",
    render: (row) => (
      <p className="text-xs text-muted-foreground leading-snug">{row.response}</p>
    ),
  },
  {
    key: "owner",
    header: "Owner",
    className: "whitespace-nowrap",
    render: (row) => <span className="text-sm text-[#1E0A3C]">{row.owner}</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <StatusBadge tone={RISK_STATUS_TONES[row.status]}>{row.status}</StatusBadge>
    ),
  },
]

export default function RisksPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Risks & Responses"
        description="The firm's ISQM 1 quality risk register — assessed risks, their linkage to SOQM components and the responses designed to address them."
        badge={`${SAMPLE_RISKS.length} Risks`}
      />

      <PreviewBanner>
        The risk register is sample data — risk endpoints are not available in the backend yet.
      </PreviewBanner>

      {/* Stat strip */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total risks" value="9" hint="On the quality risk register" icon={ShieldAlert} tone="purple" />
        <StatCard label="High severity" value="4" hint="Require active responses" icon={Flame} tone="danger" />
        <StatCard label="With responses" value="9" hint="100% response coverage" icon={ListChecks} tone="success" />
        <StatCard label="Overdue reviews" value="2" hint="Annual reassessment pending" icon={CalendarClock} tone="warning" />
      </div>

      {/* Risk register */}
      <DataTable
        columns={COLUMNS}
        rows={SAMPLE_RISKS}
        footer={
          <p className="text-xs text-muted-foreground">
            Severity is derived from likelihood × impact per the firm's risk assessment methodology. Last full reassessment: 15 Jan 2026.
          </p>
        }
      />
    </div>
  )
}
