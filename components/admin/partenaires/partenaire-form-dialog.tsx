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
import { PARTNER_STATUS_LABELS, PARTNER_TYPE_LABELS } from "@/types/enums"
import { useCreatePartner, useUpdatePartner } from "@/hooks/use-partners"
import { MediaPickerDialog } from "@/components/admin/media/media-picker-dialog"
import { Handshake, Loader2, Globe, Mail, Phone, Image as ImageIcon, Building2 } from "lucide-react"
import type { Partner, Media } from "@/types/models"
import type { PartnerStatus, PartnerType } from "@/types/enums"

interface PartenaireFormDialogProps {
  partner?: Partner | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function PartenaireFormDialog({
  partner,
  open,
  onOpenChange,
  onSuccess,
}: PartenaireFormDialogProps) {
  const isEditing = !!partner

  const createMutation = useCreatePartner()
  const updateMutation = useUpdatePartner()

  const [nom, setNom] = useState("")
  const [type, setType] = useState<PartnerType>("institutionnel")
  const [description, setDescription] = useState("")
  const [lien, setLien] = useState("")
  const [logo, setLogo] = useState("")
  const [ordre, setOrdre] = useState<string>("1")
  const [contactEmail, setContactEmail] = useState("")
  const [contactTelephone, setContactTelephone] = useState("")
  const [statut, setStatut] = useState<PartnerStatus>("actif")

  // Media Picker Dialog state
  const [isLogoPickerOpen, setIsLogoPickerOpen] = useState(false)

  useEffect(() => {
    if (partner) {
      setNom(partner.nom || "")
      setType(partner.type || "institutionnel")
      setDescription(partner.description || "")
      setLien(partner.lien || "")
      setLogo(partner.logo || "")
      setOrdre(partner.ordre ? String(partner.ordre) : "1")
      setContactEmail(partner.contact_email || "")
      setContactTelephone(partner.contact_telephone || "")
      setStatut(partner.statut || "actif")
    } else {
      setNom("")
      setType("institutionnel")
      setDescription("")
      setLien("")
      setLogo("")
      setOrdre("1")
      setContactEmail("")
      setContactTelephone("")
      setStatut("actif")
    }
  }, [partner, open])

  const isPending = createMutation.isPending || updateMutation.isPending

  const handleSelectLogo = (selected: Media[]) => {
    if (selected.length > 0) {
      setLogo(selected[0].url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      nom,
      type,
      description: description || undefined,
      lien: lien || undefined,
      logo: logo || undefined,
      ordre: Number(ordre) || 1,
      contact_email: contactEmail || undefined,
      contact_telephone: contactTelephone || undefined,
      statut,
    }

    if (isEditing && partner) {
      await updateMutation.mutateAsync({
        id: partner.id,
        payload,
      })
    } else {
      await createMutation.mutateAsync(payload as Omit<Partner, "id">)
    }

    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl rounded-3xl p-6 sm:p-8">
          <DialogHeader className="space-y-1">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
              <Handshake className="size-5" />
            </div>
            <DialogTitle className="font-display text-xl font-bold text-foreground">
              {isEditing ? "Modifier le partenaire" : "Nouveau partenaire institutionnel"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {isEditing
                ? "Ajustez les informations, coordonnées et logo de ce partenaire."
                : "Ajoutez une organisation partenaire (institution, bailleur, structure technique, média)."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 space-y-5">
            
            {/* Section 1 : Informations Principales */}
            <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-forest text-white text-[11px] font-bold">
                  1
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Identité de l'Organisation
                </h4>
              </div>

              <div>
                <Label htmlFor="partner-nom" className="text-xs font-semibold">
                  Nom officiel de l'organisation *
                </Label>
                <Input
                  id="partner-nom"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="ex. Agence Régionale de Développement (ARD)"
                  className="mt-1.5 h-11 rounded-xl text-sm bg-card"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="partner-type" className="text-xs font-semibold">
                    Typologie de partenariat *
                  </Label>
                  <Select value={type} onValueChange={(val) => setType(val as PartnerType)}>
                    <SelectTrigger id="partner-type" className="mt-1.5 h-10 rounded-xl text-xs bg-card">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl text-xs">
                      {(Object.keys(PARTNER_TYPE_LABELS) as PartnerType[]).map((key) => (
                        <SelectItem key={key} value={key}>
                          {PARTNER_TYPE_LABELS[key]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="partner-ordre" className="text-xs font-semibold">
                    Ordre d'affichage
                  </Label>
                  <Input
                    id="partner-ordre"
                    type="number"
                    min={1}
                    value={ordre}
                    onChange={(e) => setOrdre(e.target.value)}
                    className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="partner-desc" className="text-xs font-semibold">
                  Description institutionnelle
                </Label>
                <Textarea
                  id="partner-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Rôle et implication du partenaire auprès de Casa Impact..."
                  className="mt-1.5 rounded-xl resize-none text-xs bg-card"
                />
              </div>

              <div>
                <Label htmlFor="partner-lien" className="text-xs font-semibold">
                  Lien site web officiel
                </Label>
                <Input
                  id="partner-lien"
                  type="url"
                  value={lien}
                  onChange={(e) => setLien(e.target.value)}
                  placeholder="https://www.organisation-partenaire.sn"
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                />
              </div>
            </div>

            {/* Section 2 : Logo Partenaire (Médiathèque) */}
            <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-forest text-white text-[11px] font-bold">
                    2
                  </span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Logo Officiel du Partenaire
                  </h4>
                </div>

                <Button
                  type="button"
                  onClick={() => setIsLogoPickerOpen(true)}
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs font-bold gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                >
                  <ImageIcon className="size-3.5" />
                  <span>Choisir dans la médiathèque</span>
                </Button>
              </div>

              {logo ? (
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-3.5">
                  <div className="flex items-center gap-4">
                    <div className="relative size-16 rounded-2xl overflow-hidden bg-white shrink-0 border border-border shadow-xs flex items-center justify-center p-2">
                      <img
                        src={logo}
                        alt={nom || "Logo du partenaire"}
                        className="size-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary mb-1">
                        <Building2 className="size-3" />
                        Logo partenaire actif
                      </span>
                      <p className="text-xs font-bold text-foreground truncate">
                        {logo}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsLogoPickerOpen(true)}
                          className="h-7 rounded-lg text-xs font-semibold px-2 text-primary hover:bg-primary/10"
                        >
                          Changer
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setLogo("")}
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
                  onClick={() => setIsLogoPickerOpen(true)}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/60 p-5 text-center cursor-pointer hover:border-primary/50 hover:bg-secondary/60 transition-all group"
                >
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <ImageIcon className="size-4" />
                  </div>
                  <p className="mt-2 text-xs font-bold text-foreground">
                    Aucun logo sélectionné
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Cliquez ici pour sélectionner le logo dans la médiathèque
                  </p>
                </div>
              )}
            </div>

            {/* Section 3 : Contact & Statut */}
            <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-forest text-white text-[11px] font-bold">
                  3
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Contacts Référents & Statut
                </h4>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="partner-email" className="text-xs font-semibold">
                    Email de contact
                  </Label>
                  <Input
                    id="partner-email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contact@partenaire.sn"
                    className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                  />
                </div>

                <div>
                  <Label htmlFor="partner-tel" className="text-xs font-semibold">
                    Téléphone de contact
                  </Label>
                  <Input
                    id="partner-tel"
                    type="tel"
                    value={contactTelephone}
                    onChange={(e) => setContactTelephone(e.target.value)}
                    placeholder="+221 33 000 00 00"
                    className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                  />
                </div>
              </div>

              <div className="pt-1">
                <Label htmlFor="partner-statut" className="text-xs font-semibold">
                  Statut administratif *
                </Label>
                <Select value={statut} onValueChange={(val) => setStatut(val as PartnerStatus)}>
                  <SelectTrigger id="partner-statut" className="mt-1.5 h-10 rounded-xl text-xs bg-card">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs">
                    {(Object.keys(PARTNER_STATUS_LABELS) as PartnerStatus[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {PARTNER_STATUS_LABELS[key]}
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
                  <span>{isEditing ? "Enregistrer les modifications" : "Créer le partenaire"}</span>
                )}
              </Button>
            </DialogFooter>

          </form>
        </DialogContent>
      </Dialog>

      {/* Media Picker Dialog for Partner Logo (Single Select) */}
      <MediaPickerDialog
        open={isLogoPickerOpen}
        onOpenChange={setIsLogoPickerOpen}
        multiple={false}
        selectedUrls={logo ? [logo] : []}
        onSelect={handleSelectLogo}
        title="Choisir le Logo du Partenaire"
        description="Sélectionnez le fichier vectoriel ou logo officiel dans la médiathèque."
      />
    </>
  )
}
