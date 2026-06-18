// Small, locale-stable formatting helpers used across pages.

export function formatDate(value) {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

export function formatDateTime(value) {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

export function relativeTime(value) {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  const diff = d.getTime() - Date.now()
  const abs = Math.abs(diff)
  const day = 86_400_000
  const fmt = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
  if (abs < day) return fmt.format(Math.round(diff / 3_600_000), "hour")
  if (abs < 30 * day) return fmt.format(Math.round(diff / day), "day")
  if (abs < 365 * day) return fmt.format(Math.round(diff / (30 * day)), "month")
  return fmt.format(Math.round(diff / (365 * day)), "year")
}

export function initials(first, last) {
  const a = (first || "").trim()[0] ?? ""
  const b = (last || "").trim()[0] ?? ""
  return (a + b).toUpperCase() || "?"
}
