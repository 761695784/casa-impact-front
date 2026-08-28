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
import { Eye, FileText, Globe } from "lucide-react"
import type { Page } from "@/types/models"

interface PagePreviewModalProps {
  page: Page | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PagePreviewModal({
  page,
  open,
  onOpenChange,
}: PagePreviewModalProps) {
  if (!page) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl rounded-3xl p-6 sm:p-8">
        <DialogHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-forest">
              <Eye className="size-4" />
              <span>Prévisualisation fidèle — Vue Public</span>
            </span>
            <StatusBadge status={page.statut} />
          </div>
          <DialogTitle className="sr-only">Prévisualisation de la page</DialogTitle>
        </DialogHeader>

        {/* Public Page Layout Preview */}
        <article className="mt-4 space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-xs text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-md inline-block">
              /{page.slug}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug">
              {page.titre}
            </h1>
          </div>

          {page.resume && (
            <p className="text-sm sm:text-base font-medium text-foreground/80 leading-relaxed border-l-2 border-forest pl-4 italic">
              {page.resume}
            </p>
          )}

          {page.contenu ? (
            <div className="prose prose-sm sm:prose-base max-w-none text-foreground/85 leading-relaxed whitespace-pre-line space-y-4 pt-2 border-t border-border/40">
              {page.contenu}
            </div>
          ) : (
            <p className="text-xs italic text-muted-foreground">
              Aucun contenu rédigé pour le moment.
            </p>
          )}

          {page.meta_description && (
            <div className="rounded-2xl bg-secondary/30 p-4 border border-border/50 text-xs text-muted-foreground space-y-1">
              <span className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground block">
                Balise Meta Description (SEO)
              </span>
              <p>{page.meta_description}</p>
            </div>
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
