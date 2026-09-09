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
import { DOMAIN_STATUS_LABELS } from "@/types/enums"
import { useUpdateDomain } from "@/hooks/use-domains"
import { Layers, Loader2, Sparkles } from "lucide-react"
import type { Domain } from "@/types/models"
import type { DomainStatus } from "@/types/enums"

interface DomaineEditDialogProps {
  domain: Domain | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DomaineEditDialog({
  domain,
  open,
  onOpenChange,
  onSuccess,
}: DomaineEditDialogProps) {
  const [nom, setNom] = useState("")
  const [description, setDescription] = useState("")
  const [statut, setStatut] = useState<DomainStatus>("actif")
  const [ordre, setOrdre] = useState<string>("1")
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

  const updateMutation = useUpdateDomain()

  useEffect(() => {
    if (domain) {
      setNom(domain.nom || "")
      setDescription(domain.description || "")
      setStatut(domain.statut || "actif")
      setOrdre(domain.ordre ? String(domain.ordre) : "1")
    }
    setErrors({})
  }, [domain, open])

  if (!domain) return null

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {}

    if (!nom.trim()) {
      errs.nom = "Le nom du domaine est requis."
    } else if (nom.trim().length < 2) {
      errs.nom = "Le nom doit comporter au moins 2 caractères."
    }

    if (ordre && (Number(ordre) < 1 || Number(ordre) > 20)) {
      errs.ordre = "L'ordre doit être compris entre 1 et 20."
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
      await updateMutation.mutateAsync({
        id: domain.id,
        payload: {
          nom: nom.trim(),
          description: description.trim() || undefined,
          statut,
          ordre: Number(ordre) || 1,
        },
      })

      await showSuccessAlert(
        "Domaine mis à jour !",
        "Les modifications ont été enregistrées avec succès."
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
            : "Une erreur est survenue lors de la mise à jour du domaine."
        )
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-1">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
            <Layers className="size-5" />
          </div>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            Modifier le domaine d'intervention
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Ajustez la présentation éditoriale et le statut du domaine officiel #{domain.ordre || domain.id}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          
          <div className="space-y-4 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <div>
              <Label htmlFor="domain-nom" className={`text-xs font-semibold ${errors.nom ? "text-destructive" : ""}`}>
                Nom officiel du domaine d'intervention *
              </Label>
              <Input
                id="domain-nom"
                required
                value={nom}
                onChange={(e) => {
                  setNom(e.target.value)
                  clearError("nom")
                }}
                className={`mt-1.5 h-11 rounded-xl text-sm ${
                  errors.nom
                    ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                    : ""
                }`}
              />
              <FormFieldError error={errors.nom} />
            </div>

            <div>
              <Label htmlFor="domain-description" className="text-xs font-semibold">
                Description institutionnelle détaillée
              </Label>
              <Textarea
                id="domain-description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explication des objectifs et actions prioritaires..."
                className="mt-1.5 rounded-xl resize-none text-xs"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 pt-1">
              <div>
                <Label htmlFor="domain-statut" className="text-xs font-semibold">
                  Statut du domaine
                </Label>
                <Select value={statut} onValueChange={(val) => setStatut(val as DomainStatus)}>
                  <SelectTrigger id="domain-statut" className="mt-1.5 h-10 w-full rounded-xl text-xs bg-card">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs">
                    {(Object.keys(DOMAIN_STATUS_LABELS) as DomainStatus[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {DOMAIN_STATUS_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="domain-ordre" className={`text-xs font-semibold ${errors.ordre ? "text-destructive" : ""}`}>
                  Ordre d'affichage
                </Label>
                <Input
                  id="domain-ordre"
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
              disabled={updateMutation.isPending}
              className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2 shadow-xs"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <span>Enregistrer les modifications</span>
              )}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}
