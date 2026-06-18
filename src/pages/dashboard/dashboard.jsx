import { useMemo } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useComponents } from "@/hooks/useComponents"
import { useObjectives } from "@/hooks/useObjectives"
import { useRisks } from "@/hooks/useRisks"
import { useDepartments } from "@/hooks/useDepartments"
import { ROUTES } from "@/router/routes"
import { OBJECTIVE_STATUS, RISK_ZONE, riskZone, statusMeta } from "@/lib/status"
import { StatCard } from "@/components/common/StatCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import {
  Layers, Target, ShieldAlert, Building2, ArrowUpRight, ShieldCheck,
} from "lucide-react"

function greetingFor() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 18) return "Good afternoon"
  return "Good evening"
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { components } = useComponents()
  const { objectives } = useObjectives()
  const { risks } = useRisks()
  const { departments } = useDepartments()

  const firstName = user?.name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "there"

  const activeComponents = components.filter((c) => c.status === "ACTIVE").length
  const openRisks = risks.filter((r) => !["closed", "accepted"].includes(r.status)).length

  const riskZones = useMemo(() => {
    const z = { critical: 0, high: 0, low: 0 }
    for (const r of risks) z[riskZone(r.occurence, r.significance)] += 1
    return z
  }, [risks])

  const objectiveBreakdown = useMemo(() => {
    const counts = {}
    for (const o of objectives) counts[o.status] = (counts[o.status] ?? 0) + 1
    return Object.entries(OBJECTIVE_STATUS)
      .map(([key, meta]) => ({ key, meta, count: counts[key] ?? 0 }))
      .filter((x) => x.count > 0)
  }, [objectives])

  const topRisks = useMemo(
    () =>
      risks
        .map((r) => ({ ...r, score: r.occurence * r.significance }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5),
    [risks]
  )

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{greetingFor()}, {firstName}.</h1>
          <p className="mt-1 text-sm text-muted-foreground">{today} · System of Quality Management overview</p>
        </div>
        <StatusBadge tone="purple" withDot>{user?.role?.replace(/_/g, " ") ?? "Member"}</StatusBadge>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active components" value={`${activeComponents} / 8`} hint="ISQM 1 coverage" icon={Layers} tone="purple" />
        <StatCard label="Quality objectives" value={objectives.length} hint={`${objectives.filter((o) => o.status === "active").length} active`} icon={Target} tone="info" />
        <StatCard label="Open risks" value={openRisks} hint={`${riskZones.critical} critical`} icon={ShieldAlert} tone="danger" />
        <StatCard label="Departments" value={departments.length} hint={`${departments.filter((d) => !d.parent_dept).length} top-level`} icon={Building2} tone="teal" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        {/* Risk distribution donut */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Risk distribution</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">By heat-map zone (occurrence × significance)</p>
          <div className="mt-4 flex items-center gap-5">
            <Donut zones={riskZones} total={risks.length} />
            <div className="space-y-2">
              {["critical", "high", "low"].map((z) => (
                <div key={z} className="flex items-center gap-2 text-sm">
                  <span className={`size-2.5 rounded-full ${RISK_ZONE[z].dot}`} />
                  <span className="text-foreground">{RISK_ZONE[z].label}</span>
                  <span className="text-muted-foreground">· {riskZones[z]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Objective workflow breakdown */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Objectives by workflow state</h2>
            <Link to={ROUTES.OBJECTIVES} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
          {objectiveBreakdown.length === 0 ? (
            <p className="mt-6 text-center text-sm text-muted-foreground">No objectives yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {objectiveBreakdown.map(({ key, meta, count }) => {
                const pct = objectives.length ? Math.round((count / objectives.length) * 100) : 0
                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <StatusBadge tone={meta.tone} withDot>{meta.label}</StatusBadge>
                      </span>
                      <span className="tabular-nums text-muted-foreground">{count} · {pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className={`h-full rounded-full ${toneBar(meta.tone)}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top risks + quick links */}
      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Top open risks</h2>
            <Link to={ROUTES.RISKS} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              Risk matrix <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
          {topRisks.length === 0 ? (
            <p className="mt-6 text-center text-sm text-muted-foreground">No risks recorded.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {topRisks.map((r) => {
                const zone = RISK_ZONE[riskZone(r.occurence, r.significance)]
                return (
                  <li key={r.id} className="flex items-center gap-3 py-2.5">
                    <span className={`size-2 shrink-0 rounded-full ${zone.dot}`} />
                    <span className="font-mono text-xs text-muted-foreground">{r.risk_ref}</span>
                    <span className="flex-1 truncate text-sm text-foreground">{r.risk_discription}</span>
                    <StatusBadge tone={zone.tone}>{zone.label} · {r.score}</StatusBadge>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Jump back in</h2>
          <div className="mt-3 space-y-2">
            <QuickLink to={ROUTES.COMPONENTS} icon={ShieldCheck} title="SOQM components" desc="The 8 ISQM 1 components" />
            <QuickLink to={ROUTES.OBJECTIVES} icon={Target} title="Quality objectives" desc="Workflow & reviews" />
            <QuickLink to={ROUTES.RISKS} icon={ShieldAlert} title="Risk matrix" desc="Assess & track risks" />
            <QuickLink to={ROUTES.DEPARTMENTS} icon={Building2} title="Departments" desc="Org structure" />
          </div>
        </div>
      </div>
    </div>
  )
}

function toneBar(tone) {
  return {
    purple: "bg-[#7B3FBE]",
    info: "bg-[#3B6FBE]",
    success: "bg-[#2E9E6B]",
    warning: "bg-[#D4820A]",
    danger: "bg-[#E24B4A]",
    teal: "bg-[#2E8080]",
    muted: "bg-muted-foreground/40",
  }[tone] ?? "bg-primary"
}

function Donut({ zones, total }) {
  const colors = { critical: "#E24B4A", high: "#D4820A", low: "#2E9E6B" }
  const order = ["critical", "high", "low"]
  const r = 52
  const c = 2 * Math.PI * r
  let offset = 0
  const segments = total
    ? order.map((z) => {
        const frac = zones[z] / total
        const seg = { z, dash: frac * c, offset }
        offset += frac * c
        return seg
      })
    : []

  return (
    <div className="relative size-32 shrink-0">
      <svg viewBox="0 0 128 128" className="size-32 -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="var(--muted)" strokeWidth="14" />
        {segments.map((s) => (
          <circle
            key={s.z}
            cx="64" cy="64" r={r}
            fill="none"
            stroke={colors[s.z]}
            strokeWidth="14"
            strokeDasharray={`${s.dash} ${c - s.dash}`}
            strokeDashoffset={-s.offset}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold text-foreground">{total}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Risks</span>
      </div>
    </div>
  )
}

function QuickLink({ to, icon: Icon, title, desc }) {
  return (
    <Link to={to} className="group flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-muted/40">
      <div className="flex size-8 items-center justify-center rounded-lg bg-[#EDE9F8]">
        <Icon className="size-4 text-[#7B3FBE]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  )
}
