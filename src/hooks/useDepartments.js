import { useState, useEffect, useCallback } from "react"
import { listDepartments } from "@/api/endpoints/departmentsApi"

export function useDepartments() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async (signal) => {
    setLoading(true)
    setError(null)
    try {
      const data = await listDepartments()
      if (!signal?.cancelled) setDepartments(Array.isArray(data) ? data : [])
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

  return { departments, loading, error, refetch: () => load() }
}
