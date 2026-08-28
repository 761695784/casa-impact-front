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
import { Quote, Loader2, Compass } from "lucide-react"
import type { Testimonial } from "@/types/models"
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
  const [fonction, setFonction] = useState("")
  const [organisation, setOrganisation] = useState("")
  const [contenu, setContenu] = useState("")
  const [photo, setPhoto] = useState("")
  const [programmeId, setProgrammeId] = useState<string>("")
  const [ordre, setOrdre] = useState<string>("1")
  const [statut, setStatut] = useState<TestimonialStatus>("publie")

  useEffect(() => {
    if (testimonial) {
      setAuteur(testimonial.auteur || "")
      setFonction(testimonial.fonction || "")
      setOrganisation(testimonial.organisation || "")
      setContenu(testimonial.contenu || "")
      setPhoto(testimonial.photo || "")
      setProgrammeId(
        testimonial.programme_id ? String(testimonial.programme_id) : testimonial.programme?.id ? String(testimonial.programme.id) : ""
      )
      setOrdre(testimonial.ordre ? String(testimonial.ordre) : "1")
      setStatut(testimonial.statut || "publie")
    } else {
      setAuteur("")
      setFonction("")
      setOrganisation("")
      setContenu("")
      setPhoto("")
      setProgrammeId("")
      setOrdre("1")
      setStatut("publie")
    }
  }, [testimonial, open])

  const isPending = createMutation.isPending || updateMutation.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      auteur,
      fonction: fonction || undefined,
      organisation: organisation || undefined,
      contenu,
      photo: photo || undefined,
      programme_id: programmeId ? Number(programmeId) : undefined,
      ordre: Number(ordre) || 1,
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
              ? "Modifiez le retour d'expérience et la personne témoin."
              : "Ajoutez le témoignage d'un bénéficiaire, lauréat ou partenaire de Casa Impact."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
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
                className="mt-1.5 h-11 rounded-xl text-sm"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="temoin-fonction" className="text-xs font-semibold">
                  Titre / Qualité
                </Label>
                <Input
                  id="temoin-fonction"
                  value={fonction}
                  onChange={(e) => setFonction(e.target.value)}
                  placeholder="ex. Lauréate Promotion 2025"
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                />
              </div>

              <div>
                <Label htmlFor="temoin-orga" className="text-xs font-semibold">
                  Organisation / Structure
                </Label>
                <Input
                  id="temoin-orga"
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                  placeholder="ex. Coopérative Sédhiou"
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="temoin-contenu" className="text-xs font-semibold">
                Citation / Retour d'expérience *
              </Label>
              <Textarea
                id="temoin-contenu"
                required
                rows={5}
                value={contenu}
                onChange={(e) => setContenu(e.target.value)}
                placeholder="Rédigez le texte du témoignage vécu avec Casa Impact..."
                className="mt-1.5 rounded-xl text-xs"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="temoin-prog" className="text-xs font-semibold">
                  Programme associé (facultatif)
                </Label>
                <Select value={programmeId} onValueChange={(val) => setProgrammeId(val || "")}>
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

              <div>
                <Label htmlFor="temoin-ordre" className="text-xs font-semibold">
                  Ordre d'affichage
                </Label>
                <Input
                  id="temoin-ordre"
                  type="number"
                  min={1}
                  value={ordre}
                  onChange={(e) => setOrdre(e.target.value)}
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="temoin-photo" className="text-xs font-semibold">
                Photo (chemin ou URL)
              </Label>
              <Input
                id="temoin-photo"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                placeholder="ex. /assets/team/placeholder.svg"
                className="mt-1.5 h-10 rounded-xl text-xs bg-card"
              />
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
                <span>{isEditing ? "Enregistrer les modifications" : "Ajouter le témoignage"}</span>
              )}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}
