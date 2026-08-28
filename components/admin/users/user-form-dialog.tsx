"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ADMIN_ROLE_LABELS } from "@/types/enums"
import type { User } from "@/types/models"
import type { AdminRoleSlug } from "@/types/admin"

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: User | null
  onSubmit: (data: {
    nom: string
    prenom?: string
    email: string
    role_slug: AdminRoleSlug
    statut?: "actif" | "inactif" | "suspendu"
  }) => Promise<void>
  loading?: boolean
}

export function UserFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  loading = false,
}: UserFormDialogProps) {
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [email, setEmail] = useState("")
  const [roleSlug, setRoleSlug] = useState<AdminRoleSlug>("communication")
  const [statut, setStatut] = useState<"actif" | "inactif" | "suspendu">("actif")

  const isEditing = !!initialData

  useEffect(() => {
    if (initialData) {
      setNom(initialData.nom || "")
      setPrenom(initialData.prenom || "")
      setEmail(initialData.email || "")
      setRoleSlug((initialData.role?.slug as AdminRoleSlug) || "communication")
      setStatut((initialData.statut as "actif" | "inactif" | "suspendu") || "actif")
    } else {
      setNom("")
      setPrenom("")
      setEmail("")
      setRoleSlug("communication")
      setStatut("actif")
    }
  }, [initialData, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nom.trim() || !email.trim()) return

    await onSubmit({
      nom: nom.trim(),
      prenom: prenom.trim() || undefined,
      email: email.trim(),
      role_slug: roleSlug,
      statut,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold">
            {isEditing
              ? "Modifier le compte utilisateur"
              : "Créer un compte administratif"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? "Ajustez les privilèges ou l'état d'activation du compte."
              : "Le nouvel utilisateur recevra un lien d'activation sécurisé par email."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Prénom & Nom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="prenom" className="text-xs font-semibold">
                Prénom
              </Label>
              <Input
                id="prenom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Ex : Ousmane"
                className="h-10 rounded-2xl text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nom" className="text-xs font-semibold">
                Nom <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nom"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex : Faye"
                className="h-10 rounded-2xl text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">
              Adresse e-mail professionnelle <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@casa-impact.org"
              className="h-10 rounded-2xl text-xs sm:text-sm"
            />
          </div>

          {/* Rôle & Statut */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Rôle attribué <span className="text-destructive">*</span>
              </Label>
              <Select
                value={roleSlug}
                onValueChange={(val) => setRoleSlug(val as AdminRoleSlug)}
              >
                <SelectTrigger className="h-10 rounded-2xl text-xs truncate">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl text-xs">
                  {(Object.keys(ADMIN_ROLE_LABELS) as AdminRoleSlug[]).map(
                    (key) => (
                      <SelectItem key={key} value={key}>
                        {ADMIN_ROLE_LABELS[key]}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Statut du compte <span className="text-destructive">*</span>
              </Label>
              <Select
                value={statut}
                onValueChange={(val) =>
                  setStatut(val as "actif" | "inactif" | "suspendu")
                }
              >
                <SelectTrigger className="h-10 rounded-2xl text-xs">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl text-xs">
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                  <SelectItem value="suspendu">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4 sm:pt-6 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full text-xs"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading || !nom.trim() || !email.trim()}
              className="rounded-full text-xs bg-forest hover:bg-forest/90 text-white font-medium"
            >
              {loading ? "Enregistrement..." : isEditing ? "Mettre à jour" : "Créer le compte"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
