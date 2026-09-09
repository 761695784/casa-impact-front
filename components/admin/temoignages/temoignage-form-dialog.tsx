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
import { TESTIMONIAL_STATUS_LABELS } from "@/types/enums"
import { usePrograms } from "@/hooks/use-programs"
import { useCreateTestimonial, useUpdateTestimonial } from "@/hooks/use-testimonials"
import { useAttachMedia, useDetachMedia } from "@/hooks/use-media"
import { MediaPickerDialog } from "@/components/admin/media/media-picker-dialog"
import { showValidationErrorAlert, showSuccessAlert, showErrorAlert } from "@/lib/alerts"
import { FormFieldError } from "@/components/ui/form-field-error"
import { ApiError } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import { Quote, Loader2, Image as ImageIcon, User } from "lucide-react"
import type { Testimonial, Media } from "@/types/models"
import type { TestimonialStatus } from "@/types/enums"

interface TemoignageFormDialogProps {
  testimonial?: Testimonial | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const PHOTO_COLLECTION = "photo"

export function TemoignageFormDialog({
  testimonial,
  open,
  onOpenChange,
  onSuccess,
}: TemoignageFormDialogProps) {
  const isEditing = !!testimonial

  const createMutation = useCreateTestimonial()
  const updateMutation = useUpdateTestimonial()
  const attachMutation = useAttachMedia()
  const detachMutation = useDetachMedia()

  const { data: programsData } = usePrograms()
  const programs = programsData?.data || []

  const [auteur, setAuteur] = useState("")
  const [roleOrganisation, setRoleOrganisation] = useState("")
  const [citation, setCitation] = useState("")
  const [programId, setProgramId] = useState<string>("")
  const [statut, setStatut] = useState<TestimonialStatus>("publie")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Photo du témoin — rattachée à la fiche Testimonial via la médiathèque
  // partagée (collection "photo"), pas via le payload de création/mise à
  // jour. On garde l'id initial (issu de testimonial.media en édition)
  // pour ne synchroniser au moment de l'enregistrement que ce qui a
  // réellement changé (attach du remplacement, detach de l'ancienne).
  const [photoMedia, setPhotoMedia] = useState<Media | null>(null)
  const [initialPhotoId, setInitialPhotoId] = useState<number | null>(null)

  // Media Picker Dialog state
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false)

  useEffect(() => {
    setErrors({})
    if (testimonial) {
      setAuteur(testimonial.auteur || "")
      setRoleOrganisation(testimonial.role_organisation || "")
      setCitation(testimonial.citation || "")
      setProgramId(
        testimonial.program_id
          ? String(testimonial.program_id)
          : testimonial.program?.id
          ? String(testimonial.program.id)
          : ""
      )
      setStatut(testimonial.statut || "publie")

      const existingMedia = testimonial.media || []
      const photo =
        existingMedia.find((m) => m.collection === PHOTO_COLLECTION) || existingMedia[0] || null
      setPhotoMedia(photo)
      setInitialPhotoId(photo?.id ?? null)
    } else {
      setAuteur("")
      setRoleOrganisation("")
      setCitation("")
      setProgramId("")
      setStatut("publie")
      setPhotoMedia(null)
      setInitialPhotoId(null)
    }
  }, [testimonial, open])

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    attachMutation.isPending ||
    detachMutation.isPending

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[field]
        return updated
      })
    }
  }

  const handleSelectPhoto = (selected: Media[]) => {
    if (selected.length > 0) {
      setPhotoMedia(selected[0])
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!auteur.trim()) {
      newErrors.auteur = "Le nom du témoin est obligatoire."
    } else if (auteur.trim().length < 2) {
      newErrors.auteur = "Le nom doit comporter au moins 2 caractères."
    }

    if (!citation.trim()) {
      newErrors.citation = "Le texte du témoignage / retour d'expérience est obligatoire."
    } else if (citation.trim().length < 10) {
      newErrors.citation = "Le témoignage doit comporter au moins 10 caractères."
    }

    setErrors(newErrors)
    return newErrors
  }

  /**
   * Synchronise la photo avec la médiathèque une fois la fiche Testimonial
   * enregistrée (attach/detach uniquement si elle a changé). Une erreur ici
   * n'annule pas l'enregistrement du témoignage — déjà réussi à ce stade.
   */
  const syncPhoto = async (testimonialId: number) => {
    if (photoMedia?.id === (initialPhotoId ?? undefined)) return

    const tasks: Promise<unknown>[] = []

    if (initialPhotoId && initialPhotoId !== photoMedia?.id) {
      tasks.push(
        detachMutation.mutateAsync({
          mediaId: initialPhotoId,
          mediableType: "testimonial",
          mediableId: testimonialId,
          collection: PHOTO_COLLECTION,
        })
      )
    }

    if (photoMedia) {
      tasks.push(
        attachMutation.mutateAsync({
          mediaId: photoMedia.id,
          mediableType: "testimonial",
          mediableId: testimonialId,
          collection: PHOTO_COLLECTION,
          ordre: 0,
        })
      )
    }

    if (tasks.length === 0) return
    await Promise.all(tasks)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      showValidationErrorAlert("Formulaire de témoignage incomplet", validationErrors)
      return
    }

    const payload = {
      auteur: auteur.trim(),
      role_organisation: roleOrganisation.trim() || undefined,
      citation: citation.trim(),
      program_id: programId ? Number(programId) : undefined,
      statut,
    }

    try {
      let testimonialId: number

      if (isEditing && testimonial) {
        const updated = await updateMutation.mutateAsync({
          id: testimonial.id,
          payload,
        })
        testimonialId = updated.id
      } else {
        const created = await createMutation.mutateAsync(payload as Omit<Testimonial, "id">)
        testimonialId = created.id
      }

      try {
        await syncPhoto(testimonialId)
      } catch (photoErr) {
        showErrorAlert(
          "Témoignage enregistré, mais la photo n'a pas pu être rattachée",
          photoErr instanceof Error
            ? photoErr.message
            : "Réessayez de changer la photo depuis la fiche."
        )
        onOpenChange(false)
        onSuccess?.()
        return
      }

      showSuccessAlert(
        isEditing ? "Témoignage mis à jour" : "Témoignage enregistré",
        isEditing
          ? `Le témoignage de « ${auteur} » a été modifié avec succès.`
          : `Le témoignage de « ${auteur} » a été créé avec succès.`
      )
      onOpenChange(false)
      onSuccess?.()
    } catch (err: unknown) {
      if (err instanceof ApiError && err.errors) {
        const backendErrors: Record<string, string> = {}
        Object.entries(err.errors).forEach(([k, msgs]) => {
          backendErrors[k] = Array.isArray(msgs) ? msgs[0] : String(msgs)
        })
        setErrors(backendErrors)
        showValidationErrorAlert("Erreur de validation", backendErrors)
      } else {
        showErrorAlert(
          "Erreur d'enregistrement",
          err instanceof Error ? err.message : "Une erreur est survenue lors de l'enregistrement."
        )
      }
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl rounded-3xl p-6 sm:p-8">
          <DialogHeader className="space-y-1">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
              <Quote className="size-5" />
            </div>
            <DialogTitle className="font-display text-xl font-bold text-foreground">
              {isEditing ? "Modifier le témoignage" : "Nouveau témoignage"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {isEditing
                ? "Modifiez le retour d'expérience, la photo et l'identité du témoin."
                : "Ajoutez le témoignage d'un bénéficiaire, lauréat ou partenaire de Casa Impact."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 space-y-5">

            {/* Section 1 : Identité du Témoin */}
            <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-forest text-white text-[11px] font-bold">
                  1
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Identité du Témoin
                </h4>
              </div>

              <div>
                <Label htmlFor="temoin-auteur" className={cn("text-xs font-semibold", errors.auteur ? "text-destructive" : "")}>
                  Nom complet du témoin *
                </Label>
                <Input
                  id="temoin-auteur"
                  value={auteur}
                  onChange={(e) => {
                    setAuteur(e.target.value)
                    clearError("auteur")
                  }}
                  placeholder="ex. Amina Diallo"
                  aria-invalid={!!errors.auteur}
                  className={cn(
                    "mt-1.5 h-11 rounded-xl text-sm bg-card transition-colors",
                    errors.auteur ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5" : ""
                  )}
                />
                <FormFieldError error={errors.auteur} />
              </div>

              <div>
                <Label htmlFor="temoin-role-orga" className="text-xs font-semibold">
                  Rôle / Organisation
                </Label>
                <Input
                  id="temoin-role-orga"
                  value={roleOrganisation}
                  onChange={(e) => setRoleOrganisation(e.target.value)}
                  placeholder="ex. Lauréate Promotion 2025 — Coopérative Sédhiou"
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                />
              </div>
            </div>

            {/* Section 2 : Photo du Témoin (Médiathèque) */}
            <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-forest text-white text-[11px] font-bold">
                    2
                  </span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Photo du Témoin
                  </h4>
                </div>

                <Button
                  type="button"
                  onClick={() => setIsPhotoPickerOpen(true)}
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs font-bold gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                >
                  <ImageIcon className="size-3.5" />
                  <span>Choisir dans la médiathèque</span>
                </Button>
              </div>

              {photoMedia ? (
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-3.5">
                  <div className="flex items-center gap-4">
                    <div className="relative size-16 rounded-full overflow-hidden bg-secondary shrink-0 border-2 border-forest shadow-xs">
                      <img
                        src={photoMedia.url}
                        alt={auteur || "Photo du témoin"}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-forest/10 px-2.5 py-0.5 text-[10px] font-bold text-forest mb-1">
                        <User className="size-3" />
                        Photo de témoin active
                      </span>
                      <p className="text-xs font-bold text-foreground truncate">
                        {photoMedia.nom || photoMedia.nom_original}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsPhotoPickerOpen(true)}
                          className="h-7 rounded-lg text-xs font-semibold px-2 text-primary hover:bg-primary/10"
                        >
                          Changer
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setPhotoMedia(null)}
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
                  onClick={() => setIsPhotoPickerOpen(true)}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/60 p-5 text-center cursor-pointer hover:border-primary/50 hover:bg-secondary/60 transition-all group"
                >
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <ImageIcon className="size-4" />
                  </div>
                  <p className="mt-2 text-xs font-bold text-foreground">
                    Aucune photo de témoin sélectionnée
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Cliquez ici pour choisir un portrait dans la médiathèque
                  </p>
                </div>
              )}
            </div>

            {/* Section 3 : Citation & Programme */}
            <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-forest text-white text-[11px] font-bold">
                  3
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Témoignage & Diffusion
                </h4>
              </div>

              <div>
                <Label htmlFor="temoin-citation" className={cn("text-xs font-semibold", errors.citation ? "text-destructive" : "")}>
                  Citation / Retour d'expérience *
                </Label>
                <Textarea
                  id="temoin-citation"
                  rows={4}
                  value={citation}
                  onChange={(e) => {
                    setCitation(e.target.value)
                    clearError("citation")
                  }}
                  placeholder="Rédigez le texte du témoignage vécu avec Casa Impact..."
                  aria-invalid={!!errors.citation}
                  className={cn(
                    "mt-1.5 rounded-xl text-xs bg-card transition-colors",
                    errors.citation ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5" : ""
                  )}
                />
                <FormFieldError error={errors.citation} />
              </div>

              <div>
                <Label htmlFor="temoin-prog" className="text-xs font-semibold">
                  Programme associé (facultatif)
                </Label>
                <Select value={programId} onValueChange={(val) => setProgramId(val || "")}>
                  <SelectTrigger id="temoin-prog" className="mt-1.5 h-10 w-full rounded-xl text-xs bg-card truncate">
                    <SelectValue placeholder="Aucun programme" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs w-full min-w-[240px]">
                    <SelectItem value="none">Aucun programme spécifique</SelectItem>
                    {programs.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.titre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-1">
                <Label htmlFor="temoin-statut" className="text-xs font-semibold">
                  Statut de publication *
                </Label>
                <Select value={statut} onValueChange={(val) => setStatut(val as TestimonialStatus)}>
                  <SelectTrigger id="temoin-statut" className="mt-1.5 h-10 w-full rounded-xl text-xs bg-card">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs">
                    {(Object.keys(TESTIMONIAL_STATUS_LABELS) as TestimonialStatus[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {TESTIMONIAL_STATUS_LABELS[key]}
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
                  <span>{isEditing ? "Enregistrer les modifications" : "Créer le témoignage"}</span>
                )}
              </Button>
            </DialogFooter>

          </form>
        </DialogContent>
      </Dialog>

      {/* Media Picker Dialog for Testimonial Photo (Single Select) */}
      <MediaPickerDialog
        open={isPhotoPickerOpen}
        onOpenChange={setIsPhotoPickerOpen}
        multiple={false}
        selectedUrls={photoMedia ? [photoMedia.url] : []}
        onSelect={handleSelectPhoto}
        title="Choisir la photo du témoin"
        description="Sélectionnez un portrait officiel ou une photo d'immersion pour illustrer ce témoignage."
      />
    </>
  )
}
