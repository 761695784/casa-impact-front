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
import { PARTNER_STATUS_LABELS, PARTNER_TYPE_LABELS } from "@/types/enums"
import { useCreatePartner, useUpdatePartner, useUploadPartnerLogo } from "@/hooks/use-partners"
import { getPartnerLogoUrl } from "@/lib/format"
import { Handshake, Loader2, Image as ImageIcon, Building2 } from "lucide-react"
import type { Partner } from "@/types/models"
import type { PartnerStatus, PartnerType } from "@/types/enums"

interface PartenaireFormDialogProps {
  partner?: Partner | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function PartenaireFormDialog({
  partner,
  open,
  onOpenChange,
  onSuccess,
}: PartenaireFormDialogProps) {
  const isEditing = !!partner

  const createMutation = useCreatePartner()
  const updateMutation = useUpdatePartner()
  const uploadLogoMutation = useUploadPartnerLogo()

  const [nom, setNom] = useState("")
  const [type, setType] = useState<PartnerType>("institutionnel")
  const [description, setDescription] = useState("")
  const [lien, setLien] = useState("")
  const [ordre, setOrdre] = useState<string>("1")
  const [statut, setStatut] = useState<PartnerStatus>("actif")
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

  // Logo : fichier sélectionné localement (non encore envoyé) + aperçu
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (partner) {
      setNom(partner.nom || "")
      setType(partner.type || "institutionnel")
      setDescription(partner.description || "")
      setLien(partner.lien || "")
      setOrdre(partner.ordre ? String(partner.ordre) : "1")
      setStatut(partner.statut || "actif")
      setLogoFile(null)
      setLogoPreview(getPartnerLogoUrl(partner))
    } else {
      setNom("")
      setType("institutionnel")
      setDescription("")
      setLien("")
      setOrdre("1")
      setStatut("actif")
      setLogoFile(null)
      setLogoPreview(undefined)
    }
    setErrors({})
  }, [partner, open])

  const isPending =
    createMutation.isPending || updateMutation.isPending || uploadLogoMutation.isPending

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleRemoveLogo = () => {
    setLogoFile(null)
    setLogoPreview(isEditing ? getPartnerLogoUrl(partner!) : undefined)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {}

    if (!nom.trim()) {
      errs.nom = "Le nom officiel de l'organisation est requis."
    } else if (nom.trim().length < 2) {
      errs.nom = "Le nom doit comporter au moins 2 caractères."
    }

    if (!type) {
      errs.type = "Veuillez sélectionner un type de partenariat."
    }

    if (lien.trim()) {
      try {
        new URL(lien.trim())
      } catch {
        if (!lien.trim().startsWith("http://") && !lien.trim().startsWith("https://")) {
          errs.lien = "Le lien web doit commencer par http:// ou https://"
        }
      }
    }

    if (ordre && Number(ordre) < 1) {
      errs.ordre = "L'ordre d'affichage doit être supérieur ou égal à 1."
    }

    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      showValidationErrorAlert(Object.values(errs))
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const payload = {
      nom: nom.trim(),
      type,
      description: description.trim() || undefined,
      lien: lien.trim() || undefined,
      ordre: Number(ordre) || 1,
      statut,
    }

    try {
      if (isEditing && partner) {
        await updateMutation.mutateAsync({
          id: partner.id,
          payload,
        })

        if (logoFile) {
          await uploadLogoMutation.mutateAsync({ partnerId: partner.id, file: logoFile })
        }

        await showSuccessAlert(
          "Partenaire modifié !",
          "Les informations du partenaire ont été mises à jour avec succès."
        )
      } else {
        const newPartner = await createMutation.mutateAsync(payload as Omit<Partner, "id">)

        if (logoFile) {
          await uploadLogoMutation.mutateAsync({ partnerId: newPartner.id, file: logoFile })
        }

        await showSuccessAlert(
          "Partenaire ajouté !",
          "Le partenaire a été enregistré avec succès."
        )
      }

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
            : "Une erreur est survenue lors de l'enregistrement du partenaire."
        )
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-1">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
            <Handshake className="size-5" />
          </div>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            {isEditing ? "Modifier le partenaire" : "Nouveau partenaire institutionnel"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? "Ajustez les informations et le logo de ce partenaire."
              : "Ajoutez une organisation partenaire (institution, bailleur, structure technique, média)."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">

          {/* Section 1 : Informations Principales */}
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-forest text-white text-[11px] font-bold">
                1
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Identité de l'Organisation
              </h4>
            </div>

            <div>
              <Label htmlFor="partner-nom" className={`text-xs font-semibold ${errors.nom ? "text-destructive" : ""}`}>
                Nom officiel de l'organisation *
              </Label>
              <Input
                id="partner-nom"
                required
                value={nom}
                onChange={(e) => {
                  setNom(e.target.value)
                  clearError("nom")
                }}
                placeholder="ex. Agence Régionale de Développement (ARD)"
                className={`mt-1.5 h-11 rounded-xl text-sm bg-card ${
                  errors.nom
                    ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                    : ""
                }`}
              />
              <FormFieldError error={errors.nom} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="partner-type" className={`text-xs font-semibold ${errors.type ? "text-destructive" : ""}`}>
                  Typologie de partenariat *
                </Label>
                <Select
                  value={type}
                  onValueChange={(val) => {
                    setType(val as PartnerType)
                    clearError("type")
                  }}
                >
                  <SelectTrigger
                    id="partner-type"
                    className={`mt-1.5 h-10 w-full rounded-xl text-xs bg-card ${
                      errors.type
                        ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs">
                    {(Object.keys(PARTNER_TYPE_LABELS) as PartnerType[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {PARTNER_TYPE_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormFieldError error={errors.type} />
              </div>

              <div>
                <Label htmlFor="partner-ordre" className={`text-xs font-semibold ${errors.ordre ? "text-destructive" : ""}`}>
                  Ordre d'affichage
                </Label>
                <Input
                  id="partner-ordre"
                  type="number"
                  min={1}
                  value={ordre}
                  onChange={(e) => {
                    setOrdre(e.target.value)
                    clearError("ordre")
                  }}
                  className={`mt-1.5 h-10 rounded-xl text-xs bg-card ${
                    errors.ordre
                      ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                      : ""
                  }`}
                />
                <FormFieldError error={errors.ordre} />
              </div>
            </div>

            <div>
              <Label htmlFor="partner-desc" className="text-xs font-semibold">
                Description institutionnelle
              </Label>
              <Textarea
                id="partner-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Rôle et implication du partenaire auprès de Casa Impact..."
                className="mt-1.5 rounded-xl resize-none text-xs bg-card"
              />
            </div>

            <div>
              <Label htmlFor="partner-lien" className={`text-xs font-semibold ${errors.lien ? "text-destructive" : ""}`}>
                Lien site web officiel
              </Label>
              <Input
                id="partner-lien"
                type="url"
                value={lien}
                onChange={(e) => {
                  setLien(e.target.value)
                  clearError("lien")
                }}
                placeholder="https://www.organisation-partenaire.sn"
                className={`mt-1.5 h-10 rounded-xl text-xs bg-card ${
                  errors.lien
                    ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                    : ""
                }`}
              />
              <FormFieldError error={errors.lien} />
            </div>
          </div>

          {/* Section 2 : Logo Partenaire */}
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-forest text-white text-[11px] font-bold">
                2
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Logo Officiel du Partenaire
              </h4>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
              id="partner-logo-input"
            />

            {logoPreview ? (
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-3.5">
                <div className="flex items-center gap-4">
                  <div className="relative size-16 rounded-2xl overflow-hidden bg-white shrink-0 border border-border shadow-xs flex items-center justify-center p-2">
                    <img
                      src={logoPreview}
                      alt={nom || "Logo du partenaire"}
                      className="size-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary mb-1">
                      <Building2 className="size-3" />
                      {logoFile ? "Nouveau logo sélectionné" : "Logo partenaire actif"}
                    </span>
                    <p className="text-xs font-bold text-foreground truncate">
                      {logoFile ? logoFile.name : "Logo actuel"}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-7 rounded-lg text-xs font-semibold px-2 text-primary hover:bg-primary/10"
                      >
                        Changer
                      </Button>
                      {logoFile && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveLogo}
                          className="h-7 rounded-lg text-xs font-semibold px-2 text-destructive hover:bg-destructive/10"
                        >
                          Annuler
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/60 p-5 text-center cursor-pointer hover:border-primary/50 hover:bg-secondary/60 transition-all group"
              >
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <ImageIcon className="size-4" />
                </div>
                <p className="mt-2 text-xs font-bold text-foreground">
                  Aucun logo sélectionné
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Cliquez ici pour choisir un fichier logo
                </p>
              </div>
            )}
          </div>

          {/* Section 3 : Statut */}
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-forest text-white text-[11px] font-bold">
                3
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Statut
              </h4>
            </div>

            <div>
              <Label htmlFor="partner-statut" className="text-xs font-semibold">
                Statut administratif *
              </Label>
              <Select value={statut} onValueChange={(val) => setStatut(val as PartnerStatus)}>
                <SelectTrigger id="partner-statut" className="mt-1.5 h-10 rounded-xl text-xs bg-card">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl text-xs">
                  {(Object.keys(PARTNER_STATUS_LABELS) as PartnerStatus[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {PARTNER_STATUS_LABELS[key]}
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
                <span>{isEditing ? "Enregistrer les modifications" : "Créer le partenaire"}</span>
              )}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}
