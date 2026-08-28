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
import { Compass, Loader2, Sparkles } from "lucide-react"
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

  useEffect(() => {
    if (program) {
      setTitre(program.titre || "")
      setResume(program.resume || "")
      setDescription(program.description || "")
      setDomaineId(
        program.domaine_id ? String(program.domaine_id) : program.domaine?.id ? String(program.domaine.id) : ""
      )
      setTypeId(
        program.type_id ? String(program.type_id) : program.type?.id ? String(program.type.id) : ""
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      titre,
      resume,
      description,
      domaine_id: domaineId ? Number(domaineId) : undefined,
      type_id: typeId ? Number(typeId) : undefined,
      region: region !== "none" ? (region as Region) : undefined,
      localisation: localisation || undefined,
      date_debut: dateDebut || undefined,
      date_fin: dateFin || undefined,
      statut,
    }

    if (isEditing && program) {
      await updateMutation.mutateAsync({
        id: program.id,
        payload,
      })
    } else {
      await createMutation.mutateAsync(payload as Omit<Program, "id">)
    }

    onOpenChange(false)
    onSuccess?.()
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
              <Label htmlFor="prog-titre" className="text-xs font-semibold">
                Titre officiel du programme *
              </Label>
              <Input
                id="prog-titre"
                required
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                placeholder="ex. Académie du Leadership Jeune"
                className="mt-1.5 h-11 rounded-xl text-sm"
              />
            </div>

            <div>
              <Label htmlFor="prog-resume" className="text-xs font-semibold">
                Résumé d'accroche (synthèse)
              </Label>
              <Textarea
                id="prog-resume"
                rows={2}
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Courte présentation résumant l'impact du programme..."
                className="mt-1.5 rounded-xl resize-none text-xs"
              />
            </div>

            <div>
              <Label htmlFor="prog-description" className="text-xs font-semibold">
                Description institutionnelle détaillée
              </Label>
              <Textarea
                id="prog-description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Détail des activités, bénéficiaires cibles et déroulement..."
                className="mt-1.5 rounded-xl resize-none text-xs"
              />
            </div>
          </div>

          {/* Section 2 : Rattachement Stratégique */}
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest">
              2. Classification Stratégique & Typologie
            </h4>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="prog-domaine" className="text-xs font-semibold">
                  Domaine d'intervention officiel *
                </Label>
                <Select value={domaineId} onValueChange={(val) => setDomaineId(val || "")}>
                  <SelectTrigger id="prog-domaine" className="mt-1.5 h-10 rounded-xl text-xs bg-card">
                    <SelectValue placeholder="Sélectionner un domaine" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs max-w-xs">
                    {domains.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        0{d.ordre || d.id}. {d.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="prog-type" className="text-xs font-semibold">
                  Type de programme (modalité) *
                </Label>
                <Select value={typeId} onValueChange={(val) => setTypeId(val || "")}>
                  <SelectTrigger id="prog-type" className="mt-1.5 h-10 rounded-xl text-xs bg-card">
                    <SelectValue placeholder="Sélectionner une typologie" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs max-w-xs">
                    {programTypes.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <SelectTrigger id="prog-region" className="mt-1.5 h-10 rounded-xl text-xs bg-card">
                    <SelectValue placeholder="Toutes les régions" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs">
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
                  onChange={(e) => setDateDebut(e.target.value)}
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                />
              </div>

              <div>
                <Label htmlFor="prog-date-fin" className="text-xs font-semibold">
                  Date de clôture
                </Label>
                <Input
                  id="prog-date-fin"
                  type="date"
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                />
              </div>

              <div>
                <Label htmlFor="prog-statut" className="text-xs font-semibold">
                  Statut administratif *
                </Label>
                <Select value={statut} onValueChange={(val) => setStatut(val as ProgramStatus)}>
                  <SelectTrigger id="prog-statut" className="mt-1.5 h-10 rounded-xl text-xs bg-card">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs">
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
