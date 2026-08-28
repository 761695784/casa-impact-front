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
import { Handshake, Loader2, Globe, Mail, Phone, Image as ImageIcon } from "lucide-react"
import type { Partner } from "@/types/models"
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
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
                className="mt-1.5 h-11 rounded-xl text-sm"
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
                className="mt-1.5 rounded-xl resize-none text-xs"
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

            <div>
              <Label htmlFor="partner-logo" className="text-xs font-semibold">
                Logo (chemin ou URL)
              </Label>
              <Input
                id="partner-logo"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="ex. /images/partners/ard.png"
                className="mt-1.5 h-10 rounded-xl text-xs bg-card"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 pt-1">
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
                Statut administratif
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
                <span>{isEditing ? "Enregistrer les modifications" : "Ajouter le partenaire"}</span>
              )}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}
