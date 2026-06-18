import { useState, useEffect, useCallback } from "react"
import { listUsers } from "@/api/endpoints/usersApi"

export function useUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async (signal) => {
    setLoading(true)
    setError(null)
    try {
      const data = await listUsers({ limit: 100 })
      if (!signal?.cancelled) setUsers(Array.isArray(data) ? data : data?.results ?? [])
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

  return { users, loading, error, refetch: () => load() }
}
