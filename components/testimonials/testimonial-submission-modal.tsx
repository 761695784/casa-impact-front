"use client"

import React, { useState, useRef } from "react"
import Image from "next/image"
import { useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import {
  Star,
  Sparkles,
  CheckCircle2,
  Send,
  HeartHandshake,
  Loader2,
  UploadCloud,
  Camera,
  Trash2,
  User,
} from "lucide-react"
import { testimonialsService } from "@/lib/services/testimonials.service"
import { showValidationErrorAlert, showSuccessAlert, showErrorAlert } from "@/lib/alerts"
import { FormFieldError } from "@/components/ui/form-field-error"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface TestimonialSubmissionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TestimonialSubmissionModal({
  open,
  onOpenChange,
}: TestimonialSubmissionModalProps) {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)

  // Photo uploadée par l'utilisateur
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>("")

  const [formData, setFormData] = useState({
    nom: "",
    role: "",
    region: "Ziguinchor",
    programme: "Académie du Leadership Jeune",
    citation: "",
  })
  const [customProgramme, setCustomProgramme] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[field]
        return updated
      })
    }
  }

  // Gestion du téléversement d'image locale
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5 Mo.")
      return
    }

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedPhoto(event.target.result as string)
        toast.success("Photo chargée avec succès !")
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    setUploadedPhoto(null)
    setFileName("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nom.trim()) {
      newErrors.nom = "Votre nom et prénom sont obligatoires."
    } else if (formData.nom.trim().length < 2) {
      newErrors.nom = "Votre nom doit comporter au moins 2 caractères."
    }

    if (formData.programme === "autre" && !customProgramme.trim()) {
      newErrors.customProgramme = "Veuillez préciser le nom du programme suivi."
    }

    if (!formData.citation.trim()) {
      newErrors.citation = "Le texte de votre témoignage est obligatoire."
    } else if (formData.citation.trim().length < 15) {
      newErrors.citation = "Votre témoignage doit comporter au moins 15 caractères pour être significatif."
    }

    setErrors(newErrors)
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      showValidationErrorAlert("Formulaire incomplet", validationErrors)
      return
    }

    const programmeFinal =
      formData.programme === "autre"
        ? (customProgramme.trim() || "Autre action communautaire")
        : formData.programme

    setIsSubmitting(true)
    try {
      // Création réelle du témoignage
      await testimonialsService.createTestimonial({
        auteur: formData.nom.trim(),
        role_organisation: formData.role.trim()
          ? `${formData.role.trim()} • ${formData.region}`
          : `Bénéficiaire • ${formData.region}`,
        citation: formData.citation.trim(),
        contexte: programmeFinal,
        statut: "publie",
        media: uploadedPhoto
          ? [
              {
                id: Date.now(),
                collection: "testimonials",
                url: uploadedPhoto,
                nom_original: fileName || "photo-temoignage.jpg",
                mime: "image/jpeg",
                taille: 150000,
              },
            ]
          : [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      // Invalidation immédiate pour rafraîchir la liste en direct sur la page
      queryClient.invalidateQueries({ queryKey: ["testimonials"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] })

      showSuccessAlert("Témoignage publié !", "Merci beaucoup pour votre témoignage ! Il apparaît maintenant fièrement sur la plateforme.")
      setIsSubmitted(true)
    } catch (err) {
      showErrorAlert("Erreur lors de la publication", "Une erreur est survenue lors de l'enregistrement de votre témoignage.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setFormData({
      nom: "",
      role: "",
      region: "Ziguinchor",
      programme: "Académie du Leadership Jeune",
      citation: "",
    })
    setCustomProgramme("")
    setRating(5)
    setUploadedPhoto(null)
    setFileName("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px] w-[95vw] max-h-[90vh] p-0 flex flex-col overflow-hidden rounded-3xl bg-card border-border/80 shadow-2xl">
        {!isSubmitted ? (
          <>
            {/* Header */}
            <DialogHeader className="p-6 sm:p-7 border-b border-border/70 shrink-0 bg-secondary/15">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-0.5 text-xs font-bold text-earth border border-accent/30">
                  <Sparkles className="size-3.5 text-accent" />
                  Récit communautaire
                </span>
              </div>
              <DialogTitle className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                Partagez votre témoignage
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">
                Racontez votre expérience avec Casa Impact. Votre retour sera directement partagé avec la communauté.
              </DialogDescription>
            </DialogHeader>

            {/* Scrollable Form Body */}
            <form
              id="testimonial-form"
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-5"
            >
              {/* Note / Étoiles */}
              <div className="rounded-2xl border border-border/80 bg-secondary/20 p-3.5 flex items-center justify-between">
                <div>
                  <Label className="text-xs font-bold text-foreground block">Votre note globale</Label>
                  <span className="text-xs text-muted-foreground font-medium">
                    {rating} sur 5 étoiles
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-0.5 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`size-6 ${
                          star <= (hoverRating ?? rating)
                            ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                            : "text-muted-foreground/30"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Téléversement de sa propre photo */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Camera className="size-3.5 text-primary" />
                  Votre photo ou portrait (optionnel)
                </Label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                  onChange={handlePhotoChange}
                />

                {!uploadedPhoto ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-border hover:border-primary/60 bg-secondary/20 hover:bg-secondary/40 cursor-pointer transition-all text-center"
                  >
                    <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <UploadCloud className="size-6" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-foreground">
                      Cliquez pour importer ou glisser votre photo
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Formats acceptés : JPG, PNG ou WebP (max 5 Mo)
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-2xl border border-border bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <div className="relative size-14 rounded-full overflow-hidden ring-2 ring-accent/60 shrink-0 shadow-xs">
                        <Image
                          src={uploadedPhoto}
                          alt="Aperçu photo"
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate max-w-[200px]">
                          {fileName || "Photo sélectionnée"}
                        </p>
                        <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="size-3" /> Prête pour la publication
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-xl text-xs h-8 px-3"
                      >
                        Changer
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemovePhoto}
                        className="rounded-xl text-xs text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Nom & Prénom */}
              <div className="space-y-1.5">
                <Label htmlFor="author-name" className={cn("text-xs font-bold text-foreground", errors.nom ? "text-destructive" : "")}>
                  Nom et Prénom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="author-name"
                  placeholder="Ex : Mariama Sadio"
                  value={formData.nom}
                  onChange={(e) => {
                    setFormData({ ...formData, nom: e.target.value })
                    clearError("nom")
                  }}
                  aria-invalid={!!errors.nom}
                  className={cn(
                    "rounded-xl border-border bg-background focus:ring-primary h-11 transition-colors",
                    errors.nom ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5" : ""
                  )}
                />
                <FormFieldError error={errors.nom} />
              </div>

              {/* Rôle / Fonction */}
              <div className="space-y-1.5">
                <Label htmlFor="author-role" className="text-xs font-bold text-foreground">
                  Fonction / Structure ou Métier
                </Label>
                <Input
                  id="author-role"
                  placeholder="Ex : Fondatrice de Coopérative ou Étudiante en Gestion"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="rounded-xl border-border bg-background focus:ring-primary h-11"
                />
              </div>

              {/* Région & Programme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground">Région d'ancrage</Label>
                  <Select
                    value={formData.region}
                    onValueChange={(val) => setFormData({ ...formData, region: val || "" })}
                  >
                    <SelectTrigger className="rounded-xl border-border bg-background h-11 w-full">
                      <SelectValue placeholder="Choisir une région" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl text-xs w-full min-w-[200px]">
                      <SelectItem value="Ziguinchor">Ziguinchor</SelectItem>
                      <SelectItem value="Sédhiou">Sédhiou</SelectItem>
                      <SelectItem value="Kolda">Kolda</SelectItem>
                      <SelectItem value="Diaspora / Autre">Diaspora / Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground">Programme suivi</Label>
                  <Select
                    value={formData.programme}
                    onValueChange={(val) => {
                      setFormData({ ...formData, programme: val || "" })
                      if (val !== "autre") clearError("customProgramme")
                    }}
                  >
                    <SelectTrigger className="rounded-xl border-border bg-background h-11 w-full">
                      <SelectValue placeholder="Choisir un programme" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl text-xs w-full min-w-[240px]">
                      <SelectItem value="Académie du Leadership Jeune">
                        Académie du Leadership
                      </SelectItem>
                      <SelectItem value="Incubateur Entrepreneuriat & Innovation">
                        Entrepreneuriat & Innovation
                      </SelectItem>
                      <SelectItem value="Festival des Talents de Casamance">
                        Artisanat & Culture
                      </SelectItem>
                      <SelectItem value="Pôle Agro-écologie & Climat">
                        Agro-écologie & Terroir
                      </SelectItem>
                      <SelectItem value="Action Citoyenne & Caravane">
                        Action Citoyenne
                      </SelectItem>
                      <SelectItem value="autre" className="font-semibold text-primary">
                        + Autre programme (saisir manuellement)
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {formData.programme === "autre" && (
                    <div className="mt-2.5 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                      <Label htmlFor="custom-programme" className={cn("text-xs font-semibold text-primary", errors.customProgramme ? "text-destructive" : "")}>
                        Précisez le nom de votre programme / action <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="custom-programme"
                        placeholder="Ex : Caravane Éco-responsable, Bourse Tremplin..."
                        value={customProgramme}
                        onChange={(e) => {
                          setCustomProgramme(e.target.value)
                          clearError("customProgramme")
                        }}
                        aria-invalid={!!errors.customProgramme}
                        className={cn(
                          "rounded-xl border-primary/50 bg-background focus:ring-primary h-10 transition-colors",
                          errors.customProgramme ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5" : ""
                        )}
                      />
                      <FormFieldError error={errors.customProgramme} />
                    </div>
                  )}
                </div>
              </div>

              {/* Message / Citation */}
              <div className="space-y-1.5">
                <Label htmlFor="author-citation" className={cn("text-xs font-bold text-foreground", errors.citation ? "text-destructive" : "")}>
                  Votre Témoignage <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="author-citation"
                  placeholder="Racontez votre expérience, ce que ce programme vous a apporté et son impact sur votre projet ou votre région..."
                  rows={4}
                  value={formData.citation}
                  onChange={(e) => {
                    setFormData({ ...formData, citation: e.target.value })
                    clearError("citation")
                  }}
                  aria-invalid={!!errors.citation}
                  className={cn(
                    "rounded-xl border-border bg-background focus:ring-primary leading-relaxed break-words [overflow-wrap:anywhere] transition-colors",
                    errors.citation ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5" : ""
                  )}
                />
                <FormFieldError error={errors.citation} />
              </div>
            </form>

            {/* Sticky Action Footer */}
            <div className="p-4 sm:p-5 border-t border-border/70 bg-secondary/10 flex items-center justify-end gap-3 shrink-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="rounded-full px-5"
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                form="testimonial-form"
                disabled={isSubmitting}
                className="rounded-full bg-primary text-white hover:bg-primary/90 font-bold px-7 shadow-md shadow-primary/20 h-11"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Publication en cours...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 size-4" />
                    Publier mon témoignage
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="p-8 sm:p-10 text-center space-y-5 my-auto">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50 shadow-md">
              <CheckCircle2 className="size-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                Témoignage publié avec succès !
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground max-w-md mx-auto">
                Merci pour votre contribution. Votre récit d'expérience apparaît désormais fièrement
                sur la page officielle de Casa Impact.
              </p>
            </div>

            <div className="pt-3 flex justify-center">
              <Button
                onClick={handleReset}
                className="rounded-full bg-primary text-white font-bold px-8 h-12 shadow-lg hover:scale-105 transition-all"
              >
                <HeartHandshake className="mr-2 size-5" />
                Voir mon témoignage sur la page
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
