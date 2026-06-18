import axiosClient from "@/api/axiosClient"
import { IS_DEMO, demoApi } from "@/lib/demo"

// Risks — POST /risks/ is the only mutation the backend implements; its score
// is server-derived (occurence × significance). GET /risks is not yet wired on
// the backend, so live listing may 404 — the matrix degrades gracefully and the
// demo serves a full register so the visualisation can be exercised.
export async function listRisks() {
  if (IS_DEMO) return demoApi.risks.list()
  const res = await axiosClient.get("/risks")
  return res.data
}

export async function createRisk(data) {
  if (IS_DEMO) return demoApi.risks.create(data)
  const res = await axiosClient.post("/risks/", data)
  return res.data
}
