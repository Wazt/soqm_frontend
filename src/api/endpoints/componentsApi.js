import axiosClient from "@/api/axiosClient"
import { IS_DEMO, demoApi } from "@/lib/demo"

// SOQM components — GET /components, POST /components/, GET /components/{id},
// PATCH /components/{id}/, DELETE /components/{id}/ (trailing slashes matter).
export async function listComponents() {
  if (IS_DEMO) return demoApi.components.list()
  const res = await axiosClient.get("/components")
  return res.data
}

export async function getComponent(id) {
  if (IS_DEMO) return demoApi.components.get(id)
  const res = await axiosClient.get(`/components/${id}`)
  return res.data
}

export async function createComponent(data) {
  if (IS_DEMO) return demoApi.components.create(data)
  const res = await axiosClient.post("/components/", data)
  return res.data
}

export async function updateComponent(id, data) {
  if (IS_DEMO) return demoApi.components.update(id, data)
  const res = await axiosClient.patch(`/components/${id}/`, data)
  return res.data
}

export async function deleteComponent(id) {
  if (IS_DEMO) return demoApi.components.remove(id)
  await axiosClient.delete(`/components/${id}/`)
  return null
}
