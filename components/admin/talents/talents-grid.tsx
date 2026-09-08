"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Eye,
  Edit,
  Power,
  Trash2,
  Sparkles,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { resolveMediaUrl } from "@/lib/format"
import { REGION_LABELS } from "@/types/enums"
import type { Talent } from "@/types/models"

interface TalentsGridProps {
  talents: Talent[]
  onEdit: (talent: Talent) => void
  onToggleStatus: (talent: Talent) => void
  onDelete: (talent: Talent) => void
}

export function TalentsGrid({
  talents,
  onEdit,
  onToggleStatus,
  onDelete,
}: TalentsGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {talents.map((t, index) => {
        const photoUrl = resolveMediaUrl(t.media?.[0]?.url)
        return (
        <div
          key={t.id}
          className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xs transition-all hover:border-forest/40 hover:shadow-md"
        >
          <div>
            {/* Top Bar: Sequence Number, Region & Status */}
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-xl bg-forest/10 font-mono text-xs font-bold text-forest">
                  0{index + 1}
                </span>
                {t.region && (
                  <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground uppercase">
                    {REGION_LABELS[t.region] || t.region}
                  </span>
                )}
              </div>
              <StatusBadge status={t.statut} />
            </div>

            {/* Photo & Identity */}
            <div className="mt-4 flex items-start gap-3.5">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl border border-border bg-secondary flex items-center justify-center font-bold text-forest font-display text-base shadow-2xs">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={t.nom}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <span>{t.nom.substring(0, 2).toUpperCase()}</span>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-0.5">
                <Link
                  href={`/admin/talents/${t.id}`}
                  className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors block line-clamp-1 leading-snug"
                >
                  {t.nom}
                </Link>
                {t.domain?.nom && (
                  <p className="text-xs font-medium text-forest truncate">
                    {t.domain.nom}
                  </p>
                )}
              </div>
            </div>

            {/* Présentation Excerpt */}
            {t.presentation && (
              <p className="mt-4 text-xs text-foreground/80 line-clamp-3 leading-relaxed rounded-2xl bg-secondary/30 p-3.5 border border-border/40">
                {t.presentation}
              </p>
            )}

            {/* Tag Domaine */}
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {t.domain && (
                <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground truncate max-w-[170px]">
                  <Layers className="size-2.5 shrink-0" />
                  <span className="truncate">{t.domain.nom}</span>
                </span>
              )}
            </div>
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
                <Link href={`/admin/talents/${t.id}`}>
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
                title="Supprimer le talent"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        </div>
        )
      })}
    </div>
  )
}
