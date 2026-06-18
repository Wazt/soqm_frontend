import { useState, useEffect } from "react"
import { getRoles } from "@/api/endpoints/usersApi"

// Roles for the user-creation / role-assignment selects → [{ id, name }].
export function useRoles() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getRoles()
      .then((data) => { if (!cancelled) setRoles(Array.isArray(data) ? data : []) })
      .catch(() => { if (!cancelled) setRoles([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { roles, loading }
}
