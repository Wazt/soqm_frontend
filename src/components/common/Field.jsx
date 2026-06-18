import { cn } from "@/lib/utils"

// Shared form-field primitives — consistent labels, inputs and inline errors,
// styled to the SOQM palette and dark-mode aware.
export const fieldInputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-3 focus:ring-ring/20 disabled:opacity-60"

export function FieldLabel({ htmlFor, required, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
    >
      {children}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </label>
  )
}

export function FieldError({ children }) {
  if (!children) return null
  return <p className="mt-1 text-xs text-destructive">{children}</p>
}

export function TextField({ label, required, error, className, id, ...props }) {
  return (
    <div>
      {label && <FieldLabel htmlFor={id} required={required}>{label}</FieldLabel>}
      <input id={id} className={cn(fieldInputClass, "h-10", error && "border-destructive", className)} {...props} />
      <FieldError>{error}</FieldError>
    </div>
  )
}

export function TextAreaField({ label, required, error, className, id, rows = 3, ...props }) {
  return (
    <div>
      {label && <FieldLabel htmlFor={id} required={required}>{label}</FieldLabel>}
      <textarea id={id} rows={rows} className={cn(fieldInputClass, "resize-none", error && "border-destructive", className)} {...props} />
      <FieldError>{error}</FieldError>
    </div>
  )
}

export function SelectField({ label, required, error, className, id, options = [], placeholder, children, ...props }) {
  return (
    <div>
      {label && <FieldLabel htmlFor={id} required={required}>{label}</FieldLabel>}
      <select
        id={id}
        className={cn(fieldInputClass, "h-10 appearance-none bg-[length:1rem] pr-9", error && "border-destructive", className)}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.65rem center",
        }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children ?? options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <FieldError>{error}</FieldError>
    </div>
  )
}
