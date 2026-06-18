// Centered empty state for tables/lists with no content yet.
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
      {Icon && (
        <div className="flex size-11 items-center justify-center rounded-xl bg-[#EDE9F8]">
          <Icon className="size-5 text-[#7B3FBE]" />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
