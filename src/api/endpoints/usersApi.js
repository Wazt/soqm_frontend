import axiosClient from "@/api/axiosClient"
import { IS_DEMO, demoApi } from "@/lib/demo"

// Users / auth admin — GET /auth/list?limit&page, GET /auth/roles,
// POST /auth/register/, PATCH /auth/{id}/block/, POST /auth/{id}/roles/.
// NOTE: the backend has no generic user update or delete — block + role
// assignment are the only mutations, so the UI must not assume PUT/DELETE.
export async function listUsers({ page = 1, limit = 50 } = {}) {
  if (IS_DEMO) return demoApi.users.list({ page, limit })
  const res = await axiosClient.get("/auth/list", { params: { page, limit } })
  return res.data
}

export async function getRoles() {
  if (IS_DEMO) return demoApi.users.roles()
  const res = await axiosClient.get("/auth/roles")
  return res.data
}

export async function registerUser(data) {
  if (IS_DEMO) return demoApi.users.register(data)
  const res = await axiosClient.post("/auth/register/", data)
  return res.data
}

export async function blockUser(id) {
  if (IS_DEMO) return demoApi.users.block(id)
  const res = await axiosClient.patch(`/auth/${id}/block/`)
  return res.data
}

export async function assignRole(id, roleId) {
  if (IS_DEMO) return demoApi.users.assignRole(id, roleId)
  const res = await axiosClient.post(`/auth/${id}/roles/`, { role_id: roleId })
  return res.data
}
