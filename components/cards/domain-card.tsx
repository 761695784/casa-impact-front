"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react"
import type { Domain } from "@/types/models"
import { getDomainMetadata } from "@/lib/domain-visuals"
import { cn } from "@/lib/utils"

export function DomainCard({
  domain,
  className,
}: {
  domain: Domain
  className?: string
}) {
  const meta = getDomainMetadata(domain.slug)
  const Icon = meta.icon

  return (
    <Link
      href={`/domaines/${domain.slug}`}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl",
        className
      )}
    >
      <div>
        {/* Cover Image with Gradient Overlay & Zoom */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary">
          <Image
            src={meta.image}
            alt={domain.nom}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
            aria-hidden
          />

          {/* Elevated Icon Badge */}
          <div className="absolute bottom-4 left-4 flex size-12 items-center justify-center rounded-2xl bg-white/95 text-primary shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
            <Icon className="size-6" />
          </div>

          <div className="absolute right-4 top-4">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm",
                meta.badgeTone
              )}
            >
              Pilier Stratégique
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7">
          <h3 className="font-display text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
            {domain.nom}
          </h3>

          {/* meta.pitch (frontend) plutôt que domain.resume (backend) : la liste des
              axes juste en dessous rendrait un texte basé sur la description
              redondant, puisque celle-ci cite déjà les mêmes intitulés d'axes. */}
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {meta.pitch}
          </p>

          {/* Key Axes Preview */}
          <ul className="mt-5 space-y-1.5 border-t border-border/60 pt-4 text-xs text-foreground/80">
            {meta.axes.slice(0, 2).map((axis, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary shrink-0" />
                <span className="font-medium truncate">{axis.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mx-6 mb-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs sm:text-sm font-semibold text-primary">
        <span className="group-hover:underline">Découvrir le domaine</span>
        <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:translate-x-1">
          <ArrowRight className="size-4" />
        </span>
      </div>
    </Link>
  )
}
