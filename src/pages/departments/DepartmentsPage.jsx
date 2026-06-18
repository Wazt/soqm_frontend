import { useState } from "react"
import { Building2, Loader2, AlertCircle, Plus, Network, List as ListIcon } from "lucide-react"
import { useDepartments } from "@/hooks/useDepartments"
import { useRole } from "@/hooks/useRole"
import { createDepartment } from "@/api/endpoints/departmentsApi"
import { PageHeader } from "@/components/common/PageHeader"
import { StatCard } from "@/components/common/StatCard"
import { EmptyState } from "@/components/common/EmptyState"
import { Modal } from "@/components/common/Modal"
import { TextField, SelectField } from "@/components/common/Field"
import { Button } from "@/components/ui/button"

export default function DepartmentsPage() {
  const { departments, loading, error, refetch } = useDepartments()
  const { isAdmin } = useRole()
  const [view, setView] = useState("chart")
  const [createOpen, setCreateOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        <span className="text-sm">Loading departments…</span>
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-destructive">
        <AlertCircle className="size-4" />
        <span className="text-sm font-medium">Failed to load departments.</span>
      </div>
    )
  }

  const roots = departments.filter((d) => !d.parent_dept)
  const subs = departments.length - roots.length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        description="The firm's organisational structure and reporting hierarchy."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
              <ViewButton active={view === "chart"} onClick={() => setView("chart")} icon={Network}>Org chart</ViewButton>
              <ViewButton active={view === "list"} onClick={() => setView("list")} icon={ListIcon}>List</ViewButton>
            </div>
            {isAdmin && (
              <Button onClick={() => setCreateOpen(true)} size="default">
                <Plus className="size-4" /> Add department
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total departments" value={departments.length} icon={Building2} tone="purple" />
        <StatCard label="Top-level units" value={roots.length} icon={Network} tone="info" />
        <StatCard label="Sub-departments" value={subs} icon={Building2} tone="teal" />
      </div>

      {departments.length === 0 ? (
        <EmptyState icon={Building2} title="No departments yet" description="Create the first department to start building the org chart." />
      ) : view === "chart" ? (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="overflow-x-auto pb-2">
            <ul className="org-tree min-w-max">
              {roots.map((r) => (
                <OrgNode key={r.id} dept={r} departments={departments} />
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <DeptList departments={departments} />
      )}

      <CreateDepartmentModal open={createOpen} onOpenChange={setCreateOpen} departments={departments} onCreated={refetch} />
    </div>
  )
}

function ViewButton({ active, onClick, icon: Icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors ${
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="size-3.5" /> {children}
    </button>
  )
}

function OrgNode({ dept, departments }) {
  const children = departments.filter((d) => d.parent_dept === dept.id)
  const isRoot = !dept.parent_dept
  return (
    <li>
      <div
        className={`min-w-[150px] rounded-lg border px-4 py-2.5 text-center shadow-sm transition-colors ${
          isRoot
            ? "border-transparent bg-primary text-primary-foreground"
            : "border-border bg-card hover:border-primary/40"
        }`}
      >
        <p className={`text-[9px] font-semibold uppercase tracking-widest ${isRoot ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {isRoot ? "Firm" : children.length > 0 ? "Division" : "Team"}
        </p>
        <p className={`mt-0.5 text-sm font-medium ${isRoot ? "text-primary-foreground" : "text-foreground"}`}>{dept.name}</p>
      </div>
      {children.length > 0 && (
        <ul>
          {children.map((c) => (
            <OrgNode key={c.id} dept={c} departments={departments} />
          ))}
        </ul>
      )}
    </li>
  )
}

function DeptList({ departments }) {
  const nameById = Object.fromEntries(departments.map((d) => [d.id, d.name]))
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Department</th>
            <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground sm:table-cell">Reports to</th>
            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Sub-departments</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((d) => {
            const kids = d.children_dept ?? departments.filter((c) => c.parent_dept === d.id).map((c) => ({ id: c.id, name: c.name }))
            return (
              <tr key={d.id} className="border-b border-border last:border-b-0 hover:bg-muted/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-7 items-center justify-center rounded-md bg-[#EDE9F8]">
                      <Building2 className="size-3.5 text-[#7B3FBE]" />
                    </div>
                    <span className="font-medium text-foreground">{d.name}</span>
                    {!d.parent_dept && <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">Root</span>}
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{d.parent_dept ? nameById[d.parent_dept] ?? "—" : "—"}</td>
                <td className="px-4 py-3">
                  {kids.length === 0 ? (
                    <span className="text-muted-foreground">—</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {kids.slice(0, 3).map((k) => (
                        <span key={k.id} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{k.name}</span>
                      ))}
                      {kids.length > 3 && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">+{kids.length - 3}</span>}
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function CreateDepartmentModal({ open, onOpenChange, departments, onCreated }) {
  const [form, setForm] = useState({ name: "", parent_dept: "" })
  const [error, setError] = useState("")
  const [apiError, setApiError] = useState("")
  const [saving, setSaving] = useState(false)

  function set(key, value) { setForm((f) => ({ ...f, [key]: value })) }
  async function handleSubmit(ev) {
    ev.preventDefault()
    setError("")
    setApiError("")
    if (!form.name.trim()) { setError("Department name is required."); return }
    setSaving(true)
    try {
      await createDepartment({ name: form.name.trim(), parent_dept: form.parent_dept || null })
      setForm({ name: "", parent_dept: "" })
      onOpenChange(false)
      await onCreated()
    } catch (err) {
      setApiError(err?.response?.data?.message ?? "Failed to create department.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Add department" description="Create a unit and optionally nest it under a parent.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField label="Department name" required value={form.name} onChange={(e) => set("name", e.target.value)} error={error} placeholder="e.g. Forensic Advisory" />
        <SelectField
          label="Parent department"
          value={form.parent_dept}
          onChange={(e) => set("parent_dept", e.target.value)}
          placeholder="— None (top-level) —"
          options={departments.map((d) => ({ value: d.id, label: d.name }))}
        />
        {apiError && <p className="text-xs text-destructive">{apiError}</p>}
        <div className="-mx-4 -mb-4 flex justify-end gap-2 rounded-b-xl border-t border-border bg-muted/40 p-4">
          <Button type="button" variant="outline" size="default" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button type="submit" size="default" disabled={saving}>
            {saving && <Loader2 className="size-3.5 animate-spin" />} Create department
          </Button>
        </div>
      </form>
    </Modal>
  )
}
