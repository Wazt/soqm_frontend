import { useState, useEffect } from "react"
import { getComponents } from "@/api/endpoints/componentsApi"
import { IS_DEMO, demoGetComponents } from "@/lib/demo"

export function useComponents() {
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Demo path simulates the real API including 403 Access Denied for
    // roles without the component:read permission
    const fetcher = IS_DEMO ? demoGetComponents() : getComponents().then((res) => res.data)
    let cancelled = false
    fetcher
      .then((data) => { if (!cancelled) setComponents(data) })
      .catch((err) => { if (!cancelled) setError(err) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { components, loading, error }
}