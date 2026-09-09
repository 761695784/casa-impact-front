import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, MapPin, Users, Sparkles, Calendar, Layers } from "lucide-react"
import type { Program } from "@/types/models"
import { RegionBadge } from "@/components/cards/region-badge"
import { Badge } from "@/components/ui/badge"
import { getProgramMetadata } from "@/lib/program-visuals"
import { cn } from "@/lib/utils"

export function ProgramCard({
  program,
  className,
}: {
  program: Program
  className?: string
}) {
  const meta = getProgramMetadata(program.slug)
  const Icon = meta.icon
  const coverImage = program.image || meta.image || "/assets/hero/DSC08048%20copie.jpg"

  return (
    <Link
      href={`/programmes/${program.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl",
        className,
      )}
    >
      {/* Visual Cover Header */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary">
        <Image
          src={coverImage}
          alt={program.titre}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
          aria-hidden
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            {program.region && <RegionBadge region={program.region} />}
            {program.type && (
              <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md">
                {program.type.nom}
              </span>
            )}
          </div>
          {program.appels_count && program.appels_count > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold text-accent-foreground shadow-sm">
              <Sparkles className="size-3" />
              <span>Candidature ouverte</span>
            </span>
          ) : null}
        </div>

        {/* Domain Badge at bottom of image */}
        {program.domaine && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-md backdrop-blur-md">
            <Icon className="size-3.5 text-primary" />
            <span>{program.domaine.nom}</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-bold text-foreground text-balance transition-colors duration-200 group-hover:text-primary">
          {program.titre}
        </h3>

        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground text-pretty line-clamp-2">
          {program.resume}
        </p>

        {/* Metadata Strip */}
        <div className="mt-5 flex flex-wrap items-center gap-y-2 gap-x-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          {program.localisation ? (
            <span className="inline-flex items-center gap-1.5 truncate">
              <MapPin className="size-3.5 shrink-0 text-primary" />
              <span className="truncate">{program.localisation}</span>
            </span>
          ) : null}

          {program.beneficiaires_count && program.beneficiaires_count > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5 shrink-0 text-primary" />
              <span>+{program.beneficiaires_count} formés</span>
            </span>
          ) : null}
        </div>

        {/* Action Footer */}
        <div className="mt-4 flex items-center justify-between pt-2">
          <span className="text-xs font-semibold text-primary group-hover:underline">
            Découvrir le programme
          </span>
          <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:translate-x-0.5">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
