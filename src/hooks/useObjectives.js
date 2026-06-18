import { useState, useEffect, useCallback } from "react"
import { listObjectives } from "@/api/endpoints/objectivesApi"

export function useObjectives() {
  const [objectives, setObjectives] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async (signal) => {
    setLoading(true)
    setError(null)
    try {
      const data = await listObjectives({ limit: 100 })
      if (!signal?.cancelled) setObjectives(data)
    } catch (err) {
      if (!signal?.cancelled) setError(err)
    } finally {
      if (!signal?.cancelled) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const signal = { cancelled: false }
    load(signal)
    return () => { signal.cancelled = true }
  }, [load])

  return { objectives, loading, error, refetch: () => load() }
}
