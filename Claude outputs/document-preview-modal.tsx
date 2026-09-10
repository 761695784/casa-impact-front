"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Loader2, FileWarning } from "lucide-react"
import { usePreviewApplicationDocument } from "@/hooks/use-applications"
import type { ApplicationDocumentFile } from "@/types/models"

interface DocumentPreviewModalProps {
  applicationId: number
  document: ApplicationDocumentFile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDownload: (doc: ApplicationDocumentFile) => void
}

function previewKind(mimeType?: string): "pdf" | "image" | null {
  if (!mimeType) return null
  if (mimeType === "application/pdf") return "pdf"
  if (mimeType.startsWith("image/")) return "image"
  return null
}

/**
 * Aperçu en ligne d'un document joint à une candidature. Le backend force
 * `Content-Disposition: attachment` sur la route de téléchargement (voir
 * Admin\ApplicationController::downloadDocument) — impossible d'afficher
 * le fichier via une simple navigation ou un <iframe src="..."> direct.
 * On récupère donc le blob via `previewDocument` (fetch authentifié, sans
 * déclencher le "Enregistrer sous") puis on l'affiche via une URL blob:
 * locale. Seuls PDF et images ont une visionneuse native du navigateur ;
 * les autres formats (.docx, .xlsx...) retombent sur le téléchargement.
 */
export function DocumentPreviewModal({
  applicationId,
  document: doc,
  open,
  onOpenChange,
  onDownload,
}: DocumentPreviewModalProps) {
  const previewMutation = usePreviewApplicationDocument()
  const [blobUrl, setBlobUrl] = React.useState<string | null>(null)
  const [resolvedMime, setResolvedMime] = React.useState<string | undefined>(undefined)

  React.useEffect(() => {
    if (!open || !doc) return

    let cancelled = false
    let localUrl: string | null = null

    previewMutation.mutate(
      { applicationId, documentKey: doc.cle },
      {
        onSuccess: (data) => {
          if (cancelled) return
          localUrl = URL.createObjectURL(data.blob)
          setBlobUrl(localUrl)
          setResolvedMime(data.mimeType)
        },
      }
    )

    return () => {
      cancelled = true
      if (localUrl) URL.revokeObjectURL(localUrl)
      setBlobUrl(null)
      setResolvedMime(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, doc?.cle, applicationId])

  if (!doc) return null

  const kind = previewKind(resolvedMime ?? doc.mime_type)
  const isLoading = previewMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl rounded-3xl p-6 flex max-h-[85vh] flex-col">
        <DialogHeader>
          <DialogTitle className="truncate font-display text-lg font-bold text-foreground">
            {doc.libelle || doc.nom_fichier}
          </DialogTitle>
          <DialogDescription className="truncate font-mono text-xs text-muted-foreground">
            {doc.nom_fichier}
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-[50vh] flex-1 items-center justify-center overflow-auto rounded-2xl border border-border bg-secondary/30">
          {isLoading && (
            <div className="flex flex-col items-center gap-2 p-8 text-sm text-muted-foreground">
              <Loader2 className="size-6 animate-spin" />
              <span>Chargement de l'aperçu...</span>
            </div>
          )}

          {!isLoading && previewMutation.isError && (
            <div className="flex flex-col items-center gap-2 p-8 text-center text-sm text-destructive">
              <FileWarning className="size-8" />
              <span>Impossible de charger l'aperçu de ce document.</span>
            </div>
          )}

          {!isLoading && !previewMutation.isError && blobUrl && kind === "pdf" && (
            <iframe
              src={blobUrl}
              title={doc.nom_fichier}
              className="h-[65vh] w-full rounded-2xl bg-white"
            />
          )}

          {!isLoading && !previewMutation.isError && blobUrl && kind === "image" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={blobUrl}
              alt={doc.nom_fichier}
              className="max-h-[65vh] max-w-full rounded-2xl object-contain"
            />
          )}

          {!isLoading && !previewMutation.isError && blobUrl && !kind && (
            <div className="flex flex-col items-center gap-3 p-8 text-center text-sm text-muted-foreground">
              <FileWarning className="size-8 text-forest/60" />
              <p>
                L'aperçu intégré n'est pas disponible pour ce type de fichier
                {resolvedMime ? ` (${resolvedMime})` : ""}. Téléchargez-le pour le consulter.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            Fermer
          </Button>
          <Button
            type="button"
            onClick={() => onDownload(doc)}
            className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2"
          >
            <Download className="size-4" />
            <span>Télécharger</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
