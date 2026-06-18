import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Target, Loader2, AlertCircle, Plus, ArrowRight, Search } from "lucide-react"
import { useObjectives } from "@/hooks/useObjectives"
import { useComponents } from "@/hooks/useComponents"
import { useRole } from "@/hooks/useRole"
import { createObjective } from "@/api/endpoints/objectivesApi"
import { OBJECTIVE_STATUS, statusMeta } from "@/lib/status"
import { formatDate, relativeTime } from "@/lib/format"
import { objectiveDetailPath } from "@/router/routes"
import { PageHeader } from "@/components/common/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { DataTable } from "@/components/common/DataTable"
import { EmptyState } from "@/components/common/EmptyState"
import { Modal } from "@/components/common/Modal"
import { TextAreaField, SelectField, TextField, fieldInputClass } from "@/components/common/Field"
import { Button } from "@/components/ui/button"

export default function ObjectivesPage() {
  const navigate = useNavigate()
  const { objectives, loading, error, refetch } = useObjectives()
  const { components } = useComponents()
  const { isAdmin } = useRole()

  const [createOpen, setCreateOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const componentById = useMemo(
    () => Object.fromEntries(components.map((c) => [c.id, c])),
    [components]
  )

  const filtered = useMemo(() => {
    return objectives.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false
      if (query) {
        const hay = `${o.objective_text} ${o.description ?? ""}`.toLowerCase()
        if (!hay.includes(query.toLowerCase())) return false
      }
      return true
    })
  }, [objectives, statusFilter, query])

  const statusCounts = useMemo(() => {
    const counts = {}
    for (const o of objectives) counts[o.status] = (counts[o.status] ?? 0) + 1
    return counts
  }, [objectives])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        <span className="text-sm">Loading objectives…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-destructive">
        <AlertCircle className="size-4" />
        <span className="text-sm font-medium">Failed to load objectives.</span>
      </div>
    )
  }

  const columns = [
    {
      key: "objective_text",
      header: "Objective",
      render: (o) => (
        <div className="max-w-md">
          <p className="font-medium text-foreground line-clamp-1">{o.objective_text}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {componentById[o.component_id]?.name ?? "ISQM component"}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (o) => {
        const s = statusMeta(OBJECTIVE_STATUS, o.status)
        return <StatusBadge tone={s.tone} withDot>{s.label}</StatusBadge>
      },
    },
    {
      key: "review_date",
      header: "Review date",
      className: "hidden md:table-cell",
      render: (o) => <span className="text-sm text-foreground">{formatDate(o.review_date)}</span>,
    },
    {
      key: "updated_at",
      header: "Updated",
      className: "hidden lg:table-cell",
      render: (o) => <span className="text-sm text-muted-foreground">{o.updated_at ? relativeTime(o.updated_at) : "—"}</span>,
    },
    {
      key: "view",
      header: "",
      className: "w-px text-right",
      render: () => <ArrowRight className="size-4 text-muted-foreground" />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quality Objectives"
        description="SOQM quality objectives mapped to ISQM 1 components, each moving through its review workflow."
        badge={`${objectives.length} Objectives`}
        actions={
          isAdmin && (
            <Button onClick={() => setCreateOpen(true)} size="default">
              <Plus className="size-4" /> Add objective
            </Button>
          )
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <FilterChip active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>
            All <span className="opacity-60">{objectives.length}</span>
          </FilterChip>
          {Object.entries(OBJECTIVE_STATUS)
            .filter(([key]) => statusCounts[key])
            .map(([key, meta]) => (
              <FilterChip key={key} active={statusFilter === key} onClick={() => setStatusFilter(key)}>
                {meta.label} <span className="opacity-60">{statusCounts[key]}</span>
              </FilterChip>
            ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search objectives…"
            className={`${fieldInputClass} h-9 pl-9`}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No objectives match"
          description={objectives.length === 0 ? "No quality objectives have been defined yet." : "Try clearing the filter or search."}
        />
      ) : (
        <DataTable columns={columns} rows={filtered} onRowClick={(o) => navigate(objectiveDetailPath(o.id))} />
      )}

      <CreateObjectiveModal open={createOpen} onOpenChange={setCreateOpen} components={components} onCreated={refetch} />
    </div>
  )
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}

const emptyForm = { component_id: "", objective_text: "", description: "", review_date: "" }

function CreateObjectiveModal({ open, onOpenChange, components, onCreated }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState("")
  const [saving, setSaving] = useState(false)

  const activeComponents = components.filter((c) => c.status === "ACTIVE")
  const selected = components.find((c) => c.id === form.component_id)
  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    if (open) {
      setForm(emptyForm)
      setErrors({})
      setApiError("")
    }
  }, [open])
  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }
  function validate() {
    const e = {}
    if (!form.component_id) e.component_id = "Select a component."
    if (!form.objective_text.trim()) e.objective_text = "Objective text is required."
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
      await createObjective({
        component_id: form.component_id,
        objective_text: form.objective_text.trim(),
        description: form.description,
        review_date: new Date(form.review_date).toISOString(),
      })
      onOpenChange(false)
      await onCreated()
    } catch (err) {
      setApiError(err?.response?.data?.message ?? "Failed to create objective.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="New quality objective" description="Objectives can only be created for ACTIVE components and start as a draft.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <SelectField
          label="ISQM component"
          required
          value={form.component_id}
          onChange={(e) => set("component_id", e.target.value)}
          placeholder="Select a component…"
          error={errors.component_id}
          options={activeComponents
            .slice()
            .sort((a, b) => a.display_order - b.display_order)
            .map((c) => ({ value: c.id, label: `${c.display_order}. ${c.name}` }))}
        />
        {selected && (
          <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{selected.isqm_reference}</span>
            {selected.description ? ` — ${selected.description}` : ""}
          </div>
        )}
        <TextAreaField
          label="Objective"
          required
          rows={3}
          value={form.objective_text}
          onChange={(e) => set("objective_text", e.target.value)}
          error={errors.objective_text}
          placeholder="e.g. Ensure all engagements are reviewed for independence prior to acceptance…"
        />
        <TextAreaField
          label="Description"
          rows={2}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Additional context or notes…"
        />
        <TextField
          type="date"
          label="Review date"
          required
          min={today}
          value={form.review_date}
          onChange={(e) => set("review_date", e.target.value)}
          error={errors.review_date}
        />

        {apiError && <p className="text-xs text-destructive">{apiError}</p>}

        <div className="-mx-4 -mb-4 flex justify-end gap-2 rounded-b-xl border-t border-border bg-muted/40 p-4">
          <Button type="button" variant="outline" size="default" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" size="default" disabled={saving}>
            {saving && <Loader2 className="size-3.5 animate-spin" />}
            Create objective
          </Button>
        </div>
      </form>
    </Modal>
  )
}
