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
import { useCreateProgramType, useUpdateProgramType } from "@/hooks/use-program-types"
import { Tag, Loader2 } from "lucide-react"
import type { ProgramType } from "@/types/models"
import type { DomainStatus } from "@/types/enums"

/**
 * Sert à la fois la création et la modification (comme
 * ProgrammeFormDialog) : `programType` absent/null => mode création.
 */
interface ProgramTypeEditDialogProps {
  programType?: ProgramType | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ProgramTypeEditDialog({
  programType,
  open,
  onOpenChange,
  onSuccess,
}: ProgramTypeEditDialogProps) {
  const isEditing = !!programType

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

  const createMutation = useCreateProgramType()
  const updateMutation = useUpdateProgramType()
  const isPending = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (programType) {
      setNom(programType.nom || "")
      setDescription(programType.description || "")
      setStatut(programType.statut || "actif")
      setOrdre(programType.ordre ? String(programType.ordre) : "1")
    } else {
      setNom("")
      setDescription("")
      setStatut("actif")
      setOrdre("1")
    }
    setErrors({})
  }, [programType, open])

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {}

    if (!nom.trim()) {
      errs.nom = "Le nom de la modalité est requis."
    } else if (nom.trim().length < 2) {
      errs.nom = "Le nom doit comporter au moins 2 caractères."
    }

    if (ordre && (Number(ordre) < 1 || Number(ordre) > 50)) {
      errs.ordre = "L'ordre doit être compris entre 1 et 50."
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
      description: description.trim() || undefined,
      statut,
      ordre: Number(ordre) || 1,
    }

    try {
      if (isEditing && programType) {
        await updateMutation.mutateAsync({ id: programType.id, payload })
        await showSuccessAlert(
          "Modalité modifiée !",
          "Le type de programme a été mis à jour avec succès."
        )
      } else {
        await createMutation.mutateAsync(payload as Omit<ProgramType, "id">)
        await showSuccessAlert(
          "Modalité créée !",
          "Le nouveau type de programme a été enregistré avec succès."
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
            : "Une erreur est survenue lors de l'enregistrement de la modalité."
        )
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-1">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
            <Tag className="size-5" />
          </div>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            {isEditing ? "Modifier le type de programme" : "Nouveau type de programme"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? "Ajustez l'intitulé et la description de cette modalité d'action."
              : "Définissez une nouvelle modalité d'intervention proposée lors de la création des programmes."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <div>
              <Label htmlFor="type-nom" className={`text-xs font-semibold ${errors.nom ? "text-destructive" : ""}`}>
                Nom de la modalité *
              </Label>
              <Input
                id="type-nom"
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
              <Label htmlFor="type-description" className="text-xs font-semibold">
                Description de la typologie
              </Label>
              <Textarea
                id="type-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explication du format d'intervention..."
                className="mt-1.5 rounded-xl resize-none text-xs"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 pt-1">
              <div>
                <Label htmlFor="type-statut" className="text-xs font-semibold">
                  Statut
                </Label>
                <Select value={statut} onValueChange={(val) => setStatut(val as DomainStatus)}>
                  <SelectTrigger id="type-statut" className="mt-1.5 h-10 w-full rounded-xl text-xs bg-card">
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
                <Label htmlFor="type-ordre" className={`text-xs font-semibold ${errors.ordre ? "text-destructive" : ""}`}>
                  Ordre d'affichage
                </Label>
                <Input
                  id="type-ordre"
                  type="number"
                  min={1}
                  max={50}
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
              disabled={isPending}
              className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2 shadow-xs"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <span>{isEditing ? "Enregistrer les modifications" : "Créer le type de programme"}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
