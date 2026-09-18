"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useUpdateMembershipPhoto } from "@/hooks/use-memberships"
import { compressImageToWebP } from "@/lib/image-processing"
import { cn } from "@/lib/utils"
import { ImageIcon, Loader2, Camera } from "lucide-react"
import type { Membership } from "@/types/models"
import { PhotoCropModal } from "./photo-crop-modal"

interface MembershipPhotoDialogProps {
  membership: Membership
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Ajouter/remplacer la photo d'un membre déjà existant — pensé pour les
 * membres importés depuis l'historique Excel (créés sans photo, le fichier
 * source ne contenant que des liens Google Drive, jamais téléchargés
 * automatiquement — accord du 2026-09-11). Réutilisable pour n'importe quel
 * membre (remplace aussi une photo déjà présente).
 */
export function MembershipPhotoDialog({ membership, open, onOpenChange }: MembershipPhotoDialogProps) {
  const updatePhotoMutation = useUpdateMembershipPhoto()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [photo, setPhoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)

  // Étape de recadrage (accord du 2026-09-18) : le fichier brut choisi par
  // l'utilisateur passe d'abord par PhotoCropModal avant d'être compressé
  // et retenu comme `photo` — voir handleCropped().
  const [rawFile, setRawFile] = useState<File | null>(null)
  const [isCropOpen, setIsCropOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      setPhoto(null)
      if (preview) URL.revokeObjectURL(preview)
      setPreview(null)
      setRawFile(null)
      setIsCropOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setRawFile(file)
    setIsCropOpen(true)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleCropped = async (croppedFile: File) => {
    setIsCompressing(true)
    try {
      const compressed = await compressImageToWebP(croppedFile)
      if (preview) URL.revokeObjectURL(preview)
      setPhoto(compressed)
      setPreview(URL.createObjectURL(compressed))
    } finally {
      setIsCompressing(false)
    }
  }

  const handleSave = async () => {
    if (!photo) return
    try {
      await updatePhotoMutation.mutateAsync({ id: membership.id, photo })
      onOpenChange(false)
    } catch {
      // Le toast d'erreur est déjà affiché par le hook (onError).
    }
  }

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm rounded-3xl p-6">
        <DialogHeader className="space-y-1">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
            <Camera className="size-5" />
          </div>
          <DialogTitle className="font-display text-lg font-bold text-foreground">
            {membership.photo_url ? "Remplacer la photo" : "Ajouter une photo"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {membership.nom_complet} — utilisée pour la carte de membre officielle.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {preview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-2xl border border-border bg-secondary"
            >
              <img src={preview} alt="Aperçu" className="size-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity text-white text-xs font-semibold">
                Changer
              </div>
            </div>
          ) : (
            <div
              onClick={() => !isCompressing && fileInputRef.current?.click()}
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/60 p-8 text-center cursor-pointer transition-all group",
                "hover:border-primary/50 hover:bg-secondary/60"
              )}
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                {isCompressing ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <ImageIcon className="size-5" />
                )}
              </div>
              <p className="mt-2 text-xs font-bold text-foreground">
                {isCompressing ? "Optimisation..." : "Cliquez pour importer une photo"}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!photo || updatePhotoMutation.isPending || isCompressing}
            className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2 shadow-xs"
          >
            {updatePhotoMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <span>Enregistrer</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <PhotoCropModal
      file={rawFile}
      open={isCropOpen}
      onOpenChange={setIsCropOpen}
      onCropped={handleCropped}
    />
    </>
  )
}
