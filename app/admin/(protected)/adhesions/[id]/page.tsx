"use client"

import React, { useState, use } from "react"
import Link from "next/link"
import Image from "next/image"
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
  Sparkles,
  Maximize2,
  Download,
  User,
  CheckCircle2,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent } from "@/components/ui/dialog"
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
import { BaobabMark } from "@/components/brand/baobab-mark"
import { toast } from "sonner"

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
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)

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

  const memberPhoto = membership.photo || "/assets/team/fatoumata-drame.jpg"

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in-50 duration-300">
      {/* 1. Page Header & Back Button */}
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
              className="rounded-full text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
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

      {/* 2. Highlight Card: Photo du Membre & Informations Clés */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Photo Profile Box with Zoom trigger */}
          <div className="relative group shrink-0">
            <div
              onClick={() => setIsPhotoModalOpen(true)}
              className="relative size-28 sm:size-32 rounded-3xl overflow-hidden border-2 border-forest/20 shadow-md bg-secondary cursor-pointer"
            >
              {membership.photo ? (
                <img
                  src={membership.photo}
                  alt={membership.nom_complet}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="size-full flex flex-col items-center justify-center bg-primary/10 text-primary">
                  <User className="size-12 opacity-50" />
                  <span className="text-[10px] font-bold mt-1 text-muted-foreground">Sans photo</span>
                </div>
              )}

              {/* Hover Zoom Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Maximize2 className="size-6" />
              </div>
            </div>

            <span className="absolute -bottom-2 -right-2 flex size-7 items-center justify-center rounded-full bg-forest text-white shadow-md border-2 border-background">
              <CheckCircle2 className="size-4" />
            </span>
          </div>

          {/* Member Core Info */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="font-mono text-xs font-bold text-forest bg-forest/10 px-2.5 py-0.5 rounded-full">
                {membership.reference || `#${membership.id}`}
              </span>
              <StatusBadge status={membership.statut} />
              <span className="text-xs text-muted-foreground">
                • Région {MEMBERSHIP_REGION_LABELS[membership.region] || membership.region}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-foreground">
              {membership.nom_complet}
            </h2>

            <p className="text-sm font-medium text-foreground/80">
              {membership.profession || "Profession non spécifiée"}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs">
              <a
                href={`mailto:${membership.email}`}
                className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
              >
                <Mail className="size-3.5" />
                <span>{membership.email}</span>
              </a>
              <a
                href={`tel:${membership.telephone}`}
                className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
              >
                <Phone className="size-3.5" />
                <span>{membership.telephone}</span>
              </a>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-3.5 text-forest" />
                <span>{membership.departement || "Casamance"}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Grid: Profil, Engagement & Simulation Carte de Membre */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column (2 spans): Identity, Engagement & Official Card Preview */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Card: Carte de Membre Officielle Preview */}
          <Card className="rounded-3xl border-border shadow-2xs overflow-hidden">
            <CardHeader className="border-b border-border/60 pb-4 bg-secondary/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="size-4 text-accent" />
                  <span>Carte de Membre Numérique Officielle</span>
                </CardTitle>
                <span className="text-[11px] font-bold text-muted-foreground">
                  Modèle 2026
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <p className="text-xs text-muted-foreground">
                Aperçu du modèle officiel de carte de membre avec la photo d'identité et les attributs du titulaire.
              </p>

              {/* Member Card Mockup Visual */}
              <div className="relative aspect-[16/10] w-full max-w-lg mx-auto overflow-hidden rounded-2xl bg-secondary shadow-xl border border-border">
                <Image
                  src="/assets/Carte-membres.png"
                  alt="Carte de membre Casa Impact"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover"
                />

                {/* Overlaid Dynamic Badge on Preview */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 flex flex-col justify-end text-white">
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 rounded-xl overflow-hidden border-2 border-white bg-black/40 shrink-0">
                      {membership.photo ? (
                        <img
                          src={membership.photo}
                          alt={membership.nom_complet}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center bg-white/20">
                          <User className="size-6 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white drop-shadow">
                        {membership.nom_complet}
                      </p>
                      <p className="text-[11px] text-white/80 font-mono">
                        N° {membership.reference || `ADH-2026-0${membership.id}`} • {MEMBERSHIP_REGION_LABELS[membership.region] || membership.region}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Pôle d'engagement & Type de contribution */}
          <Card className="rounded-3xl border-border shadow-2xs">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Layers className="size-4 text-earth" />
                <span>Engagement au sein de l'Organisation</span>
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
                {membership.updated_at && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    <span>
                      Dernière mise à jour :{" "}
                      <strong className="text-foreground">
                        {formatDate(membership.updated_at)}
                      </strong>
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Contact Card */}
          <Card className="rounded-3xl border-border shadow-2xs">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Phone className="size-4 text-forest" />
                <span>Contact Direct</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-3 text-xs">
              <Button
                asChild
                className="w-full rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2"
              >
                <a
                  href={`https://wa.me/${membership.telephone.replace(/[^0-9]/g, "")}?text=Bonjour%20${encodeURIComponent(membership.nom_complet)},%20concernant%20votre%20adh%C3%A9sion%20%C3%A0%20Casa%20Impact...`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="size-3.5" />
                  <span>Contacter via WhatsApp</span>
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full rounded-full text-xs font-semibold gap-2"
              >
                <a href={`mailto:${membership.email}`}>
                  <Mail className="size-3.5" />
                  <span>Envoyer un e-mail</span>
                </a>
              </Button>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* Zoom Modal for Member Photo */}
      <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-3xl text-center bg-card border-border">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-secondary border border-border shadow-md mb-4">
            {membership.photo ? (
              <img
                src={membership.photo}
                alt={membership.nom_complet}
                className="size-full object-cover"
              />
            ) : (
              <div className="size-full flex flex-col items-center justify-center bg-secondary text-muted-foreground">
                <User className="size-16 opacity-40" />
                <p className="text-xs mt-2">Aucune photo transmise</p>
              </div>
            )}
          </div>
          <h3 className="text-base font-bold text-foreground">
            {membership.nom_complet}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Photo d'identité officielle • Référence {membership.reference || `#${membership.id}`}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsPhotoModalOpen(false)}
            className="mt-4 rounded-full w-full"
          >
            Fermer
          </Button>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog: Valider */}
      <ConfirmDialog
        open={confirmValidate}
        onOpenChange={setConfirmValidate}
        title="Valider cette adhésion ?"
        description={`Confirmez-vous la validation de l'adhésion de ${membership.nom_complet} (${membership.reference}) ?`}
        confirmText="Valider l'adhésion"
        variant="default"
        isLoading={validateMutation.isPending}
        onConfirm={async () => {
          await validateMutation.mutateAsync(membership.id)
          setConfirmValidate(false)
        }}
      />

      {/* Confirmation Dialog: Refuser */}
      <ConfirmDialog
        open={confirmReject}
        onOpenChange={setConfirmReject}
        title="Refuser cette adhésion ?"
        description={`Êtes-vous sûr de vouloir refuser le dossier de ${membership.nom_complet} ?`}
        confirmText="Refuser le dossier"
        variant="destructive"
        isLoading={rejectMutation.isPending}
        onConfirm={async () => {
          await rejectMutation.mutateAsync(membership.id)
          setConfirmReject(false)
        }}
      />

      {/* Confirmation Dialog: Supprimer */}
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Supprimer définitivement cette demande ?"
        description={`Cette action est irréversible. Toutes les données liées à l'adhésion de ${membership.nom_complet} seront effacées.`}
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
