import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  Loader2, AlertCircle, ArrowLeft, Pencil, Trash2, ShieldCheck,
  CalendarClock, Clock, AlertTriangle, X, Check,
} from "lucide-react"
import { useObjective } from "@/hooks/useObjective"
import { useComponents } from "@/hooks/useComponents"
import { useRisks } from "@/hooks/useRisks"
import { useRole } from "@/hooks/useRole"
import { updateObjective, deleteObjective } from "@/api/endpoints/objectivesApi"
import {
  OBJECTIVE_STATUS, OBJECTIVE_TRANSITIONS, OBJECTIVE_ACTION_LABEL,
  RISK_ZONE, riskZone, statusMeta,
} from "@/lib/status"
import { formatDate, formatDateTime } from "@/lib/format"
import { ROUTES } from "@/router/routes"
import { StatusBadge } from "@/components/common/StatusBadge"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { TextAreaField, TextField, SelectField } from "@/components/common/Field"
import { Button } from "@/components/ui/button"

// Buttons that move the objective into a "winding down" state read as cautionary.
const DESTRUCTIVE_TARGETS = new Set(["suspended", "archived"])

export default function ObjectiveDetailsPage() {
  const { objectiveId } = useParams()
  const navigate = useNavigate()
  const { objective, loading, error, refetch, setObjective } = useObjective(objectiveId)
  const { components } = useComponents()
  const { risks } = useRisks()
  const { isAdmin } = useRole()

  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        <span className="text-sm">Loading objective…</span>
      </div>
    )
  }
  if (error || !objective) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="size-4" />
          <span className="text-sm font-medium">Objective not found.</span>
        </div>
        <Button variant="outline" size="default" onClick={() => navigate(ROUTES.OBJECTIVES)}>
          <ArrowLeft className="size-4" /> Back to objectives
        </Button>
      </div>
    )
  }

  const status = statusMeta(OBJECTIVE_STATUS, objective.status)
  const component = components.find((c) => c.id === objective.component_id)
  const transitions = OBJECTIVE_TRANSITIONS[objective.status] ?? []
  const linkedRisks = risks.filter((r) => r.objective_id === objective.id)
  const canEdit = isAdmin && objective.status === "draft"
  const canDelete = isAdmin && objective.status === "draft"

  async function transition(target) {
    setBusy(true)
    setActionError("")
    try {
      const updated = await updateObjective(objective.id, { status: target })
      setObjective(updated)
    } catch (err) {
      setActionError(err?.response?.data?.message ?? "Could not change status.")
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    setBusy(true)
    try {
      await deleteObjective(objective.id)
      navigate(ROUTES.OBJECTIVES)
    } catch (err) {
      setActionError(err?.response?.data?.message ?? "Could not delete objective.")
      setConfirmDelete(false)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link to={ROUTES.OBJECTIVES} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" /> Quality Objectives
        </Link>
        {isAdmin && !editing && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="default" onClick={() => setEditing(true)} disabled={!canEdit} title={canEdit ? undefined : "Only draft objectives can be edited"}>
              <Pencil className="size-4" /> Edit
            </Button>
            <Button variant="destructive" size="default" onClick={() => setConfirmDelete(true)} disabled={!canDelete} title={canDelete ? undefined : "Only draft objectives can be deleted"}>
              <Trash2 className="size-4" /> Delete
            </Button>
          </div>
        )}
      </div>

      {editing ? (
        <EditObjectiveForm
          objective={objective}
          components={components}
          onCancel={() => setEditing(false)}
          onSaved={async () => { setEditing(false); await refetch() }}
        />
      ) : (
        <>
          {/* Header card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <StatusBadge tone={status.tone} withDot>{status.label}</StatusBadge>
                <h1 className="max-w-2xl text-lg font-semibold leading-snug text-foreground">{objective.objective_text}</h1>
              </div>
            </div>
            {component && (
              <Link to={ROUTES.COMPONENTS} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs transition-colors hover:border-primary/40">
                <ShieldCheck className="size-3.5 text-[#7B3FBE]" />
                <span className="font-medium text-foreground">{component.name}</span>
                <span className="text-muted-foreground">· {component.isqm_reference}</span>
              </Link>
            )}
          </div>

          {/* Workflow */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Workflow</h2>
            {transitions.length > 0 ? (
              <>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isAdmin ? "Move this objective to its next state:" : "Available transitions from this state:"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {transitions.map((target) => (
                    <Button
                      key={target}
                      size="default"
                      variant={DESTRUCTIVE_TARGETS.has(target) ? (target === "archived" ? "destructive" : "outline") : "default"}
                      onClick={() => transition(target)}
                      disabled={!isAdmin || busy}
                    >
                      {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                      {OBJECTIVE_ACTION_LABEL[target] ?? target}
                    </Button>
                  ))}
                </div>
                {!isAdmin && (
                  <p className="mt-3 text-xs text-muted-foreground">Only ADMIN / SUPER ADMIN can transition objectives.</p>
                )}
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                This objective is in a terminal state ({status.label.toLowerCase()}) — no further transitions are available.
              </p>
            )}
            {actionError && <p className="mt-3 text-xs text-destructive">{actionError}</p>}
          </div>

          {/* Details grid */}
          <div className="grid gap-4 md:grid-cols-3">
            <DetailCard icon={CalendarClock} label="Next review">{formatDate(objective.review_date)}</DetailCard>
            <DetailCard icon={Clock} label="Last updated">{objective.updated_at ? formatDateTime(objective.updated_at) : "Never"}</DetailCard>
            <DetailCard icon={AlertTriangle} label="Linked risks">{linkedRisks.length}</DetailCard>
          </div>

          {objective.description && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Description</h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{objective.description}</p>
            </div>
          )}

          {/* Linked risks */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Risks linked to this objective</h2>
            {linkedRisks.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No risks are currently linked to this objective.</p>
            ) : (
              <ul className="mt-3 divide-y divide-border">
                {linkedRisks.map((r) => {
                  const zone = RISK_ZONE[riskZone(r.occurence, r.significance)]
                  return (
                    <li key={r.id} className="flex items-center gap-3 py-2.5">
                      <span className={`size-2 shrink-0 rounded-full ${zone.dot}`} />
                      <span className="font-mono text-xs text-muted-foreground">{r.risk_ref}</span>
                      <span className="flex-1 truncate text-sm text-foreground">{r.risk_discription}</span>
                      <StatusBadge tone={zone.tone}>{zone.label}</StatusBadge>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </>
      )}

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete objective?"
        description="Draft objectives can be deleted permanently. Active objectives must be archived instead."
        confirmLabel="Delete objective"
        loading={busy}
        onConfirm={handleDelete}
      />
    </div>
  )
}

function DetailCard({ icon: Icon, label, children }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </div>
      <p className="mt-2 text-lg font-semibold text-foreground">{children}</p>
    </div>
  )
}

function EditObjectiveForm({ objective, components, onCancel, onSaved }) {
  const [form, setForm] = useState({
    objective_text: objective.objective_text ?? "",
    description: objective.description ?? "",
    review_date: objective.review_date ? objective.review_date.slice(0, 10) : "",
    component_id: objective.component_id ?? "",
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState("")
  const [saving, setSaving] = useState(false)
  const today = new Date().toISOString().slice(0, 10)
  const activeComponents = components.filter((c) => c.status === "ACTIVE")

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }
  function validate() {
    const e = {}
    if (!form.objective_text.trim()) e.objective_text = "Objective text is required."
    if (!form.component_id) e.component_id = "Select a component."
    if (!form.review_date) e.review_date = "A review date is required."
    else if (new Date(form.review_date) <= new Date(today)) e.review_date = "Review date must be in the future."
    setErrors(e)
    return Object.keys(e).length === 0
  }
  async function handleSubmit(ev) {
    ev.preventDefault()
    setApiError("")
    if (!validate()) return
    setSaving(true)
    try {
      // send only what changed
      const patch = {}
      if (form.objective_text.trim() !== objective.objective_text) patch.objective_text = form.objective_text.trim()
      if (form.description !== (objective.description ?? "")) patch.description = form.description
      if (form.component_id !== objective.component_id) patch.component_id = form.component_id
      if (form.review_date !== objective.review_date?.slice(0, 10)) patch.review_date = new Date(form.review_date).toISOString()
      if (Object.keys(patch).length > 0) await updateObjective(objective.id, patch)
      await onSaved()
    } catch (err) {
      setApiError(err?.response?.data?.message ?? "Could not save changes.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-4 text-sm font-semibold text-foreground">Edit draft objective</h2>
      <div className="space-y-4">
        <TextAreaField label="Objective" required rows={3} value={form.objective_text} onChange={(e) => set("objective_text", e.target.value)} error={errors.objective_text} />
        <SelectField
          label="ISQM component"
          required
          value={form.component_id}
          onChange={(e) => set("component_id", e.target.value)}
          error={errors.component_id}
          options={activeComponents.slice().sort((a, b) => a.display_order - b.display_order).map((c) => ({ value: c.id, label: `${c.display_order}. ${c.name}` }))}
        />
        <TextAreaField label="Description" rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} />
        <TextField type="date" label="Review date" required min={today} value={form.review_date} onChange={(e) => set("review_date", e.target.value)} error={errors.review_date} />
        {apiError && <p className="text-xs text-destructive">{apiError}</p>}
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button type="button" variant="outline" size="default" onClick={onCancel} disabled={saving}>
          <X className="size-4" /> Cancel
        </Button>
        <Button type="submit" size="default" disabled={saving}>
          {saving && <Loader2 className="size-3.5 animate-spin" />}
          Save changes
        </Button>
      </div>
    </form>
  )
}
