import { PageHeader } from "@/components/common/PageHeader"
import { PreviewBanner } from "@/components/common/PreviewBanner"
import { StatCard } from "@/components/common/StatCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Paperclip,
  FileSearch,
  ShieldCheck,
  UserCheck,
  DatabaseZap,
  BarChart3,
  Megaphone,
} from "lucide-react"

const FREQUENCY_TONES = {
  Quarterly: "info",
  Annual: "purple",
  Continuous: "teal",
}

const RESULT_TONES = {
  Passed: "success",
  Exceptions: "warning",
  Failed: "danger",
}

const SAMPLE_ACTIVITIES = [
  {
    id: "mon-001",
    name: "Cold file inspections — assurance practice",
    scope: "Post-issuance review of 8 completed audit files, including Cevital SPA and Saidal Group SPA 2025.",
    frequency: "Quarterly",
    lastRun: "2026-05-15",
    result: "Exceptions",
    exceptions: 2,
    evidenceCount: 24,
    component: "Engagement Performance",
    icon: FileSearch,
  },
  {
    id: "mon-002",
    name: "Independence declarations sweep",
    scope: "Verification of annual independence confirmations for all 142 client-facing staff and partners.",
    frequency: "Annual",
    lastRun: "2026-04-30",
    result: "Passed",
    exceptions: 0,
    evidenceCount: 12,
    component: "Relevant Ethical Requirements",
    icon: ShieldCheck,
  },
  {
    id: "mon-003",
    name: "Acceptance & continuance file check",
    scope: "Sample of 12 new and recurring engagements tested for complete acceptance documentation.",
    frequency: "Quarterly",
    lastRun: "2026-06-02",
    result: "Passed",
    exceptions: 0,
    evidenceCount: 18,
    component:
      "Acceptance and Continuance of Client Relationships and Specific Engagements",
    icon: UserCheck,
  },
  {
    id: "mon-004",
    name: "Archiving deadline monitor",
    scope: "Automated tracking of the 60-day assembly limit across all open engagement files in Voyager.",
    frequency: "Continuous",
    lastRun: "2026-06-09",
    result: "Failed",
    exceptions: 3,
    evidenceCount: 9,
    component: "Information and Communication",
    icon: DatabaseZap,
  },
  {
    id: "mon-005",
    name: "Leadership quality KPI review",
    scope: "Annual assessment of quality objectives in partner scorecards and tone-at-the-top survey results.",
    frequency: "Annual",
    lastRun: "2026-03-20",
    result: "Passed",
    exceptions: 0,
    evidenceCount: 7,
    component: "Governance and Leadership",
    icon: BarChart3,
  },
  {
    id: "mon-006",
    name: "Methodology update cascade check",
    scope: "Confirmation that ISA and IFRS methodology alerts reached every active engagement team.",
    frequency: "Quarterly",
    lastRun: "2026-05-28",
    result: "Passed",
    exceptions: 0,
    evidenceCount: 11,
    component: "Monitoring and Remediation Process",
    icon: Megaphone,
  },
]

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function ActivityCard({ activity }) {
  const Icon = activity.icon
  return (
    <div className="rounded-xl border border-border bg-white p-5 hover:border-[#C4B0E8] hover:shadow-md transition-all">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        {/* Name + scope */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#EDE9F8]">
            <Icon className="size-5 text-[#3B1F6A]" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-medium text-[#1E0A3C]">
                {activity.name}
              </h3>
              <StatusBadge tone={FREQUENCY_TONES[activity.frequency]}>
                {activity.frequency}
              </StatusBadge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-snug">
              {activity.scope}
            </p>
          </div>
        </div>

        {/* Run details */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 shrink-0 xl:justify-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Last run
            </p>
            <p className="text-sm text-[#1E0A3C] mt-0.5 whitespace-nowrap">
              {formatDate(activity.lastRun)}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Result
            </p>
            <div className="mt-0.5">
              <StatusBadge
                tone={RESULT_TONES[activity.result]}
                withDot={activity.result !== "Passed"}
              >
                {activity.result === "Passed"
                  ? "Passed"
                  : `${activity.result} (${activity.exceptions})`}
              </StatusBadge>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Evidence
            </p>
            <p className="flex items-center gap-1.5 text-sm text-[#1E0A3C] mt-0.5 whitespace-nowrap">
              <Paperclip className="size-4 text-[#7B3FBE]" />
              {activity.evidenceCount} items
            </p>
          </div>
          <StatusBadge tone="purple" className="max-w-[240px] whitespace-normal! text-left">
            {activity.component}
          </StatusBadge>
        </div>
      </div>
    </div>
  )
}

export default function MonitoringPage() {
  const passed = SAMPLE_ACTIVITIES.filter((a) => a.result === "Passed").length
  const exceptionsRaised = SAMPLE_ACTIVITIES.reduce(
    (sum, a) => sum + a.exceptions,
    0
  )
  const evidenceItems = SAMPLE_ACTIVITIES.reduce(
    (sum, a) => sum + a.evidenceCount,
    0
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evidence & Monitoring"
        description="Ongoing and periodic monitoring activities over the system of quality management, with supporting evidence."
        badge={`${SAMPLE_ACTIVITIES.length} activities`}
      />

      <PreviewBanner />

      {/* Stat strip */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Monitoring activities"
          value={SAMPLE_ACTIVITIES.length}
          hint="Across the 2026 monitoring plan"
          icon={Activity}
          tone="purple"
        />
        <StatCard
          label="Passed"
          value={passed}
          hint="No exceptions on last run"
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Exceptions raised"
          value={exceptionsRaised}
          hint="Across 2 activities, under review"
          icon={AlertTriangle}
          tone="warning"
        />
        <StatCard
          label="Evidence items"
          value={evidenceItems}
          hint="Workpapers, extracts and logs on file"
          icon={Paperclip}
          tone="info"
        />
      </div>

      {/* Activity list */}
      <div className="space-y-3">
        {SAMPLE_ACTIVITIES.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Monitoring activities provide the basis for the annual evaluation of the
        SOQM by the individual assigned ultimate responsibility — ISQM 1
        paragraphs 53–54.
      </p>
    </div>
  )
}
