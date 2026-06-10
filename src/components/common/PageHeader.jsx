// Standard page header — mirrors the IsqmComponents header pattern.
// Usage: <PageHeader title="..." description="..." badge="8 Components" actions={<Button/>} />
export function PageHeader({ title, description, badge, actions }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-[#1E0A3C] tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {badge && (
          <span className="text-xs font-medium bg-[#EDE9F8] text-[#3B1F6A] px-3 py-1.5 rounded-full whitespace-nowrap">
            {badge}
          </span>
        )}
        {actions}
      </div>
    </div>
  )
}
