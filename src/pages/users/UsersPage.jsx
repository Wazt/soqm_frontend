import { useState, useMemo, useEffect } from "react"
import {
  Users as UsersIcon, Loader2, AlertCircle, Plus, Search,
  Ban, CircleCheck, ShieldCog,
} from "lucide-react"
import { useUsers } from "@/hooks/useUsers"
import { useRoles } from "@/hooks/useRoles"
import { useRole } from "@/hooks/useRole"
import { useAuth } from "@/hooks/useAuth"
import { registerUser, blockUser, assignRole } from "@/api/endpoints/usersApi"
import { initials } from "@/lib/format"
import { PageHeader } from "@/components/common/PageHeader"
import { StatCard } from "@/components/common/StatCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { EmptyState } from "@/components/common/EmptyState"
import { Modal } from "@/components/common/Modal"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { TextField, SelectField, fieldInputClass } from "@/components/common/Field"
import { Button } from "@/components/ui/button"

const ROLE_TONE = {
  SUPER_ADMIN: "purple",
  ADMIN: "info",
  MANAGER: "success",
  REVIEWER: "warning",
  OPERATOR: "danger",
  QUALITY_CHAMPION: "teal",
  VIEWER: "muted",
}
const roleLabel = (r) => (r ?? "").replace(/_/g, " ")
const PAGE_SIZE = 8

export default function UsersPage() {
  const { users, loading, error, refetch } = useUsers()
  const { roles } = useRoles()
  const { isAdmin } = useRole()
  const { user: current } = useAuth()

  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)
  const [roleTarget, setRoleTarget] = useState(null) // user being re-roled
  const [blockTarget, setBlockTarget] = useState(null)
  const [busy, setBusy] = useState(false)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return users.filter((u) =>
      `${u.first_name} ${u.last_name} ${u.email} ${(u.roles ?? []).join(" ")}`.toLowerCase().includes(q)
    )
  }, [users, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageClamped = Math.min(page, totalPages)
  const pageRows = filtered.slice((pageClamped - 1) * PAGE_SIZE, pageClamped * PAGE_SIZE)

  const activeCount = users.filter((u) => u.is_active).length

  async function handleBlock() {
    setBusy(true)
    try {
      await blockUser(blockTarget.id)
      setBlockTarget(null)
      await refetch()
    } catch (err) {
      alert(err?.response?.data?.message ?? "Could not update user.")
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        <span className="text-sm">Loading users…</span>
      </div>
    )
  }
  if (error) {
    const accessDenied = error.response?.status === 403
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="size-4" />
          <span className="text-sm font-medium">{accessDenied ? "Access denied." : "Failed to load users."}</span>
        </div>
        {accessDenied && (
          <p className="max-w-sm text-xs text-muted-foreground">
            Your role lacks the <code>auth:read</code> permission. Sign in as SUPER ADMIN, ADMIN or MANAGER to view users.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & Roles"
        description="Manage team members and the access they have to the SOQM platform."
        actions={
          isAdmin && (
            <Button onClick={() => setCreateOpen(true)} size="default">
              <Plus className="size-4" /> Add user
            </Button>
          )
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total users" value={users.length} icon={UsersIcon} tone="purple" />
        <StatCard label="Active" value={activeCount} icon={CircleCheck} tone="success" />
        <StatCard label="Blocked" value={users.length - activeCount} icon={Ban} tone="danger" />
      </div>

      <div className="relative sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1) }}
          placeholder="Search by name, email or role…"
          className={`${fieldInputClass} h-9 pl-9`}
        />
      </div>

      {pageRows.length === 0 ? (
        <EmptyState icon={UsersIcon} title="No users match" description="Try a different search term." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">User</th>
                  <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground md:table-cell">Email</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Role</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Status</th>
                  {isAdmin && <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((u) => {
                  const role = u.roles?.[0] ?? "VIEWER"
                  const isSelf = current?.sub === u.id || current?.email === u.email
                  return (
                    <tr key={u.id} className="group border-b border-border last:border-b-0 hover:bg-muted/40">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                            {initials(u.first_name, u.last_name)}
                          </div>
                          <div className="min-w-0">
                            <p className="flex items-center gap-1.5 font-medium text-foreground">
                              <span className="truncate">{u.first_name} {u.last_name}</span>
                              {isSelf && <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">You</span>}
                            </p>
                            <p className="truncate text-xs text-muted-foreground md:hidden">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{u.email}</td>
                      <td className="px-4 py-3">
                        <StatusBadge tone={ROLE_TONE[role] ?? "muted"}>{roleLabel(role)}</StatusBadge>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge tone={u.is_active ? "success" : "muted"} withDot>
                          {u.is_active ? "Active" : "Blocked"}
                        </StatusBadge>
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => setRoleTarget(u)}
                              className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              title="Change role"
                            >
                              <ShieldCog className="size-3.5" />
                            </button>
                            <button
                              onClick={() => setBlockTarget(u)}
                              disabled={isSelf}
                              className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:pointer-events-none disabled:opacity-30"
                              title={isSelf ? "You can't block yourself" : u.is_active ? "Block user" : "Unblock user"}
                            >
                              {u.is_active ? <Ban className="size-3.5" /> : <CircleCheck className="size-3.5" />}
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="text-xs text-muted-foreground">
                {filtered.length} user{filtered.length === 1 ? "" : "s"} · page {pageClamped} of {totalPages}
              </p>
              <div className="flex gap-1.5">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pageClamped <= 1}>Prev</Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={pageClamped >= totalPages}>Next</Button>
              </div>
            </div>
          )}
        </div>
      )}

      <CreateUserModal open={createOpen} onOpenChange={setCreateOpen} roles={roles} onCreated={refetch} />
      <AssignRoleModal target={roleTarget} onOpenChange={(v) => !v && setRoleTarget(null)} roles={roles} onSaved={refetch} />
      <ConfirmDialog
        open={!!blockTarget}
        onOpenChange={(v) => !v && setBlockTarget(null)}
        title={blockTarget?.is_active ? "Block this user?" : "Unblock this user?"}
        description={
          blockTarget?.is_active
            ? `${blockTarget?.first_name} ${blockTarget?.last_name} will lose access until unblocked.`
            : `${blockTarget?.first_name} ${blockTarget?.last_name} will regain access to the platform.`
        }
        confirmLabel={blockTarget?.is_active ? "Block user" : "Unblock user"}
        tone={blockTarget?.is_active ? "destructive" : "default"}
        loading={busy}
        onConfirm={handleBlock}
      />
    </div>
  )
}

function CreateUserModal({ open, onOpenChange, roles, onCreated }) {
  const empty = { first_name: "", last_name: "", email: "", password: "", role_id: "" }
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) { setForm({ ...empty, role_id: roles[0]?.id ?? "" }); setErrors({}); setApiError("") }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, roles])
  function set(key, value) { setForm((f) => ({ ...f, [key]: value })) }
  function validate() {
    const e = {}
    if (!form.first_name.trim()) e.first_name = "Required."
    if (!form.last_name.trim()) e.last_name = "Required."
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Enter a valid email."
    if (form.password.length < 8) e.password = "At least 8 characters."
    if (!form.role_id) e.role_id = "Select a role."
    setErrors(e)
    return Object.keys(e).length === 0
  }
  async function handleSubmit(ev) {
    ev.preventDefault()
    setApiError("")
    if (!validate()) return
    setSaving(true)
    try {
      await registerUser({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        password: form.password,
        role_id: form.role_id,
      })
      onOpenChange(false)
      await onCreated()
    } catch (err) {
      setApiError(err?.response?.data?.message ?? "Failed to create user.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Add user" description="Create an account and assign an initial role.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <TextField label="First name" required value={form.first_name} onChange={(e) => set("first_name", e.target.value)} error={errors.first_name} />
          <TextField label="Last name" required value={form.last_name} onChange={(e) => set("last_name", e.target.value)} error={errors.last_name} />
        </div>
        <TextField type="email" label="Email" required value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} placeholder="name@grantthornton.com" />
        <TextField type="password" label="Password" required value={form.password} onChange={(e) => set("password", e.target.value)} error={errors.password} placeholder="At least 8 characters" />
        <SelectField label="Role" required value={form.role_id} onChange={(e) => set("role_id", e.target.value)} error={errors.role_id}
          options={roles.map((r) => ({ value: r.id, label: roleLabel(r.name) }))} />
        {apiError && <p className="text-xs text-destructive">{apiError}</p>}
        <div className="-mx-4 -mb-4 flex justify-end gap-2 rounded-b-xl border-t border-border bg-muted/40 p-4">
          <Button type="button" variant="outline" size="default" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button type="submit" size="default" disabled={saving}>
            {saving && <Loader2 className="size-3.5 animate-spin" />} Create user
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function AssignRoleModal({ target, onOpenChange, roles, onSaved }) {
  const [roleId, setRoleId] = useState("")
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState("")
  const open = !!target

  useEffect(() => {
    if (open && target) {
      const current = roles.find((r) => r.name === target.roles?.[0])
      setRoleId(current?.id ?? roles[0]?.id ?? "")
      setApiError("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, roles])

  async function handleSubmit(ev) {
    ev.preventDefault()
    setSaving(true)
    setApiError("")
    try {
      await assignRole(target.id, roleId)
      onOpenChange(false)
      await onSaved()
    } catch (err) {
      setApiError(err?.response?.data?.message ?? "Could not assign role.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Change role" description={target ? `Update the role for ${target.first_name} ${target.last_name}.` : ""} className="sm:max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <SelectField label="Role" value={roleId} onChange={(e) => setRoleId(e.target.value)} options={roles.map((r) => ({ value: r.id, label: roleLabel(r.name) }))} />
        {apiError && <p className="text-xs text-destructive">{apiError}</p>}
        <div className="-mx-4 -mb-4 flex justify-end gap-2 rounded-b-xl border-t border-border bg-muted/40 p-4">
          <Button type="button" variant="outline" size="default" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button type="submit" size="default" disabled={saving}>
            {saving && <Loader2 className="size-3.5 animate-spin" />} Save role
          </Button>
        </div>
      </form>
    </Modal>
  )
}
