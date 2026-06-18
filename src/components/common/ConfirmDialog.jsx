import { Loader2, AlertTriangle } from "lucide-react"
import { Modal } from "@/components/common/Modal"
import { Button } from "@/components/ui/button"

// Destructive-action confirmation. onConfirm may be async; while pending the
// confirm button shows a spinner and both buttons are disabled.
export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  loading = false,
  tone = "destructive",
}) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} className="sm:max-w-md">
      <div className="flex gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="size-4.5 text-destructive" />
        </div>
        <div className="space-y-1 pt-0.5">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      <div className="-mx-4 -mb-4 mt-2 flex justify-end gap-2 rounded-b-xl border-t border-border bg-muted/40 p-4">
        <Button variant="outline" size="default" onClick={() => onOpenChange(false)} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant={tone} size="default" onClick={onConfirm} disabled={loading}>
          {loading && <Loader2 className="size-3.5 animate-spin" />}
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
