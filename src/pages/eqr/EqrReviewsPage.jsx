import { PageHeader } from "@/components/common/PageHeader"
import { PreviewBanner } from "@/components/common/PreviewBanner"
import { StatCard } from "@/components/common/StatCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { DataTable } from "@/components/common/DataTable"
import { ClipboardCheck, Loader, CheckCircle2, AlertTriangle } from "lucide-react"

// Reference date for the 2025/2026 review cycle (sample data only).
const TODAY = "2026-06-10"

const STAGE_TONES = {
  Planning: { tone: "info", withDot: false },
  "Fieldwork review": { tone: "warning", withDot: true },
  Conclusions: { tone: "teal", withDot: false },
  Completed: { tone: "success", withDot: false },
}

const STATUS_TONES = {
  "On track": { tone: "info", withDot: false },
  "At risk": { tone: "warning", withDot: true },
  Overdue: { tone: "danger", withDot: true },
  Completed: { tone: "success", withDot: false },
}

const SAMPLE_REVIEWS = [
  {
    id: "eqr-001",
    engagement: "Statutory Audit — Cevital SPA 2025",
    client: "Cevital SPA — Agri-food group, Béjaïa",
    partner: "Karim Benmoussa",
    reviewer: "Amel Haddad",
    stage: "Fieldwork review",
    signOffDue: "2026-06-28",
    status: "On track",
  },
  {
    id: "eqr-002",
    engagement: "Group Audit — Saidal Group SPA 2025",
    client: "Saidal Group SPA — Listed on the Algiers Stock Exchange",
    partner: "Lydia Aït-Kaci",
    reviewer: "Rachid Ziani",
    stage: "Completed",
    signOffDue: "2026-05-22",
    status: "Completed",
  },
  {
    id: "eqr-003",
    engagement: "Statutory Audit — Alliance Assurances SPA 2025",
    client: "Alliance Assurances SPA — Listed insurer, Algiers",
    partner: "Sofiane Merabet",
    reviewer: "Claire Fontaine",
    stage: "Fieldwork review",
    signOffDue: "2026-06-05",
    status: "Overdue",
  },
  {
    id: "eqr-004",
    engagement: "Statutory Audit — BNP Paribas El Djazaïr 2025",
    client: "BNP Paribas El Djazaïr — Banking, public interest entity",
    partner: "Nadia Bouchareb",
    reviewer: "Mohamed Lamine Saadi",
    stage: "Planning",
    signOffDue: "2026-08-14",
    status: "On track",
  },
  {
    id: "eqr-005",
    engagement: "Statutory Audit — Biopharm SPA 2025",
    client: "Biopharm SPA — Listed pharmaceutical group",
    partner: "Yacine Cherif",
    reviewer: "Amel Haddad",
    stage: "Conclusions",
    signOffDue: "2026-06-20",
    status: "At risk",
  },
  {
    id: "eqr-006",
    engagement: "Statutory Audit — Sonatrach SPA 2025",
    client: "Sonatrach SPA — State energy group, bond issuer",
    partner: "Marc Delacroix",
    reviewer: "Rachid Ziani",
    stage: "Conclusions",
    signOffDue: "2026-06-26",
    status: "On track",
  },
  {
    id: "eqr-007",
    engagement: "IFRS Group Reporting — Lafarge Holcim Algérie 2025",
    client: "Lafarge Holcim Algérie SPA — Component of listed group",
    partner: "Salima Ferhat",
    reviewer: "Claire Fontaine",
    stage: "Planning",
    signOffDue: "2026-09-04",
    status: "On track",
  },
]

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function isOverdue(row) {
  return row.stage !== "Completed" && row.signOffDue < TODAY
}

const COLUMNS = [
  {
    key: "engagement",
    header: "Engagement",
    render: (row) => (
      <div className="min-w-[220px]">
        <p className="font-medium text-foreground">{row.engagement}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{row.client}</p>
      </div>
    ),
  },
  {
    key: "partner",
    header: "Engagement partner",
    render: (row) => <span className="text-foreground">{row.partner}</span>,
  },
  {
    key: "reviewer",
    header: "EQ reviewer",
    render: (row) => <span className="text-foreground">{row.reviewer}</span>,
  },
  {
    key: "stage",
    header: "Stage",
    render: (row) => {
      const s = STAGE_TONES[row.stage]
      return (
        <StatusBadge tone={s.tone} withDot={s.withDot}>
          {row.stage}
        </StatusBadge>
      )
    },
  },
  {
    key: "signOffDue",
    header: "Sign-off due",
    render: (row) => (
      <span
        className={
          isOverdue(row)
            ? "text-[#C4336E] font-medium whitespace-nowrap"
            : "text-muted-foreground whitespace-nowrap"
        }
      >
        {formatDate(row.signOffDue)}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => {
      const s = STATUS_TONES[row.status]
      return (
        <StatusBadge tone={s.tone} withDot={s.withDot}>
          {row.status}
        </StatusBadge>
      )
    },
  },
]

export default function EqrReviewsPage() {
  const inProgress = SAMPLE_REVIEWS.filter(
    (r) => r.stage === "Fieldwork review" || r.stage === "Conclusions"
  ).length
  const completed = SAMPLE_REVIEWS.filter((r) => r.stage === "Completed").length
  const overdue = SAMPLE_REVIEWS.filter(isOverdue).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Engagement Quality Reviews"
        description="EQR assignments and sign-off tracking for engagements requiring review under ISQM 1 and ISA 220 (Revised)."
        badge={`${SAMPLE_REVIEWS.length} reviews — 2025/2026 cycle`}
      />

      <PreviewBanner />

      {/* Stat strip */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Reviews this cycle"
          value={SAMPLE_REVIEWS.length}
          hint="Listed entities and other PIEs"
          icon={ClipboardCheck}
          tone="purple"
        />
        <StatCard
          label="In progress"
          value={inProgress}
          hint="Fieldwork review or conclusions"
          icon={Loader}
          tone="info"
        />
        <StatCard
          label="Completed"
          value={completed}
          hint="EQR sign-off on file"
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Overdue"
          value={overdue}
          hint="Past the sign-off due date"
          icon={AlertTriangle}
          tone="danger"
        />
      </div>

      {/* Reviews table */}
      <DataTable
        columns={COLUMNS}
        rows={SAMPLE_REVIEWS}
        footer={
          <p className="text-xs text-muted-foreground">
            The engagement quality reviewer must complete the review before the
            auditor&apos;s report is dated — ISA 220 (Revised), para. 36.
          </p>
        }
      />
    </div>
  )
}
