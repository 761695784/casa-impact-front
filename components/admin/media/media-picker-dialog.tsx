"use client"

import React, { useState, useMemo } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMedia, useCreateMedia } from "@/hooks/use-media"
import {
  Image as ImageIcon,
  Search,
  Check,
  UploadCloud,
  Layers,
  Sparkles,
  CheckCircle2,
  X,
  FileText,
  Plus,
} from "lucide-react"
import { MEDIA_CATEGORY_LABELS } from "@/types/enums"
import type { Media } from "@/types/models"

interface MediaPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  multiple?: boolean
  selectedUrls?: string[]
  onSelect: (selected: Media[]) => void
  title?: string
  description?: string
  filterType?: string
}

export function MediaPickerDialog({
  open,
  onOpenChange,
  multiple = false,
  selectedUrls = [],
  onSelect,
  title = "Choisir depuis la médiathèque",
  description = "Sélectionnez une ou plusieurs photos issues de l'album officiel de Casa Impact.",
  filterType = "image",
}: MediaPickerDialogProps) {
  const { data: mediaItems = [], isLoading } = useMedia({
    type: filterType === "all" ? undefined : filterType,
  })
  const createMutation = useCreateMedia()

  const [activeTab, setActiveTab] = useState<string>("browse")
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedMap, setSelectedMap] = useState<Record<number, Media>>({})

  // Quick upload state inside picker
  const [uploadNom, setUploadNom] = useState("")
  const [uploadUrl, setUploadUrl] = useState("")
  const [uploadPreview, setUploadPreview] = useState("")
  const [uploadCategory, setUploadCategory] = useState<string>("general")

  // Initialize selection when opened
  React.useEffect(() => {
    if (open) {
      const initial: Record<number, Media> = {}
      if (selectedUrls.length > 0 && mediaItems.length > 0) {
        mediaItems.forEach((m) => {
          if (selectedUrls.includes(m.url)) {
            initial[m.id] = m
          }
        })
      }
      setSelectedMap(initial)
      setActiveTab("browse")
      setSearch("")
    }
  }, [open, selectedUrls, mediaItems])

  // Filtered Media List
  const filteredList = useMemo(() => {
    return mediaItems.filter((m) => {
      const matchesSearch =
        !search.trim() ||
        m.nom?.toLowerCase().includes(search.toLowerCase()) ||
        m.nom_fichier?.toLowerCase().includes(search.toLowerCase()) ||
        m.alt?.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        selectedCategory === "all" || m.categorie === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [mediaItems, search, selectedCategory])

  const toggleSelect = (media: Media) => {
    if (multiple) {
      setSelectedMap((prev) => {
        const next = { ...prev }
        if (next[media.id]) {
          delete next[media.id]
        } else {
          next[media.id] = media
        }
        return next
      })
    } else {
      // Single selection
      setSelectedMap({ [media.id]: media })
    }
  }

  const handleConfirm = () => {
    const selectedList = Object.values(selectedMap)
    onSelect(selectedList)
    onOpenChange(false)
  }

  const handleQuickUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadUrl && !uploadPreview) return

    const payload = {
      nom: uploadNom.trim() || "Photo ajoutée à l'actualité",
      nom_fichier: "photo-actualite.jpg",
      url: uploadPreview || uploadUrl,
      type: "image",
      categorie: (uploadCategory as any) || "general",
      statut: "actif" as const,
      taille: 800000,
      dimensions: "1920x1080",
      mime_type: "image/jpeg",
    }

    try {
      const created = await createMutation.mutateAsync(payload)
      // Auto select the uploaded item
      if (multiple) {
        setSelectedMap((prev) => ({ ...prev, [created.id]: created }))
      } else {
        setSelectedMap({ [created.id]: created })
      }
      setUploadNom("")
      setUploadUrl("")
      setUploadPreview("")
      setActiveTab("browse")
    } catch {
      // Handled by toast
    }
  }

  const selectedCount = Object.keys(selectedMap).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] sm:max-w-4xl w-[95vw] sm:w-full rounded-3xl p-6 sm:p-8 overflow-hidden flex flex-col">
        <DialogHeader className="space-y-1 shrink-0 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-2xl bg-forest/10 text-forest">
              <ImageIcon className="size-4.5" />
            </div>
            <div>
              <DialogTitle className="font-display text-lg sm:text-xl font-bold text-foreground">
                {title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Tabs: Album vs Upload */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between gap-4 border-b border-border pb-3 shrink-0">
            <TabsList className="rounded-full bg-secondary/80 p-1">
              <TabsTrigger value="browse" className="rounded-full text-xs font-bold px-4 py-1.5 gap-1.5">
                <Layers className="size-3.5" />
                <span>Album Médiathèque ({mediaItems.length})</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className="rounded-full text-xs font-bold px-4 py-1.5 gap-1.5">
                <UploadCloud className="size-3.5" />
                <span>+ Téléverser une photo</span>
              </TabsTrigger>
            </TabsList>

            {selectedCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                <CheckCircle2 className="size-3.5" />
                {selectedCount} {selectedCount > 1 ? "éléments sélectionnés" : "élément sélectionné"}
              </span>
            )}
          </div>

          {/* TAB 1: BROWSE ALBUM */}
          <TabsContent value="browse" className="flex-1 flex flex-col min-h-0 pt-4 space-y-4 data-[state=inactive]:hidden">
            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher une photo par mot-clé, événement, lieu..."
                  className="h-10 rounded-full pl-9 pr-8 text-xs bg-background"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-all whitespace-nowrap ${
                    selectedCategory === "all"
                      ? "bg-primary text-white shadow-xs"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                  }`}
                >
                  Toutes
                </button>
                {Object.entries(MEDIA_CATEGORY_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedCategory(key)}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-all whitespace-nowrap ${
                      selectedCategory === key
                        ? "bg-primary text-white shadow-xs"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Media Thumbnails Grid */}
            <div className="flex-1 overflow-y-auto pr-1 min-h-[260px] max-h-[45vh]">
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-2xl bg-secondary animate-pulse" />
                  ))}
                </div>
              ) : filteredList.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                  <ImageIcon className="size-10 mb-2 opacity-40" />
                  <p className="text-sm font-semibold">Aucune image trouvée</p>
                  <p className="text-xs mt-1">Essayez un autre mot-clé ou ajoutez une photo via l'onglet Téléverser.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {filteredList.map((media) => {
                    const isSelected = !!selectedMap[media.id]
                    return (
                      <div
                        key={media.id}
                        onClick={() => toggleSelect(media)}
                        className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-200 select-none bg-secondary ${
                          isSelected
                            ? "border-primary ring-4 ring-primary/20 shadow-md scale-[0.98]"
                            : "border-transparent hover:border-border hover:shadow-sm"
                        }`}
                      >
                        {media.type === "image" ? (
                          <img
                            src={media.url}
                            alt={media.alt || media.nom}
                            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="size-full flex flex-col items-center justify-center p-3 text-center bg-blue-500/10 text-blue-600">
                            <FileText className="size-8 mb-1" />
                            <span className="text-[10px] font-bold line-clamp-2">{media.nom}</span>
                          </div>
                        )}

                        {/* Hover Overlay with Media Info */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-between text-white">
                          <span className="self-end rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-xs">
                            {media.categorie || "photo"}
                          </span>
                          <p className="text-xs font-bold line-clamp-2 leading-tight">
                            {media.nom}
                          </p>
                        </div>

                        {/* Selected Checkmark Badge */}
                        {isSelected && (
                          <div className="absolute top-2 left-2 flex size-6 items-center justify-center rounded-full bg-primary text-white shadow-md animate-in zoom-in-75">
                            <Check className="size-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 2: QUICK UPLOAD */}
          <TabsContent value="upload" className="flex-1 overflow-y-auto pt-4 space-y-4 data-[state=inactive]:hidden">
            <form onSubmit={handleQuickUpload} className="space-y-4 max-w-lg mx-auto p-4 rounded-3xl border border-border bg-card">
              <div>
                <Label className="text-xs font-semibold">Fichier photo ou URL directe *</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    if (!uploadNom) {
                      const base = f.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
                      setUploadNom(base.charAt(0).toUpperCase() + base.slice(1))
                    }
                    const reader = new FileReader()
                    reader.onload = (ev) => {
                      setUploadPreview(ev.target?.result as string)
                    }
                    reader.readAsDataURL(f)
                  }}
                  className="mt-1.5 block w-full text-xs text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-forest"
                />
              </div>

              {uploadPreview && (
                <div className="relative size-24 rounded-2xl overflow-hidden border border-border bg-secondary">
                  <img src={uploadPreview} alt="Aperçu" className="size-full object-cover" />
                </div>
              )}

              <div>
                <Label htmlFor="picker-upload-nom" className="text-xs font-semibold">Titre de la photo *</Label>
                <Input
                  id="picker-upload-nom"
                  required
                  value={uploadNom}
                  onChange={(e) => setUploadNom(e.target.value)}
                  placeholder="ex. Atelier Numérique Bignona 2026"
                  className="mt-1.5 h-10 rounded-xl text-xs bg-background"
                />
              </div>

              <div>
                <Label htmlFor="picker-upload-cat" className="text-xs font-semibold">Catégorie</Label>
                <select
                  id="picker-upload-cat"
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background p-2.5 text-xs"
                >
                  <option value="general">Général / Reportage</option>
                  <option value="banniere">Bannière & Couverture</option>
                  <option value="portrait">Portrait</option>
                  <option value="logo">Logo & Identité</option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={createMutation.isPending || (!uploadUrl && !uploadPreview)}
                className="w-full rounded-full bg-primary text-white hover:bg-forest font-bold text-xs"
              >
                {createMutation.isPending ? "Téléversement..." : "Ajouter et Sélectionner"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <DialogFooter className="pt-4 border-t border-border flex items-center justify-between shrink-0 gap-3">
          <div className="text-xs text-muted-foreground">
            {selectedCount === 0 ? (
              <span>Aucune image sélectionnée</span>
            ) : (
              <span className="font-semibold text-foreground">
                {selectedCount} image{selectedCount > 1 ? "s" : ""} prête{selectedCount > 1 ? "s" : ""} à être insérée{selectedCount > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full text-xs"
            >
              Annuler
            </Button>
            <Button
              type="button"
              disabled={selectedCount === 0}
              onClick={handleConfirm}
              className="rounded-full bg-forest hover:bg-forest/90 text-white font-bold text-xs px-5 shadow-xs"
            >
              <Check className="size-3.5 mr-1" />
              {multiple
                ? `Insérer (${selectedCount})`
                : "Sélectionner cette image"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
