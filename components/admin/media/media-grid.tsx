"use client"

import React from "react"
import Link from "next/link"
import { FileText, Eye, Pencil, Trash2, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { formatDate } from "@/lib/format"
import { MEDIA_CATEGORY_LABELS } from "@/types/enums"
import type { Media } from "@/types/models"

interface MediaGridProps {
  items: Media[]
  onPreview: (media: Media) => void
  onEdit: (media: Media) => void
  onDelete: (media: Media) => void
}

function formatBytes(bytes?: number): string {
  if (!bytes) return "—"
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`
}

export function MediaGrid({
  items,
  onPreview,
  onEdit,
  onDelete,
}: MediaGridProps) {
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success("URL copiée dans le presse-papier", {
      description: url,
    })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((m) => {
        const isImage = m.type === "image"

        return (
          <div
            key={m.id}
            className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-3 shadow-2xs hover:shadow-md transition-all duration-200"
          >
            {/* Visual Header / Thumbnail */}
            <div
              onClick={() => onPreview(m)}
              className="relative aspect-video w-full overflow-hidden rounded-2xl bg-secondary/70 flex items-center justify-center cursor-pointer border border-border/50"
            >
              {isImage ? (
                <img
                  src={m.url}
                  alt={m.alt || m.nom || "Média"}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-forest p-4">
                  <FileText className="size-10 opacity-80 group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-[10px] uppercase mt-1 font-bold text-muted-foreground">
                    {m.mime?.split("/")[1] || "DOC"}
                  </span>
                </div>
              )}

              {/* Hover Overlay with Preview Icon */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-900 shadow-sm">
                  <Eye className="size-3.5 text-forest" />
                  <span>Aperçu</span>
                </span>
              </div>

              {/* Category Tag */}
              <div className="absolute top-2 left-2">
                <span className="rounded-md bg-background/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-foreground shadow-2xs">
                  {m.categorie ? MEDIA_CATEGORY_LABELS[m.categorie] : "Général"}
                </span>
              </div>
            </div>

            {/* Information Block */}
            <div className="p-2 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <p
                  onClick={() => onPreview(m)}
                  className="font-bold text-xs text-foreground hover:text-primary transition-colors cursor-pointer line-clamp-1 mt-1"
                  title={m.nom || m.nom_original}
                >
                  {m.nom || m.nom_original}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground truncate">
                  {m.nom_original}
                </p>
              </div>

              <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{formatBytes(m.taille)}</span>
                {m.dimensions && <span>{m.dimensions}</span>}
              </div>
            </div>

            {/* Card Action Buttons */}
            <div className="flex items-center justify-between gap-1 pt-2 border-t border-border/50 px-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopyUrl(m.url)}
                className="size-7 rounded-full text-muted-foreground hover:text-foreground"
                title="Copier le lien"
              >
                <Copy className="size-3.5" />
              </Button>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(m)}
                  className="size-7 rounded-full text-muted-foreground hover:text-foreground"
                  title="Modifier les métadonnées"
                >
                  <Pencil className="size-3.5 text-amber-600" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(m)}
                  className="size-7 rounded-full text-muted-foreground hover:text-destructive"
                  title="Supprimer"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
