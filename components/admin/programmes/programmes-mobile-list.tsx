"use client"

import React from "react"
import Link from "next/link"
import {
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  MapPin,
  Calendar,
  Layers,
  Tag,
  Megaphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { REGION_LABELS } from "@/types/enums"
import type { Program } from "@/types/models"

interface ProgrammesMobileListProps {
  programs: Program[]
  onEdit: (program: Program) => void
  onDelete: (program: Program) => void
}

export function ProgrammesMobileList({
  programs,
  onEdit,
  onDelete,
}: ProgrammesMobileListProps) {
  return (
    <div className="space-y-4">
      {programs.map((program) => (
        <div
          key={program.id}
          className="rounded-3xl border border-border bg-card p-5 shadow-2xs space-y-4"
        >
          {/* Header : Title, Status */}
          <div className="flex items-start justify-between gap-2 border-b border-border/60 pb-3">
            <div className="space-y-1">
              <Link
                href={`/admin/programmes/${program.id}`}
                className="font-bold text-foreground hover:text-primary transition-colors text-sm line-clamp-1"
              >
                {program.titre}
              </Link>
              <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                {program.domaine && (
                  <span className="rounded-md bg-forest/10 px-2 py-0.5 font-bold text-forest">
                    {program.domaine.nom}
                  </span>
                )}
                {program.type && (
                  <span className="rounded-md bg-secondary px-2 py-0.5 font-medium text-muted-foreground">
                    {program.type.nom}
                  </span>
                )}
              </div>
            </div>
            <StatusBadge status={program.statut} />
          </div>

          {/* Details */}
          {program.resume && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {program.resume}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2 pt-1 border-t border-border/40">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3 text-muted-foreground" />
              <span>
                {program.region ? REGION_LABELS[program.region] : "Multi-régional"}
              </span>
            </span>

            <span className="inline-flex items-center gap-1 font-semibold text-forest">
              <Megaphone className="size-3" />
              <span>{program.appels_count || 0} appel{(program.appels_count || 0) > 1 ? "s" : ""}</span>
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/60">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1 h-9 rounded-full text-xs gap-1.5"
            >
              <Link href={`/admin/programmes/${program.id}`}>
                <Eye className="size-3.5 text-forest" />
                <span>Détail</span>
              </Link>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(program)}
              className="h-9 rounded-full text-xs gap-1 px-3"
            >
              <Edit className="size-3.5" />
              <span>Modifier</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(program)}
              className="size-9 rounded-full text-destructive hover:bg-destructive/10"
              title="Supprimer le programme"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
