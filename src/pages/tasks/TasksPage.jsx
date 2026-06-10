import { PageHeader } from "@/components/common/PageHeader"
import { PreviewBanner } from "@/components/common/PreviewBanner"
import { StatusBadge } from "@/components/common/StatusBadge"
import { CalendarDays } from "lucide-react"

const COLUMNS = [
  { id: "todo", label: "To do", dot: "bg-[#7B3FBE]" },
  { id: "in_progress", label: "In progress", dot: "bg-[#3B6FBE]" },
  { id: "done", label: "Done", dot: "bg-[#2E7D52]" },
]

const PRIORITY_TONES = {
  High: "danger",
  Medium: "warning",
  Low: "muted",
}

const SAMPLE_TASKS = [
  {
    id: "TSK-2026-041",
    status: "todo",
    title: "Collect signed independence confirmations — Statutory Audit Cevital SPA 2025",
    module: "Documents",
    assignee: "Nadia Cherif",
    due: "2026-06-09",
    priority: "High",
  },
  {
    id: "TSK-2026-042",
    status: "todo",
    title: "Prepare Q2 2026 monitoring sample selection across assurance engagements",
    module: "Monitoring",
    assignee: "Karim Haddad",
    due: "2026-06-19",
    priority: "Medium",
  },
  {
    id: "TSK-2026-043",
    status: "todo",
    title: "Update continuance memo — Sonatrach Raffinage subsidiary",
    module: "Acceptance",
    assignee: "Amel Boudiaf",
    due: "2026-06-26",
    priority: "Low",
  },
  {
    id: "TSK-2026-037",
    status: "in_progress",
    title: "Remediate finding F-2026-014 — archiving delays on Djezzy interim file",
    module: "Findings",
    assignee: "Yacine Belkacem",
    due: "2026-06-08",
    priority: "High",
  },
  {
    id: "TSK-2026-038",
    status: "in_progress",
    title: "Draft EQR conclusions memo — Air Algérie consolidated FY2025",
    module: "EQR",
    assignee: "Sarah Whitmore",
    due: "2026-06-13",
    priority: "High",
  },
  {
    id: "TSK-2026-039",
    status: "in_progress",
    title: "Reconcile ethics training completion against the staff register",
    module: "Resources",
    assignee: "Mohamed Larbi",
    due: "2026-06-20",
    priority: "Medium",
  },
  {
    id: "TSK-2026-031",
    status: "done",
    title: "Publish Week 23 quality report to the leadership group",
    module: "Reports",
    assignee: "Lina Benhamouda",
    due: "2026-06-08",
    priority: "Medium",
  },
  {
    id: "TSK-2026-029",
    status: "done",
    title: "Rescore IT system migration risk after control walkthrough",
    module: "Risks",
    assignee: "Thomas Keller",
    due: "2026-06-05",
    priority: "Low",
  },
  {
    id: "TSK-2026-027",
    status: "done",
    title: "Close root-cause analysis — F-2026-009 file assembly deadline",
    module: "Findings",
    assignee: "Nadia Cherif",
    due: "2026-06-04",
    priority: "High",
  },
]

const initials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

const formatDue = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

const isOverdue = (iso) => new Date(`${iso}T23:59:59`) < new Date()

function TaskCard({ task, columnId }) {
  const overdue = columnId !== "done" && isOverdue(task.due)
  return (
    <div className="space-y-3 rounded-xl border border-border bg-white p-4 hover:border-[#C4B0E8] hover:shadow-md transition-all">
      <p className="text-sm font-medium text-[#1E0A3C] leading-snug">{task.title}</p>

      <div className="flex flex-wrap items-center gap-1.5">
        <StatusBadge tone="purple">{task.module}</StatusBadge>
        <StatusBadge tone={PRIORITY_TONES[task.priority]}>{task.priority}</StatusBadge>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#EDE9F8] text-[10px] font-semibold text-[#3B1F6A]">
            {initials(task.assignee)}
          </span>
          <span className="truncate text-xs text-muted-foreground">{task.assignee}</span>
        </div>
        <span
          className={`flex shrink-0 items-center gap-1 text-xs ${
            overdue ? "font-medium text-[#C4336E]" : "text-muted-foreground"
          }`}
        >
          <CalendarDays className="size-3.5" />
          {formatDue(task.due)}
        </span>
      </div>
    </div>
  )
}

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Quality-management actions assigned across the firm, organised by progress."
        badge={`${SAMPLE_TASKS.length} open items`}
      />

      <PreviewBanner />

      <div className="grid gap-4 lg:grid-cols-3">
        {COLUMNS.map((column) => {
          const tasks = SAMPLE_TASKS.filter((task) => task.status === column.id)
          return (
            <div key={column.id} className="flex flex-col gap-3 rounded-xl bg-[#F7F4FC] p-3">
              <div className="flex items-center justify-between px-1 pt-1">
                <div className="flex items-center gap-2">
                  <span className={`size-1.5 rounded-full ${column.dot}`} />
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {column.label}
                  </span>
                </div>
                <span className="rounded-full border border-border bg-white px-2 py-0.5 text-[11px] font-medium text-[#3B1F6A]">
                  {tasks.length}
                </span>
              </div>

              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} columnId={column.id} />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
