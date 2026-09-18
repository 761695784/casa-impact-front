"use client"

import React, { useState, useEffect, useRef } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MEMBERSHIP_REGION_LABELS,
  CONTRIBUTION_DOMAIN_LABELS,
  CONTRIBUTION_TYPE_LABELS,
} from "@/types/enums"
import type { MembershipRegion, ContributionDomain, ContributionType } from "@/types/enums"
import { useCreateMembership } from "@/hooks/use-memberships"
import { showValidationErrorAlert, showErrorAlert } from "@/lib/alerts"
import { FormFieldError } from "@/components/ui/form-field-error"
import { compressImageToWebP } from "@/lib/image-processing"
import { ApiError } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import { UserPlus, ImageIcon, Loader2, X, BadgeCheck, History } from "lucide-react"
import { PhotoCropModal } from "./photo-crop-modal"

/** Miroir de MembershipRegion::estEnCasamance() côté backend. */
const CASAMANCE_REGIONS = new Set<MembershipRegion>(["ziguinchor", "sedhiou", "kolda"])

interface MembershipFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Ajout MANUEL d'un membre depuis le panneau admin — réservé aux membres
 * antérieurs au site (accord explicite du 2026-08-24 : cette saisie ne
 * repasse jamais par le cycle "en attente de paiement", le membre est créé
 * directement `validee`). Deux points spécifiques à ce formulaire (accord
 * du 2026-09-11) :
 *   - Champ "ID existant" optionnel : à renseigner UNIQUEMENT si ce membre
 *     a déjà une carte imprimée (garde l'ID tel quel) ; laissé vide, le
 *     serveur en génère un nouveau automatiquement.
 *   - Case "Envoyer l'email de bienvenue" décochée par défaut : un ajout
 *     manuel concerne presque toujours un membre historique, à qui l'email
 *     "adhésion reçue aujourd'hui" n'a pas de sens.
 * Pour importer en masse l'historique complet (fichier Excel), voir la
 * commande Artisan ponctuelle côté backend — ce formulaire sert aux ajouts
 * au coup par coup (un oubli, une correction...).
 */
export function MembershipFormDialog({ open, onOpenChange }: MembershipFormDialogProps) {
  const createMutation = useCreateMembership()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [numeroMembre, setNumeroMembre] = useState("")
  const [nomComplet, setNomComplet] = useState("")
  const [email, setEmail] = useState("")
  const [telephone, setTelephone] = useState("")
  const [profession, setProfession] = useState("")
  const [region, setRegion] = useState<MembershipRegion | "">("")
  const [departement, setDepartement] = useState("")
  const [domaineContribution, setDomaineContribution] = useState<ContributionDomain | "">("")
  const [typeContribution, setTypeContribution] = useState<ContributionType | "">("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
  // Étape de recadrage (accord du 2026-09-18) — voir handlePhotoChange/
  // handlePhotoCropped et membership-photo-dialog.tsx pour le même flux.
  const [rawPhotoFile, setRawPhotoFile] = useState<File | null>(null)
  const [isPhotoCropOpen, setIsPhotoCropOpen] = useState(false)
  const [suggestionsCompetences, setSuggestionsCompetences] = useState("")
  const [adminNote, setAdminNote] = useState("")
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const reset = () => {
    setNumeroMembre("")
    setNomComplet("")
    setEmail("")
    setTelephone("")
    setProfession("")
    setRegion("")
    setDepartement("")
    setDomaineContribution("")
    setTypeContribution("")
    setPhoto(null)
    setPhotoPreview(null)
    setRawPhotoFile(null)
    setIsPhotoCropOpen(false)
    setSuggestionsCompetences("")
    setAdminNote("")
    setSendWelcomeEmail(false)
    setErrors({})
  }

  useEffect(() => {
    if (open) reset()
  }, [open])

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
    }
  }, [photoPreview])

  const isCasamance = region !== "" && CASAMANCE_REGIONS.has(region)

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[field]
        return updated
      })
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    clearError("photo")
    setRawPhotoFile(file)
    setIsPhotoCropOpen(true)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handlePhotoCropped = async (croppedFile: File) => {
    setIsCompressingPhoto(true)
    try {
      const compressed = await compressImageToWebP(croppedFile)
      if (photoPreview) URL.revokeObjectURL(photoPreview)
      setPhoto(compressed)
      setPhotoPreview(URL.createObjectURL(compressed))
    } finally {
      setIsCompressingPhoto(false)
    }
  }

  const removePhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhoto(null)
    setPhotoPreview(null)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!nomComplet.trim()) {
      newErrors.nom_complet = "Le nom complet est obligatoire."
    }
    if (!email.trim()) {
      newErrors.email = "L'adresse email est obligatoire."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "L'adresse email n'est pas valide."
    }
    if (!telephone.trim()) {
      newErrors.telephone = "Le numéro de téléphone / WhatsApp est obligatoire."
    }
    if (!region) {
      newErrors.region = "La région de résidence est obligatoire."
    }
    if (region && CASAMANCE_REGIONS.has(region) && !departement.trim()) {
      newErrors.departement = "Le département est obligatoire pour une région de Casamance."
    }
    if (!photo) {
      newErrors.photo = "La photo est obligatoire (nécessaire pour la carte de membre)."
    }
    if (numeroMembre.trim() && !/^[A-Za-z0-9-]+$/.test(numeroMembre.trim())) {
      newErrors.numero_membre = "L'ID ne doit contenir que des lettres, chiffres et tirets."
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

    try {
      await createMutation.mutateAsync({
        numero_membre: numeroMembre.trim() || undefined,
        nom_complet: nomComplet.trim(),
        email: email.trim(),
        telephone: telephone.trim(),
        profession: profession.trim() || undefined,
        region: region as MembershipRegion,
        departement: departement.trim() || undefined,
        domaine_contribution: domaineContribution || undefined,
        type_contribution: typeContribution || undefined,
        photo: photo as File,
        suggestions_competences: suggestionsCompetences.trim() || undefined,
        admin_note: adminNote.trim() || undefined,
        send_welcome_email: sendWelcomeEmail,
      })
      onOpenChange(false)
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-1">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
            <UserPlus className="size-5" />
          </div>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            Ajouter un membre
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Pour un membre ayant adhéré avant la mise en ligne du site. L'adhésion est
            créée directement au statut « Validée », sans passer par l'attente de paiement.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          {/* Section 1 : Identité & Contact */}
          <div className="space-y-3.5 rounded-3xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-forest text-white text-[11px] font-bold">
                1
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Identité & Contact
              </h4>
            </div>

            <div>
              <Label htmlFor="mb-nom" className={cn("text-xs font-semibold", errors.nom_complet ? "text-destructive" : "")}>
                Nom complet *
              </Label>
              <Input
                id="mb-nom"
                value={nomComplet}
                onChange={(e) => {
                  setNomComplet(e.target.value)
                  clearError("nom_complet")
                }}
                placeholder="ex. Fatoumata Dramé"
                aria-invalid={!!errors.nom_complet}
                className={cn(
                  "mt-1.5 h-11 rounded-xl text-sm bg-card transition-colors",
                  errors.nom_complet ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5" : ""
                )}
              />
              <FormFieldError error={errors.nom_complet} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="mb-email" className={cn("text-xs font-semibold", errors.email ? "text-destructive" : "")}>
                  Adresse email *
                </Label>
                <Input
                  id="mb-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    clearError("email")
                  }}
                  placeholder="exemple@mail.com"
                  aria-invalid={!!errors.email}
                  className={cn(
                    "mt-1.5 h-11 rounded-xl text-sm bg-card transition-colors",
                    errors.email ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5" : ""
                  )}
                />
                <FormFieldError error={errors.email} />
              </div>

              <div>
                <Label htmlFor="mb-tel" className={cn("text-xs font-semibold", errors.telephone ? "text-destructive" : "")}>
                  Téléphone / WhatsApp *
                </Label>
                <Input
                  id="mb-tel"
                  value={telephone}
                  onChange={(e) => {
                    setTelephone(e.target.value)
                    clearError("telephone")
                  }}
                  placeholder="77 123 45 67"
                  aria-invalid={!!errors.telephone}
                  className={cn(
                    "mt-1.5 h-11 rounded-xl text-sm bg-card transition-colors",
                    errors.telephone ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5" : ""
                  )}
                />
                <FormFieldError error={errors.telephone} />
              </div>
            </div>

            <div>
              <Label htmlFor="mb-profession" className="text-xs font-semibold">
                Profession / Domaine d'activité
              </Label>
              <Input
                id="mb-profession"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="ex. Enseignante, Entrepreneur..."
                className="mt-1.5 h-11 rounded-xl text-sm bg-card"
              />
            </div>
          </div>

          {/* Section 2 : Photo */}
          <div className="space-y-3.5 rounded-3xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-forest text-white text-[11px] font-bold">
                2
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Photo (pour la carte de membre) *
              </h4>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />

            {photoPreview ? (
              <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3.5">
                <div className="relative size-20 rounded-2xl overflow-hidden bg-secondary shrink-0 border border-border shadow-xs">
                  <img src={photoPreview} alt="Aperçu photo" className="size-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground truncate">{photo?.name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-7 rounded-lg text-xs font-semibold px-2 text-primary hover:bg-primary/10"
                    >
                      Changer
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removePhoto}
                      className="h-7 rounded-lg text-xs font-semibold px-2 text-destructive hover:bg-destructive/10"
                    >
                      <X className="size-3.5 mr-1" />
                      Retirer
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => !isCompressingPhoto && fileInputRef.current?.click()}
                className={cn(
                  "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all group",
                  errors.photo
                    ? "border-destructive/50 bg-destructive/5"
                    : "border-border bg-card/60 hover:border-primary/50 hover:bg-secondary/60"
                )}
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  {isCompressingPhoto ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <ImageIcon className="size-5" />
                  )}
                </div>
                <p className="mt-2 text-xs font-bold text-foreground">
                  {isCompressingPhoto ? "Optimisation de la photo..." : "Aucune photo sélectionnée"}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Cliquez pour importer une photo (portrait de préférence)
                </p>
              </div>
            )}
            <FormFieldError error={errors.photo} />
          </div>

          {/* Section 3 : Région & Contribution */}
          <div className="space-y-3.5 rounded-3xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-forest text-white text-[11px] font-bold">
                3
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Région & Contribution
              </h4>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="mb-region" className={cn("text-xs font-semibold", errors.region ? "text-destructive" : "")}>
                  Région de résidence *
                </Label>
                <Select
                  value={region}
                  onValueChange={(val) => {
                    setRegion(val as MembershipRegion)
                    clearError("region")
                  }}
                >
                  <SelectTrigger id="mb-region" className="mt-1.5 h-10 w-full rounded-xl text-xs bg-card" aria-invalid={!!errors.region}>
                    <SelectValue placeholder="Choisir une région" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs">
                    {(Object.keys(MEMBERSHIP_REGION_LABELS) as MembershipRegion[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {MEMBERSHIP_REGION_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormFieldError error={errors.region} />
              </div>

              <div>
                <Label htmlFor="mb-dept" className={cn("text-xs font-semibold", errors.departement ? "text-destructive" : "")}>
                  Département {isCasamance ? "*" : "(Casamance uniquement)"}
                </Label>
                <Input
                  id="mb-dept"
                  value={departement}
                  onChange={(e) => {
                    setDepartement(e.target.value)
                    clearError("departement")
                  }}
                  disabled={!isCasamance}
                  placeholder={isCasamance ? "ex. Bignona" : "—"}
                  aria-invalid={!!errors.departement}
                  className={cn(
                    "mt-1.5 h-10 rounded-xl text-xs bg-card transition-colors",
                    errors.departement ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5" : ""
                  )}
                />
                <FormFieldError error={errors.departement} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="mb-domaine" className="text-xs font-semibold">
                  Domaine de contribution
                </Label>
                <Select value={domaineContribution} onValueChange={(val) => setDomaineContribution(val as ContributionDomain)}>
                  <SelectTrigger id="mb-domaine" className="mt-1.5 h-10 w-full rounded-xl text-xs bg-card truncate">
                    <SelectValue placeholder="Non renseigné" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs">
                    {(Object.keys(CONTRIBUTION_DOMAIN_LABELS) as ContributionDomain[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {CONTRIBUTION_DOMAIN_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="mb-type" className="text-xs font-semibold">
                  Type de contribution
                </Label>
                <Select value={typeContribution} onValueChange={(val) => setTypeContribution(val as ContributionType)}>
                  <SelectTrigger id="mb-type" className="mt-1.5 h-10 w-full rounded-xl text-xs bg-card">
                    <SelectValue placeholder="Membre" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs">
                    {(Object.keys(CONTRIBUTION_TYPE_LABELS) as ContributionType[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {CONTRIBUTION_TYPE_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="mb-suggestions" className="text-xs font-semibold">
                Suggestions / compétences particulières
              </Label>
              <Textarea
                id="mb-suggestions"
                rows={2}
                value={suggestionsCompetences}
                onChange={(e) => setSuggestionsCompetences(e.target.value)}
                placeholder="Optionnel"
                className="mt-1.5 rounded-xl resize-none text-xs bg-card"
              />
            </div>
          </div>

          {/* Section 4 : Membre historique */}
          <div className="space-y-3.5 rounded-3xl border border-amber-500/30 bg-amber-50/50 p-4 sm:p-5 dark:bg-amber-500/5">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-amber-500 text-white text-[11px] font-bold">
                4
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <History className="size-3.5 text-amber-600" />
                Membre historique (avant le site)
              </h4>
            </div>

            <div>
              <Label htmlFor="mb-numero" className={cn("text-xs font-semibold", errors.numero_membre ? "text-destructive" : "")}>
                ID existant sur la carte déjà imprimée
              </Label>
              <Input
                id="mb-numero"
                value={numeroMembre}
                onChange={(e) => {
                  setNumeroMembre(e.target.value)
                  clearError("numero_membre")
                }}
                placeholder="ex. CI-2026-0042 — laissez vide pour générer automatiquement"
                aria-invalid={!!errors.numero_membre}
                className={cn(
                  "mt-1.5 h-11 rounded-xl text-sm bg-card font-mono transition-colors",
                  errors.numero_membre ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5" : ""
                )}
              />
              <FormFieldError error={errors.numero_membre} />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Ne renseignez ce champ que si ce membre a déjà une carte physique avec un ID
                imprimé — il sera conservé tel quel. Sinon, laissez vide : un nouvel ID sera
                généré automatiquement.
              </p>
            </div>

            <div>
              <Label htmlFor="mb-note" className="text-xs font-semibold">
                Note admin (usage interne, non visible du membre)
              </Label>
              <Textarea
                id="mb-note"
                rows={2}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Optionnel"
                className="mt-1.5 rounded-xl resize-none text-xs bg-card"
              />
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <Checkbox
                checked={sendWelcomeEmail}
                onCheckedChange={setSendWelcomeEmail}
                className="mt-0.5"
              />
              <span className="text-xs text-foreground">
                Envoyer l'email de bienvenue « Adhésion validée » à ce membre
                <span className="block text-[11px] text-muted-foreground mt-0.5">
                  À laisser décoché pour un membre historique — l'email fait référence à une
                  adhésion « reçue aujourd'hui ».
                </span>
              </span>
            </label>
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
              disabled={createMutation.isPending || isCompressingPhoto}
              className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2 shadow-xs"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <BadgeCheck className="size-4" />
                  <span>Créer le membre</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <PhotoCropModal
      file={rawPhotoFile}
      open={isPhotoCropOpen}
      onOpenChange={setIsPhotoCropOpen}
      onCropped={handlePhotoCropped}
    />
    </>
  )
}
