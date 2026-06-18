import { useState, useEffect } from "react"
import { ShieldCheck, AlertCircle, Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { useComponents } from "@/hooks/useComponents"
import { useRole } from "@/hooks/useRole"
import {
  createComponent,
  updateComponent,
  deleteComponent,
} from "@/api/endpoints/componentsApi"
import { COMPONENT_STATUS, COMPONENT_TRANSITIONS, statusMeta } from "@/lib/status"
import { PageHeader } from "@/components/common/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Modal } from "@/components/common/Modal"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { TextField, TextAreaField, SelectField } from "@/components/common/Field"
import { Button } from "@/components/ui/button"

const COMPONENT_COLORS = [
  { bg: "bg-[#EDE9F8]", text: "text-[#3B1F6A]", dot: "bg-[#7B3FBE]" },
  { bg: "bg-[#E8F0FB]", text: "text-[#1E3A6E]", dot: "bg-[#3B6FBE]" },
  { bg: "bg-[#F0EBF8]", text: "text-[#4A2080]", dot: "bg-[#9B5FDE]" },
  { bg: "bg-[#EAF3EE]", text: "text-[#1A4731]", dot: "bg-[#2E7D52]" },
  { bg: "bg-[#FDF3E7]", text: "text-[#7A3E0A]", dot: "bg-[#D4820A]" },
  { bg: "bg-[#FDE8F0]", text: "text-[#7A1E3E]", dot: "bg-[#C4336E]" },
  { bg: "bg-[#E8F5F5]", text: "text-[#1A4747]", dot: "bg-[#2E8080]" },
  { bg: "bg-[#F5EDE8]", text: "text-[#6E2E1A]", dot: "bg-[#B85030]" },
]

const emptyForm = { name: "", description: "", isqm_reference: "", display_order: "" }

export default function IsqmComponents() {
  const { components, loading, error, refetch } = useComponents()
  const { isAdmin } = useRole()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null) // component | null (create)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }
  function openEdit(component) {
    setEditing(component)
    setFormOpen(true)
  }

  async function handleDelete() {
    setBusy(true)
    try {
      await deleteComponent(deleting.id)
      setDeleting(null)
      await refetch()
    } catch (err) {
      // surface failure but keep dialog open
      alert(err?.response?.data?.message ?? "Failed to delete component.")
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        <span className="text-sm">Loading components…</span>
      </div>
    )
  }

  if (error) {
    const message = error.response?.data?.message
    const accessDenied = error.response?.status === 403
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="size-4" />
          <span className="text-sm font-medium">
            {message ? `${message} — couldn't load components.` : "Failed to load components."}
          </span>
        </div>
        {accessDenied && (
          <p className="max-w-sm text-xs text-muted-foreground">
            Your role doesn't have the <code>component:read</code> permission. Sign in as
            SUPER ADMIN, ADMIN, MANAGER or OPERATOR to view SOQM components.
          </p>
        )}
      </div>
    )
  }

  const atCapacity = components.length >= 8

  return (
    <div className="space-y-6">
      <PageHeader
        title="ISQM 1 Components"
        description="The 8 components of the System of Quality Management as defined by ISQM 1."
        badge={`${components.length} / 8 Components`}
        actions={
          isAdmin && (
            <Button onClick={openCreate} disabled={atCapacity} size="default" title={atCapacity ? "Maximum of 8 components reached" : undefined}>
              <Plus className="size-4" /> Add component
            </Button>
          )
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {components.map((component, index) => {
          const color = COMPONENT_COLORS[(component.display_order - 1) % COMPONENT_COLORS.length] ?? COMPONENT_COLORS[index % COMPONENT_COLORS.length]
          const status = statusMeta(COMPONENT_STATUS, component.status)
          return (
            <div
              key={component.id}
              className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={`flex size-9 items-center justify-center rounded-lg ${color.bg}`}>
                  <ShieldCheck className={`size-4 ${color.text}`} />
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${color.bg} ${color.text}`}>
                  {component.isqm_reference}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`size-1.5 shrink-0 rounded-full ${color.dot}`} />
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Component {component.display_order}
                  </span>
                </div>
                <h3 className="text-sm font-medium leading-snug text-foreground">{component.name}</h3>
                {component.description && (
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{component.description}</p>
                )}
              </div>

              <div className="mt-auto flex items-center justify-between pt-1">
                <StatusBadge tone={status.tone} withDot>{status.label}</StatusBadge>
                {isAdmin && (
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => openEdit(component)}
                      className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      title="Edit"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleting(component)}
                      disabled={component.status !== "ARCHIVED"}
                      className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:pointer-events-none disabled:opacity-30"
                      title={component.status === "ARCHIVED" ? "Delete" : "Only archived components can be deleted"}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <ComponentFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        usedOrders={components.map((c) => c.display_order)}
        onSaved={refetch}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Delete component?"
        description={`"${deleting?.name}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete component"
        loading={busy}
        onConfirm={handleDelete}
      />
    </div>
  )
}

function ComponentFormModal({ open, onOpenChange, editing, usedOrders, onSaved }) {
  const isEdit = !!editing
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState("")
  const [saving, setSaving] = useState(false)

  // populate / reset whenever the modal opens (programmatic opens don't fire onOpenChange)
  useEffect(() => {
    if (!open) return
    setErrors({})
    setApiError("")
    setForm(
      editing
        ? {
            name: editing.name ?? "",
            description: editing.description ?? "",
            isqm_reference: editing.isqm_reference ?? "",
            display_order: editing.display_order ?? "",
            status: editing.status ?? "ACTIVE",
          }
        : { ...emptyForm, display_order: firstFreeOrder(usedOrders) }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing])

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = "Name is required."
    if (!form.isqm_reference.trim()) e.isqm_reference = "ISQM reference is required."
    if (!isEdit) {
      const order = Number(form.display_order)
      if (!(order >= 1 && order <= 8)) e.display_order = "Display order must be 1–8."
      else if (usedOrders.includes(order)) e.display_order = "That display order is already taken."
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    setApiError("")
    if (!validate()) return
    setSaving(true)
    try {
      if (isEdit) {
        await updateComponent(editing.id, {
          name: form.name.trim(),
          description: form.description,
          isqm_reference: form.isqm_reference.trim(),
          status: form.status,
        })
      } else {
        await createComponent({
          name: form.name.trim(),
          description: form.description,
          isqm_reference: form.isqm_reference.trim(),
          display_order: Number(form.display_order),
        })
      }
      onOpenChange(false)
      await onSaved()
    } catch (err) {
      setApiError(err?.response?.data?.message ?? "Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const statusOptions = isEdit
    ? [editing.status, ...(COMPONENT_TRANSITIONS[editing.status] ?? [])].map((s) => ({
        value: s,
        label: COMPONENT_STATUS[s]?.label ?? s,
      }))
    : []

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit component" : "Add component"}
      description={isEdit ? "Update details or transition the component's status." : "Create a new SOQM component (max 8)."}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField label="Component name" required value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} placeholder="e.g. Governance and Leadership" />
        <TextField label="ISQM reference" required value={form.isqm_reference} onChange={(e) => set("isqm_reference", e.target.value)} error={errors.isqm_reference} placeholder="e.g. ISQM1.28-29" />
        <TextAreaField label="Description" value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="What this component covers…" />
        {isEdit ? (
          <SelectField
            label="Status"
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            options={statusOptions}
          />
        ) : (
          <TextField type="number" min={1} max={8} label="Display order (1–8)" required value={form.display_order} onChange={(e) => set("display_order", e.target.value)} error={errors.display_order} />
        )}

        {apiError && <p className="text-xs text-destructive">{apiError}</p>}

        <div className="-mx-4 -mb-4 flex justify-end gap-2 rounded-b-xl border-t border-border bg-muted/40 p-4">
          <Button type="button" variant="outline" size="default" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" size="default" disabled={saving}>
            {saving && <Loader2 className="size-3.5 animate-spin" />}
            {isEdit ? "Save changes" : "Create component"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function firstFreeOrder(used) {
  for (let i = 1; i <= 8; i++) if (!used.includes(i)) return i
  return ""
}
