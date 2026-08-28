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
import { TALENT_STATUS_LABELS, REGION_LABELS } from "@/types/enums"
import { useDomains } from "@/hooks/use-domains"
import { usePrograms } from "@/hooks/use-programs"
import { useCreateTalent, useUpdateTalent } from "@/hooks/use-talents"
import { Sparkles, Loader2 } from "lucide-react"
import type { Talent } from "@/types/models"
import type { TalentStatus, Region } from "@/types/enums"

interface TalentFormDialogProps {
  talent?: Talent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function TalentFormDialog({
  talent,
  open,
  onOpenChange,
  onSuccess,
}: TalentFormDialogProps) {
  const isEditing = !!talent

  const createMutation = useCreateTalent()
  const updateMutation = useUpdateTalent()

  const { data: domains = [] } = useDomains()
  const { data: programsData } = usePrograms()
  const programs = programsData?.data || []

  const [nom, setNom] = useState("")
  const [slug, setSlug] = useState("")
  const [domaineActivite, setDomaineActivite] = useState("")
  const [region, setRegion] = useState<Region>("ziguinchor")
  const [localisation, setLocalisation] = useState("")
  const [bio, setBio] = useState("")
  const [parcours, setParcours] = useState("")
  const [photo, setPhoto] = useState("")
  const [domaineId, setDomaineId] = useState<string>("")
  const [programmeId, setProgrammeId] = useState<string>("")
  const [ordre, setOrdre] = useState<string>("1")
  const [statut, setStatut] = useState<TalentStatus>("publie")

  useEffect(() => {
    if (talent) {
      setNom(talent.nom || "")
      setSlug(talent.slug || "")
      setDomaineActivite(talent.domaine_activite || "")
      setRegion(talent.region || "ziguinchor")
      setLocalisation(talent.localisation || "")
      setBio(talent.bio || "")
      setParcours(talent.parcours || "")
      setPhoto(talent.photo || "")
      setDomaineId(
        talent.domaine_id
          ? String(talent.domaine_id)
          : talent.domaine?.id
          ? String(talent.domaine.id)
          : ""
      )
      setProgrammeId(
        talent.programme_id
          ? String(talent.programme_id)
          : talent.programme?.id
          ? String(talent.programme.id)
          : ""
      )
      setOrdre(talent.ordre ? String(talent.ordre) : "1")
      setStatut(talent.statut || "publie")
    } else {
      setNom("")
      setSlug("")
      setDomaineActivite("")
      setRegion("ziguinchor")
      setLocalisation("")
      setBio("")
      setParcours("")
      setPhoto("")
      setDomaineId("")
      setProgrammeId("")
      setOrdre("1")
      setStatut("publie")
    }
  }, [talent, open])

  const isPending = createMutation.isPending || updateMutation.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      nom,
      slug: slug || undefined,
      domaine_activite: domaineActivite || undefined,
      region,
      localisation: localisation || undefined,
      bio: bio || undefined,
      parcours: parcours || undefined,
      photo: photo || undefined,
      domaine_id: domaineId ? Number(domaineId) : undefined,
      programme_id: programmeId ? Number(programmeId) : undefined,
      ordre: Number(ordre) || 1,
      statut,
    }

    if (isEditing && talent) {
      await updateMutation.mutateAsync({
        id: talent.id,
        payload,
      })
    } else {
      await createMutation.mutateAsync(payload as Omit<Talent, "id">)
    }

    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-1">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
            <Sparkles className="size-5" />
          </div>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            {isEditing ? "Modifier le profil de talent" : "Nouveau talent du territoire"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? "Modifiez la fiche biographique et le parcours du talent mis en avant."
              : "Ajoutez un porteur de projet, artiste, sportif ou champion territorial au Mur des Talents."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Section 1 : Identité & Métier */}
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest">
              1. Identité & Métier
            </h4>

            <div>
              <Label htmlFor="talent-nom" className="text-xs font-semibold">
                Nom complet du talent *
              </Label>
              <Input
                id="talent-nom"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="ex. Fatou Kiné Diédhiou"
                className="mt-1.5 h-11 rounded-xl text-sm"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="talent-domaine-act" className="text-xs font-semibold">
                  Domaine d'activité / Spécialité
                </Label>
                <Input
                  id="talent-domaine-act"
                  value={domaineActivite}
                  onChange={(e) => setDomaineActivite(e.target.value)}
                  placeholder="ex. Agroécologie & Transformation"
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                />
              </div>

              <div>
                <Label htmlFor="talent-slug" className="text-xs font-semibold">
                  Slug / URL
                </Label>
                <Input
                  id="talent-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="fatou-kine-diedhiou"
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card font-mono"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="talent-region" className="text-xs font-semibold">
                  Région naturelle *
                </Label>
                <Select value={region} onValueChange={(val) => setRegion(val as Region)}>
                  <SelectTrigger id="talent-region" className="mt-1.5 h-10 rounded-xl text-xs bg-card">
                    <SelectValue placeholder="Région" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs">
                    {(Object.keys(REGION_LABELS) as Region[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {REGION_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="talent-loc" className="text-xs font-semibold">
                  Commune / Localisation
                </Label>
                <Input
                  id="talent-loc"
                  value={localisation}
                  onChange={(e) => setLocalisation(e.target.value)}
                  placeholder="ex. Oussouye, Basse-Casamance"
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                />
              </div>
            </div>
          </div>

          {/* Section 2 : Biographie & Parcours */}
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest">
              2. Présentation & Récit
            </h4>

            <div>
              <Label htmlFor="talent-bio" className="text-xs font-semibold">
                Bio courte / Accroche
              </Label>
              <Textarea
                id="talent-bio"
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Une ou deux phrases synthétisant l'impact du talent..."
                className="mt-1.5 rounded-xl resize-none text-xs"
              />
            </div>

            <div>
              <Label htmlFor="talent-parcours" className="text-xs font-semibold">
                Parcours détaillé & Réalisations
              </Label>
              <Textarea
                id="talent-parcours"
                rows={4}
                value={parcours}
                onChange={(e) => setParcours(e.target.value)}
                placeholder="Racontez les étapes clés, études, création d'entreprise ou distinctions..."
                className="mt-1.5 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Section 3 : Rattachement & Publication */}
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest">
              3. Rattachement Institutionnel & Média
            </h4>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="talent-dom" className="text-xs font-semibold">
                  Domaine d'intervention lié
                </Label>
                <Select value={domaineId} onValueChange={(val) => setDomaineId(val || "")}>
                  <SelectTrigger id="talent-dom" className="mt-1.5 h-10 rounded-xl text-xs bg-card truncate">
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
                <Label htmlFor="talent-prog" className="text-xs font-semibold">
                  Programme rattaché
                </Label>
                <Select value={programmeId} onValueChange={(val) => setProgrammeId(val || "")}>
                  <SelectTrigger id="talent-prog" className="mt-1.5 h-10 rounded-xl text-xs bg-card truncate">
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

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Label htmlFor="talent-photo" className="text-xs font-semibold">
                  Photo (URL ou chemin d'accès)
                </Label>
                <Input
                  id="talent-photo"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder="/assets/team/placeholder.svg"
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                />
              </div>

              <div>
                <Label htmlFor="talent-ordre" className="text-xs font-semibold">
                  Ordre d'affichage
                </Label>
                <Input
                  id="talent-ordre"
                  type="number"
                  min={1}
                  value={ordre}
                  onChange={(e) => setOrdre(e.target.value)}
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="talent-statut" className="text-xs font-semibold">
                Statut de publication *
              </Label>
              <Select value={statut} onValueChange={(val) => setStatut(val as TalentStatus)}>
                <SelectTrigger id="talent-statut" className="mt-1.5 h-10 rounded-xl text-xs bg-card">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl text-xs">
                  {(Object.keys(TALENT_STATUS_LABELS) as TalentStatus[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {TALENT_STATUS_LABELS[key]}
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
                <span>{isEditing ? "Enregistrer les modifications" : "Créer le profil"}</span>
              )}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}
