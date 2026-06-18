import axiosClient from "@/api/axiosClient"
import { IS_DEMO, demoApi } from "@/lib/demo"

// Organization / departments — GET /organization/departments,
// POST /organization/departments/, GET /organization/departments/{id}.
// Each department carries children_dept: [{ id, name }] for the hierarchy.
export async function listDepartments() {
  if (IS_DEMO) return demoApi.departments.list()
  const res = await axiosClient.get("/organization/departments")
  return res.data
}

export async function getDepartment(id) {
  if (IS_DEMO) return demoApi.departments.get(id)
  const res = await axiosClient.get(`/organization/departments/${id}`)
  return res.data
}

export async function createDepartment(data) {
  if (IS_DEMO) return demoApi.departments.create(data)
  const res = await axiosClient.post("/organization/departments/", data)
  return res.data
}
