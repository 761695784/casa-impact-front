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
import { MediaPickerDialog } from "@/components/admin/media/media-picker-dialog"
import { Sparkles, Loader2, Image as ImageIcon, Star, User } from "lucide-react"
import type { Talent, Media } from "@/types/models"
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

  // Media Picker Dialog State
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false)

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

  const handleSelectPhoto = (selected: Media[]) => {
    if (selected.length > 0) {
      setPhoto(selected[0].url)
    }
  }

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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl rounded-3xl p-6 sm:p-8">
          <DialogHeader className="space-y-1">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
              <Sparkles className="size-5" />
            </div>
            <DialogTitle className="font-display text-xl font-bold text-foreground">
              {isEditing ? "Modifier le talent" : "Nouveau talent territorial"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {isEditing
                ? "Mettez à jour le parcours, la photo et les réalisations de ce talent."
                : "Mettez en avant un porteur de projet, innovateur, artisan ou leader inspirant de la Casamance."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 space-y-6">
            
            {/* Section 1 : Identité & Métier */}
            <div className="space-y-3.5 rounded-3xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-forest text-white text-[11px] font-bold">
                  1
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Identité & Spécialité
                </h4>
              </div>

              <div>
                <Label htmlFor="talent-nom" className="text-xs font-semibold">
                  Nom complet du talent *
                </Label>
                <Input
                  id="talent-nom"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="ex. Fatoumata Dramé"
                  className="mt-1.5 h-11 rounded-xl text-sm bg-card"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="talent-dom-act" className="text-xs font-semibold">
                    Domaine d'activité / Métier *
                  </Label>
                  <Input
                    id="talent-dom-act"
                    required
                    value={domaineActivite}
                    onChange={(e) => setDomaineActivite(e.target.value)}
                    placeholder="ex. Éco-construction & Architecture bioclimatique"
                    className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                  />
                </div>

                <div>
                  <Label htmlFor="talent-region" className="text-xs font-semibold">
                    Région *
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
              </div>

              <div>
                <Label htmlFor="talent-loc" className="text-xs font-semibold">
                  Localisation précise (Ville / Commune)
                </Label>
                <Input
                  id="talent-loc"
                  value={localisation}
                  onChange={(e) => setLocalisation(e.target.value)}
                  placeholder="ex. Ziguinchor (Quartier Boukot)"
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                />
              </div>
            </div>

            {/* Section 2 : Photo du Talent (Médiathèque) */}
            <div className="space-y-3.5 rounded-3xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-forest text-white text-[11px] font-bold">
                    2
                  </span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Photo de Profil du Talent
                  </h4>
                </div>

                <Button
                  type="button"
                  onClick={() => setIsPhotoPickerOpen(true)}
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs font-bold gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                >
                  <ImageIcon className="size-3.5" />
                  <span>Choisir dans la médiathèque</span>
                </Button>
              </div>

              {photo ? (
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-3.5">
                  <div className="flex items-center gap-4">
                    <div className="relative size-20 rounded-2xl overflow-hidden bg-secondary shrink-0 border border-border shadow-xs">
                      <img
                        src={photo}
                        alt={nom || "Photo du talent"}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-forest/10 px-2.5 py-0.5 text-[10px] font-bold text-forest mb-1">
                        <User className="size-3" />
                        Photo de profil active
                      </span>
                      <p className="text-xs font-bold text-foreground truncate">
                        {photo}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsPhotoPickerOpen(true)}
                          className="h-7 rounded-lg text-xs font-semibold px-2 text-primary hover:bg-primary/10"
                        >
                          Changer
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setPhoto("")}
                          className="h-7 rounded-lg text-xs font-semibold px-2 text-destructive hover:bg-destructive/10"
                        >
                          Retirer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsPhotoPickerOpen(true)}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/60 p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-secondary/60 transition-all group"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <ImageIcon className="size-5" />
                  </div>
                  <p className="mt-2 text-xs font-bold text-foreground">
                    Aucune photo de profil sélectionnée
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Cliquez ici pour sélectionner une photo de portrait dans la médiathèque
                  </p>
                </div>
              )}
            </div>

            {/* Section 3 : Bio & Parcours */}
            <div className="space-y-3.5 rounded-3xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-forest text-white text-[11px] font-bold">
                  3
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Bio & Parcours d'Excellence
                </h4>
              </div>

              <div>
                <Label htmlFor="talent-bio" className="text-xs font-semibold">
                  Bio courte / Accroche (synthèse percutante)
                </Label>
                <Textarea
                  id="talent-bio"
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Une ou deux phrases synthétisant l'impact du talent..."
                  className="mt-1.5 rounded-xl resize-none text-xs bg-card"
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
                  className="mt-1.5 rounded-xl text-xs bg-card"
                />
              </div>
            </div>

            {/* Section 4 : Rattachement Institutionnel & Publication */}
            <div className="space-y-3.5 rounded-3xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-forest text-white text-[11px] font-bold">
                  4
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Rattachement Institutionnel & Statut
                </h4>
              </div>

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

              <div className="grid gap-3 sm:grid-cols-2">
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

      {/* Media Picker Dialog for Talent Photo (Single Select) */}
      <MediaPickerDialog
        open={isPhotoPickerOpen}
        onOpenChange={setIsPhotoPickerOpen}
        multiple={false}
        selectedUrls={photo ? [photo] : []}
        onSelect={handleSelectPhoto}
        title="Choisir la photo du Talent"
        description="Sélectionnez un portrait ou une photo de terrain pour illustrer le profil de ce talent."
      />
    </>
  )
}
