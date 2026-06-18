import { useState, useEffect, useCallback } from "react"
import { getObjective } from "@/api/endpoints/objectivesApi"

export function useObjective(id) {
  const [objective, setObjective] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async (signal) => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await getObjective(id)
      if (!signal?.cancelled) setObjective(data)
    } catch (err) {
      if (!signal?.cancelled) setError(err)
    } finally {
      if (!signal?.cancelled) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    const signal = { cancelled: false }
    load(signal)
    return () => { signal.cancelled = true }
  }, [load])

  return { objective, loading, error, refetch: () => load(), setObjective }
}
