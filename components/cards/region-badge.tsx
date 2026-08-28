import { MapPin } from "lucide-react"
import { REGION_LABELS, type Region } from "@/types/enums"
import { cn } from "@/lib/utils"

export function RegionBadge({ region, className }: { region?: Region; className?: string }) {
  if (!region) return null
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground",
        className,
      )}
    >
      <MapPin className="size-3 text-primary" />
      {REGION_LABELS[region]}
    </span>
  )
}
