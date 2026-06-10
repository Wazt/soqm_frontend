// KPI/stat card for dashboards.
// tone follows StatusBadge palette; value renders large, hint renders small below.
const TONES = {
  purple: { bg: "bg-[#EDE9F8]", text: "text-[#3B1F6A]" },
  info: { bg: "bg-[#E8F0FB]", text: "text-[#1E3A6E]" },
  success: { bg: "bg-[#EAF3EE]", text: "text-[#1A4731]" },
  warning: { bg: "bg-[#FDF3E7]", text: "text-[#7A3E0A]" },
  danger: { bg: "bg-[#FDE8F0]", text: "text-[#7A1E3E]" },
  teal: { bg: "bg-[#E8F5F5]", text: "text-[#1A4747]" },
}

export function StatCard({ label, value, hint, icon: Icon, tone = "purple", children }) {
  const t = TONES[tone] ?? TONES.purple
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        {Icon && (
          <div className={`flex size-8 items-center justify-center rounded-lg ${t.bg}`}>
            <Icon className={`size-4 ${t.text}`} />
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-semibold text-[#1E0A3C] tracking-tight">{value}</p>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </div>
      {children}
    </div>
  )
}
