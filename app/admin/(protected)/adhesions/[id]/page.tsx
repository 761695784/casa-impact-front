"use client"

import React, { useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  UserCheck,
  XCircle,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CreditCard,
  Calendar,
  Layers,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { formatDate, formatNumber } from "@/lib/format"
import {
  MEMBERSHIP_REGION_LABELS,
  CONTRIBUTION_DOMAIN_LABELS,
  CONTRIBUTION_TYPE_LABELS,
} from "@/types/enums"
import {
  useMembership,
  useValidateMembership,
  useRejectMembership,
  useDeleteMembership,
} from "@/hooks/use-memberships"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function AdminMembershipDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const id = resolvedParams.id

  const [confirmValidate, setConfirmValidate] = useState(false)
  const [confirmReject, setConfirmReject] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const {
    data: membership,
    isLoading,
    isError,
    error,
    refetch,
  } = useMembership(id)

  const validateMutation = useValidateMembership()
  const rejectMutation = useRejectMembership()
  const deleteMutation = useDeleteMembership()

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in-50 duration-300">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-8 w-64 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-40 rounded-3xl" />
          </div>
          <Skeleton className="h-80 rounded-3xl" />
        </div>
      </div>
    )
  }

  if (isError || !membership) {
    return (
      <div className="space-y-6">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-full text-xs gap-1.5"
        >
          <Link href="/admin/adhesions">
            <ArrowLeft className="size-3.5" />
            <span>Retour aux adhésions</span>
          </Link>
        </Button>
        <ErrorState
          title="Adhésion introuvable"
          message={
            error instanceof Error
              ? error.message
              : "Impossible de récupérer ce dossier."
          }
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in-50 duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="size-8 rounded-full"
            >
              <Link href="/admin/adhesions">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">
              <CreditCard className="size-3.5" />
              <span>Dossier d'Adhésion</span>
            </div>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {membership.nom_complet}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Référence {membership.reference || `#${membership.id}`} • Demandée le{" "}
            {membership.created_at ? formatDate(membership.created_at) : "—"}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {membership.statut !== "validee" && (
            <Button
              size="sm"
              onClick={() => setConfirmValidate(true)}
              className="rounded-full text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <UserCheck className="size-3.5" />
              <span>Valider l'adhésion</span>
            </Button>
          )}

          {membership.statut !== "refusee" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmReject(true)}
              className="rounded-full text-xs gap-1.5 text-amber-700 hover:bg-amber-500/10 border-amber-300"
            >
              <XCircle className="size-3.5" />
              <span>Refuser</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setConfirmDelete(true)}
            className="size-8 rounded-full text-destructive hover:bg-destructive/10"
            title="Supprimer la demande"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* 2. Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column (2 spans): Identity & Contribution */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Card: Identité & Contact */}
          <Card className="rounded-3xl border-border shadow-2xs">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Briefcase className="size-4 text-forest" />
                <span>Profil & Coordonnées</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Nom complet
                  </span>
                  <span className="font-bold text-foreground text-base">
                    {membership.nom_complet}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Profession / Activité
                  </span>
                  <span className="font-semibold text-foreground">
                    {membership.profession || "Non renseigné"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Adresse e-mail
                  </span>
                  <a
                    href={`mailto:${membership.email}`}
                    className="font-medium text-primary hover:underline flex items-center gap-1.5 mt-0.5"
                  >
                    <Mail className="size-3.5" />
                    <span>{membership.email}</span>
                  </a>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Téléphone (WhatsApp)
                  </span>
                  <a
                    href={`tel:${membership.telephone}`}
                    className="font-medium text-primary hover:underline flex items-center gap-1.5 mt-0.5"
                  >
                    <Phone className="size-3.5" />
                    <span>{membership.telephone}</span>
                  </a>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Région
                  </span>
                  <span className="font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                    <MapPin className="size-3.5 text-forest" />
                    <span>
                      {MEMBERSHIP_REGION_LABELS[membership.region] ||
                        membership.region}
                    </span>
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Département / Commune
                  </span>
                  <span className="font-semibold text-foreground">
                    {membership.departement || "Non renseigné"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Pôle d'engagement & Type de contribution */}
          <Card className="rounded-3xl border-border shadow-2xs">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Layers className="size-4 text-earth" />
                <span>Engagement au sein du Mouvement</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Pôle / Commission choisi
                  </span>
                  <span className="font-bold text-foreground mt-0.5 block">
                    {CONTRIBUTION_DOMAIN_LABELS[membership.domaine_contribution] ||
                      membership.domaine_contribution}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Type de contribution
                  </span>
                  <span className="font-bold text-foreground mt-0.5 block">
                    {CONTRIBUTION_TYPE_LABELS[membership.type_contribution] ||
                      membership.type_contribution}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column (1 span): Status, Cotisation & Metas */}
        <div className="space-y-6">
          
          {/* Card: Statut & Cotisation */}
          <Card className="rounded-3xl border-border shadow-2xs">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <CreditCard className="size-4 text-amber-600" />
                <span>Statut & Cotisation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4 text-xs sm:text-sm">
              <div>
                <span className="text-xs text-muted-foreground block mb-1">
                  Statut de la demande
                </span>
                <StatusBadge status={membership.statut} />
              </div>

              <div className="pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground block">
                  Montant de la carte de membre
                </span>
                <span className="font-mono font-bold text-lg text-foreground block">
                  {formatNumber(membership.montant || 1000)} FCFA
                </span>
              </div>

              <div>
                <span className="text-xs text-muted-foreground block mb-1">
                  État du paiement
                </span>
                <span
                  className={`inline-block rounded-md px-2 py-0.5 text-xs font-bold uppercase ${
                    membership.paiement_statut === "paye"
                      ? "bg-emerald-500/10 text-emerald-700"
                      : membership.paiement_statut === "echoue"
                      ? "bg-rose-500/10 text-rose-700"
                      : "bg-amber-500/10 text-amber-700"
                  }`}
                >
                  {membership.paiement_statut === "paye"
                    ? "Cotisation Réglée"
                    : membership.paiement_statut === "echoue"
                    ? "Paiement Échoué"
                    : "En Attente de règlement"}
                </span>
              </div>

              <div className="pt-2 border-t border-border/50 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  <span>
                    Demandée le :{" "}
                    <strong className="text-foreground">
                      {membership.created_at
                        ? formatDate(membership.created_at)
                        : "—"}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="size-3.5" />
                  <span>
                    Réf :{" "}
                    <strong className="font-mono text-foreground">
                      {membership.reference || `#${membership.id}`}
                    </strong>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* Validation Dialog */}
      <ConfirmDialog
        open={confirmValidate}
        onOpenChange={setConfirmValidate}
        title="Confirmer la validation de l'adhésion ?"
        description={`Confirmez-vous la réception du paiement de la cotisation (1 000 FCFA) et l'émission de la carte de membre pour ${membership.nom_complet} ?`}
        confirmText="Valider l'adhésion"
        variant="default"
        isLoading={validateMutation.isPending}
        onConfirm={async () => {
          await validateMutation.mutateAsync(membership.id)
          setConfirmValidate(false)
        }}
      />

      {/* Rejection Dialog */}
      <ConfirmDialog
        open={confirmReject}
        onOpenChange={setConfirmReject}
        title="Refuser cette adhésion ?"
        description={`Voulez-vous marquer le dossier de ${membership.nom_complet} comme refusé ?`}
        confirmText="Refuser"
        variant="destructive"
        isLoading={rejectMutation.isPending}
        onConfirm={async () => {
          await rejectMutation.mutateAsync(membership.id)
          setConfirmReject(false)
        }}
      />

      {/* Deletion Dialog */}
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Supprimer définitivement cette adhésion ?"
        description="Cette action effacera complètement le dossier de la base."
        confirmText="Supprimer"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          await deleteMutation.mutateAsync(membership.id)
          setConfirmDelete(false)
          router.push("/admin/adhesions")
        }}
      />
    </div>
  )
}
