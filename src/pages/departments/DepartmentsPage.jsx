import { PageHeader } from "@/components/common/PageHeader"
import { PreviewBanner } from "@/components/common/PreviewBanner"
import { StatCard } from "@/components/common/StatCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import {
  Building2,
  Users,
  Award,
  BriefcaseBusiness,
  ShieldCheck,
  Landmark,
  Lightbulb,
  Scale,
  MonitorCog,
  HeartHandshake,
} from "lucide-react"

const SAMPLE_DEPARTMENTS = [
  {
    id: "dep-001",
    name: "Audit & Assurance",
    description: "Statutory and contractual audits, IFRS reporting and assurance engagements.",
    head: { name: "Yacine Benmansour", role: "Managing Partner" },
    headcount: 64,
    activeEngagements: 31,
    qualityChampion: "Lina Hadj-Arab",
    icon: ShieldCheck,
    color: { bg: "bg-[#EDE9F8]", text: "text-[#3B1F6A]" },
  },
  {
    id: "dep-002",
    name: "Tax",
    description: "Corporate tax compliance, transfer pricing and tax advisory services.",
    head: { name: "Salima Cherifi", role: "Tax Partner" },
    headcount: 28,
    activeEngagements: 19,
    qualityChampion: "Karim Ould-Slimane",
    icon: Landmark,
    color: { bg: "bg-[#E8F0FB]", text: "text-[#1E3A6E]" },
  },
  {
    id: "dep-003",
    name: "Advisory",
    description: "Transaction services, valuations, restructuring and business consulting.",
    head: { name: "Thomas Keller", role: "Advisory Partner" },
    headcount: 22,
    activeEngagements: 12,
    qualityChampion: "Nadia Boukhalfa",
    icon: Lightbulb,
    color: { bg: "bg-[#FDF3E7]", text: "text-[#7A3E0A]" },
  },
  {
    id: "dep-004",
    name: "Quality & Risk Management",
    description: "ISQM 1 system of quality management, ethics, independence and EQR oversight.",
    head: { name: "Amel Ferhat", role: "Quality Partner" },
    headcount: 9,
    activeEngagements: 6,
    qualityChampion: "Sofiane Mebarki",
    icon: Scale,
    color: { bg: "bg-[#EAF3EE]", text: "text-[#1A4731]" },
  },
  {
    id: "dep-005",
    name: "IT & Operations",
    description: "Technological resources, audit tooling, information security and facilities.",
    head: { name: "Mehdi Zeroual", role: "IT Director" },
    headcount: 11,
    activeEngagements: 4,
    qualityChampion: "Sarah Lindqvist",
    icon: MonitorCog,
    color: { bg: "bg-[#E8F5F5]", text: "text-[#1A4747]" },
  },
  {
    id: "dep-006",
    name: "HR & Talent",
    description: "Recruitment, training, performance evaluation and professional development.",
    head: { name: "Imene Bouzid", role: "HR Director" },
    headcount: 7,
    activeEngagements: 3,
    qualityChampion: "Rachid Ait-Kaci",
    icon: HeartHandshake,
    color: { bg: "bg-[#FDE8F0]", text: "text-[#7A1E3E]" },
  },
]

const TOTAL_STAFF = SAMPLE_DEPARTMENTS.reduce((sum, d) => sum + d.headcount, 0)
const OPEN_POSITIONS = 8

export default function DepartmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        description="Service lines and support functions of the firm, with their quality champions."
        badge={`${SAMPLE_DEPARTMENTS.length} Departments`}
      />

      <PreviewBanner />

      {/* Stat strip */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Departments"
          value={SAMPLE_DEPARTMENTS.length}
          hint="Service lines and support functions"
          icon={Building2}
          tone="purple"
        />
        <StatCard
          label="Total staff"
          value={TOTAL_STAFF}
          hint="Across all departments"
          icon={Users}
          tone="info"
        />
        <StatCard
          label="Quality champions"
          value={SAMPLE_DEPARTMENTS.length}
          hint="One designated per department"
          icon={Award}
          tone="success"
        />
        <StatCard
          label="Open positions"
          value={OPEN_POSITIONS}
          hint="Currently under recruitment"
          icon={BriefcaseBusiness}
          tone="warning"
        />
      </div>

      {/* Department cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SAMPLE_DEPARTMENTS.map((dept) => {
          const Icon = dept.icon
          return (
            <div
              key={dept.id}
              className="group flex flex-col gap-4 rounded-xl border border-border bg-white p-5 hover:border-[#C4B0E8] hover:shadow-md transition-all duration-200"
            >
              {/* Icon + headcount */}
              <div className="flex items-center justify-between">
                <div className={`flex size-10 items-center justify-center rounded-lg ${dept.color.bg}`}>
                  <Icon className={`size-5 ${dept.color.text}`} />
                </div>
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${dept.color.bg} ${dept.color.text}`}>
                  {dept.headcount} staff
                </span>
              </div>

              {/* Name + description */}
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-[#1E0A3C] leading-snug">
                  {dept.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {dept.description}
                </p>
              </div>

              {/* Head + engagements */}
              <div className="grid grid-cols-2 gap-3 border-t border-border pt-4">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Head
                  </p>
                  <p className="text-sm font-medium text-[#1E0A3C]">{dept.head.name}</p>
                  <p className="text-xs text-muted-foreground">{dept.head.role}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Engagements
                  </p>
                  <p className="text-sm font-medium text-[#1E0A3C]">{dept.activeEngagements}</p>
                  <p className="text-xs text-muted-foreground">currently active</p>
                </div>
              </div>

              {/* Quality champion */}
              <div className="flex items-center justify-between mt-auto">
                <StatusBadge tone="warning" withDot>
                  QUALITY CHAMPION
                </StatusBadge>
                <span className="text-xs font-medium text-[#3B1F6A]">
                  {dept.qualityChampion}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
