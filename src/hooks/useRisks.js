import { useState, useEffect, useCallback } from "react"
import { listRisks } from "@/api/endpoints/risksApi"

// Risk register. The backend does not yet implement GET /risks, so live mode
// may return 404/501 — treat that as an empty register rather than a hard
// error so the matrix still renders. Real errors are surfaced normally.
export function useRisks() {
  const [risks, setRisks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async (signal) => {
    setLoading(true)
    setError(null)
    try {
      const data = await listRisks()
      if (!signal?.cancelled) setRisks(Array.isArray(data) ? data : [])
    } catch (err) {
      const status = err?.response?.status
      if (status === 404 || status === 405 || status === 501) {
        if (!signal?.cancelled) setRisks([])
      } else if (!signal?.cancelled) {
        setError(err)
      }
    } finally {
      if (!signal?.cancelled) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const signal = { cancelled: false }
    load(signal)
    return () => { signal.cancelled = true }
  }, [load])

  return { risks, loading, error, refetch: () => load() }
}
