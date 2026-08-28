import Image from "next/image"
import { branding } from "@/lib/config"
import { cn } from "@/lib/utils"

/**
 * The baobab from the Casa Impact logo, reused as a discreet graphic signature
 * (never a repeated decoration) — a grounding silhouette in the hero, or a
 * small divider glyph between sections.
 */
export function BaobabMark({
  variant = "color",
  size = 96,
  className,
}: {
  variant?: "color" | "white"
  size?: number
  className?: string
}) {
  const src = variant === "white" ? branding.treeWhite : branding.tree
  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      width={size}
      height={Math.round(size * 1.12)}
      className={cn("pointer-events-none select-none object-contain", className)}
    />
  )
}

export function SectionDivider({
  variant = "color",
  className,
}: {
  variant?: "color" | "white"
  className?: string
}) {
  return (
    <div className={cn("flex items-center justify-center gap-4", className)} aria-hidden>
      <span className={cn("h-px flex-1 max-w-24", variant === "white" ? "bg-current/25" : "bg-border")} />
      <BaobabMark variant={variant} size={28} className="opacity-70" />
      <span className={cn("h-px flex-1 max-w-24", variant === "white" ? "bg-current/25" : "bg-border")} />
    </div>
  )
}
