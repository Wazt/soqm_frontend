import { PageHeader } from "@/components/common/PageHeader"
import { PreviewBanner } from "@/components/common/PreviewBanner"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarRange,
  Download,
  FileChartColumn,
} from "lucide-react"

const SAMPLE_REPORTS = [
  {
    id: "WR-2026-23",
    week: 23,
    year: 2026,
    range: "1 – 7 Jun 2026",
    status: "Draft",
    featured: true,
    kpis: [
      { label: "Documents reviewed", value: "47", delta: "+5", direction: "up" },
      { label: "Avg quality score", value: "88.0%", delta: "+1.2", direction: "up" },
      { label: "New findings", value: "3", delta: "-2", direction: "down" },
    ],
  },
  {
    id: "WR-2026-22",
    week: 22,
    year: 2026,
    range: "25 – 31 May 2026",
    status: "Published",
    featured: false,
    kpis: [
      { label: "Documents reviewed", value: "42", delta: "+3", direction: "up" },
      { label: "Avg quality score", value: "86.8%", delta: "-0.6", direction: "down" },
      { label: "New findings", value: "5", delta: "+1", direction: "up" },
    ],
  },
  {
    id: "WR-2026-21",
    week: 21,
    year: 2026,
    range: "18 – 24 May 2026",
    status: "Published",
    featured: false,
    kpis: [
      { label: "Documents reviewed", value: "39", delta: "-4", direction: "down" },
      { label: "Avg quality score", value: "87.4%", delta: "+0.9", direction: "up" },
      { label: "New findings", value: "4", delta: "-1", direction: "down" },
    ],
  },
  {
    id: "WR-2026-20",
    week: 20,
    year: 2026,
    range: "11 – 17 May 2026",
    status: "Published",
    featured: false,
    kpis: [
      { label: "Documents reviewed", value: "43", delta: "+8", direction: "up" },
      { label: "Avg quality score", value: "86.5%", delta: "-1.1", direction: "down" },
      { label: "New findings", value: "5", delta: "+2", direction: "up" },
    ],
  },
  {
    id: "WR-2026-19",
    week: 19,
    year: 2026,
    range: "4 – 10 May 2026",
    status: "Published",
    featured: false,
    kpis: [
      { label: "Documents reviewed", value: "35", delta: "-2", direction: "down" },
      { label: "Avg quality score", value: "87.6%", delta: "+0.4", direction: "up" },
      { label: "New findings", value: "3", delta: "-1", direction: "down" },
    ],
  },
  {
    id: "WR-2026-18",
    week: 18,
    year: 2026,
    range: "27 Apr – 3 May 2026",
    status: "Published",
    featured: false,
    kpis: [
      { label: "Documents reviewed", value: "37", delta: "+6", direction: "up" },
      { label: "Avg quality score", value: "87.2%", delta: "+0.8", direction: "up" },
      { label: "New findings", value: "4", delta: "+1", direction: "up" },
    ],
  },
]

function KpiRow({ kpi }) {
  const up = kpi.direction === "up"
  const DeltaIcon = up ? ArrowUpRight : ArrowDownRight
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground">{kpi.label}</span>
      <span className="flex items-center gap-1.5">
        <span className="text-sm font-medium text-[#1E0A3C]">{kpi.value}</span>
        <span
          className={`flex items-center gap-0.5 text-[11px] font-medium ${
            up ? "text-[#2E7D52]" : "text-[#C4336E]"
          }`}
        >
          <DeltaIcon className="size-3" />
          {kpi.delta}
        </span>
      </span>
    </div>
  )
}

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Reports"
        description="Weekly snapshots of review activity, quality scores and findings across the firm."
        badge={`${SAMPLE_REPORTS.length} reports`}
      />

      <PreviewBanner />

      <TooltipProvider>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {SAMPLE_REPORTS.map((report) => (
            <div
              key={report.id}
              className={`flex flex-col gap-4 rounded-xl border bg-white p-5 transition-all hover:shadow-md ${
                report.featured
                  ? "border-[#C4B0E8] shadow-sm"
                  : "border-border hover:border-[#C4B0E8]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex size-9 items-center justify-center rounded-lg bg-[#EDE9F8]">
                  <FileChartColumn className="size-4 text-[#3B1F6A]" />
                </div>
                <div className="flex items-center gap-1.5">
                  {report.featured && (
                    <StatusBadge tone="purple" withDot>
                      Latest
                    </StatusBadge>
                  )}
                  <StatusBadge tone={report.status === "Published" ? "success" : "muted"}>
                    {report.status}
                  </StatusBadge>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-[#1E0A3C]">
                  Week {report.week} — {report.year}
                </h3>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarRange className="size-3.5" />
                  {report.range}
                </p>
              </div>

              <div className="space-y-2 border-t border-border pt-3">
                {report.kpis.map((kpi) => (
                  <KpiRow key={kpi.label} kpi={kpi} />
                ))}
              </div>

              <Tooltip>
                <TooltipTrigger render={<span className="mt-auto block" />}>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="pointer-events-none w-full gap-1.5"
                  >
                    <Download className="size-3.5" />
                    Download
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Export will be available once the reporting API ships
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </div>
      </TooltipProvider>
    </div>
  )
}
