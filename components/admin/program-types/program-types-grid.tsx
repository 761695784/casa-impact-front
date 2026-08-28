"use client"

import React from "react"
import Link from "next/link"
import {
  Eye,
  Edit,
  Power,
  Compass,
  Tag,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import type { ProgramType } from "@/types/models"

interface ProgramTypesGridProps {
  programTypes: ProgramType[]
  onEdit: (type: ProgramType) => void
  onToggleStatus: (type: ProgramType) => void
}

export function ProgramTypesGrid({
  programTypes,
  onEdit,
  onToggleStatus,
}: ProgramTypesGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {programTypes.map((type, index) => (
        <div
          key={type.id}
          className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xs transition-all hover:border-forest/40 hover:shadow-md"
        >
          <div>
            {/* Top Bar: Sequence Number, Slug, Status */}
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-xl bg-forest/10 font-mono text-xs font-bold text-forest">
                  0{type.ordre || index + 1}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[140px]">
                  /{type.slug}
                </span>
              </div>
              <StatusBadge status={type.statut || "actif"} />
            </div>

            {/* Title & Description */}
            <div className="mt-4 space-y-2">
              <Link
                href={`/admin/types-de-programme/${type.id}`}
                className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors block line-clamp-1"
              >
                {type.nom}
              </Link>
              {type.description && (
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed rounded-2xl bg-secondary/30 p-3 border border-border/40">
                  {type.description}
                </p>
              )}
            </div>
          </div>

          {/* Bottom Meta & Actions */}
          <div className="mt-6 pt-4 border-t border-border/60 space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 font-semibold text-forest">
                <Compass className="size-3.5" />
                <span>{type.programmes_count || 0} programme{(type.programmes_count || 0) > 1 ? "s" : ""}</span>
              </span>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-6 rounded-full px-2 text-[11px] text-primary gap-1"
              >
                <Link href={`/admin/programmes?type_id=${type.id}`}>
                  <span>Filtrer programmes</span>
                  <ArrowRight className="size-3" />
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 h-9 rounded-full text-xs gap-1.5 border-border hover:bg-secondary"
              >
                <Link href={`/admin/types-de-programme/${type.id}`}>
                  <Eye className="size-3.5 text-forest" />
                  <span>Consulter la fiche</span>
                </Link>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(type)}
                className="h-9 rounded-full text-xs gap-1 px-3"
              >
                <Edit className="size-3.5" />
                <span>Modifier</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleStatus(type)}
                className={`size-9 rounded-full ${
                  type.statut === "inactif"
                    ? "text-emerald-700 hover:bg-emerald-500/10"
                    : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                }`}
                title={type.statut === "inactif" ? "Activer la modalité" : "Désactiver la modalité"}
              >
                <Power className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
