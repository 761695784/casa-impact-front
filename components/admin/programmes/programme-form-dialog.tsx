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
import { PROGRAM_STATUS_LABELS, REGION_LABELS } from "@/types/enums"
import { useDomains } from "@/hooks/use-domains"
import { useProgramTypes } from "@/hooks/use-program-types"
import { useCreateProgram, useUpdateProgram } from "@/hooks/use-programs"
import { mockDomains } from "@/lib/mock/domains.mock"
import { mockProgramTypes } from "@/lib/mock/programs.mock"
import { showValidationErrorAlert, showSuccessAlert, showErrorAlert } from "@/lib/alerts"
import { FormFieldError } from "@/components/ui/form-field-error"
import { ApiError } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import { Compass, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Program } from "@/types/models"
import type { ProgramStatus, Region } from "@/types/enums"

interface ProgrammeFormDialogProps {
  program?: Program | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ProgrammeFormDialog({
  program,
  open,
  onOpenChange,
  onSuccess,
}: ProgrammeFormDialogProps) {
  const isEditing = !!program

  const { data: domains = [] } = useDomains()
  const { data: programTypes = [] } = useProgramTypes()

  const domainList = React.useMemo(() => {
    const base = domains && domains.length > 0 ? [...domains] : [...mockDomains]
    if (program?.domaine && !base.some((d) => String(d.id) === String(program.domaine?.id))) {
      base.push(program.domaine)
    }
    return base
  }, [domains, program])

  const typeList = React.useMemo(() => {
    const base = programTypes && programTypes.length > 0 ? [...programTypes] : [...mockProgramTypes]
    if (program?.type && !base.some((t) => String(t.id) === String(program.type?.id))) {
      base.push(program.type)
    }
    return base
  }, [programTypes, program])

  const createMutation = useCreateProgram()
  const updateMutation = useUpdateProgram()

  const [titre, setTitre] = useState("")
  const [resume, setResume] = useState("")
  const [description, setDescription] = useState("")
  const [domaineId, setDomaineId] = useState<string>("")
  const [typeId, setTypeId] = useState<string>("")
  const [region, setRegion] = useState<string>("none")
  const [localisation, setLocalisation] = useState("")
  const [dateDebut, setDateDebut] = useState("")
  const [dateFin, setDateFin] = useState("")
  const [statut, setStatut] = useState<ProgramStatus>("brouillon")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setErrors({})
    if (program) {
      setTitre(program.titre || "")
      setResume(program.resume || "")
      setDescription(program.description || "")
      setDomaineId(
        program.domaine_id
          ? String(program.domaine_id)
          : program.domaine?.id
          ? String(program.domaine.id)
          : (program as any).domain_id
          ? String((program as any).domain_id)
          : (program as any).domain?.id
          ? String((program as any).domain.id)
          : ""
      )
      setTypeId(
        program.type_id
          ? String(program.type_id)
          : program.type?.id
          ? String(program.type.id)
          : (program as any).program_type_id
          ? String((program as any).program_type_id)
          : (program as any).program_type?.id
          ? String((program as any).program_type.id)
          : ""
      )
      setRegion(program.region || "none")
      setLocalisation(program.localisation || "")
      setDateDebut(program.date_debut ? program.date_debut.split("T")[0] : "")
      setDateFin(program.date_fin ? program.date_fin.split("T")[0] : "")
      setStatut(program.statut || "brouillon")
    } else {
      setTitre("")
      setResume("")
      setDescription("")
      setDomaineId("")
      setTypeId("")
      setRegion("none")
      setLocalisation("")
      setDateDebut("")
      setDateFin("")
      setStatut("brouillon")
    }
  }, [program, open])

  const isPending = createMutation.isPending || updateMutation.isPending

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[field]
        return updated
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!titre.trim()) {
      newErrors.titre = "Le titre officiel du programme est obligatoire."
    } else if (titre.trim().length < 3) {
      newErrors.titre = "Le titre doit comporter au moins 3 caractères."
    }

    if (!domaineId) {
      newErrors.domaine_id = "Veuillez sélectionner le domaine d'intervention officiel."
    }

    if (!typeId) {
      newErrors.type_id = "Veuillez sélectionner le type / modalité du programme."
    }

    if (dateDebut && dateFin && dateFin < dateDebut) {
      newErrors.date_fin = "La date de clôture doit être égale ou postérieure à la date de lancement."
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

    const payload = {
      titre: titre.trim(),
      resume: resume.trim() || undefined,
      description: description.trim() || undefined,
      domaine_id: Number(domaineId),
      type_id: Number(typeId),
      region: region !== "none" ? (region as Region) : undefined,
      localisation: localisation.trim() || undefined,
      date_debut: dateDebut || undefined,
      date_fin: dateFin || undefined,
      statut,
    }

    try {
      if (isEditing && program) {
        await updateMutation.mutateAsync({
          id: program.id,
          payload,
        })
        showSuccessAlert("Programme mis à jour", `Le programme « ${titre} » a été modifié avec succès.`)
      } else {
        await createMutation.mutateAsync(payload as Omit<Program, "id">)
        showSuccessAlert("Programme créé avec succès", `Le nouveau programme « ${titre} » a été enregistré.`)
      }
      onOpenChange(false)
      onSuccess?.()
    } catch (err: unknown) {
      if (err instanceof ApiError && err.errors) {
        const backendErrors: Record<string, string> = {}
        Object.entries(err.errors).forEach(([k, msgs]) => {
          const fieldKey = k === "domain_id" ? "domaine_id" : k === "program_type_id" ? "type_id" : k
          backendErrors[fieldKey] = Array.isArray(msgs) ? msgs[0] : String(msgs)
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-1">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
            <Compass className="size-5" />
          </div>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            {isEditing ? "Modifier le programme" : "Nouveau programme d'action"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? "Mettez à jour les paramètres, le domaine et la planification du programme."
              : "Créez un nouveau dispositif opérationnel rattaché aux piliers institutionnels de Casa Impact."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          
          {/* Section 1 : Informations Générales */}
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest">
              1. Identité du Programme
            </h4>

            <div>
              <Label htmlFor="prog-titre" className={cn("text-xs font-semibold", errors.titre ? "text-destructive" : "")}>
                Titre officiel du programme *
              </Label>
              <Input
                id="prog-titre"
                value={titre}
                onChange={(e) => {
                  setTitre(e.target.value)
                  clearError("titre")
                }}
                placeholder="ex. Académie du Leadership Jeune"
                aria-invalid={!!errors.titre}
                className={cn(
                  "mt-1.5 h-11 rounded-xl text-sm transition-colors",
                  errors.titre ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5" : ""
                )}
              />
              <FormFieldError error={errors.titre} />
            </div>

            <div>
              <Label htmlFor="prog-resume" className="text-xs font-semibold">
                Résumé d'accroche (synthèse)
              </Label>
              <Textarea
                id="prog-resume"
                rows={2}
                value={resume}
                onChange={(e) => {
                  setResume(e.target.value)
                  clearError("resume")
                }}
                placeholder="Courte présentation résumant l'impact du programme..."
                className="mt-1.5 rounded-xl resize-none text-xs"
              />
              <FormFieldError error={errors.resume} />
            </div>

            <div>
              <Label htmlFor="prog-description" className="text-xs font-semibold">
                Description institutionnelle détaillée
              </Label>
              <Textarea
                id="prog-description"
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  clearError("description")
                }}
                placeholder="Détail des activités, bénéficiaires cibles et déroulement..."
                className="mt-1.5 rounded-xl resize-none text-xs"
              />
              <FormFieldError error={errors.description} />
            </div>
          </div>

          {/* Section 2 : Rattachement Stratégique */}
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest">
              2. Classification Stratégique & Typologie
            </h4>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="prog-domaine" className={cn("text-xs font-semibold", errors.domaine_id ? "text-destructive" : "")}>
                  Domaine d'intervention officiel *
                </Label>
                <Select
                  value={domaineId}
                  onValueChange={(val) => {
                    setDomaineId(val || "")
                    clearError("domaine_id")
                  }}
                >
                  <SelectTrigger
                    id="prog-domaine"
                    aria-invalid={!!errors.domaine_id}
                    className={cn(
                      "mt-1.5 h-10 w-full rounded-xl text-xs bg-card transition-colors",
                      errors.domaine_id ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5" : ""
                    )}
                  >
                    <SelectValue placeholder="Sélectionner un domaine" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs w-full min-w-[240px]">
                    {domainList.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        0{d.ordre || d.id}. {d.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormFieldError error={errors.domaine_id} />
              </div>

              <div>
                <Label htmlFor="prog-type" className={cn("text-xs font-semibold", errors.type_id ? "text-destructive" : "")}>
                  Type de programme (modalité) *
                </Label>
                <Select
                  value={typeId}
                  onValueChange={(val) => {
                    setTypeId(val || "")
                    clearError("type_id")
                  }}
                >
                  <SelectTrigger
                    id="prog-type"
                    aria-invalid={!!errors.type_id}
                    className={cn(
                      "mt-1.5 h-10 w-full rounded-xl text-xs bg-card transition-colors",
                      errors.type_id ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5" : ""
                    )}
                  >
                    <SelectValue placeholder="Sélectionner une typologie" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs w-full min-w-[240px]">
                    {typeList.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormFieldError error={errors.type_id} />
              </div>
            </div>
          </div>

          {/* Section 3 : Cadre Opérationnel & Statut */}
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest">
              3. Déploiement & Statut de Publication
            </h4>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="prog-region" className="text-xs font-semibold">
                  Région principale
                </Label>
                <Select value={region} onValueChange={(val) => setRegion(val || "none")}>
                  <SelectTrigger id="prog-region" className="mt-1.5 h-10 w-full rounded-xl text-xs bg-card">
                    <SelectValue placeholder="Toutes les régions" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs w-full min-w-[220px]">
                    <SelectItem value="none">Multi-régional / Tout territoire</SelectItem>
                    {(Object.keys(REGION_LABELS) as Region[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {REGION_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="prog-localisation" className="text-xs font-semibold">
                  Précision de localisation
                </Label>
                <Input
                  id="prog-localisation"
                  value={localisation}
                  onChange={(e) => setLocalisation(e.target.value)}
                  placeholder="ex. Ziguinchor (Campus Territorial)"
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 pt-1">
              <div>
                <Label htmlFor="prog-date-debut" className="text-xs font-semibold">
                  Date de lancement
                </Label>
                <Input
                  id="prog-date-debut"
                  type="date"
                  value={dateDebut}
                  onChange={(e) => {
                    setDateDebut(e.target.value)
                    clearError("date_fin")
                  }}
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                />
              </div>

              <div>
                <Label htmlFor="prog-date-fin" className={cn("text-xs font-semibold", errors.date_fin ? "text-destructive" : "")}>
                  Date de clôture
                </Label>
                <Input
                  id="prog-date-fin"
                  type="date"
                  value={dateFin}
                  onChange={(e) => {
                    setDateFin(e.target.value)
                    clearError("date_fin")
                  }}
                  aria-invalid={!!errors.date_fin}
                  className={cn(
                    "mt-1.5 h-10 rounded-xl text-xs bg-card transition-colors",
                    errors.date_fin ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5" : ""
                  )}
                />
                <FormFieldError error={errors.date_fin} />
              </div>

              <div>
                <Label htmlFor="prog-statut" className="text-xs font-semibold">
                  Statut administratif *
                </Label>
                <Select value={statut} onValueChange={(val) => setStatut(val as ProgramStatus)}>
                  <SelectTrigger id="prog-statut" className="mt-1.5 h-10 w-full rounded-xl text-xs bg-card">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs w-full min-w-[180px]">
                    {(Object.keys(PROGRAM_STATUS_LABELS) as ProgramStatus[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {PROGRAM_STATUS_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <span>{isEditing ? "Enregistrer les modifications" : "Créer le programme"}</span>
              )}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}
