"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
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
import { ADMIN_ROLE_LABELS } from "@/types/enums"
import type { User } from "@/types/models"
import type { AdminRoleSlug } from "@/types/admin"

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: User | null
  onSubmit: (data: {
    nom: string
    prenom?: string
    email: string
    role_slug: AdminRoleSlug
    statut?: "actif" | "inactif" | "suspendu"
  }) => Promise<void>
  loading?: boolean
}

export function UserFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  loading = false,
}: UserFormDialogProps) {
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [email, setEmail] = useState("")
  const [roleSlug, setRoleSlug] = useState<AdminRoleSlug>("communication")
  const [statut, setStatut] = useState<"actif" | "inactif" | "suspendu">("actif")
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

  const isEditing = !!initialData

  useEffect(() => {
    if (initialData) {
      setNom(initialData.nom || "")
      setPrenom(initialData.prenom || "")
      setEmail(initialData.email || "")
      setRoleSlug((initialData.role?.slug as AdminRoleSlug) || "communication")
      setStatut((initialData.statut as "actif" | "inactif" | "suspendu") || "actif")
    } else {
      setNom("")
      setPrenom("")
      setEmail("")
      setRoleSlug("communication")
      setStatut("actif")
    }
    setErrors({})
  }, [initialData, open])

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {}

    if (!nom.trim()) {
      errs.nom = "Le nom de famille est requis."
    } else if (nom.trim().length < 2) {
      errs.nom = "Le nom doit comporter au moins 2 caractères."
    }

    if (!email.trim()) {
      errs.email = "L'adresse email est requise."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Veuillez entrer une adresse email valide."
    }

    if (!roleSlug) {
      errs.roleSlug = "Veuillez sélectionner un rôle administratif."
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

    try {
      await onSubmit({
        nom: nom.trim(),
        prenom: prenom.trim() || undefined,
        email: email.trim().toLowerCase(),
        role_slug: roleSlug,
        statut,
      })

      await showSuccessAlert(
        isEditing ? "Compte modifié !" : "Compte créé !",
        isEditing
          ? "Les modifications ont été enregistrées avec succès."
          : "Le nouveau compte administratif a été créé avec succès."
      )

      onOpenChange(false)
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
            : "Une erreur est survenue lors de l'enregistrement de l'utilisateur."
        )
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold">
            {isEditing
              ? "Modifier le compte utilisateur"
              : "Créer un compte administratif"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? "Ajustez les privilèges ou l'état d'activation du compte."
              : "Le nouvel utilisateur recevra un lien d'activation sécurisé par email."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Prénom & Nom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="prenom" className="text-xs font-semibold">
                Prénom
              </Label>
              <Input
                id="prenom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Ex : Ousmane"
                className="h-10 rounded-2xl text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nom" className={`text-xs font-semibold ${errors.nom ? "text-destructive" : ""}`}>
                Nom <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nom"
                required
                value={nom}
                onChange={(e) => {
                  setNom(e.target.value)
                  clearError("nom")
                }}
                placeholder="Ex : Faye"
                className={`h-10 rounded-2xl text-xs sm:text-sm ${
                  errors.nom
                    ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                    : ""
                }`}
              />
              <FormFieldError error={errors.nom} />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className={`text-xs font-semibold ${errors.email ? "text-destructive" : ""}`}>
              Adresse e-mail professionnelle <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                clearError("email")
              }}
              placeholder="admin@casa-impact.org"
              className={`h-10 rounded-2xl text-xs sm:text-sm ${
                errors.email
                  ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                  : ""
              }`}
            />
            <FormFieldError error={errors.email} />
          </div>

          {/* Rôle & Statut */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className={`text-xs font-semibold ${errors.roleSlug ? "text-destructive" : ""}`}>
                Rôle attribué <span className="text-destructive">*</span>
              </Label>
              <Select
                value={roleSlug}
                onValueChange={(val) => {
                  setRoleSlug(val as AdminRoleSlug)
                  clearError("roleSlug")
                }}
              >
                <SelectTrigger
                  className={`h-10 w-full rounded-2xl text-xs truncate ${
                    errors.roleSlug
                      ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                      : ""
                  }`}
                >
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl text-xs">
                  {(Object.keys(ADMIN_ROLE_LABELS) as AdminRoleSlug[]).map(
                    (key) => (
                      <SelectItem key={key} value={key}>
                        {ADMIN_ROLE_LABELS[key]}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormFieldError error={errors.roleSlug} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Statut du compte <span className="text-destructive">*</span>
              </Label>
              <Select
                value={statut}
                onValueChange={(val) =>
                  setStatut(val as "actif" | "inactif" | "suspendu")
                }
              >
                <SelectTrigger className="h-10 w-full rounded-2xl text-xs">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl text-xs">
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                  <SelectItem value="suspendu">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4 sm:pt-6 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full text-xs"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-full text-xs bg-forest hover:bg-forest/90 text-white font-medium"
            >
              {loading ? "Enregistrement..." : isEditing ? "Mettre à jour" : "Créer le compte"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
