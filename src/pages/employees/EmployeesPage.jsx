import { useMemo, useState } from "react"
import { PageHeader } from "@/components/common/PageHeader"
import { PreviewBanner } from "@/components/common/PreviewBanner"
import { StatCard } from "@/components/common/StatCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { DataTable } from "@/components/common/DataTable"
import { EmptyState } from "@/components/common/EmptyState"
import { Input } from "@/components/ui/input"
import { Users, UserCheck, KeyRound, Hourglass, Search, UserX } from "lucide-react"

const ROLE_TONES = {
  SUPER_ADMIN: "purple",
  ADMIN: "purple",
  MANAGER: "info",
  REVIEWER: "teal",
  QUALITY_CHAMPION: "warning",
  OPERATOR: "success",
  VIEWER: "muted",
}

const ROLE_FILTERS = [
  "All",
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER",
  "REVIEWER",
  "OPERATOR",
  "QUALITY_CHAMPION",
  "VIEWER",
]

const SAMPLE_EMPLOYEES = [
  {
    id: "emp-001",
    name: "Yacine Benmansour",
    email: "y.benmansour@dz.gt.com",
    department: "Audit & Assurance",
    role: "SUPER_ADMIN",
    active: true,
    joined: "2026-01-05",
  },
  {
    id: "emp-002",
    name: "Amel Ferhat",
    email: "a.ferhat@dz.gt.com",
    department: "Quality & Risk Management",
    role: "ADMIN",
    active: true,
    joined: "2026-01-12",
  },
  {
    id: "emp-003",
    name: "Salima Cherifi",
    email: "s.cherifi@dz.gt.com",
    department: "Tax",
    role: "MANAGER",
    active: true,
    joined: "2026-01-19",
  },
  {
    id: "emp-004",
    name: "Lina Hadj-Arab",
    email: "l.hadjarab@dz.gt.com",
    department: "Audit & Assurance",
    role: "QUALITY_CHAMPION",
    active: true,
    joined: "2026-02-02",
  },
  {
    id: "emp-005",
    name: "Thomas Keller",
    email: "t.keller@dz.gt.com",
    department: "Advisory",
    role: "REVIEWER",
    active: true,
    joined: "2026-02-16",
  },
  {
    id: "emp-006",
    name: "Sofiane Mebarki",
    email: "s.mebarki@dz.gt.com",
    department: "Quality & Risk Management",
    role: "REVIEWER",
    active: true,
    joined: "2026-03-03",
  },
  {
    id: "emp-007",
    name: "Sarah Lindqvist",
    email: "s.lindqvist@dz.gt.com",
    department: "IT & Operations",
    role: "OPERATOR",
    active: true,
    joined: "2026-03-24",
  },
  {
    id: "emp-008",
    name: "Karim Ould-Slimane",
    email: "k.ouldslimane@dz.gt.com",
    department: "Tax",
    role: "OPERATOR",
    active: false,
    joined: "2026-04-07",
  },
  {
    id: "emp-009",
    name: "Imene Bouzid",
    email: "i.bouzid@dz.gt.com",
    department: "HR & Talent",
    role: "VIEWER",
    active: true,
    joined: "2026-04-20",
  },
  {
    id: "emp-010",
    name: "James Whitfield",
    email: "j.whitfield@dz.gt.com",
    department: "Advisory",
    role: "VIEWER",
    active: false,
    joined: "2026-05-11",
  },
]

const PENDING_ACCESS_REQUESTS = 3

const initialsOf = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

const formatRole = (role) => role.replaceAll("_", " ")

const COLUMNS = [
  {
    key: "name",
    header: "Employee",
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#3B1F6A] text-white text-xs font-semibold">
          {initialsOf(row.name)}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "department",
    header: "Department",
    render: (row) => (
      <span className="text-sm text-foreground">{row.department}</span>
    ),
  },
  {
    key: "role",
    header: "Role",
    render: (row) => (
      <StatusBadge tone={ROLE_TONES[row.role] ?? "muted"}>
        {formatRole(row.role)}
      </StatusBadge>
    ),
  },
  {
    key: "active",
    header: "Status",
    render: (row) =>
      row.active ? (
        <StatusBadge tone="success" withDot>Active</StatusBadge>
      ) : (
        <StatusBadge tone="muted">Inactive</StatusBadge>
      ),
  },
  {
    key: "joined",
    header: "Joined",
    render: (row) => (
      <span className="text-sm text-muted-foreground">{formatDate(row.joined)}</span>
    ),
  },
]

export default function EmployeesPage() {
  const [query, setQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")

  const activeCount = SAMPLE_EMPLOYEES.filter((e) => e.active).length
  const rolesInUse = new Set(SAMPLE_EMPLOYEES.map((e) => e.role)).size

  const filteredEmployees = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SAMPLE_EMPLOYEES.filter((emp) => {
      const matchesRole = roleFilter === "All" || emp.role === roleFilter
      const matchesQuery =
        !q ||
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q)
      return matchesRole && matchesQuery
    })
  }, [query, roleFilter])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees & Roles"
        description="Firm personnel, their departments and their access roles in the SOQM platform."
        badge={`${SAMPLE_EMPLOYEES.length} Employees`}
      />

      <PreviewBanner />

      {/* Stat strip */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total employees"
          value={SAMPLE_EMPLOYEES.length}
          hint="Registered in the platform"
          icon={Users}
          tone="purple"
        />
        <StatCard
          label="Active"
          value={activeCount}
          hint={`${SAMPLE_EMPLOYEES.length - activeCount} inactive accounts`}
          icon={UserCheck}
          tone="success"
        />
        <StatCard
          label="Roles in use"
          value={rolesInUse}
          hint="Of 7 available platform roles"
          icon={KeyRound}
          tone="info"
        />
        <StatCard
          label="Pending access requests"
          value={PENDING_ACCESS_REQUESTS}
          hint="Awaiting admin approval"
          icon={Hourglass}
          tone="warning"
        />
      </div>

      {/* Search + role filters */}
      <div className="space-y-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 bg-card"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {ROLE_FILTERS.map((role) => {
            const isActive = roleFilter === role
            return (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors ${
                  isActive
                    ? "bg-[#3B1F6A] border-[#3B1F6A] text-white"
                    : "bg-card border-border text-muted-foreground hover:bg-[#F7F4FC] hover:text-[#3B1F6A]"
                }`}
              >
                {role === "All" ? "All" : formatRole(role)}
              </button>
            )
          })}
        </div>
      </div>

      {/* Table */}
      {filteredEmployees.length > 0 ? (
        <DataTable
          columns={COLUMNS}
          rows={filteredEmployees}
          footer={
            <p className="text-xs text-muted-foreground">
              Showing {filteredEmployees.length} of {SAMPLE_EMPLOYEES.length} employees
            </p>
          }
        />
      ) : (
        <EmptyState
          icon={UserX}
          title="No employees match your filters"
          description="Try a different search term or reset the role filter to see all employees."
        />
      )}
    </div>
  )
}
