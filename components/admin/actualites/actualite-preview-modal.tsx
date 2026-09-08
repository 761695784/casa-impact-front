"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { formatDate } from "@/lib/format"
import { NEWS_TYPE_LABELS } from "@/types/enums"
import { Calendar, Eye } from "lucide-react"
import type { News } from "@/types/models"

interface ActualitePreviewModalProps {
  news: News | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ActualitePreviewModal({
  news,
  open,
  onOpenChange,
}: ActualitePreviewModalProps) {
  if (!news) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl rounded-3xl p-6 sm:p-8">
        <DialogHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-forest">
              <Eye className="size-4" />
              <span>Prévisualisation fidèle — Vue Public</span>
            </span>
            <StatusBadge status={news.statut} />
          </div>
          <DialogTitle className="sr-only">Prévisualisation de l'article</DialogTitle>
        </DialogHeader>

        {/* Public Article Layout Preview */}
        <article className="mt-4 space-y-6">
          
          {/* Category & Date */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="rounded-full bg-forest/10 px-3 py-1 font-bold text-forest uppercase tracking-wider text-[10px]">
              {NEWS_TYPE_LABELS[news.type] || news.type}
            </span>

            {news.created_at && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3.5" />
                <span>{formatDate(news.created_at)}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug">
            {news.titre}
          </h1>

          {/* Content */}
          {news.corps ? (
            <div className="prose prose-sm sm:prose-base max-w-none text-foreground/85 leading-relaxed whitespace-pre-line space-y-4 pt-2 border-t border-border/40">
              {news.corps}
            </div>
          ) : (
            <p className="text-xs italic text-muted-foreground">
              Aucun contenu rédigé pour le moment.
            </p>
          )}
        </article>

        <div className="mt-8 flex justify-end border-t border-border/60 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            Fermer la prévisualisation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
