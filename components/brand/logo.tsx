import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { branding, siteConfig } from "@/lib/config"

interface LogoProps {
  variant?: "color" | "white"
  className?: string
  priority?: boolean
  /** width in px; height auto-scales to the logo aspect ratio */
  width?: number
  href?: string | null
}

export function Logo({ variant = "color", className, priority, width = 168, href = "/" }: LogoProps) {
  const src = variant === "white" ? branding.logoWhite : branding.logo
  const img = (
    <Image
      src={src || "/placeholder.svg"}
      alt={`${siteConfig.name} — ${siteConfig.tagline}`}
      width={width}
      height={Math.round(width * 0.58)}
      priority={priority}
      className={cn("object-contain", className)}
      style={{ width, height: "auto" }}
    />
  )
  if (href === null) return img
  return (
    <Link href={href} aria-label={`${siteConfig.name} — Accueil`} className="inline-flex items-center">
      {img}
    </Link>
  )
}
