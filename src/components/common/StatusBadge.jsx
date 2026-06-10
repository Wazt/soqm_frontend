// Tinted status pill following the SOQM light palette (see IsqmComponents COMPONENT_COLORS).
// tone: purple | info | success | warning | danger | teal | muted
const TONES = {
  purple: { bg: "bg-[#EDE9F8]", text: "text-[#3B1F6A]", dot: "bg-[#7B3FBE]" },
  info: { bg: "bg-[#E8F0FB]", text: "text-[#1E3A6E]", dot: "bg-[#3B6FBE]" },
  success: { bg: "bg-[#EAF3EE]", text: "text-[#1A4731]", dot: "bg-[#2E7D52]" },
  warning: { bg: "bg-[#FDF3E7]", text: "text-[#7A3E0A]", dot: "bg-[#D4820A]" },
  danger: { bg: "bg-[#FDE8F0]", text: "text-[#7A1E3E]", dot: "bg-[#C4336E]" },
  teal: { bg: "bg-[#E8F5F5]", text: "text-[#1A4747]", dot: "bg-[#2E8080]" },
  muted: { bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground/50" },
}

export function StatusBadge({ tone = "muted", children, withDot = false, className = "" }) {
  const t = TONES[tone] ?? TONES.muted
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${t.bg} ${t.text} ${className}`}
    >
      {withDot && <span className={`size-1.5 rounded-full ${t.dot}`} />}
      {children}
    </span>
  )
}
