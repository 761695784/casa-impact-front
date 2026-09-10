"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Download,
  Eye,
  Sparkles,
  Edit,
  User,
  ShieldCheck,
  Briefcase,
  Layers,
  Compass,
  CheckCircle2,
  Clock,
  Loader2,
  Trash2,
} from "lucide-react"
import {
  useApplication,
  useDownloadApplicationDocument,
  useDeleteApplication,
} from "@/hooks/use-applications"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { CandidatureStatusModal } from "@/components/admin/candidatures/candidature-status-modal"
import { CandidaturePromoteModal } from "@/components/admin/candidatures/candidature-promote-modal"
import { DocumentPreviewModal } from "@/components/admin/candidatures/document-preview-modal"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/format"
import { REGION_LABELS } from "@/types/enums"
import type { ApplicationDocumentFile } from "@/types/models"

function formatFileSize(bytes?: number): string {
  if (!bytes) return "—"
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

export default function CandidatureDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params?.id)

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<ApplicationDocumentFile | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const { data: application, isLoading, isError, error, refetch } = useApplication(id)
  const downloadMutation = useDownloadApplicationDocument()
  const deleteMutation = useDeleteApplication()

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in-50">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-64 rounded-xl" />
          <Skeleton className="h-10 w-44 rounded-full" />
        </div>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-72 rounded-3xl" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <Skeleton className="h-80 rounded-3xl" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !application) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="rounded-full gap-1.5 text-xs">
          <Link href="/admin/candidatures">
            <ArrowLeft className="size-4" />
            <span>Retour à la liste</span>
          </Link>
        </Button>
        <ErrorState
          title="Candidature introuvable"
          message={error instanceof Error ? error.message : "Cette candidature n'existe pas ou a été supprimée."}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  const handleDownloadDoc = (docKey: string, filename?: string) => {
    downloadMutation.mutate({
      applicationId: application.id,
      documentKey: docKey,
      filename,
    })
  }

  const handlePreviewDoc = (doc: ApplicationDocumentFile) => {
    setPreviewDoc(doc)
    setIsPreviewOpen(true)
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(application.id)
    router.push("/admin/candidatures")
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
            <Link href="/admin/candidatures">
              <ArrowLeft className="size-4" />
              <span>Retour à toutes les candidatures</span>
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
              className="rounded-full text-xs gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5" />
              <span>Supprimer</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-md">
                {application.reference}
              </span>
              <StatusBadge status={application.statut} />
              {application.promu && (
                <Badge
                  variant="outline"
                  className="border-accent/50 bg-accent/20 text-accent-foreground text-xs font-bold gap-1 px-2.5 py-0.5"
                >
                  <Sparkles className="size-3 text-accent-foreground" />
                  <span>Profil Promu</span>
                </Badge>
              )}
            </div>

            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {application.candidat_nom || "Candidature sans nom"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Dossier déposé le <strong>{application.created_at ? formatDate(application.created_at) : "Date non précisée"}</strong>
              {application.updated_at && (
                <span> • Dernière révision : {formatDate(application.updated_at)}</span>
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => setIsStatusModalOpen(true)}
              size="sm"
              className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-1.5 shadow-xs"
            >
              <Edit className="size-3.5" />
              <span>Évaluer / Modifier Statut</span>
            </Button>

            {!application.promu && (
              <Button
                onClick={() => setIsPromoteModalOpen(true)}
                size="sm"
                variant="outline"
                className="rounded-full border-accent/40 bg-accent/10 text-accent-foreground hover:bg-accent hover:text-accent-foreground font-semibold gap-1.5"
              >
                <Sparkles className="size-3.5 text-accent-foreground" />
                <span>Promouvoir</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Left Column (8 cols) : Projet, Motivation, Documents */}
        <div className="space-y-8 lg:col-span-8">
          
          {/* Projet & Motivation */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="border-b border-border/80 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-forest">
                Présentation du Projet
              </span>
              <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                {application.projet_titre || "Projet d'impact pour la Casamance"}
              </h2>
            </div>

            {application.projet_description && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Description du projet / initiative
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-foreground/90 bg-secondary/30 rounded-2xl p-4 border border-border/50">
                  {application.projet_description}
                </p>
              </div>
            )}

            {application.motivation && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Lettre / Motivation du candidat
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-foreground/90 bg-secondary/30 rounded-2xl p-4 border border-border/50 whitespace-pre-line">
                  {application.motivation}
                </p>
              </div>
            )}
          </div>

          {/* Documents Joints & Téléchargement Sécurisé */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest">
                  Pièces Justificatives
                </span>
                <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                  Documents joints au dossier
                </h2>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                {application.documents?.length || 0} document{application.documents && application.documents.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {application.documents && application.documents.length > 0 ? (
                application.documents.map((doc) => (
                  <div
                    key={doc.cle}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border/80 bg-secondary/30 p-4 transition-colors hover:border-forest/40 hover:bg-secondary/50"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-forest mt-0.5">
                        <FileText className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {doc.libelle || doc.nom_fichier}
                        </p>
                        <p className="text-xs text-muted-foreground truncate font-mono">
                          {doc.nom_fichier} {doc.taille ? `• ${formatFileSize(doc.taille)}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePreviewDoc(doc)}
                        className="rounded-full text-xs gap-1.5 border-border hover:bg-forest/10 hover:text-forest transition-colors"
                      >
                        <Eye className="size-3.5" />
                        <span>Aperçu</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadDoc(doc.cle, doc.nom_fichier)}
                        disabled={downloadMutation.isPending}
                        className="rounded-full text-xs gap-1.5 border-border hover:bg-forest hover:text-white transition-colors"
                      >
                        <Download className="size-3.5" />
                        <span>Télécharger</span>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  Aucun document spécifique n'a été rattaché à cette candidature.
                </div>
              )}
            </div>
          </div>

          {/* Notes Internes d'Évaluation */}
          <div className="rounded-3xl border border-forest/20 bg-forest/5 p-6 sm:p-8 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="size-4.5 text-forest" />
                <span>Notes internes du comité</span>
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsStatusModalOpen(true)}
                className="h-8 rounded-full text-xs text-forest hover:bg-forest/10 gap-1"
              >
                <Edit className="size-3" />
                <span>Modifier les notes</span>
              </Button>
            </div>
            <p className="text-sm leading-relaxed text-foreground/85 bg-background rounded-2xl p-4 border border-forest/15">
              {application.notes_internes || "Aucune note interne enregistrée pour le moment. Cliquez sur Évaluer pour consigner l'avis du jury."}
            </p>
          </div>

        </div>

        {/* Right Column (4 cols) : Profil Candidat & Appel */}
        <div className="space-y-8 lg:col-span-4">
          
          {/* Fiche Identité Candidat */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs space-y-5">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 border-b border-border/80 pb-3">
              <User className="size-4.5 text-primary" />
              <span>Profil du Candidat</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                  Nom Complet
                </span>
                <span className="font-bold text-sm text-foreground block mt-0.5">
                  {application.candidat_nom || "Non renseigné"}
                </span>
              </div>

              {application.profession && (
                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Profession / Statut
                  </span>
                  <span className="font-medium text-foreground block mt-0.5">
                    {application.profession}
                  </span>
                </div>
              )}

              {application.candidat_email && (
                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Adresse Courriel
                  </span>
                  <a
                    href={`mailto:${application.candidat_email}`}
                    className="font-medium text-primary hover:underline flex items-center gap-1 mt-0.5 truncate"
                  >
                    <Mail className="size-3 shrink-0" />
                    <span>{application.candidat_email}</span>
                  </a>
                </div>
              )}

              {application.candidat_telephone && (
                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Téléphone / WhatsApp
                  </span>
                  <a
                    href={`tel:${application.candidat_telephone.replace(/\s+/g, "")}`}
                    className="font-medium text-foreground hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <Phone className="size-3 shrink-0 text-forest" />
                    <span>{application.candidat_telephone}</span>
                  </a>
                </div>
              )}

              {application.region && (
                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Ancrage Régional
                  </span>
                  <span className="font-bold text-forest flex items-center gap-1 mt-0.5">
                    <MapPin className="size-3.5 shrink-0" />
                    <span>
                      {REGION_LABELS[application.region] || application.region}
                      {application.ville ? ` (${application.ville})` : ""}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Appel Associé */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs space-y-4">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 border-b border-border/80 pb-3">
              <Compass className="size-4.5 text-forest" />
              <span>Appel à Candidatures</span>
            </h3>

            <div className="space-y-3 text-xs">
              <p className="font-bold text-sm text-foreground">
                {application.appel?.titre || `Appel #${application.appel_id}`}
              </p>
              
              {application.appel?.resume && (
                <p className="text-muted-foreground leading-relaxed">
                  {application.appel.resume}
                </p>
              )}

              {application.appel?.date_limite && (
                <div className="rounded-xl bg-secondary/50 p-3 border border-border/60 flex items-center justify-between">
                  <span className="text-muted-foreground">Clôture des dépôts :</span>
                  <span className="font-semibold text-foreground">
                    {formatDate(application.appel.date_limite)}
                  </span>
                </div>
              )}

              {application.appel?.nombre_places && (
                <div className="flex items-center justify-between px-1">
                  <span className="text-muted-foreground">Places dans la cohorte :</span>
                  <span className="font-bold text-foreground">
                    {application.appel.nombre_places} lauréats
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Modales */}
      <CandidatureStatusModal
        application={application}
        open={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
      />

      <CandidaturePromoteModal
        application={application}
        open={isPromoteModalOpen}
        onOpenChange={setIsPromoteModalOpen}
      />

      <DocumentPreviewModal
        applicationId={application.id}
        document={previewDoc}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        onDownload={(doc) => handleDownloadDoc(doc.cle, doc.nom_fichier)}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Supprimer cette candidature"
        description={`Êtes-vous sûr de vouloir supprimer définitivement le dossier ${application.reference} (${application.candidat_nom}) ?`}
        confirmText="Supprimer définitivement"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />

    </div>
  )
}
