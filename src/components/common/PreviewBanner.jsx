import { Sparkles } from "lucide-react"

// Honest "this module is a preview" notice for pages whose backend endpoints
// don't exist yet in soqm_backend. Data shown below it is sample data.
export function PreviewBanner({ children }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#E3D9F5] bg-[#F7F4FC] px-4 py-3">
      <Sparkles className="size-4 text-[#7B3FBE] mt-0.5 shrink-0" />
      <div className="text-[13px] leading-relaxed text-[#4A3D6A]">
        <span className="font-semibold text-[#3B1F6A]">Preview module.</span>{" "}
        {children ||
          "This screen shows sample data — its backend endpoints are not available yet. The UI is ready to be wired once the API ships."}
      </div>
    </div>
  )
}
