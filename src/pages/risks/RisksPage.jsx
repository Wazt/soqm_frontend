import { useState, useMemo, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  ShieldAlert, Loader2, AlertCircle, Plus, ChevronRight, X, Target,
} from "lucide-react"
import { useRisks } from "@/hooks/useRisks"
import { useObjectives } from "@/hooks/useObjectives"
import { useComponents } from "@/hooks/useComponents"
import { useRole } from "@/hooks/useRole"
import { createRisk } from "@/api/endpoints/risksApi"
import { RISK_ZONE, RISK_STATUS, RISK_LEVEL, riskZone, statusMeta } from "@/lib/status"
import { formatDate } from "@/lib/format"
import { objectiveDetailPath } from "@/router/routes"
import { PageHeader } from "@/components/common/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { EmptyState } from "@/components/common/EmptyState"
import { Modal } from "@/components/common/Modal"
import { TextField, TextAreaField, SelectField } from "@/components/common/Field"
import { Button } from "@/components/ui/button"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet"

const SIGNIFICANCE_ROWS = [3, 2, 1] // top → bottom
const OCCURRENCE_COLS = [1, 2, 3] // left → right

export default function RisksPage() {
  const { risks, loading, error, refetch } = useRisks()
  const { objectives } = useObjectives()
  const { components } = useComponents()
  const { isAdmin } = useRole()

  const [zoneFilter, setZoneFilter] = useState(null)
  const [selected, setSelected] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)

  const withZone = useMemo(
    () => risks.map((r) => ({ ...r, zone: riskZone(r.occurence, r.significance), score: r.occurence * r.significance })),
    [risks]
  )
  const counts = useMemo(() => {
    const c = { critical: 0, high: 0, low: 0 }
    for (const r of withZone) c[r.zone] += 1
    return c
  }, [withZone])

  const listRisks = zoneFilter ? withZone.filter((r) => r.zone === zoneFilter) : withZone

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        <span className="text-sm">Loading risk register…</span>
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-destructive">
        <AlertCircle className="size-4" />
        <span className="text-sm font-medium">Failed to load risks.</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Risk matrix"
        description="Quality risks plotted by occurrence × significance. Score drives the heat-map zone."
        badge={`${risks.length} Risks`}
        actions={
          isAdmin && (
            <Button onClick={() => setCreateOpen(true)} size="default">
              <Plus className="size-4" /> Add risk
            </Button>
          )
        }
      />

      {/* Zone stat / filter cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {["critical", "high", "low"].map((zone) => {
          const meta = RISK_ZONE[zone]
          const active = zoneFilter === zone
          return (
            <button
              key={zone}
              onClick={() => setZoneFilter(active ? null : zone)}
              className={`flex items-center justify-between rounded-xl border bg-card p-5 text-left transition-all ${
                active ? "border-primary ring-2 ring-ring/30" : "border-border hover:border-primary/40"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  <span className={`size-2 rounded-full ${meta.dot}`} /> {meta.label} risks
                </div>
                <p className="mt-2 text-2xl font-semibold text-foreground">{counts[zone]}</p>
              </div>
              <StatusBadge tone={meta.tone}>{active ? "Filtering" : "Filter"}</StatusBadge>
            </button>
          )
        })}
      </div>

      {risks.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="No risks recorded"
          description={isAdmin ? "Add the first quality risk to populate the matrix." : "No quality risks have been recorded yet."}
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          {/* Heat map */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex">
              {/* y-axis label */}
              <div className="flex w-6 items-center justify-center">
                <span className="-rotate-90 whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Significance →
                </span>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-[auto_repeat(3,minmax(0,1fr))] gap-1.5">
                  {SIGNIFICANCE_ROWS.map((sig) => (
                    <RowCells
                      key={sig}
                      sig={sig}
                      risks={withZone}
                      zoneFilter={zoneFilter}
                      onSelect={setSelected}
                    />
                  ))}
                  {/* x-axis ticks */}
                  <div />
                  {OCCURRENCE_COLS.map((occ) => (
                    <div key={occ} className="pt-1 text-center text-[10px] font-medium text-muted-foreground">
                      {RISK_LEVEL[occ]}
                    </div>
                  ))}
                </div>
                <p className="mt-1.5 text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Occurrence →
                </p>
              </div>
            </div>

            {/* legend */}
            <div className="mt-4 flex items-center justify-center gap-4 border-t border-border pt-3">
              {["low", "high", "critical"].map((z) => (
                <span key={z} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className={`size-2 rounded-full ${RISK_ZONE[z].dot}`} /> {RISK_ZONE[z].label}
                </span>
              ))}
            </div>
          </div>

          {/* Register list */}
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Risk register {zoneFilter && <>· <span className={RISK_ZONE[zoneFilter].text}>{RISK_ZONE[zoneFilter].label}</span></>}
              </h2>
              {zoneFilter && (
                <button onClick={() => setZoneFilter(null)} className="text-xs text-muted-foreground hover:text-foreground">Clear filter</button>
              )}
            </div>
            <div className="max-h-[460px] overflow-y-auto">
              {listRisks.map((r) => {
                const meta = RISK_ZONE[r.zone]
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className="flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left last:border-b-0 hover:bg-muted/40"
                  >
                    <span className={`size-2 shrink-0 rounded-full ${meta.dot}`} />
                    <span className="font-mono text-xs text-muted-foreground">{r.risk_ref}</span>
                    <span className="flex-1 truncate text-sm text-foreground">{r.risk_discription}</span>
                    <StatusBadge tone={meta.tone}>{r.score}</StatusBadge>
                    <ChevronRight className="size-4 text-muted-foreground/50" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <RiskDrawer risk={selected} onClose={() => setSelected(null)} objectives={objectives} components={components} />
      <CreateRiskModal open={createOpen} onOpenChange={setCreateOpen} objectives={objectives} onCreated={refetch} />
    </div>
  )
}

function RowCells({ sig, risks, zoneFilter, onSelect }) {
  return (
    <>
      <div className="flex items-center justify-end pr-1.5 text-[10px] font-medium text-muted-foreground">{RISK_LEVEL[sig]}</div>
      {OCCURRENCE_COLS.map((occ) => {
        const zone = riskZone(occ, sig)
        const meta = RISK_ZONE[zone]
        const cellRisks = risks.filter((r) => r.occurence === occ && r.significance === sig)
        const dimmed = zoneFilter && zoneFilter !== zone
        return (
          <div
            key={occ}
            className={`min-h-[78px] rounded-lg border border-border/60 p-1.5 transition-opacity ${meta.cell} ${dimmed ? "opacity-30" : ""}`}
          >
            <div className="flex flex-wrap content-start gap-1">
              {cellRisks.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onSelect(r)}
                  className={`rounded-md bg-card/80 px-1.5 py-0.5 font-mono text-[10px] font-medium shadow-sm ring-1 ring-border transition-transform hover:scale-105 ${meta.text}`}
                  title={r.risk_discription}
                >
                  {r.risk_ref}
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </>
  )
}

function RiskDrawer({ risk, onClose, objectives, components }) {
  const open = !!risk
  if (!risk) return <Sheet open={false} onOpenChange={onClose}><SheetContent /></Sheet>
  const meta = RISK_ZONE[riskZone(risk.occurence, risk.significance)]
  const status = statusMeta(RISK_STATUS, risk.status)
  const objective = objectives.find((o) => o.id === risk.objective_id)
  const component = components.find((c) => c.id === risk.component_id)
  const score = risk.occurence * risk.significance

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <div className="flex items-center gap-2">
            <StatusBadge tone={meta.tone} withDot>{meta.label}</StatusBadge>
            <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
          </div>
          <SheetTitle className="mt-1.5 font-mono">{risk.risk_ref}</SheetTitle>
          <SheetDescription>{risk.risk_discription}</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 overflow-y-auto p-4">
          <div className="grid grid-cols-3 gap-2">
            <MiniStat label="Occurrence" value={RISK_LEVEL[risk.occurence]} sub={`(${risk.occurence})`} />
            <MiniStat label="Significance" value={RISK_LEVEL[risk.significance]} sub={`(${risk.significance})`} />
            <MiniStat label="Score" value={score} sub={`/ 9`} />
          </div>

          <Field label="Identified">{formatDate(risk.date_identified)}</Field>
          {component && <Field label="Component">{component.name} · {component.isqm_reference}</Field>}
          {objective && (
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Linked objective</p>
              <Link to={objectiveDetailPath(objective.id)} className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm transition-colors hover:border-primary/40">
                <Target className="size-3.5 text-[#7B3FBE]" />
                <span className="flex-1 truncate text-foreground">{objective.objective_text}</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function MiniStat({ label, value, sub }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-semibold text-foreground">{value} <span className="text-xs font-normal text-muted-foreground">{sub}</span></p>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{children}</p>
    </div>
  )
}

const emptyRisk = { objective_id: "", risk_ref: "", risk_discription: "", occurence: "2", significance: "2" }

function CreateRiskModal({ open, onOpenChange, objectives, onCreated }) {
  const [form, setForm] = useState(emptyRisk)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) { setForm(emptyRisk); setErrors({}); setApiError("") }
  }, [open])

  const objective = objectives.find((o) => o.id === form.objective_id)
  // risks may only be created against ACTIVE-component objectives that aren't archived
  const eligible = objectives.filter((o) => !["archived", "superseded"].includes(o.status))

  function set(key, value) { setForm((f) => ({ ...f, [key]: value })) }
  function validate() {
    const e = {}
    if (!form.objective_id) e.objective_id = "Select an objective."
    if (!form.risk_discription.trim()) e.risk_discription = "Describe the risk."
    setErrors(e)
    return Object.keys(e).length === 0
  }
  async function handleSubmit(ev) {
    ev.preventDefault()
    setApiError("")
    if (!validate()) return
    setSaving(true)
    try {
      await createRisk({
        objective_id: form.objective_id,
        component_id: objective?.component_id,
        risk_ref: form.risk_ref.trim(),
        risk_discription: form.risk_discription.trim(),
        occurence: Number(form.occurence),
        significance: Number(form.significance),
        status: "identified",
      })
      onOpenChange(false)
      await onCreated()
    } catch (err) {
      setApiError(err?.response?.data?.message ?? "Failed to create risk.")
    } finally {
      setSaving(false)
    }
  }

  const levelOptions = [
    { value: "1", label: "1 · Low" },
    { value: "2", label: "2 · Medium" },
    { value: "3", label: "3 · High" },
  ]
  const previewScore = Number(form.occurence) * Number(form.significance)
  const previewZone = RISK_ZONE[riskZone(Number(form.occurence), Number(form.significance))]

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="New risk" description="Risks are scored automatically as occurrence × significance.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <SelectField
          label="Quality objective"
          required
          value={form.objective_id}
          onChange={(e) => set("objective_id", e.target.value)}
          placeholder="Select an objective…"
          error={errors.objective_id}
          options={eligible.map((o) => ({ value: o.id, label: o.objective_text.slice(0, 70) }))}
        />
        <TextField label="Risk reference" value={form.risk_ref} onChange={(e) => set("risk_ref", e.target.value)} placeholder="Auto-generated if left blank (e.g. R-013)" />
        <TextAreaField label="Description" required rows={3} value={form.risk_discription} onChange={(e) => set("risk_discription", e.target.value)} error={errors.risk_discription} placeholder="What could go wrong, and why it matters…" />
        <div className="grid grid-cols-2 gap-3">
          <SelectField label="Occurrence" value={form.occurence} onChange={(e) => set("occurence", e.target.value)} options={levelOptions} />
          <SelectField label="Significance" value={form.significance} onChange={(e) => set("significance", e.target.value)} options={levelOptions} />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
          <span className="text-muted-foreground">Calculated score</span>
          <span className="flex items-center gap-2 font-medium text-foreground">
            {previewScore} <StatusBadge tone={previewZone.tone}>{previewZone.label}</StatusBadge>
          </span>
        </div>
        {apiError && <p className="text-xs text-destructive">{apiError}</p>}
        <div className="-mx-4 -mb-4 flex justify-end gap-2 rounded-b-xl border-t border-border bg-muted/40 p-4">
          <Button type="button" variant="outline" size="default" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button type="submit" size="default" disabled={saving}>
            {saving && <Loader2 className="size-3.5 animate-spin" />} Create risk
          </Button>
        </div>
      </form>
    </Modal>
  )
}
