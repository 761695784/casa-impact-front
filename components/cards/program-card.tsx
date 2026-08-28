import Link from "next/link"
import { ArrowUpRight, MapPin } from "lucide-react"
import type { Program } from "@/types/models"
import { RegionBadge } from "@/components/cards/region-badge"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function ProgramCard({ program, className }: { program: Program; className?: string }) {
  return (
    <Link
      href={`/programmes/${program.slug}`}
      className={cn(
        "group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {program.region ? <RegionBadge region={program.region} /> : null}
        {program.type ? (
          <Badge variant="secondary" className="font-medium">
            {program.type.nom}
          </Badge>
        ) : null}
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-foreground text-balance">{program.titre}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">{program.resume}</p>
      <div className="mt-4 flex items-center justify-between">
        {program.localisation ? (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5" />
            {program.localisation}
          </span>
        ) : (
          <span />
        )}
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
          Découvrir
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}
