import { useState, useEffect } from "react"
import { getComponents } from "@/api/endpoints/componentsApi"
import { IS_DEMO, DEMO_COMPONENTS } from "@/lib/demo"

export function useComponents() {
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (IS_DEMO) {
      // Backend-less preview: resolve locally with a brief, realistic delay
      const timer = setTimeout(() => {
        setComponents(DEMO_COMPONENTS)
        setLoading(false)
      }, 400)
      return () => clearTimeout(timer)
    }
    getComponents()
      .then((res) => setComponents(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [])

  return { components, loading, error }
}