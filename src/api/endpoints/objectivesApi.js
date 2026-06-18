import axiosClient from "@/api/axiosClient"
import { IS_DEMO, demoApi } from "@/lib/demo"

// Quality objectives — GET /objectives?limit&page, POST /objectives/,
// GET /objectives/{id}, PATCH /objectives/{id}/, DELETE /objectives/{id}/.
export async function listObjectives({ page = 1, limit = 50 } = {}) {
  if (IS_DEMO) return demoApi.objectives.list({ page, limit })
  const res = await axiosClient.get("/objectives", { params: { page, limit } })
  return res.data
}

export async function getObjective(id) {
  if (IS_DEMO) return demoApi.objectives.get(id)
  const res = await axiosClient.get(`/objectives/${id}`)
  return res.data
}

export async function createObjective(data) {
  if (IS_DEMO) return demoApi.objectives.create(data)
  const res = await axiosClient.post("/objectives/", data)
  return res.data
}

export async function updateObjective(id, data) {
  if (IS_DEMO) return demoApi.objectives.update(id, data)
  const res = await axiosClient.patch(`/objectives/${id}/`, data)
  return res.data
}

export async function deleteObjective(id) {
  if (IS_DEMO) return demoApi.objectives.remove(id)
  await axiosClient.delete(`/objectives/${id}/`)
  return null
}
