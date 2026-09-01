"use client"

import React, { useState, useRef } from "react"
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
import { UploadCloud, Image as ImageIcon, FileText, Loader2, X, Check } from "lucide-react"
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

  const [nom, setNom] = useState("")
  const [url, setUrl] = useState("")
  const [nomFichier, setNomFichier] = useState("")
  const [type, setType] = useState<"image" | "document">("image")
  const [categorie, setCategorie] = useState<"banniere" | "portrait" | "logo" | "document" | "general">("general")
  const [alt, setAlt] = useState("")
  const [description, setDescription] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [taille, setTaille] = useState<number>(0)
  const [dimensions, setDimensions] = useState<string>("")

  const resetForm = () => {
    setNom("")
    setUrl("")
    setNomFichier("")
    setType("image")
    setCategorie("general")
    setAlt("")
    setDescription("")
    setPreviewUrl("")
    setTaille(0)
    setDimensions("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isImage = file.type.startsWith("image/")
    setType(isImage ? "image" : "document")
    setNomFichier(file.name)
    setTaille(file.size)

    if (!nom) {
      // Auto generate title from filename without extension
      const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
      setNom(baseName.charAt(0).toUpperCase() + baseName.slice(1))
    }

    if (isImage) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setUrl(result)
        setPreviewUrl(result)

        // Read dimensions
        const img = new Image()
        img.onload = () => {
          setDimensions(`${img.naturalWidth}x${img.naturalHeight}`)
        }
        img.src = result
      }
      reader.readAsDataURL(file)
    } else {
      setUrl(`/documents/${file.name}`)
      setPreviewUrl("")
      setCategorie("document")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url && !previewUrl) return

    const payload = {
      nom: nom.trim() || nomFichier || "Nouveau média",
      nom_fichier: nomFichier || "media-file.jpg",
      url: previewUrl || url,
      type,
      categorie,
      alt: alt.trim() || nom.trim() || undefined,
      description: description.trim() || undefined,
      taille: taille || 500000,
      dimensions: dimensions || (type === "image" ? "1920x1080" : undefined),
      mime_type: type === "image" ? "image/jpeg" : "application/pdf",
      statut: "actif" as const,
    }

    try {
      const created = await createMutation.mutateAsync(payload)
      resetForm()
      onOpenChange(false)
      onSuccess?.(created)
    } catch (err) {
      // Handled by mutation toast
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
          {/* Drag & Drop / File Input Box */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="media-file-upload"
            />
            {!previewUrl && !url ? (
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
                  PNG, JPG, WEBP, PDF jusqu'à 25 Mo
                </p>
              </label>
            ) : (
              <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-4">
                <div className="flex items-center gap-4">
                  {type === "image" && previewUrl ? (
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
                      {nomFichier || "Fichier sélectionné"}
                    </p>
                    {dimensions && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Dimensions : {dimensions} px
                      </p>
                    )}
                    {taille > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Poids : {(taille / (1024 * 1024)).toFixed(2)} Mo
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl("")
                      setUrl("")
                      setNomFichier("")
                    }}
                    className="flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Saisie manuelle alternative URL */}
          <div>
            <Label htmlFor="media-url-input" className="text-xs font-semibold">
              Ou chemin / URL de l'image
            </Label>
            <Input
              id="media-url-input"
              value={url.startsWith("data:") ? "" : url}
              onChange={(e) => {
                setUrl(e.target.value)
                setPreviewUrl(e.target.value)
              }}
              placeholder="ex. /assets/hero/DSC08016%20copie.jpg"
              className="mt-1.5 h-10 rounded-xl text-xs bg-card"
            />
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
                  {Object.entries(MEDIA_CATEGORY_LABELS).map(([k, label]) => (
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
            <Label htmlFor="media-desc" className="text-xs font-semibold">
              Légende ou Description détaillée (optionnel)
            </Label>
            <Textarea
              id="media-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              disabled={createMutation.isPending || (!url && !previewUrl)}
              className="rounded-full bg-primary text-white hover:bg-forest font-semibold gap-2 shadow-xs"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Enregistrement...</span>
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
