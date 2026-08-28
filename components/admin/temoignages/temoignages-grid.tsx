"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Eye,
  Edit,
  Power,
  Trash2,
  Quote,
  Compass,
  Building,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import type { Testimonial } from "@/types/models"

interface TemoignagesGridProps {
  testimonials: Testimonial[]
  onEdit: (t: Testimonial) => void
  onToggleStatus: (t: Testimonial) => void
  onDelete: (t: Testimonial) => void
}

export function TemoignagesGrid({
  testimonials,
  onEdit,
  onToggleStatus,
  onDelete,
}: TemoignagesGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((t, index) => (
        <div
          key={t.id}
          className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xs transition-all hover:border-forest/40 hover:shadow-md"
        >
          <div>
            {/* Top Bar: Sequence Number & Status */}
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-xl bg-forest/10 font-mono text-xs font-bold text-forest">
                  0{t.ordre || index + 1}
                </span>
                <Quote className="size-4 text-forest/60" />
              </div>
              <StatusBadge status={t.statut} />
            </div>

            {/* Author Avatar & Identity */}
            <div className="mt-4 flex items-start gap-3.5">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-border bg-secondary flex items-center justify-center font-bold text-forest font-display text-sm">
                {t.photo ? (
                  <Image
                    src={t.photo}
                    alt={t.auteur}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <span>{t.auteur.substring(0, 2).toUpperCase()}</span>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-0.5">
                <Link
                  href={`/admin/temoignages/${t.id}`}
                  className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors block line-clamp-1 leading-snug"
                >
                  {t.auteur}
                </Link>
                {t.fonction && (
                  <p className="text-xs font-medium text-foreground/80 truncate">
                    {t.fonction}
                  </p>
                )}
                {t.organisation && (
                  <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                    <Building className="size-3 shrink-0" />
                    <span>{t.organisation}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Quotation text */}
            <blockquote className="mt-4 text-xs text-foreground/85 line-clamp-4 leading-relaxed rounded-2xl bg-secondary/30 p-3.5 border border-border/40 italic">
              « {t.contenu} »
            </blockquote>

            {/* Linked Program tag */}
            {t.programme && (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-forest/5 px-2.5 py-1 text-[11px] font-medium text-forest">
                <Compass className="size-3 shrink-0" />
                <span className="truncate max-w-[200px]">{t.programme.titre}</span>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="mt-6 pt-4 border-t border-border/60">
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 h-9 rounded-full text-xs gap-1.5 border-border hover:bg-secondary"
              >
                <Link href={`/admin/temoignages/${t.id}`}>
                  <Eye className="size-3.5 text-forest" />
                  <span>Fiche</span>
                </Link>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(t)}
                className="h-9 rounded-full text-xs gap-1 px-3"
              >
                <Edit className="size-3.5" />
                <span>Modifier</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleStatus(t)}
                className={`size-9 rounded-full ${
                  t.statut === "archive"
                    ? "text-emerald-700 hover:bg-emerald-500/10"
                    : "text-muted-foreground hover:text-amber-700 hover:bg-amber-500/10"
                }`}
                title={t.statut === "archive" ? "Publier" : "Archiver"}
              >
                <Power className="size-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(t)}
                className="size-9 rounded-full text-destructive hover:bg-destructive/10"
                title="Supprimer le témoignage"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
