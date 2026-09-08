"use client"

import React from "react"
import Link from "next/link"
import {
  Eye,
  Edit,
  Trash2,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { formatDate } from "@/lib/format"
import { NEWS_TYPE_LABELS } from "@/types/enums"
import type { News } from "@/types/models"

interface ActualitesMobileListProps {
  newsList: News[]
  onEdit: (news: News) => void
  onPreview: (news: News) => void
  onDelete: (news: News) => void
}

export function ActualitesMobileList({
  newsList,
  onEdit,
  onPreview,
  onDelete,
}: ActualitesMobileListProps) {
  return (
    <div className="space-y-4">
      {newsList.map((item) => (
        <div
          key={item.id}
          className="rounded-3xl border border-border bg-card p-5 shadow-2xs space-y-4"
        >
          {/* Header : Type, Status, Title */}
          <div className="space-y-2 border-b border-border/60 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-forest/10 px-2 py-0.5 font-bold text-forest text-[10px] uppercase">
                  {NEWS_TYPE_LABELS[item.type] || item.type}
                </span>
              </div>
              <StatusBadge status={item.statut} />
            </div>

            <Link
              href={`/admin/actualites/${item.id}`}
              className="font-bold text-foreground hover:text-primary transition-colors text-sm block line-clamp-2"
            >
              {item.titre}
            </Link>
          </div>

          {/* Details */}
          {item.corps && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {item.corps}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-end text-xs text-muted-foreground gap-2 pt-1 border-t border-border/40">
            {item.created_at && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3 text-muted-foreground" />
                <span>{formatDate(item.created_at)}</span>
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/60">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1 h-9 rounded-full text-xs gap-1.5"
            >
              <Link href={`/admin/actualites/${item.id}`}>
                <Eye className="size-3.5 text-forest" />
                <span>Détail</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPreview(item)}
              className="h-9 rounded-full text-xs text-primary gap-1"
            >
              <Eye className="size-3.5" />
              <span>Aperçu</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(item)}
              className="h-9 rounded-full text-xs gap-1 px-3"
            >
              <Edit className="size-3.5" />
              <span>Modifier</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(item)}
              className="size-9 rounded-full text-destructive hover:bg-destructive/10"
              title="Supprimer l'actualité"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
