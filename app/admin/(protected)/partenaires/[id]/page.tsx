"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Handshake,
  Edit,
  Trash2,
  Power,
  ExternalLink,
  Building2,
  Mail,
  Phone,
  Globe,
} from "lucide-react"
import { usePartner, useDeletePartner, useUpdatePartner } from "@/hooks/use-partners"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { PartenaireFormDialog } from "@/components/admin/partenaires/partenaire-form-dialog"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/format"
import { PARTNER_TYPE_LABELS } from "@/types/enums"

export default function PartenaireDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id ? String(params.id) : ""

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isToggleStatusOpen, setIsToggleStatusOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const { data: partner, isLoading, isError, error, refetch } = usePartner(id)
  const deleteMutation = useDeletePartner()
  const updateMutation = useUpdatePartner()

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in-50">
        <Skeleton className="h-6 w-44 rounded-lg" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-64 rounded-xl" />
          <Skeleton className="h-10 w-44 rounded-full" />
        </div>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <Skeleton className="h-80 rounded-3xl" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !partner) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="rounded-full gap-1.5 text-xs">
          <Link href="/admin/partenaires">
            <ArrowLeft className="size-4" />
            <span>Retour aux partenaires</span>
          </Link>
        </Button>
        <ErrorState
          title="Partenaire introuvable"
          message={error instanceof Error ? error.message : "Ce partenaire n'existe pas ou n'a pas pu être chargé."}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(partner.id)
    router.push("/admin/partenaires")
  }

  const handleToggleStatus = async () => {
    const nextStatut = partner.statut === "inactif" ? "actif" : "inactif"
    await updateMutation.mutateAsync({
      id: partner.id,
      payload: { statut: nextStatut },
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      
      {/* 1. Top Navigation & Action Header */}
      <div className="space-y-4 border-b border-border/80 pb-6">
        <div className="flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="rounded-full gap-1.5 text-xs text-muted-foreground hover:text-foreground -ml-2"
          >
            <Link href="/admin/partenaires">
              <ArrowLeft className="size-4" />
              <span>Retour à tous les partenaires</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full text-xs gap-1.5 border-border hover:bg-secondary"
          >
            <Link href="/partenaires" target="_blank">
              <ExternalLink className="size-3.5 text-forest" />
              <span>Voir la section publique Partenaires</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-secondary/50 text-forest font-bold font-display text-lg">
              {partner.logo ? (
                <Building2 className="size-7 text-forest/70" />
              ) : (
                <span>{partner.nom.substring(0, 2).toUpperCase()}</span>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-forest/10 px-2.5 py-0.5 font-bold text-forest text-xs uppercase tracking-wider">
                  {PARTNER_TYPE_LABELS[partner.type] || partner.type}
                </span>
                <span className="font-mono text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                  Position #{partner.ordre || partner.id}
                </span>
                <StatusBadge status={partner.statut} />
              </div>

              <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {partner.nom}
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
                Organisation partenaire de l'écosystème Casa Impact.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsToggleStatusOpen(true)}
              className="rounded-full gap-1.5 text-xs font-medium"
            >
              <Power className="size-3.5" />
              <span>{partner.statut === "inactif" ? "Activer" : "Désactiver"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
              className="rounded-full gap-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 hover:border-destructive/30"
            >
              <Trash2 className="size-3.5" />
              <span>Supprimer</span>
            </Button>

            <Button
              onClick={() => setIsEditOpen(true)}
              size="sm"
              className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-1.5 shadow-xs"
            >
              <Edit className="size-3.5" />
              <span>Modifier le partenaire</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Left Column (8 cols) : Description & Liens */}
        <div className="space-y-8 lg:col-span-8">
          
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="border-b border-border/80 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-forest">
                Présentation
              </span>
              <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                Rôle et Implication Partenariale
              </h2>
            </div>

            {partner.description ? (
              <p className="text-sm sm:text-base leading-relaxed text-foreground/85 whitespace-pre-line bg-secondary/30 rounded-2xl p-5 border border-border/50">
                {partner.description}
              </p>
            ) : (
              <p className="text-xs italic text-muted-foreground">
                Aucune description spécifique renseignée pour ce partenaire.
              </p>
            )}

            {/* Lien Web */}
            {partner.lien && (
              <div className="pt-2 border-t border-border/40">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  Site Web Officiel
                </span>
                <a
                  href={partner.lien}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:underline"
                >
                  <Globe className="size-4" />
                  <span>{partner.lien}</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (4 cols) : Coordonnées & Métadonnées */}
        <div className="space-y-8 lg:col-span-4">
          
          {/* Contacts & Référents */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs space-y-4">
            <h3 className="font-display text-base font-bold text-foreground border-b border-border/80 pb-3">
              Coordonnées de Contact
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Email
                </span>
                {partner.contact_email ? (
                  <a
                    href={`mailto:${partner.contact_email}`}
                    className="font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 mt-0.5"
                  >
                    <Mail className="size-3.5 text-muted-foreground" />
                    <span>{partner.contact_email}</span>
                  </a>
                ) : (
                  <span className="text-muted-foreground mt-0.5 block">—</span>
                )}
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Téléphone
                </span>
                {partner.contact_telephone ? (
                  <a
                    href={`tel:${partner.contact_telephone}`}
                    className="font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 mt-0.5"
                  >
                    <Phone className="size-3.5 text-muted-foreground" />
                    <span>{partner.contact_telephone}</span>
                  </a>
                ) : (
                  <span className="text-muted-foreground mt-0.5 block">—</span>
                )}
              </div>
            </div>
          </div>

          {/* Fiche Technique */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs space-y-4">
            <h3 className="font-display text-base font-bold text-foreground border-b border-border/80 pb-3">
              Paramètres d'Affichage
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Ordre d'Apparition
                </span>
                <span className="font-bold text-sm text-foreground mt-0.5 block">
                  Rang #{partner.ordre || partner.id}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Statut
                </span>
                <div className="mt-1">
                  <StatusBadge status={partner.statut} />
                </div>
              </div>

              {partner.updated_at && (
                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Dernière Mise à Jour
                  </span>
                  <span className="font-medium text-muted-foreground mt-0.5 block">
                    {formatDate(partner.updated_at)}
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Formulaire Modal */}
      <PartenaireFormDialog
        partner={partner}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      {/* Confirmation Activation / Désactivation */}
      <ConfirmDialog
        open={isToggleStatusOpen}
        onOpenChange={setIsToggleStatusOpen}
        title={
          partner.statut === "inactif"
            ? "Activer ce partenaire"
            : "Désactiver ce partenaire"
        }
        description={
          partner.statut === "inactif"
            ? `Êtes-vous sûr de vouloir réactiver le partenaire « ${partner.nom} » ?`
            : `Êtes-vous sûr de vouloir désactiver le partenaire « ${partner.nom} » ? Son logo ne sera plus visible sur le site public.`
        }
        confirmText={
          partner.statut === "inactif"
            ? "Activer le partenaire"
            : "Désactiver le partenaire"
        }
        variant={partner.statut === "inactif" ? "default" : "warning"}
        isLoading={updateMutation.isPending}
        onConfirm={handleToggleStatus}
      />

      {/* Confirmation Suppression */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Supprimer ce partenaire"
        description={`Êtes-vous certain de vouloir supprimer le partenaire « ${partner.nom} » ?`}
        confirmText="Supprimer définitivement"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />

    </div>
  )
}
