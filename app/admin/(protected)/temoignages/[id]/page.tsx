"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Quote,
  Edit,
  Trash2,
  Power,
  Compass,
  Building,
  UserCheck,
  Calendar,
  ExternalLink,
} from "lucide-react"
import {
  useTestimonial,
  useDeleteTestimonial,
  useUpdateTestimonial,
} from "@/hooks/use-testimonials"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { TemoignageFormDialog } from "@/components/admin/temoignages/temoignage-form-dialog"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate, resolveMediaUrl } from "@/lib/format"
import { TESTIMONIAL_STATUS_LABELS } from "@/types/enums"

export default function TemoignageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id ? String(params.id) : ""

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isToggleStatusOpen, setIsToggleStatusOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const { data: testimonial, isLoading, isError, error, refetch } =
    useTestimonial(id)
  const deleteMutation = useDeleteTestimonial()
  const updateMutation = useUpdateTestimonial()

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

  if (isError || !testimonial) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="rounded-full gap-1.5 text-xs">
          <Link href="/admin/temoignages">
            <ArrowLeft className="size-4" />
            <span>Retour aux témoignages</span>
          </Link>
        </Button>
        <ErrorState
          title="Témoignage introuvable"
          message={
            error instanceof Error
              ? error.message
              : "Ce témoignage n'existe pas ou n'a pas pu être chargé."
          }
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(testimonial.id)
    router.push("/admin/temoignages")
  }

  const handleToggleStatus = async () => {
    const nextStatut =
      testimonial.statut === "archive" ? "publie" : "archive"
    await updateMutation.mutateAsync({
      id: testimonial.id,
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
            <Link href="/admin/temoignages">
              <ArrowLeft className="size-4" />
              <span>Retour à tous les témoignages</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full text-xs gap-1.5 border-border hover:bg-secondary"
          >
            <Link href="/qui-sommes-nous" target="_blank">
              <ExternalLink className="size-3.5 text-forest" />
              <span>Voir sur le site public</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-border bg-secondary flex items-center justify-center font-bold text-forest font-display text-lg">
              {testimonial.media?.[0]?.url ? (
                <Image
                  src={resolveMediaUrl(testimonial.media[0].url) || testimonial.media[0].url}
                  alt={testimonial.auteur}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              ) : (
                <span>{testimonial.auteur.substring(0, 2).toUpperCase()}</span>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-md">
                  Fiche #{testimonial.id}
                </span>
                <StatusBadge status={testimonial.statut} />
              </div>

              <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {testimonial.auteur}
              </h1>
              {testimonial.role_organisation && (
                <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
                  {testimonial.role_organisation}
                </p>
              )}
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
              <span>{testimonial.statut === "archive" ? "Publier" : "Archiver"}</span>
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
              <span>Modifier</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Left Column (8 cols) : Récit & Citation */}
        <div className="space-y-8 lg:col-span-8">
          
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="border-b border-border/80 pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest">
                  Récit d'Impact
                </span>
                <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                  Parole de Bénéficiaire
                </h2>
              </div>
              <Quote className="size-8 text-forest/20" />
            </div>

            <blockquote className="text-sm sm:text-base leading-relaxed text-foreground font-serif italic bg-secondary/30 rounded-2xl p-6 border border-border/50">
              « {testimonial.citation} »
            </blockquote>

            {/* Programme Associé */}
            {testimonial.program && (
              <div className="pt-2 border-t border-border/40">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Programme Rattaché
                </span>
                <Link
                  href={`/admin/programmes/${testimonial.program.id}`}
                  className="inline-flex items-center gap-2 rounded-2xl bg-forest/5 p-4 border border-forest/20 text-xs text-foreground hover:bg-forest/10 transition-colors w-full"
                >
                  <Compass className="size-5 text-forest shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-forest block truncate">
                      {testimonial.program.titre}
                    </span>
                    <span className="text-muted-foreground text-[11px] block truncate">
                      Consulter la fiche programme associée
                    </span>
                  </div>
                  <ExternalLink className="size-3.5 text-muted-foreground shrink-0" />
                </Link>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (4 cols) : Profil & Paramètres */}
        <div className="space-y-8 lg:col-span-4">
          
          {/* Identité du Témoin */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs space-y-4">
            <h3 className="font-display text-base font-bold text-foreground border-b border-border/80 pb-3">
              Fiche du Témoin
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Nom Complet
                </span>
                <span className="font-semibold text-foreground mt-0.5 block">
                  {testimonial.auteur}
                </span>
              </div>

              {testimonial.role_organisation && (
                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Rôle / Organisation
                  </span>
                  <span className="font-medium text-foreground mt-0.5 block">
                    {testimonial.role_organisation}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Paramètres d'Affichage */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs space-y-4">
            <h3 className="font-display text-base font-bold text-foreground border-b border-border/80 pb-3">
              Paramètres d'Affichage
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Identifiant
                </span>
                <span className="font-bold text-sm text-foreground mt-0.5 block">
                  #{testimonial.id}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Statut
                </span>
                <div className="mt-1">
                  <StatusBadge status={testimonial.statut} />
                </div>
              </div>

              {testimonial.created_at && (
                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Date de Saisie
                  </span>
                  <span className="font-medium text-muted-foreground mt-0.5 block">
                    {formatDate(testimonial.created_at)}
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Formulaire Modal */}
      <TemoignageFormDialog
        testimonial={testimonial}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      {/* Confirmation Activation / Désactivation */}
      <ConfirmDialog
        open={isToggleStatusOpen}
        onOpenChange={setIsToggleStatusOpen}
        title={
          testimonial.statut === "archive"
            ? "Publier ce témoignage"
            : "Archiver ce témoignage"
        }
        description={
          testimonial.statut === "archive"
            ? `Êtes-vous sûr de vouloir publier le témoignage de « ${testimonial.auteur} » ?`
            : `Êtes-vous sûr de vouloir archiver le témoignage de « ${testimonial.auteur} » ? Il sera retiré du site public.`
        }
        confirmText={
          testimonial.statut === "archive"
            ? "Publier le témoignage"
            : "Archiver le témoignage"
        }
        variant={testimonial.statut === "archive" ? "default" : "warning"}
        isLoading={updateMutation.isPending}
        onConfirm={handleToggleStatus}
      />

      {/* Confirmation Suppression */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Supprimer ce témoignage"
        description={`Êtes-vous certain de vouloir supprimer le témoignage de « ${testimonial.auteur} » ?`}
        confirmText="Supprimer définitivement"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />

    </div>
  )
}
