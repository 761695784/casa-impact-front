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
import { useUpdateMembershipPhoto, useFetchMembershipPhotoForCrop } from "@/hooks/use-memberships"
import { compressImageToWebP } from "@/lib/image-processing"
import { cn } from "@/lib/utils"
import { ImageIcon, Loader2, Camera, Crop } from "lucide-react"
import type { Membership } from "@/types/models"
import { PhotoCropModal } from "./photo-crop-modal"

interface MembershipPhotoDialogProps {
  membership: Membership
  open: boolean
  onOpenChange: (open: boolean) => void
  /**
   * Ouvre directement l'outil de recadrage sur la photo déjà enregistrée du
   * membre, sans passer par l'aperçu intermédiaire — utilisé par le bouton
   * "Recadrer" de la fenêtre de zoom (accord du 2026-09-18 : "a partir du
   * click au niveau de la photo, recadrer aussi et enregistrer").
   */
  autoStartCrop?: boolean
}

/**
 * Ajouter/remplacer/recadrer la photo d'un membre déjà existant. Deux
 * usages :
 *  - Membre sans photo (import historique, accord du 2026-09-11) :
 *    sélection d'un nouveau fichier, recadré puis compressé avant envoi.
 *  - Membre AVEC une photo déjà envoyée par l'adhérent (via le formulaire
 *    public) mais mal cadrée : accord du 2026-09-18, l'admin doit pouvoir
 *    recadrer cette photo EXISTANTE sans avoir à en réimporter une nouvelle
 *    depuis son ordinateur. Voir handleRecadrerExisting() — récupère la
 *    photo actuelle via l'API (nécessaire pour le CORS, voir
 *    memberships.service.ts::getMembershipPhotoAsFile), puis réutilise
 *    exactement le même flux crop → compression → enregistrement que pour
 *    un nouveau fichier.
 */
export function MembershipPhotoDialog({
  membership,
  open,
  onOpenChange,
  autoStartCrop = false,
}: MembershipPhotoDialogProps) {
  const updatePhotoMutation = useUpdateMembershipPhoto()
  const fetchCurrentPhotoMutation = useFetchMembershipPhotoForCrop()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [photo, setPhoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)

  // Étape de recadrage (accord du 2026-09-18) : le fichier brut (nouveau ou
  // récupéré depuis la photo existante) passe d'abord par PhotoCropModal
  // avant d'être compressé et retenu comme `photo` — voir handleCropped().
  const [rawFile, setRawFile] = useState<File | null>(null)
  const [isCropOpen, setIsCropOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      setPhoto(null)
      if (preview) URL.revokeObjectURL(preview)
      setPreview(null)
      setRawFile(null)
      setIsCropOpen(false)
      return
    }

    if (autoStartCrop && membership.photo_url) {
      handleRecadrerExisting()
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

  const handleRecadrerExisting = async () => {
    try {
      const file = await fetchCurrentPhotoMutation.mutateAsync(membership.id)
      setRawFile(file)
      setIsCropOpen(true)
    } catch {
      // Le toast d'erreur est déjà affiché par le hook (onError).
    }
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

  const isLoadingCurrentPhoto = fetchCurrentPhotoMutation.isPending

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm rounded-3xl p-6">
        <DialogHeader className="space-y-1">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
            <Camera className="size-5" />
          </div>
          <DialogTitle className="font-display text-lg font-bold text-foreground">
            {membership.photo_url ? "Remplacer / recadrer la photo" : "Ajouter une photo"}
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
            // Un nouveau fichier (importé ou recadré depuis l'existant) a déjà
            // été choisi/recadré — clic = repartir d'un autre fichier.
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-2xl border border-border bg-secondary"
            >
              <img src={preview} alt="Aperçu" className="size-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity text-white text-xs font-semibold">
                Changer
              </div>
            </div>
          ) : membership.photo_url ? (
            // Photo déjà enregistrée (envoyée par l'adhérent) : deux actions
            // possibles — la recadrer telle quelle, ou en importer une autre.
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-secondary">
              <img
                src={membership.photo_url}
                alt="Photo actuelle"
                className="size-full object-cover"
              />
              {isLoadingCurrentPhoto ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                  <Loader2 className="size-6 animate-spin" />
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleRecadrerExisting}
                    className="rounded-full bg-white text-forest hover:bg-white/90 text-xs font-semibold gap-1.5 shadow-xs"
                  >
                    <Crop className="size-3.5" />
                    <span>Recadrer cette photo</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full text-white hover:bg-white/10 text-xs font-semibold"
                  >
                    Importer une autre photo
                  </Button>
                </div>
              )}
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
