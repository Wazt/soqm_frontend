import { useAuth } from "@/hooks/useAuth"

// Admin-equivalent roles for UI gating. Mirrors the backend's seeded
// permissions: only SUPER_ADMIN / ADMIN carry the full create/update/delete set.
const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"]

export function useRole() {
  const { user } = useAuth()
  const role = user?.role ?? null
  return {
    role,
    isAdmin: ADMIN_ROLES.includes(role),
    isSuperAdmin: role === "SUPER_ADMIN",
  }
}
