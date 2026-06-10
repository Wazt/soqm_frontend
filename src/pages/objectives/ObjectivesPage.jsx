import { useComponents } from "@/hooks/useComponents"
import { PageHeader } from "@/components/common/PageHeader"
import { PreviewBanner } from "@/components/common/PreviewBanner"
import { StatCard } from "@/components/common/StatCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Skeleton } from "@/components/ui/skeleton"
import { Target, CheckCircle2, Loader2, AlertTriangle, AlertCircle, CalendarDays, User } from "lucide-react"

// Sample quality objectives, grouped per component by index. Each entry holds
// 2-3 objectives so the page works for whatever the live API returns.
const SAMPLE_OBJECTIVE_SETS = [
  {
    completion: 78,
    objectives: [
      {
        id: "OBJ-101",
        statement: "Leadership demonstrates commitment to quality through the annual tone-at-the-top communication and quarterly quality council meetings.",
        owner: "Karim Benhamed",
        status: "Achieved",
        targetDate: "2026-03-31",
      },
      {
        id: "OBJ-102",
        statement: "Quality objectives and SOQM accountability are embedded in partner performance evaluations and remuneration decisions.",
        owner: "Salima Cherfaoui",
        status: "In progress",
        targetDate: "2026-09-30",
      },
      {
        id: "OBJ-103",
        statement: "Organizational structure assigns clear operational responsibility for the SOQM to a designated quality leader.",
        owner: "Karim Benhamed",
        status: "Achieved",
        targetDate: "2026-02-28",
      },
    ],
  },
  {
    completion: 55,
    objectives: [
      {
        id: "OBJ-201",
        statement: "Quality risks are identified and assessed annually using the firm-wide risk assessment workshop and updated for emerging engagement risks.",
        owner: "Nadia Hamidi",
        status: "In progress",
        targetDate: "2026-06-30",
      },
      {
        id: "OBJ-202",
        statement: "Changes in the firm's circumstances (new service lines, regulatory changes) trigger a documented reassessment of quality risks within 30 days.",
        owner: "Yacine Boudali",
        status: "Not started",
        targetDate: "2026-11-30",
      },
    ],
  },
  {
    completion: 82,
    objectives: [
      {
        id: "OBJ-301",
        statement: "All partners and staff confirm independence annually and on assignment to each engagement, with breaches reported within 48 hours.",
        owner: "Lydia Mansouri",
        status: "Achieved",
        targetDate: "2026-01-31",
      },
      {
        id: "OBJ-302",
        statement: "The firm maintains an up-to-date restricted entity list reconciled monthly against the international network database.",
        owner: "Sofiane Kaci",
        status: "In progress",
        targetDate: "2026-07-31",
      },
      {
        id: "OBJ-303",
        statement: "Ethics and independence training is completed by 100% of client-facing staff before busy season.",
        owner: "Lydia Mansouri",
        status: "Achieved",
        targetDate: "2026-04-30",
      },
    ],
  },
  {
    completion: 64,
    objectives: [
      {
        id: "OBJ-401",
        statement: "Client acceptance decisions are supported by documented background, integrity and AML screening before engagement letters are issued.",
        owner: "Mehdi Larbi",
        status: "In progress",
        targetDate: "2026-08-31",
      },
      {
        id: "OBJ-402",
        statement: "Continuance assessments for listed and public-interest entities (e.g. Statutory Audit — Cevital SPA 2025) are approved by a second partner.",
        owner: "Amel Ferrah",
        status: "Achieved",
        targetDate: "2026-03-15",
      },
    ],
  },
  {
    completion: 49,
    objectives: [
      {
        id: "OBJ-501",
        statement: "Engagement teams apply the firm's audit methodology consistently, with direction, supervision and review evidenced in the engagement file.",
        owner: "Rachid Belkacem",
        status: "In progress",
        targetDate: "2026-10-31",
      },
      {
        id: "OBJ-502",
        statement: "Engagement files are assembled and archived within 60 days of the report date for all assurance engagements.",
        owner: "Ines Touati",
        status: "Not started",
        targetDate: "2026-12-15",
      },
      {
        id: "OBJ-503",
        statement: "Consultations on difficult or contentious matters are documented and conclusions implemented before report release.",
        owner: "Rachid Belkacem",
        status: "In progress",
        targetDate: "2026-09-15",
      },
    ],
  },
  {
    completion: 71,
    objectives: [
      {
        id: "OBJ-601",
        statement: "Resource planning ensures every engagement is staffed with personnel having appropriate competence and capacity, including busy-season peaks.",
        owner: "Samir Ghoul",
        status: "In progress",
        targetDate: "2026-08-15",
      },
      {
        id: "OBJ-602",
        statement: "Technological resources (audit software, data analytics platform) are licensed, supported and available to all engagement teams.",
        owner: "Thomas Weiss",
        status: "Achieved",
        targetDate: "2026-05-31",
      },
    ],
  },
  {
    completion: 58,
    objectives: [
      {
        id: "OBJ-701",
        statement: "The information system captures and communicates quality-relevant information to engagement teams in a timely manner.",
        owner: "Amina Zerrouki",
        status: "In progress",
        targetDate: "2026-07-15",
      },
      {
        id: "OBJ-702",
        statement: "External communications (transparency report, regulator requests) are reviewed by the quality leader before release.",
        owner: "Karim Benhamed",
        status: "Achieved",
        targetDate: "2026-04-15",
      },
      {
        id: "OBJ-703",
        statement: "A whistleblowing channel is operational and complaints are logged, investigated and resolved within defined timeframes.",
        owner: "Amina Zerrouki",
        status: "Not started",
        targetDate: "2026-11-15",
      },
    ],
  },
  {
    completion: 44,
    objectives: [
      {
        id: "OBJ-801",
        statement: "Annual monitoring plan covers in-flight engagement reviews and completed-file inspections across all service lines.",
        owner: "Farid Osmani",
        status: "In progress",
        targetDate: "2026-10-15",
      },
      {
        id: "OBJ-802",
        statement: "Identified deficiencies are evaluated for root cause, with remediation actions tracked to closure and effectiveness re-tested.",
        owner: "Claire Dubois",
        status: "Not started",
        targetDate: "2026-12-31",
      },
    ],
  },
]

const OBJECTIVE_STATUS_TONES = {
  Achieved: "success",
  "In progress": "warning",
  "Not started": "muted",
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })

function CompletionBar({ value }) {
  return (
    <div className="flex items-center gap-3 min-w-[140px]">
      <div className="h-1.5 flex-1 rounded-full bg-[#EDE9F8] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#7B3FBE] transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-[#3B1F6A] tabular-nums w-9 text-right">
        {value}%
      </span>
    </div>
  )
}

function ObjectiveRow({ objective }) {
  return (
    <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 hover:bg-[#F7F4FC] transition-colors">
      <div className="flex items-start gap-3 min-w-0">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#EDE9F8] mt-0.5">
          <Target className="size-4 text-[#7B3FBE]" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-[#1E0A3C] leading-snug">{objective.statement}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="font-medium text-[#7B3FBE]">{objective.id}</span>
            <span className="inline-flex items-center gap-1">
              <User className="size-3" />
              {objective.owner}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-3" />
              Target {formatDate(objective.targetDate)}
            </span>
          </div>
        </div>
      </div>
      <div className="shrink-0 pl-10 sm:pl-0">
        <StatusBadge tone={OBJECTIVE_STATUS_TONES[objective.status]} withDot={objective.status === "In progress"}>
          {objective.status}
        </StatusBadge>
      </div>
    </div>
  )
}

function ComponentSection({ component, index }) {
  const sample = SAMPLE_OBJECTIVE_SETS[index % SAMPLE_OBJECTIVE_SETS.length]
  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden hover:border-[#C4B0E8] hover:shadow-md transition-all">
      {/* Section header */}
      <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Component {index + 1}
            </span>
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#EDE9F8] text-[#3B1F6A]">
              {component.isqm_reference}
            </span>
          </div>
          <h2 className="mt-1 text-sm font-semibold text-[#1E0A3C] leading-snug">
            {component.name}
          </h2>
        </div>
        <div className="shrink-0 sm:w-48">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 sm:text-right">
            Completion
          </p>
          <CompletionBar value={sample.completion} />
        </div>
      </div>

      {/* Objectives */}
      <div className="divide-y divide-border">
        {sample.objectives.map((objective) => (
          <ObjectiveRow key={objective.id} objective={objective} />
        ))}
      </div>
    </div>
  )
}

function SectionSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <div className="border-b border-border px-5 py-4 space-y-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="divide-y divide-border">
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-4">
            <Skeleton className="size-7 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ObjectivesPage() {
  const { components, loading, error } = useComponents()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quality Objectives"
        description="Quality objectives established for each component of the System of Quality Management, with owners, target dates and progress."
        badge="ISQM 1 §24-29"
      />

      <PreviewBanner>
        Objectives are sample data — only the SOQM components below come from the live API.
      </PreviewBanner>

      {/* Stat strip */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total objectives" value="21" hint="Across all 8 components" icon={Target} tone="purple" />
        <StatCard label="Achieved" value="8" hint="Confirmed by monitoring" icon={CheckCircle2} tone="success" />
        <StatCard label="In progress" value="9" hint="Actions underway" icon={Loader2} tone="warning" />
        <StatCard label="At risk" value="4" hint="Target date within 30 days" icon={AlertTriangle} tone="danger" />
      </div>

      {/* Component sections */}
      {loading ? (
        <div className="space-y-4">
          <SectionSkeleton />
          <SectionSkeleton />
          <SectionSkeleton />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-6 text-sm text-muted-foreground">
          <AlertCircle className="size-4 shrink-0" />
          <span>Could not load SOQM components — objectives cannot be grouped right now.</span>
        </div>
      ) : (
        <div className="space-y-4">
          {components.map((component, index) => (
            <ComponentSection key={component.id} component={component} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
