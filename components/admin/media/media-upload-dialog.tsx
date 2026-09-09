"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateMedia } from "@/hooks/use-media"
import { UploadCloud, FileText, Loader2, X, Check } from "lucide-react"
import { MEDIA_CATEGORY_LABELS } from "@/types/enums"
import type { Media } from "@/types/models"

interface MediaUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (created: Media) => void
}

export function MediaUploadDialog({
  open,
  onOpenChange,
  onSuccess,
}: MediaUploadDialogProps) {
  const createMutation = useCreateMedia()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [nom, setNom] = useState("")
  const [categorie, setCategorie] = useState<"banniere" | "portrait" | "logo" | "document" | "general">("general")
  const [alt, setAlt] = useState("")
  const [legende, setLegende] = useState("")
  const [dimensions, setDimensions] = useState<string>("")

  const isImage = file ? file.type.startsWith("image/") : true

  // Libère l'URL objet créée pour la prévisualisation quand elle change ou
  // que le dialog se ferme, pour éviter les fuites mémoire.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const resetForm = () => {
    setFile(null)
    setPreviewUrl("")
    setNom("")
    setCategorie("general")
    setAlt("")
    setLegende("")
    setDimensions("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    setFile(selected)
    setDimensions("")

    if (!nom) {
      const baseName = selected.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
      setNom(baseName.charAt(0).toUpperCase() + baseName.slice(1))
    }

    const objectUrl = URL.createObjectURL(selected)
    setPreviewUrl(objectUrl)

    if (selected.type.startsWith("image/")) {
      const img = new Image()
      img.onload = () => {
        setDimensions(`${img.naturalWidth}x${img.naturalHeight}`)
      }
      img.src = objectUrl
    } else {
      setCategorie((prev) => (prev === "general" ? "document" : prev))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    try {
      const created = await createMutation.mutateAsync({
        file,
        nom: nom.trim() || undefined,
        alt: alt.trim() || undefined,
        legende: legende.trim() || undefined,
        categorie,
      })
      resetForm()
      onOpenChange(false)
      onSuccess?.(created)
    } catch (err) {
      // Géré par le toast de la mutation
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm()
        onOpenChange(v)
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-1">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UploadCloud className="size-5" />
          </div>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            Ajouter un média à l'album
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Importez une image, un logo ou un document pour l'utiliser sur les actualités, programmes et pages de Casa Impact.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          {/* Zone de dépôt / sélection de fichier */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="media-file-upload"
            />
            {!file ? (
              <label
                htmlFor="media-file-upload"
                className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-primary/30 bg-secondary/30 p-8 text-center cursor-pointer hover:bg-secondary/60 hover:border-primary/60 transition-all group"
              >
                <div className="flex size-14 items-center justify-center rounded-2xl bg-background text-primary shadow-xs group-hover:scale-110 transition-transform">
                  <UploadCloud className="size-7" />
                </div>
                <p className="mt-3 text-sm font-bold text-foreground">
                  Cliquez pour choisir une photo ou un document
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  PNG, JPG, WEBP, PDF jusqu'à 5 Mo
                </p>
              </label>
            ) : (
              <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-4">
                <div className="flex items-center gap-4">
                  {isImage && previewUrl ? (
                    <div className="relative size-20 rounded-2xl overflow-hidden bg-secondary shrink-0 border border-border">
                      <img
                        src={previewUrl}
                        alt="Aperçu"
                        className="size-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex size-20 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 shrink-0">
                      <FileText className="size-8" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground truncate">
                      {file.name}
                    </p>
                    {dimensions && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Dimensions : {dimensions} px
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Poids : {(file.size / (1024 * 1024)).toFixed(2)} Mo
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (previewUrl) URL.revokeObjectURL(previewUrl)
                      setFile(null)
                      setPreviewUrl("")
                      setDimensions("")
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    }}
                    className="flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="media-nom" className="text-xs font-semibold">
                Nom ou Titre descriptif *
              </Label>
              <Input
                id="media-nom"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="ex. Caravane Jeunesse Ziguinchor"
                className="mt-1.5 h-10 rounded-xl text-xs bg-card"
              />
            </div>

            <div>
              <Label htmlFor="media-categorie" className="text-xs font-semibold">
                Catégorie dans l'album *
              </Label>
              <Select
                value={categorie}
                onValueChange={(val) => setCategorie(val as any)}
              >
                <SelectTrigger id="media-categorie" className="mt-1.5 h-10 rounded-xl text-xs bg-card">
                  <SelectValue placeholder="Catégorie" />
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
          </div>

          <div>
            <Label htmlFor="media-alt" className="text-xs font-semibold">
              Texte alternatif (Alt text SEO / Accessibilité)
            </Label>
            <Input
              id="media-alt"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Description concise pour les lecteurs d'écran..."
              className="mt-1.5 h-10 rounded-xl text-xs bg-card"
            />
          </div>

          <div>
            <Label htmlFor="media-legende" className="text-xs font-semibold">
              Légende ou Description détaillée (optionnel)
            </Label>
            <Textarea
              id="media-legende"
              rows={2}
              value={legende}
              onChange={(e) => setLegende(e.target.value)}
              placeholder="Précisez le contexte, les personnes présentes ou le lieu de la photo..."
              className="mt-1.5 rounded-xl resize-none text-xs"
            />
          </div>

          <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || !file}
              className="rounded-full bg-primary text-white hover:bg-forest font-semibold gap-2 shadow-xs"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Téléversement...</span>
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  <span>Ajouter à la médiathèque</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
