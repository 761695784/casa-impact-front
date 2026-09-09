"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MEDIA_CATEGORY_LABELS } from "@/types/enums"
import type { Media } from "@/types/models"

interface MediaEditDialogProps {
  media: Media | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (id: number, payload: Partial<Media>) => Promise<void>
  loading?: boolean
}

export function MediaEditDialog({
  media,
  open,
  onOpenChange,
  onSubmit,
  loading = false,
}: MediaEditDialogProps) {
  const [nom, setNom] = useState("")
  const [alt, setAlt] = useState("")
  const [legende, setLegende] = useState("")
  const [categorie, setCategorie] = useState<string>("general")

  useEffect(() => {
    if (media) {
      setNom(media.nom || "")
      setAlt(media.alt || "")
      setLegende(media.legende || "")
      setCategorie(media.categorie || "general")
    }
  }, [media, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!media) return

    await onSubmit(media.id, {
      nom: nom.trim(),
      alt: alt.trim(),
      legende: legende.trim(),
      categorie: categorie as Media["categorie"],
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold">
            Modifier les métadonnées
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Ajustez le titre d'affichage, le texte alternatif pour l'accessibilité et la catégorie.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Nom du média */}
          <div className="space-y-1.5">
            <Label htmlFor="media-nom" className="text-xs font-semibold">
              Titre du média
            </Label>
            <Input
              id="media-nom"
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ex : Bannière officielle..."
              className="h-10 rounded-2xl text-xs sm:text-sm"
            />
          </div>

          {/* Catégorie */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Catégorie d'usage
            </Label>
            <Select value={categorie} onValueChange={(val) => setCategorie(val || "general")}>
              <SelectTrigger className="h-10 rounded-2xl text-xs">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl text-xs">
                {Object.entries(MEDIA_CATEGORY_LABELS)
                  .filter(([k]) => k !== "all")
                  .map(([k, label]) => (
                    <SelectItem key={k} value={k}>
                      {label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Texte alternatif (Alt) */}
          <div className="space-y-1.5">
            <Label htmlFor="media-alt" className="text-xs font-semibold">
              Texte alternatif (Accessibilité SEO)
            </Label>
            <Input
              id="media-alt"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Description courte de l'image..."
              className="h-10 rounded-2xl text-xs sm:text-sm"
            />
          </div>

          {/* Légende */}
          <div className="space-y-1.5">
            <Label htmlFor="media-legende" className="text-xs font-semibold">
              Notes & Légende
            </Label>
            <Textarea
              id="media-legende"
              rows={3}
              value={legende}
              onChange={(e) => setLegende(e.target.value)}
              placeholder="Précisions sur l'utilisation de ce fichier..."
              className="rounded-2xl text-xs sm:text-sm resize-none"
            />
          </div>

          <DialogFooter className="pt-4 sm:pt-6 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full text-xs"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading || !nom.trim()}
              className="rounded-full text-xs bg-forest hover:bg-forest/90 text-white font-medium"
            >
              {loading ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
