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
import { useDomains } from "@/hooks/use-domains"
import { usePrograms } from "@/hooks/use-programs"
import {
  useCreateImpactIndicator,
  useUpdateImpactIndicator,
} from "@/hooks/use-impact"
import { BarChart3, Loader2 } from "lucide-react"
import type { ImpactIndicator } from "@/types/models"

interface ImpactIndicatorFormDialogProps {
  indicator?: ImpactIndicator | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ImpactIndicatorFormDialog({
  indicator,
  open,
  onOpenChange,
  onSuccess,
}: ImpactIndicatorFormDialogProps) {
  const isEditing = !!indicator

  const createMutation = useCreateImpactIndicator()
  const updateMutation = useUpdateImpactIndicator()

  const { data: domains = [] } = useDomains()
  const { data: programsData } = usePrograms()
  const programs = programsData?.data || []

  const [libelle, setLibelle] = useState("")
  const [unite, setUnite] = useState("")
  const [description, setDescription] = useState("")
  const [valeur, setValeur] = useState<string>("0")
  const [cible, setCible] = useState<string>("")
  const [categorie, setCategorie] = useState("")
  const [domaineId, setDomaineId] = useState<string>("")
  const [programmeId, setProgrammeId] = useState<string>("")
  const [ordre, setOrdre] = useState<string>("1")
  const [statut, setStatut] = useState<"actif" | "inactif">("actif")

  useEffect(() => {
    if (indicator) {
      setLibelle(indicator.libelle || "")
      setUnite(indicator.unite || "")
      setDescription(indicator.description || "")
      const currentVal =
        indicator.valeurs && indicator.valeurs.length > 0
          ? indicator.valeurs.reduce((acc, v) => acc + (v.valeur || 0), 0)
          : 0
      setValeur(String(currentVal))
      setCible(indicator.cible ? String(indicator.cible) : "")
      setCategorie(indicator.categorie || "")
      setDomaineId(
        indicator.domaine_id
          ? String(indicator.domaine_id)
          : indicator.domaine?.id
          ? String(indicator.domaine.id)
          : ""
      )
      setProgrammeId(
        indicator.programme_id
          ? String(indicator.programme_id)
          : indicator.programme?.id
          ? String(indicator.programme.id)
          : ""
      )
      setOrdre(indicator.ordre ? String(indicator.ordre) : "1")
      setStatut(indicator.statut || "actif")
    } else {
      setLibelle("")
      setUnite("")
      setDescription("")
      setValeur("0")
      setCible("")
      setCategorie("")
      setDomaineId("")
      setProgrammeId("")
      setOrdre("1")
      setStatut("actif")
    }
  }, [indicator, open])

  const isPending = createMutation.isPending || updateMutation.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const numVal = Number(valeur) || 0
    const payload: Partial<ImpactIndicator> = {
      libelle,
      unite: unite || undefined,
      description: description || undefined,
      cible: cible ? Number(cible) : undefined,
      categorie: categorie || undefined,
      domaine_id: domaineId ? Number(domaineId) : undefined,
      programme_id: programmeId ? Number(programmeId) : undefined,
      ordre: Number(ordre) || 1,
      statut,
      valeurs: [
        {
          id: indicator?.valeurs?.[0]?.id || Date.now(),
          periode: "2025/2026",
          valeur: numVal,
        },
      ],
    }

    if (isEditing && indicator) {
      await updateMutation.mutateAsync({
        id: indicator.id,
        payload,
      })
    } else {
      await createMutation.mutateAsync(
        payload as Omit<ImpactIndicator, "id">
      )
    }

    onOpenChange(false)
    onSuccess?.()
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
              ? "Modifiez la définition, la mesure terrain ou la cible de cet indicateur."
              : "Ajoutez un indicateur quantitatif mesurant la transformation en Casamance."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <div>
              <Label htmlFor="ind-libelle" className="text-xs font-semibold">
                Libellé de l'indicateur *
              </Label>
              <Input
                id="ind-libelle"
                required
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
                placeholder="ex. Jeunes & Femmes formés au leadership"
                className="mt-1.5 h-11 rounded-xl text-sm"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="ind-valeur" className="text-xs font-semibold">
                  Valeur mesurée actuelle *
                </Label>
                <Input
                  id="ind-valeur"
                  type="number"
                  required
                  value={valeur}
                  onChange={(e) => setValeur(e.target.value)}
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card font-mono"
                />
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
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="ind-cible" className="text-xs font-semibold">
                  Objectif / Cible visée
                </Label>
                <Input
                  id="ind-cible"
                  type="number"
                  value={cible}
                  onChange={(e) => setCible(e.target.value)}
                  placeholder="ex. 1000"
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card font-mono"
                />
              </div>

              <div>
                <Label htmlFor="ind-cat" className="text-xs font-semibold">
                  Catégorie d'impact
                </Label>
                <Input
                  id="ind-cat"
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value)}
                  placeholder="ex. Jeunesse & Formation"
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                />
              </div>
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

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="ind-dom" className="text-xs font-semibold">
                  Domaine d'intervention lié
                </Label>
                <Select value={domaineId} onValueChange={(val) => setDomaineId(val || "")}>
                  <SelectTrigger id="ind-dom" className="mt-1.5 h-10 rounded-xl text-xs bg-card truncate">
                    <SelectValue placeholder="Aucun domaine" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs max-w-xs">
                    {domains.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        {d.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ind-prog" className="text-xs font-semibold">
                  Programme rattaché
                </Label>
                <Select value={programmeId} onValueChange={(val) => setProgrammeId(val || "")}>
                  <SelectTrigger id="ind-prog" className="mt-1.5 h-10 rounded-xl text-xs bg-card truncate">
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
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="ind-ordre" className="text-xs font-semibold">
                  Ordre d'affichage
                </Label>
                <Input
                  id="ind-ordre"
                  type="number"
                  min={1}
                  value={ordre}
                  onChange={(e) => setOrdre(e.target.value)}
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                />
              </div>

              <div>
                <Label htmlFor="ind-statut" className="text-xs font-semibold">
                  Statut de l'indicateur *
                </Label>
                <Select value={statut} onValueChange={(val) => setStatut(val as "actif" | "inactif")}>
                  <SelectTrigger id="ind-statut" className="mt-1.5 h-10 rounded-xl text-xs bg-card">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs">
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="inactif">Inactif</SelectItem>
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
                <span>{isEditing ? "Enregistrer les modifications" : "Créer l'indicateur"}</span>
              )}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}
