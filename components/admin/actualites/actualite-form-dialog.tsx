"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
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
import { FormFieldError } from "@/components/ui/form-field-error"
import {
  showSuccessAlert,
  showErrorAlert,
  showValidationErrorAlert,
} from "@/lib/alerts"
import { ApiError } from "@/lib/api-client"
import { NEWS_STATUS_LABELS, NEWS_TYPE_LABELS } from "@/types/enums"
import { useCreateNews, useUpdateNews } from "@/hooks/use-news"
import { useAttachMedia, useDetachMedia } from "@/hooks/use-media"
import { MediaPickerDialog } from "@/components/admin/media/media-picker-dialog"
import {
  Newspaper,
  Loader2,
  Image as ImageIcon,
  Plus,
  Trash2,
  Star,
  Layers,
} from "lucide-react"
import type { News, Media } from "@/types/models"
import type { NewsStatus, NewsType } from "@/types/enums"

interface ActualiteFormDialogProps {
  news?: News | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const COVER_COLLECTION = "cover"
const GALLERY_COLLECTION = "gallery"

export function ActualiteFormDialog({
  news,
  open,
  onOpenChange,
  onSuccess,
}: ActualiteFormDialogProps) {
  const isEditing = !!news

  const createMutation = useCreateNews()
  const updateMutation = useUpdateNews()
  const attachMutation = useAttachMedia()
  const detachMutation = useDetachMedia()

  const [titre, setTitre] = useState("")
  const [corps, setCorps] = useState("")
  const [type, setType] = useState<NewsType>("article")
  const [statut, setStatut] = useState<NewsStatus>("brouillon")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  // Couverture (photo unique, collection "cover") et album (plusieurs
  // photos, collection "gallery") — rattachées à la fiche News via la
  // médiathèque partagée (media_attachments), pas via le payload de
  // création/mise à jour de l'article. On garde une trace de l'état
  // initial (issu de news.media en édition) pour ne synchroniser au
  // moment de l'enregistrement que ce qui a réellement changé
  // (attach des ajouts, detach des retraits).
  const [coverMedia, setCoverMedia] = useState<Media | null>(null)
  const [galleryMedias, setGalleryMedias] = useState<Media[]>([])
  const [initialCoverId, setInitialCoverId] = useState<number | null>(null)
  const [initialGalleryIds, setInitialGalleryIds] = useState<number[]>([])

  // Media Picker Dialog states
  const [isCoverPickerOpen, setIsCoverPickerOpen] = useState(false)
  const [isGalleryPickerOpen, setIsGalleryPickerOpen] = useState(false)

  useEffect(() => {
    if (news) {
      setTitre(news.titre || "")
      setCorps(news.corps || "")
      setType(news.type || "article")
      setStatut(news.statut || "brouillon")

      const existingMedia = news.media || []
      const cover = existingMedia.find((m) => m.collection === COVER_COLLECTION) || null
      const gallery = existingMedia.filter((m) => m.collection !== COVER_COLLECTION)

      setCoverMedia(cover)
      setGalleryMedias(gallery)
      setInitialCoverId(cover?.id ?? null)
      setInitialGalleryIds(gallery.map((m) => m.id))
    } else {
      setTitre("")
      setCorps("")
      setType("article")
      setStatut("brouillon")
      setCoverMedia(null)
      setGalleryMedias([])
      setInitialCoverId(null)
      setInitialGalleryIds([])
    }
    setErrors({})
  }, [news, open])

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    attachMutation.isPending ||
    detachMutation.isPending

  const handleSelectCover = (selected: Media[]) => {
    if (selected.length > 0) {
      setCoverMedia(selected[0])
    }
  }

  const handleSelectGallery = (selected: Media[]) => {
    // Add unique selected media
    setGalleryMedias((prev) => {
      const existingIds = new Set(prev.map((m) => m.id))
      const newItems = selected.filter((m) => !existingIds.has(m.id))
      return [...prev, ...newItems]
    })
  }

  const handleRemoveGalleryItem = (id: number) => {
    setGalleryMedias((prev) => prev.filter((m) => m.id !== id))
  }

  const handleSetAsCover = (media: Media) => {
    setCoverMedia(media)
  }

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {}

    if (!titre.trim()) {
      errs.titre = "Le titre de la publication est requis."
    } else if (titre.trim().length < 3) {
      errs.titre = "Le titre doit comporter au moins 3 caractères."
    }

    if (!corps.trim()) {
      errs.corps = "Le corps de l'article est requis."
    } else if (corps.trim().length < 10) {
      errs.corps = "Le corps de l'article doit contenir au moins 10 caractères."
    }

    if (!type) {
      errs.type = "Le format éditorial est requis."
    }

    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      showValidationErrorAlert(Object.values(errs))
      return false
    }
    return true
  }

  /**
   * Synchronise couverture + album avec la médiathèque une fois la fiche
   * News enregistrée (attach/detach uniquement pour ce qui a changé).
   * Les erreurs ici n'annulent pas l'enregistrement de l'article — déjà
   * réussi à ce stade — mais sont signalées séparément.
   */
  const syncMedia = async (newsId: number) => {
    const tasks: Promise<unknown>[] = []

    if (coverMedia?.id !== (initialCoverId ?? undefined)) {
      if (initialCoverId && initialCoverId !== coverMedia?.id) {
        tasks.push(
          detachMutation.mutateAsync({
            mediaId: initialCoverId,
            mediableType: "news",
            mediableId: newsId,
            collection: COVER_COLLECTION,
          })
        )
      }
      if (coverMedia) {
        tasks.push(
          attachMutation.mutateAsync({
            mediaId: coverMedia.id,
            mediableType: "news",
            mediableId: newsId,
            collection: COVER_COLLECTION,
            ordre: 0,
          })
        )
      }
    }

    const currentGalleryIds = galleryMedias.map((m) => m.id)
    const removedIds = initialGalleryIds.filter((id) => !currentGalleryIds.includes(id))
    const addedMedias = galleryMedias.filter((m) => !initialGalleryIds.includes(m.id))

    removedIds.forEach((mediaId) => {
      tasks.push(
        detachMutation.mutateAsync({
          mediaId,
          mediableType: "news",
          mediableId: newsId,
          collection: GALLERY_COLLECTION,
        })
      )
    })

    addedMedias.forEach((media) => {
      tasks.push(
        attachMutation.mutateAsync({
          mediaId: media.id,
          mediableType: "news",
          mediableId: newsId,
          collection: GALLERY_COLLECTION,
          ordre: galleryMedias.findIndex((m) => m.id === media.id),
        })
      )
    })

    if (tasks.length === 0) return

    await Promise.all(tasks)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const payload = {
      titre: titre.trim(),
      corps: corps.trim() || undefined,
      type,
      statut,
    }

    try {
      let newsId: number

      if (isEditing && news) {
        const updated = await updateMutation.mutateAsync({
          id: news.id,
          payload,
        })
        newsId = updated.id
      } else {
        const created = await createMutation.mutateAsync(payload as Omit<News, "id">)
        newsId = created.id
      }

      try {
        await syncMedia(newsId)
      } catch (mediaErr) {
        showErrorAlert(
          "Article enregistré, mais un problème est survenu avec les photos",
          mediaErr instanceof Error
            ? mediaErr.message
            : "Certaines photos n'ont pas pu être rattachées à l'article. Réessayez depuis la fiche."
        )
        onOpenChange(false)
        onSuccess?.()
        return
      }

      await showSuccessAlert(
        isEditing ? "Publication modifiée !" : "Publication créée !",
        isEditing
          ? "L'article a été mis à jour avec succès."
          : "Le nouvel article a été enregistré avec succès."
      )

      onOpenChange(false)
      onSuccess?.()
    } catch (err: unknown) {
      if (err instanceof ApiError && err.errors) {
        const backendErrors: Record<string, string> = {}
        const errorMessages: string[] = []
        Object.entries(err.errors).forEach(([field, messages]) => {
          backendErrors[field] = messages[0]
          errorMessages.push(...messages)
        })
        setErrors(backendErrors)
        showValidationErrorAlert(
          errorMessages.length > 0 ? errorMessages : [err.message]
        )
      } else {
        showErrorAlert(
          "Erreur d'enregistrement",
          err instanceof Error
            ? err.message
            : "Une erreur inattendue est survenue lors de l'enregistrement de l'article."
        )
      }
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl rounded-3xl p-6 sm:p-8">
          <DialogHeader className="space-y-1">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
              <Newspaper className="size-5" />
            </div>
            <DialogTitle className="font-display text-xl font-bold text-foreground">
              {isEditing ? "Modifier la publication" : "Nouvelle publication éditoriale"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {isEditing
                ? "Modifiez le contenu, la typologie, la couverture et l'album photos de cette actualité."
                : "Rédigez un article, associez vos photos depuis la médiathèque et publiez pour la communauté."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 space-y-6">

            {/* Section 1 : Identité & Typologie */}
            <div className="space-y-3.5 rounded-3xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-forest text-white text-[11px] font-bold">
                  1
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Identité de l'Article
                </h4>
              </div>

              <div>
                <Label htmlFor="news-titre" className={`text-xs font-semibold ${errors.titre ? "text-destructive" : ""}`}>
                  Titre de la publication *
                </Label>
                <Input
                  id="news-titre"
                  required
                  value={titre}
                  onChange={(e) => {
                    setTitre(e.target.value)
                    clearError("titre")
                  }}
                  placeholder="ex. Immersion & Rencontre avec la Jeunesse de Ziguinchor"
                  className={`mt-1.5 h-11 rounded-xl text-sm bg-card ${
                    errors.titre
                      ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                      : ""
                  }`}
                />
                <FormFieldError error={errors.titre} />
              </div>

              <div>
                <Label htmlFor="news-type" className={`text-xs font-semibold ${errors.type ? "text-destructive" : ""}`}>
                  Format éditorial *
                </Label>
                <Select
                  value={type}
                  onValueChange={(val) => {
                    setType(val as NewsType)
                    clearError("type")
                  }}
                >
                  <SelectTrigger
                    id="news-type"
                    className={`mt-1.5 h-10 w-full rounded-xl text-xs bg-card ${
                      errors.type
                        ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs">
                    {(Object.keys(NEWS_TYPE_LABELS) as NewsType[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {NEWS_TYPE_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormFieldError error={errors.type} />
              </div>
            </div>

            {/* Section 2 : Contenu & Rédaction */}
            <div className="space-y-3.5 rounded-3xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-forest text-white text-[11px] font-bold">
                  2
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Rédaction & Contenu
                </h4>
              </div>

              <div>
                <Label htmlFor="news-corps" className={`text-xs font-semibold ${errors.corps ? "text-destructive" : ""}`}>
                  Corps de l'article / Texte complet *
                </Label>
                <Textarea
                  id="news-corps"
                  required
                  rows={6}
                  value={corps}
                  onChange={(e) => {
                    setCorps(e.target.value)
                    clearError("corps")
                  }}
                  placeholder="Rédigez les détails de l'événement, les déclarations, les chiffres et les perspectives..."
                  className={`mt-1.5 rounded-xl text-xs bg-card ${
                    errors.corps
                      ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                      : ""
                  }`}
                />
                <FormFieldError error={errors.corps} />
              </div>
            </div>

            {/* Section 3 : Image Principale (Couverture) */}
            <div className="space-y-3.5 rounded-3xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-forest text-white text-[11px] font-bold">
                    3
                  </span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Image Principale (Couverture)
                  </h4>
                </div>

                <Button
                  type="button"
                  onClick={() => setIsCoverPickerOpen(true)}
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs font-bold gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                >
                  <ImageIcon className="size-3.5" />
                  <span>Choisir dans la médiathèque</span>
                </Button>
              </div>

              {coverMedia ? (
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-3">
                  <div className="flex items-center gap-4">
                    <div className="relative size-20 sm:size-24 rounded-xl overflow-hidden bg-secondary shrink-0 border border-border">
                      <img
                        src={coverMedia.url}
                        alt="Couverture"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-bold text-accent-foreground mb-1">
                        <Star className="size-3 fill-accent text-accent" />
                        Image de couverture active
                      </span>
                      <p className="text-xs font-bold text-foreground truncate">
                        {coverMedia.nom || coverMedia.nom_original}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsCoverPickerOpen(true)}
                          className="h-7 rounded-lg text-xs font-semibold px-2 text-primary hover:bg-primary/10"
                        >
                          Changer
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setCoverMedia(null)}
                          className="h-7 rounded-lg text-xs font-semibold px-2 text-destructive hover:bg-destructive/10"
                        >
                          Retirer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsCoverPickerOpen(true)}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/60 p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-secondary/60 transition-all group"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <ImageIcon className="size-5" />
                  </div>
                  <p className="mt-2 text-xs font-bold text-foreground">
                    Aucune image de couverture sélectionnée
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Cliquez ici pour choisir une photo dans la médiathèque
                  </p>
                </div>
              )}
            </div>

            {/* Section 4 : Galerie Photos Multi-Images (Album de l'article) */}
            <div className="space-y-3.5 rounded-3xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-forest text-white text-[11px] font-bold">
                    4
                  </span>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Galerie Photos de l'Actualité ({galleryMedias.length})
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Associez plusieurs photos de l'événement pour créer un album photos dans l'article.
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => setIsGalleryPickerOpen(true)}
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs font-bold gap-1.5 border-primary/30 text-primary hover:bg-primary/10 self-start sm:self-auto"
                >
                  <Plus className="size-3.5" />
                  <span>+ Ajouter des photos</span>
                </Button>
              </div>

              {galleryMedias.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                  {galleryMedias.map((m, idx) => (
                    <div
                      key={m.id || idx}
                      className="group relative aspect-square rounded-2xl overflow-hidden border border-border bg-card shadow-2xs"
                    >
                      <img
                        src={m.url}
                        alt={m.nom || `Photo ${idx + 1}`}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white">
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            title="Définir en image de couverture"
                            onClick={() => handleSetAsCover(m)}
                            className="flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-accent hover:text-forest transition-colors"
                          >
                            <Star className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Retirer de la galerie"
                            onClick={() => handleRemoveGalleryItem(m.id)}
                            className="flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-destructive hover:text-white transition-colors"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] font-bold line-clamp-2">
                          {m.nom || m.nom_original}
                        </p>
                      </div>

                      {/* Cover Badge if matches current cover */}
                      {coverMedia?.id === m.id && (
                        <div className="absolute bottom-1.5 left-1.5 rounded-full bg-accent px-2 py-0.5 text-[9px] font-bold text-accent-foreground shadow-xs">
                          Couverture
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  onClick={() => setIsGalleryPickerOpen(true)}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/60 p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-secondary/60 transition-all group"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-transform">
                    <Layers className="size-5" />
                  </div>
                  <p className="mt-2 text-xs font-bold text-foreground">
                    Aucune photo supplémentaire dans l'album
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Cliquez pour sélectionner plusieurs photos de reportage dans la médiathèque
                  </p>
                </div>
              )}
            </div>

            {/* Section 5 : Publication */}
            <div className="space-y-3.5 rounded-3xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-forest text-white text-[11px] font-bold">
                  5
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Statut Éditorial
                </h4>
              </div>

              <div>
                <Label htmlFor="news-statut" className="text-xs font-semibold">
                  Statut éditorial *
                </Label>
                <Select value={statut} onValueChange={(val) => setStatut(val as NewsStatus)}>
                  <SelectTrigger id="news-statut" className="mt-1.5 h-10 rounded-xl text-xs bg-card">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs">
                    {(Object.keys(NEWS_STATUS_LABELS) as NewsStatus[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {NEWS_STATUS_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                disabled={isPending}
                className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2 shadow-xs"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <span>{isEditing ? "Enregistrer les modifications" : "Créer l'article"}</span>
                )}
              </Button>
            </DialogFooter>

          </form>
        </DialogContent>
      </Dialog>

      {/* Media Picker Dialog for Cover (Single) */}
      <MediaPickerDialog
        open={isCoverPickerOpen}
        onOpenChange={setIsCoverPickerOpen}
        multiple={false}
        selectedUrls={coverMedia ? [coverMedia.url] : []}
        onSelect={handleSelectCover}
        title="Choisir l'image de couverture"
        description="Sélectionnez la photo principale qui illustrera cet article sur la vitrine publique."
      />

      {/* Media Picker Dialog for Gallery (Multiple) */}
      <MediaPickerDialog
        open={isGalleryPickerOpen}
        onOpenChange={setIsGalleryPickerOpen}
        multiple={true}
        selectedUrls={galleryMedias.map((m) => m.url)}
        onSelect={handleSelectGallery}
        title="Ajouter des photos à l'album de l'article"
        description="Sélectionnez toutes les images que vous souhaitez intégrer dans la galerie de cet article."
      />
    </>
  )
}
