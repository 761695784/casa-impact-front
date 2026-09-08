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
import { MediaPickerDialog } from "@/components/admin/media/media-picker-dialog"
import { resolveMediaUrl } from "@/lib/format"
import { Quote, Loader2, Image as ImageIcon, User } from "lucide-react"
import type { Testimonial, Media } from "@/types/models"
import type { TestimonialStatus } from "@/types/enums"

interface TemoignageFormDialogProps {
  testimonial?: Testimonial | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function TemoignageFormDialog({
  testimonial,
  open,
  onOpenChange,
  onSuccess,
}: TemoignageFormDialogProps) {
  const isEditing = !!testimonial

  const createMutation = useCreateTestimonial()
  const updateMutation = useUpdateTestimonial()

  const { data: programsData } = usePrograms()
  const programs = programsData?.data || []

  const [auteur, setAuteur] = useState("")
  // Le backend combine fonction + organisation en un seul champ `role_organisation`.
  const [roleOrganisation, setRoleOrganisation] = useState("")
  const [citation, setCitation] = useState("")
  // NOTE : pas de champ `photo` direct sur Testimonial (voir `media`). Ce
  // champ sert uniquement à prévisualiser une image existante ; il n'est
  // PAS envoyé au backend — l'association réelle passe par le module
  // Médiathèque (TODO : intégration Médiathèque plutôt qu'upload en ligne).
  const [photo, setPhoto] = useState("")
  const [programId, setProgramId] = useState<string>("")
  const [statut, setStatut] = useState<TestimonialStatus>("publie")

  // Media Picker Dialog state
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false)

  useEffect(() => {
    if (testimonial) {
      setAuteur(testimonial.auteur || "")
      setRoleOrganisation(testimonial.role_organisation || "")
      setCitation(testimonial.citation || "")
      setPhoto(resolveMediaUrl(testimonial.media?.[0]?.url) || "")
      setProgramId(
        testimonial.program_id
          ? String(testimonial.program_id)
          : testimonial.program?.id
          ? String(testimonial.program.id)
          : ""
      )
      setStatut(testimonial.statut || "publie")
    } else {
      setAuteur("")
      setRoleOrganisation("")
      setCitation("")
      setPhoto("")
      setProgramId("")
      setStatut("publie")
    }
  }, [testimonial, open])

  const isPending = createMutation.isPending || updateMutation.isPending

  const handleSelectPhoto = (selected: Media[]) => {
    if (selected.length > 0) {
      setPhoto(selected[0].url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // `photo` (Médiathèque) n'est pas un champ du modèle Testimonial : non inclus.
    const payload = {
      auteur,
      role_organisation: roleOrganisation || undefined,
      citation,
      program_id: programId ? Number(programId) : undefined,
      statut,
    }

    if (isEditing && testimonial) {
      await updateMutation.mutateAsync({
        id: testimonial.id,
        payload,
      })
    } else {
      await createMutation.mutateAsync(payload as Omit<Testimonial, "id">)
    }

    onOpenChange(false)
    onSuccess?.()
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
                <Label htmlFor="temoin-auteur" className="text-xs font-semibold">
                  Nom complet du témoin *
                </Label>
                <Input
                  id="temoin-auteur"
                  required
                  value={auteur}
                  onChange={(e) => setAuteur(e.target.value)}
                  placeholder="ex. Amina Diallo"
                  className="mt-1.5 h-11 rounded-xl text-sm bg-card"
                />
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

              {photo ? (
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-3.5">
                  <div className="flex items-center gap-4">
                    <div className="relative size-16 rounded-full overflow-hidden bg-secondary shrink-0 border-2 border-forest shadow-xs">
                      <img
                        src={photo}
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
                        {photo}
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
                          onClick={() => setPhoto("")}
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
                <Label htmlFor="temoin-citation" className="text-xs font-semibold">
                  Citation / Retour d'expérience *
                </Label>
                <Textarea
                  id="temoin-citation"
                  required
                  rows={4}
                  value={citation}
                  onChange={(e) => setCitation(e.target.value)}
                  placeholder="Rédigez le texte du témoignage vécu avec Casa Impact..."
                  className="mt-1.5 rounded-xl text-xs bg-card"
                />
              </div>

              <div>
                <Label htmlFor="temoin-prog" className="text-xs font-semibold">
                  Programme associé (facultatif)
                </Label>
                <Select value={programId} onValueChange={(val) => setProgramId(val || "")}>
                  <SelectTrigger id="temoin-prog" className="mt-1.5 h-10 rounded-xl text-xs bg-card truncate">
                    <SelectValue placeholder="Aucun programme" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs max-w-xs">
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
                  <SelectTrigger id="temoin-statut" className="mt-1.5 h-10 rounded-xl text-xs bg-card">
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
        selectedUrls={photo ? [photo] : []}
        onSelect={handleSelectPhoto}
        title="Choisir la photo du témoin"
        description="Sélectionnez un portrait officiel ou une photo d'immersion pour illustrer ce témoignage."
      />
    </>
  )
}
