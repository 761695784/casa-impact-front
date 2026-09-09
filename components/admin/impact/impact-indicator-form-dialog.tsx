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
  showConfirmAlert,
} from "@/lib/alerts"
import { ApiError } from "@/lib/api-client"
import {
  useCreateImpactIndicator,
  useUpdateImpactIndicator,
  useAddImpactValue,
  useUpdateImpactValue,
  useDeleteImpactValue,
} from "@/hooks/use-impact"
import { BarChart3, Loader2, Plus, Pencil, Trash2, Check, X } from "lucide-react"
import { formatNumber } from "@/lib/format"
import type { ImpactIndicator, ImpactValue } from "@/types/models"
import { REGION_LABELS, type Region } from "@/types/enums"

interface ImpactIndicatorFormDialogProps {
  indicator?: ImpactIndicator | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const REGION_OPTIONS = Object.entries(REGION_LABELS) as [Region, string][]

export function ImpactIndicatorFormDialog({
  indicator,
  open,
  onOpenChange,
  onSuccess,
}: ImpactIndicatorFormDialogProps) {
  const isEditing = !!indicator

  const createMutation = useCreateImpactIndicator()
  const updateMutation = useUpdateImpactIndicator()

  const [libelle, setLibelle] = useState("")
  const [unite, setUnite] = useState("")
  const [description, setDescription] = useState("")
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

  // Valeurs (points de mesure) : sous-ressource imbriquée gérée
  // indépendamment de l'indicateur (POST/PUT/DELETE dédiés). On tient une
  // copie locale synchronisée avec `indicator.values`, mise à jour au fil
  // des mutations réussies pour rester réactif sans dépendre d'un refetch
  // du parent.
  const [values, setValues] = useState<ImpactValue[]>([])

  useEffect(() => {
    if (indicator) {
      setLibelle(indicator.libelle || "")
      setUnite(indicator.unite || "")
      setDescription(indicator.description || "")
      setValues(indicator.values || [])
    } else {
      setLibelle("")
      setUnite("")
      setDescription("")
      setValues([])
    }
    setErrors({})
  }, [indicator, open])

  const isPending = createMutation.isPending || updateMutation.isPending

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {}

    if (!libelle.trim()) {
      errs.libelle = "Le libellé de l'indicateur est requis."
    } else if (libelle.trim().length < 3) {
      errs.libelle = "Le libellé doit comporter au moins 3 caractères."
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

    const payload: Partial<ImpactIndicator> = {
      libelle: libelle.trim(),
      unite: unite.trim() || undefined,
      description: description.trim() || undefined,
    }

    try {
      if (isEditing && indicator) {
        await updateMutation.mutateAsync({
          id: indicator.id,
          payload,
        })
        await showSuccessAlert(
          "Indicateur modifié !",
          "L'indicateur d'impact a été mis à jour avec succès."
        )
      } else {
        await createMutation.mutateAsync(
          payload as Omit<ImpactIndicator, "id">
        )
        await showSuccessAlert(
          "Indicateur créé !",
          "Le nouvel indicateur a été enregistré avec succès."
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
            : "Une erreur est survenue lors de l'enregistrement de l'indicateur."
        )
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-1">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
            <BarChart3 className="size-5" />
          </div>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            {isEditing ? "Modifier l'indicateur d'impact" : "Nouvel indicateur d'impact"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? "Modifiez la définition de cet indicateur ou ses points de mesure ci-dessous."
              : "Ajoutez un indicateur quantitatif mesurant la transformation en Casamance."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">

          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <div>
              <Label htmlFor="ind-libelle" className={`text-xs font-semibold ${errors.libelle ? "text-destructive" : ""}`}>
                Libellé de l'indicateur *
              </Label>
              <Input
                id="ind-libelle"
                required
                value={libelle}
                onChange={(e) => {
                  setLibelle(e.target.value)
                  clearError("libelle")
                }}
                placeholder="ex. Jeunes & Femmes formés au leadership"
                className={`mt-1.5 h-11 rounded-xl text-sm ${
                  errors.libelle
                    ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                    : ""
                }`}
              />
              <FormFieldError error={errors.libelle} />
            </div>

            <div>
              <Label htmlFor="ind-unite" className="text-xs font-semibold">
                Unité de mesure
              </Label>
              <Input
                id="ind-unite"
                value={unite}
                onChange={(e) => setUnite(e.target.value)}
                placeholder="ex. bénéficiaires, emplois, FCFA"
                className="mt-1.5 h-10 rounded-xl text-xs bg-card"
              />
            </div>

            <div>
              <Label htmlFor="ind-desc" className="text-xs font-semibold">
                Définition & Méthode de calcul
              </Label>
              <Textarea
                id="ind-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Précisez le périmètre et la source de vérification..."
                className="mt-1.5 rounded-xl text-xs"
              />
            </div>
          </div>

          {isEditing && indicator ? (
            <ImpactValuesEditor
              indicatorId={indicator.id}
              values={values}
              onValuesChange={setValues}
            />
          ) : (
            <p className="rounded-2xl border border-dashed border-border/80 bg-secondary/20 p-4 text-xs italic text-muted-foreground">
              Vous pourrez ajouter des points de mesure une fois l'indicateur créé.
            </p>
          )}

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
                <span>{isEditing ? "Enregistrer les modifications" : "Créer l'indicateur"}</span>
              )}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}

interface ImpactValuesEditorProps {
  indicatorId: number
  values: ImpactValue[]
  onValuesChange: (values: ImpactValue[]) => void
}

/**
 * Édition des points de mesure d'un indicateur — sous-ressource imbriquée
 * (POST .../values, PUT/DELETE /impact-values/{id}), jamais envoyée avec
 * le PUT de l'indicateur lui-même.
 */
function ImpactValuesEditor({
  indicatorId,
  values,
  onValuesChange,
}: ImpactValuesEditorProps) {
  const addMutation = useAddImpactValue()
  const updateMutation = useUpdateImpactValue()
  const deleteMutation = useDeleteImpactValue()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editPeriode, setEditPeriode] = useState("")
  const [editRegion, setEditRegion] = useState<string>("")
  const [editValeur, setEditValeur] = useState("")

  const [newPeriode, setNewPeriode] = useState("")
  const [newRegion, setNewRegion] = useState<string>("")
  const [newValeur, setNewValeur] = useState("")

  const startEdit = (v: ImpactValue) => {
    setEditingId(v.id)
    setEditPeriode(v.periode || "")
    setEditRegion(v.region || "")
    setEditValeur(String(v.valeur))
  }

  const cancelEdit = () => setEditingId(null)

  const saveEdit = async (valueId: number) => {
    if (!editValeur.trim() || isNaN(Number(editValeur))) {
      showValidationErrorAlert(["La valeur numérique du point de mesure est requise."])
      return
    }

    try {
      const updated = await updateMutation.mutateAsync({
        valueId,
        indicatorId,
        payload: {
          periode: editPeriode.trim() || undefined,
          region: (editRegion || undefined) as Region | undefined,
          valeur: Number(editValeur) || 0,
        },
      })
      onValuesChange(values.map((v) => (v.id === valueId ? updated : v)))
      setEditingId(null)
      await showSuccessAlert("Point de mesure modifié", "La valeur a été mise à jour.")
    } catch {
      showErrorAlert("Erreur", "Impossible de mettre à jour le point de mesure.")
    }
  }

  const handleDelete = async (valueId: number) => {
    const confirmed = await showConfirmAlert(
      "Supprimer ce point de mesure ?",
      "Cette action retirera définitivement ce relevé d'impact."
    )
    if (!confirmed) return

    try {
      await deleteMutation.mutateAsync({ valueId, indicatorId })
      onValuesChange(values.filter((v) => v.id !== valueId))
      await showSuccessAlert("Supprimé", "Le point de mesure a été retiré.")
    } catch {
      showErrorAlert("Erreur", "Impossible de supprimer le point de mesure.")
    }
  }

  const handleAdd = async () => {
    if (!newValeur.trim() || isNaN(Number(newValeur))) {
      showValidationErrorAlert(["Veuillez saisir une valeur numérique valide pour ajouter un point de mesure."])
      return
    }

    try {
      const created = await addMutation.mutateAsync({
        indicatorId,
        payload: {
          periode: newPeriode.trim() || undefined,
          region: (newRegion || undefined) as Region | undefined,
          valeur: Number(newValeur) || 0,
        },
      })
      onValuesChange([...values, created])
      setNewPeriode("")
      setNewRegion("")
      setNewValeur("")
      await showSuccessAlert("Point de mesure ajouté", "Le relevé a été enregistré.")
    } catch {
      showErrorAlert("Erreur", "Impossible d'ajouter le point de mesure.")
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
      <Label className="text-xs font-semibold">Points de mesure enregistrés</Label>

      {values.length > 0 ? (
        <div className="space-y-2">
          {values.map((v) => (
            <div
              key={v.id}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-card p-2.5"
            >
              {editingId === v.id ? (
                <>
                  <Input
                    value={editPeriode}
                    onChange={(e) => setEditPeriode(e.target.value)}
                    placeholder="Période"
                    className="h-8 w-28 rounded-lg text-[11px]"
                  />
                  <Select value={editRegion} onValueChange={(val) => setEditRegion(val || "")}>
                    <SelectTrigger className="h-8 w-32 rounded-lg text-[11px]">
                      <SelectValue placeholder="Toutes régions" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl text-xs">
                      {REGION_OPTIONS.map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={editValeur}
                    onChange={(e) => setEditValeur(e.target.value)}
                    className="h-8 w-24 rounded-lg text-[11px] font-mono"
                  />
                  <div className="ml-auto flex items-center gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-7 rounded-full text-forest"
                      onClick={() => saveEdit(v.id)}
                      disabled={updateMutation.isPending}
                      aria-label="Enregistrer"
                    >
                      <Check className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-7 rounded-full text-muted-foreground"
                      onClick={cancelEdit}
                      aria-label="Annuler"
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <span className="font-mono font-semibold text-[11px] text-foreground bg-secondary px-2 py-1 rounded-md">
                    {v.periode || "—"}
                  </span>
                  {v.region && (
                    <span className="text-[11px] text-muted-foreground">
                      {REGION_LABELS[v.region]}
                    </span>
                  )}
                  <span className="font-mono font-bold text-xs text-foreground">
                    {formatNumber(v.valeur)}
                  </span>
                  <div className="ml-auto flex items-center gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-7 rounded-full text-muted-foreground hover:text-foreground"
                      onClick={() => startEdit(v)}
                      aria-label="Modifier cette valeur"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-7 rounded-full text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(v.id)}
                      disabled={deleteMutation.isPending}
                      aria-label="Supprimer cette valeur"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs italic text-muted-foreground">
          Aucun point de mesure enregistré pour cet indicateur.
        </p>
      )}

      {/* Ajout d'un nouveau point de mesure */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/60">
        <Input
          value={newPeriode}
          onChange={(e) => setNewPeriode(e.target.value)}
          placeholder="Période (ex. 2025/2026)"
          className="h-9 w-36 rounded-lg text-[11px] bg-card"
        />
        <Select value={newRegion} onValueChange={(val) => setNewRegion(val || "")}>
          <SelectTrigger className="h-9 w-32 rounded-lg text-[11px] bg-card">
            <SelectValue placeholder="Toutes régions" />
          </SelectTrigger>
          <SelectContent className="rounded-xl text-xs">
            {REGION_OPTIONS.map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          value={newValeur}
          onChange={(e) => setNewValeur(e.target.value)}
          placeholder="Valeur"
          className="h-9 w-24 rounded-lg text-[11px] bg-card font-mono"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAdd}
          disabled={addMutation.isPending || !newValeur.trim()}
          className="h-9 rounded-full text-[11px] gap-1.5"
        >
          <Plus className="size-3.5" />
          <span>Ajouter</span>
        </Button>
      </div>
    </div>
  )
}
