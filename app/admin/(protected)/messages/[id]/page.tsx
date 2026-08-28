"use client"

import React, { useState, use, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Layers,
  Trash2,
  Send,
  Save,
  CheckCircle,
  Clock,
  ShieldCheck,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { formatDate } from "@/lib/format"
import {
  CONTACT_CATEGORY_LABELS,
  CONTACT_MESSAGE_STATUS_LABELS,
} from "@/types/enums"
import {
  useContactMessage,
  useUpdateContactMessage,
  useDeleteContactMessage,
} from "@/hooks/use-contact-messages"
import type { ContactMessageStatus } from "@/types/enums"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function AdminMessageDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const id = resolvedParams.id

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [notesInternes, setNotesInternes] = useState("")
  const [statut, setStatut] = useState<ContactMessageStatus>("nouveau")

  const {
    data: message,
    isLoading,
    isError,
    error,
    refetch,
  } = useContactMessage(id)

  const updateMutation = useUpdateContactMessage()
  const deleteMutation = useDeleteContactMessage()

  useEffect(() => {
    if (message) {
      setNotesInternes(message.notes_internes || "")
      setStatut(message.statut)
    }
  }, [message])

  const fullName = message ? `${message.prenom || ""} ${message.nom}`.trim() : ""

  const handleSaveTreatment = async () => {
    if (!message) return
    await updateMutation.mutateAsync({
      id: message.id,
      payload: {
        statut,
        notes_internes: notesInternes.trim() || undefined,
      },
    })
  }

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

  if (isError || !message) {
    return (
      <div className="space-y-6">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-full text-xs gap-1.5"
        >
          <Link href="/admin/messages">
            <ArrowLeft className="size-3.5" />
            <span>Retour aux messages</span>
          </Link>
        </Button>
        <ErrorState
          title="Message introuvable"
          message={
            error instanceof Error
              ? error.message
              : "Impossible de récupérer ce message."
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
              <Link href="/admin/messages">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">
              <Mail className="size-3.5" />
              <span>
                {CONTACT_CATEGORY_LABELS[message.categorie] || message.categorie}
              </span>
            </div>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {message.sujet || "Sans sujet"}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            De <strong>{fullName}</strong> • Reçu le{" "}
            {message.created_at ? formatDate(message.created_at) : "—"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            asChild
            size="sm"
            className="rounded-full text-xs gap-1.5 bg-forest hover:bg-forest/90 text-white"
          >
            <a
              href={`mailto:${message.email}?subject=Re:%20${encodeURIComponent(
                message.sujet || "Votre message à Casa Impact"
              )}`}
            >
              <Send className="size-3.5" />
              <span>Répondre par e-mail</span>
            </a>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setConfirmDelete(true)}
            className="size-8 rounded-full text-destructive hover:bg-destructive/10"
            title="Supprimer le message"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* 2. Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left (2 spans): Message Content & Sender */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Card: Corps du message */}
          <Card className="rounded-3xl border-border shadow-2xs">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <FileText className="size-4 text-forest" />
                <span>Contenu du message</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="rounded-2xl bg-secondary/30 p-4 sm:p-5 border border-border/50">
                <p className="text-xs sm:text-sm leading-relaxed text-foreground whitespace-pre-line">
                  {message.message}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card: Expéditeur */}
          <Card className="rounded-3xl border-border shadow-2xs">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Mail className="size-4 text-forest" />
                <span>Coordonnées de l'expéditeur</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Nom & Prénom
                  </span>
                  <span className="font-bold text-foreground mt-0.5 block">
                    {fullName}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Adresse e-mail
                  </span>
                  <a
                    href={`mailto:${message.email}`}
                    className="font-semibold text-primary hover:underline flex items-center gap-1.5 mt-0.5"
                  >
                    <Mail className="size-3.5" />
                    <span>{message.email}</span>
                  </a>
                </div>
                {message.telephone && (
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Téléphone
                    </span>
                    <a
                      href={`tel:${message.telephone}`}
                      className="font-semibold text-primary hover:underline flex items-center gap-1.5 mt-0.5"
                    >
                      <Phone className="size-3.5" />
                      <span>{message.telephone}</span>
                    </a>
                  </div>
                )}
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Catégorie déclarée
                  </span>
                  <span className="font-semibold text-foreground mt-0.5 block">
                    {CONTACT_CATEGORY_LABELS[message.categorie] || message.categorie}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right (1 span): Treatment & Internal Notes */}
        <div className="space-y-6">
          
          <Card className="rounded-3xl border-border shadow-2xs">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-forest" />
                <span>Traitement interne</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-5 space-y-4 text-xs">
              {/* Statut selector */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Statut du dossier</Label>
                <Select
                  value={statut}
                  onValueChange={(val) =>
                    setStatut(val as ContactMessageStatus)
                  }
                >
                  <SelectTrigger className="h-10 rounded-2xl text-xs">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs">
                    {(
                      Object.keys(
                        CONTACT_MESSAGE_STATUS_LABELS
                      ) as ContactMessageStatus[]
                    ).map((key) => (
                      <SelectItem key={key} value={key}>
                        {CONTACT_MESSAGE_STATUS_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes internes */}
              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <Label htmlFor="notes" className="text-xs font-semibold">
                  Notes de suivi interne
                </Label>
                <Textarea
                  id="notes"
                  rows={4}
                  value={notesInternes}
                  onChange={(e) => setNotesInternes(e.target.value)}
                  placeholder="Notes réservées à l'équipe (ex : contacté par téléphone le...)"
                  className="rounded-2xl text-xs resize-none"
                />
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSaveTreatment}
                disabled={updateMutation.isPending}
                className="w-full rounded-full text-xs gap-1.5 bg-forest text-white hover:bg-forest/90 font-medium"
              >
                <Save className="size-3.5" />
                <span>
                  {updateMutation.isPending ? "Enregistrement..." : "Enregistrer le suivi"}
                </span>
              </Button>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* Deletion Dialog */}
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Supprimer ce message ?"
        description={`Confirmez-vous la suppression définitive du message de ${fullName} ?`}
        confirmText="Supprimer"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          await deleteMutation.mutateAsync(message.id)
          setConfirmDelete(false)
          router.push("/admin/messages")
        }}
      />
    </div>
  )
}
