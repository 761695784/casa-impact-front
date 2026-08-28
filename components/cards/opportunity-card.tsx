"use client"

import Link from "next/link"
import { ArrowRight, CalendarClock, Users, MapPin, CheckCircle2, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { RegionBadge } from "@/components/cards/region-badge"
import { formatDate, daysUntil } from "@/lib/format"
import type { ApplicationCall } from "@/types/models"

const statusMeta: Record<ApplicationCall["statut"], { label: string; className: string }> = {
  publie: { label: "Candidatures Ouvertes", className: "bg-emerald-600 text-white font-bold" },
  ferme: { label: "Clôturé", className: "bg-muted text-muted-foreground" },
  brouillon: { label: "À Venir", className: "bg-accent text-accent-foreground font-bold" },
}

export function OpportunityCard({ call }: { call: ApplicationCall }) {
  const status = statusMeta[call.statut] || { label: call.statut, className: "bg-primary text-white" }
  const remaining = daysUntil(call.date_limite)
  const isOpen = call.statut === "publie"

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      <div>
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-wider ${status.className}`}>
            {status.label}
          </span>
          <RegionBadge region={call.region} />
        </div>

        {/* Title */}
        <h3 className="mt-4 font-display text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
          {call.titre}
        </h3>

        {/* Summary */}
        {call.resume && (
          <p className="mt-3 line-clamp-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
            {call.resume}
          </p>
        )}

        {/* Meta Details Box */}
        <div className="mt-6 space-y-2.5 rounded-2xl border border-border/60 bg-secondary/30 p-3.5 text-xs text-muted-foreground">
          {call.localisation && (
            <div className="flex items-center gap-2">
              <MapPin className="size-3.5 text-primary shrink-0" />
              <span>
                Lieu : <strong className="text-foreground">{call.localisation}</strong>
              </span>
            </div>
          )}

          {call.date_limite && (
            <div className="flex items-center gap-2">
              <CalendarClock className="size-3.5 text-primary shrink-0" />
              <span>
                Clôture : <strong className="text-foreground">{formatDate(call.date_limite)}</strong>
                {isOpen && remaining !== null && remaining >= 0 && (
                  <span className="ml-1.5 inline-flex items-center rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                    J-{remaining}
                  </span>
                )}
              </span>
            </div>
          )}

          {call.nombre_places && (
            <div className="flex items-center gap-2">
              <Users className="size-3.5 text-primary shrink-0" />
              <span>
                Capacité : <strong className="text-foreground">{call.nombre_places} places</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
        <span className="text-xs font-bold text-primary group-hover:underline">
          {isOpen ? "Déposer ma candidature" : "Consulter le programme"}
        </span>
        <Link
          href={`/appels-a-candidatures/${call.slug}`}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
            isOpen
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 group-hover:bg-primary/90"
              : "bg-secondary text-foreground hover:bg-secondary/80"
          }`}
        >
          <span>{isOpen ? "Postuler" : "Détails"}</span>
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}
