"use client"

import React, { useState, useEffect, useCallback } from "react"
import Cropper, { type Area } from "react-easy-crop"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, ZoomIn } from "lucide-react"
import { cropImageFile } from "@/lib/image-processing"

/**
 * Étape de recadrage avant l'envoi d'une photo de membre (accord du
 * 2026-09-18 : "je veux qu'on puisse rogner la photo pour qu'elle soit
 * bien cadrée dans la carte"). Ratio fixe = celui de l'encadré photo du
 * gabarit de carte de membre (voir MembershipCardService::generate() /
 * resources/views/pdf/membership-card.blade.php : `.photo-box` fait
 * 148pt de large sur 182pt de haut) — recadrer à ce ratio ici garantit que
 * la carte générée côté serveur n'aura plus jamais besoin de rogner ou
 * d'étirer l'image elle-même (object-fit: cover s'en chargeait avant, au
 * prix d'un cadrage parfois imprévisible choisi par le navigateur).
 *
 * Utilisé à la fois par membership-photo-dialog.tsx (remplacement de
 * photo d'un membre existant) et membership-form-dialog.tsx (saisie
 * manuelle d'un nouveau membre) — un seul composant partagé pour ne pas
 * dupliquer la logique de recadrage.
 */
export const MEMBERSHIP_PHOTO_ASPECT = 148 / 182

interface PhotoCropModalProps {
  /** Fichier brut sélectionné par l'utilisateur, à recadrer. */
  file: File | null
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Appelé avec le fichier final (recadré) une fois validé. */
  onCropped: (file: File) => void
}

export function PhotoCropModal({ file, open, onOpenChange, onCropped }: PhotoCropModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!file || !open) {
      setImageUrl(null)
      return
    }

    const url = URL.createObjectURL(file)
    setImageUrl(url)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)

    return () => URL.revokeObjectURL(url)
  }, [file, open])

  const handleCropComplete = useCallback((_croppedArea: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  const handleValidate = async () => {
    if (!file || !croppedAreaPixels) return
    setIsProcessing(true)
    try {
      const cropped = await cropImageFile(file, croppedAreaPixels)
      onCropped(cropped)
      onOpenChange(false)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm rounded-3xl p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="font-display text-lg font-bold text-foreground">
            Cadrer la photo
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Ajustez le cadrage et le zoom pour que le visage soit bien centré dans l'encadré de la carte de membre.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-2 h-72 w-full overflow-hidden rounded-2xl bg-secondary">
          {imageUrl && (
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={MEMBERSHIP_PHOTO_ASPECT}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          )}
        </div>

        <div className="mt-3 flex items-center gap-3">
          <ZoomIn className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-forest"
            aria-label="Zoom"
          />
        </div>

        <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleValidate}
            disabled={!croppedAreaPixels || isProcessing}
            className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2 shadow-xs"
          >
            {isProcessing ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Traitement...</span>
              </>
            ) : (
              <span>Valider le cadrage</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
