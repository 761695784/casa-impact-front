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
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Megaphone, Loader2, Sparkles } from "lucide-react"
import { APPLICATION_CALL_STATUS_LABELS, REGION_LABELS } from "@/types/enums"
import { mockPrograms } from "@/lib/mock/programs.mock"
import { useCreateApplicationCall, useUpdateApplicationCall } from "@/hooks/use-application-calls"
import type { ApplicationCall, ApplicationDocument } from "@/types/models"
import type { ApplicationCallStatus, Region } from "@/types/enums"

interface AppelFormDialogProps {
  applicationCall: ApplicationCall | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const DEFAULT_DOCUMENTS: ApplicationDocument[] = [
  { cle: "cv", libelle: "Curriculum Vitae", requis: true, formats: ["pdf"], taille_max: 5 },
  { cle: "lettre_motivation", libelle: "Lettre de motivation", requis: true, formats: ["pdf", "docx"], taille_max: 5 },
]

export function AppelFormDialog({
  applicationCall,
  open,
  onOpenChange,
  onSuccess,
}: AppelFormDialogProps) {
  const isEditing = !!applicationCall

  const [titre, setTitre] = useState("")
  const [slug, setSlug] = useState("")
  const [resume, setResume] = useState("")
  const [description, setDescription] = useState("")
  const [programmeId, setProgrammeId] = useState<string>("1")
  const [region, setRegion] = useState<string>("ziguinchor")
  const [localisation, setLocalisation] = useState("")
  const [dateOuverture, setDateOuverture] = useState("")
  const [dateLimite, setDateLimite] = useState("")
  const [nombrePlaces, setNombrePlaces] = useState<string>("30")
  const [statut, setStatut] = useState<ApplicationCallStatus>("brouillon")
  const [documents, setDocuments] = useState<ApplicationDocument[]>(DEFAULT_DOCUMENTS)

  const createMutation = useCreateApplicationCall()
  const updateMutation = useUpdateApplicationCall()
  const isPending = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (applicationCall) {
      setTitre(applicationCall.titre || "")
      setSlug(applicationCall.slug || "")
      setResume(applicationCall.resume || "")
      setDescription(applicationCall.description || "")
      setProgrammeId(applicationCall.programme_id ? String(applicationCall.programme_id) : "1")
      setRegion(applicationCall.region || "ziguinchor")
      setLocalisation(applicationCall.localisation || "")
      setDateOuverture(applicationCall.date_ouverture || "")
      setDateLimite(applicationCall.date_limite || "")
      setNombrePlaces(applicationCall.nombre_places ? String(applicationCall.nombre_places) : "")
      setStatut(applicationCall.statut || "brouillon")
      setDocuments(
        applicationCall.documents_requis && applicationCall.documents_requis.length > 0
          ? applicationCall.documents_requis
          : DEFAULT_DOCUMENTS
      )
    } else {
      // Reset for creation
      setTitre("")
      setSlug("")
      setResume("")
      setDescription("")
      setProgrammeId("1")
      setRegion("ziguinchor")
      setLocalisation("Ziguinchor")
      setDateOuverture(new Date().toISOString().split("T")[0])
      setDateLimite("")
      setNombrePlaces("30")
      setStatut("brouillon")
      setDocuments(DEFAULT_DOCUMENTS)
    }
  }, [applicationCall, open])

  const handleAddDocument = () => {
    setDocuments([
      ...documents,
      { cle: `doc_${Date.now()}`, libelle: "Nouveau document requis", requis: true, formats: ["pdf"], taille_max: 5 },
    ])
  }

  const handleRemoveDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index))
  }

  const handleUpdateDoc = (index: number, field: keyof ApplicationDocument, val: any) => {
    const updated = [...documents]
    updated[index] = { ...updated[index], [field]: val }
    setDocuments(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      titre,
      slug: slug || titre.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      resume,
      description,
      programme_id: Number(programmeId),
      region: region as Region,
      localisation,
      date_ouverture: dateOuverture || undefined,
      date_limite: dateLimite || undefined,
      nombre_places: nombrePlaces ? Number(nombrePlaces) : null,
      statut,
      documents_requis: documents,
    }

    if (isEditing && applicationCall) {
      await updateMutation.mutateAsync({
        id: applicationCall.id,
        payload,
      })
    } else {
      await createMutation.mutateAsync(payload)
    }

    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-1">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
            <Megaphone className="size-5" />
          </div>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            {isEditing ? "Modifier l'appel à candidatures" : "Créer un nouvel appel à candidatures"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Définissez les détails, le calendrier et les pièces demandées aux candidats.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          
          {/* Section 1 : Informations Principales */}
          <div className="space-y-4 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-forest">
              1. Informations Générales
            </span>

            <div className="space-y-3">
              <div>
                <Label htmlFor="call-titre" className="text-xs font-semibold">
                  Titre officiel de l'appel *
                </Label>
                <Input
                  id="call-titre"
                  required
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  placeholder="Ex : Cohorte 2026 — Académie du Leadership Jeune"
                  className="mt-1.5 h-11 rounded-xl text-sm"
                />
              </div>

              <div>
                <Label htmlFor="call-resume" className="text-xs font-semibold">
                  Résumé accrocheur (affiché dans les cartes et aperçus)
                </Label>
                <Textarea
                  id="call-resume"
                  rows={2}
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Brève synthèse pour donner envie aux candidats de postuler..."
                  className="mt-1.5 rounded-xl resize-none text-xs"
                />
              </div>

              <div>
                <Label htmlFor="call-description" className="text-xs font-semibold">
                  Description complète de l'opportunité
                </Label>
                <Textarea
                  id="call-description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Objectifs, critères d'éligibilité, déroulement du programme..."
                  className="mt-1.5 rounded-xl resize-none text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2 : Programme, Territoire & Calendrier */}
          <div className="space-y-4 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-forest">
              2. Programme, Territoire & Calendrier
            </span>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="call-programme" className="text-xs font-semibold">
                  Programme associé
                </Label>
                <Select value={programmeId} onValueChange={(val) => setProgrammeId(val || "1")}>
                  <SelectTrigger id="call-programme" className="mt-1.5 h-10 rounded-xl text-xs">
                    <SelectValue placeholder="Sélectionner un programme" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs">
                    {mockPrograms.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.titre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="call-region" className="text-xs font-semibold">
                  Région cible
                </Label>
                <Select value={region} onValueChange={(val) => setRegion(val || "ziguinchor")}>
                  <SelectTrigger id="call-region" className="mt-1.5 h-10 rounded-xl text-xs">
                    <SelectValue placeholder="Région" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs">
                    {(Object.keys(REGION_LABELS) as Region[]).map((r) => (
                      <SelectItem key={r} value={r}>
                        {REGION_LABELS[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="call-localisation" className="text-xs font-semibold">
                  Lieu / Localisation précise
                </Label>
                <Input
                  id="call-localisation"
                  value={localisation}
                  onChange={(e) => setLocalisation(e.target.value)}
                  placeholder="Ex : Ziguinchor, Kolda, Sédhiou..."
                  className="mt-1.5 h-10 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label htmlFor="call-places" className="text-xs font-semibold">
                  Nombre de places disponibles
                </Label>
                <Input
                  id="call-places"
                  type="number"
                  min={1}
                  value={nombrePlaces}
                  onChange={(e) => setNombrePlaces(e.target.value)}
                  placeholder="Ex : 40"
                  className="mt-1.5 h-10 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label htmlFor="call-date-ouverture" className="text-xs font-semibold">
                  Date d'ouverture
                </Label>
                <Input
                  id="call-date-ouverture"
                  type="date"
                  value={dateOuverture}
                  onChange={(e) => setDateOuverture(e.target.value)}
                  className="mt-1.5 h-10 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label htmlFor="call-date-limite" className="text-xs font-semibold">
                  Date limite de candidature *
                </Label>
                <Input
                  id="call-date-limite"
                  type="date"
                  required
                  value={dateLimite}
                  onChange={(e) => setDateLimite(e.target.value)}
                  className="mt-1.5 h-10 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3 : Documents Requis pour Postuler */}
          <div className="space-y-4 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-forest">
                3. Documents Requis du Candidat
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddDocument}
                className="h-8 rounded-full text-xs gap-1"
              >
                <Plus className="size-3.5" />
                <span>Ajouter un document</span>
              </Button>
            </div>

            <div className="space-y-2.5">
              {documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 rounded-xl border border-border/80 bg-card p-3"
                >
                  <Input
                    value={doc.libelle}
                    onChange={(e) => handleUpdateDoc(idx, "libelle", e.target.value)}
                    placeholder="Intitulé du document (ex: CV)"
                    className="h-9 rounded-lg text-xs flex-1"
                  />
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                      <Checkbox
                        checked={doc.requis}
                        onCheckedChange={(checked: boolean) => handleUpdateDoc(idx, "requis", checked)}
                      />
                      <span>Obligatoire</span>
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveDocument(idx)}
                      disabled={documents.length <= 1}
                      className="size-8 text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4 : Statut de Publication */}
          <div className="space-y-2 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <Label htmlFor="call-statut" className="text-xs font-bold uppercase tracking-wider text-forest">
              4. Statut de Publication
            </Label>
            <Select value={statut} onValueChange={(val) => setStatut(val as ApplicationCallStatus)}>
              <SelectTrigger id="call-statut" className="h-11 rounded-xl text-sm bg-card">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl text-sm">
                <SelectItem value="brouillon">Brouillon (Non visible sur le site public)</SelectItem>
                <SelectItem value="publie">Publié (Ouvert aux candidatures)</SelectItem>
                <SelectItem value="ferme">Fermé (Clôturé)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-3 flex flex-col-reverse sm:flex-row gap-2">
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
                <span>{isEditing ? "Mettre à jour l'appel" : "Créer l'appel"}</span>
              )}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}
