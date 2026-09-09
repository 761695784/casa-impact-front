"use client"

import React from "react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import { formatDate } from "@/lib/format"
import { MEDIA_CATEGORY_LABELS } from "@/types/enums"
import type { Media } from "@/types/models"

interface MediaPreviewDialogProps {
  media: Media | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatBytes(bytes?: number): string {
  if (!bytes) return "—"
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`
}

export function MediaPreviewDialog({
  media,
  open,
  onOpenChange,
}: MediaPreviewDialogProps) {
  if (!media) return null

  const isImage = media.type === "image"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-3xl p-6 sm:p-8 overflow-hidden">
        <DialogHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-display text-lg font-bold truncate pr-4">
              {media.nom || media.nom_original}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Visual Media Viewer */}
          <div className="flex items-center justify-center rounded-2xl bg-secondary/60 border border-border overflow-hidden min-h-[260px] max-h-[420px] p-2 relative group">
            {isImage ? (
              <img
                src={media.url}
                alt={media.alt || media.nom || "Média"}
                className="max-h-[380px] w-auto max-w-full object-contain rounded-xl shadow-xs"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                <div className="size-16 rounded-3xl bg-forest/10 text-forest flex items-center justify-center">
                  <FileText className="size-8" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">
                    {media.nom_original || media.nom}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {media.mime || "Document numérique"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Details & Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-secondary/30 rounded-2xl p-4 border border-border/50">
            <div>
              <span className="text-muted-foreground block text-[11px]">Format / MIME :</span>
              <span className="font-mono font-semibold text-foreground mt-0.5 block truncate">
                {media.mime || media.type}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Poids :</span>
              <span className="font-semibold text-foreground mt-0.5 block">
                {formatBytes(media.taille)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Dimensions :</span>
              <span className="font-semibold text-foreground mt-0.5 block">
                {media.dimensions || "—"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Catégorie :</span>
              <span className="font-semibold text-foreground mt-0.5 block truncate">
                {media.categorie ? MEDIA_CATEGORY_LABELS[media.categorie] : "Général"}
              </span>
            </div>
          </div>

          {/* Légende */}
          {media.legende && (
            <div className="text-xs space-y-1">
              <span className="font-semibold text-foreground">Légende :</span>
              <p className="text-muted-foreground leading-relaxed">
                {media.legende}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-2 border-t border-border/60">
            <span className="text-[11px] text-muted-foreground">
              Ajouté le {media.created_at ? formatDate(media.created_at) : "—"}
            </span>

            <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full text-xs gap-1.5"
              >
                <a href={media.url} target="_blank" rel="noopener noreferrer" download>
                  <Download className="size-3.5" />
                  <span>Télécharger</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
