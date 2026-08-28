"use client"

import React, { useState, useMemo } from "react"
import { Mail, MailOpen, Clock, CheckCircle2 } from "lucide-react"
import { MessagesFilterBar } from "@/components/admin/messages/messages-filter-bar"
import { MessagesTable } from "@/components/admin/messages/messages-table"
import { MessagesMobileList } from "@/components/admin/messages/messages-mobile-list"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  useContactMessages,
  useMarkContactMessageAsRead,
  useDeleteContactMessage,
} from "@/hooks/use-contact-messages"
import type { ContactMessage } from "@/types/models"

export default function AdminMessagesPage() {
  const [search, setSearch] = useState("")
  const [categorie, setCategorie] = useState("all")
  const [statut, setStatut] = useState("all")
  const [lu, setLu] = useState<"all" | "true" | "false">("all")

  // Modal dialog states
  const [deletingMessage, setDeletingMessage] = useState<ContactMessage | null>(
    null
  )

  const {
    data: messages = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useContactMessages({ search, categorie, statut, lu })

  const markAsReadMutation = useMarkContactMessageAsRead()
  const deleteMutation = useDeleteContactMessage()

  const handleReset = () => {
    setSearch("")
    setCategorie("all")
    setStatut("all")
    setLu("all")
  }

  // Summary counts
  const counts = useMemo(() => {
    return {
      total: messages.length,
      nonLus: messages.filter((m) => !m.lu).length,
      enCours: messages.filter((m) => m.statut === "en_cours").length,
      traites: messages.filter((m) => m.statut === "traite").length,
    }
  }, [messages])

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">
            <Mail className="size-3.5" />
            <span>Courrier & Demandes Publiques</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Messages de Contact
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Traitement des prises de contact, propositions de partenariat et sollicitations reçues depuis le site public.
          </p>
        </div>
      </div>

      {/* 2. KPI Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-3xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Mail className="size-4 text-forest" />
            <span>Total Messages</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {counts.total}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <MailOpen className="size-4 text-amber-600" />
            <span>Messages Non Lus</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-amber-600">
            {counts.nonLus}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Clock className="size-4 text-blue-600" />
            <span>En cours de traitement</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-blue-600">
            {counts.enCours}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>Messages Traités</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-emerald-600">
            {counts.traites}
          </p>
        </div>
      </div>

      {/* 3. Filters Bar */}
      <MessagesFilterBar
        search={search}
        categorie={categorie}
        statut={statut}
        lu={lu}
        onSearchChange={setSearch}
        onCategorieChange={setCategorie}
        onStatutChange={setStatut}
        onLuChange={(val) => setLu((val || "all") as "all" | "true" | "false")}
        onReset={handleReset}
        totalCount={messages.length}
      />

      {/* 4. Content */}
      {isLoading ? (
        <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      ) : isError ? (
        <ErrorState
          title="Impossible de charger les messages"
          message={
            error instanceof Error ? error.message : "Erreur de connexion."
          }
          onRetry={() => refetch()}
        />
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
            <Mail className="size-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Aucun message trouvé
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {search || categorie !== "all" || statut !== "all" || lu !== "all"
              ? "Aucun message ne correspond aux filtres appliqués."
              : "Aucun message n'a été reçu pour l'instant."}
          </p>
          {(search ||
            categorie !== "all" ||
            statut !== "all" ||
            lu !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="mt-4 rounded-full"
            >
              Réinitialiser les filtres
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <MessagesTable
              messages={messages}
              onMarkAsRead={(m) => markAsReadMutation.mutate(m.id)}
              onDelete={(m) => setDeletingMessage(m)}
            />
          </div>

          {/* Mobile Cards View */}
          <MessagesMobileList
            messages={messages}
            onMarkAsRead={(m) => markAsReadMutation.mutate(m.id)}
            onDelete={(m) => setDeletingMessage(m)}
          />
        </div>
      )}

      {/* Deletion Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingMessage}
        onOpenChange={(open) => !open && setDeletingMessage(null)}
        title="Supprimer définitivement ce message ?"
        description={`Confirmez-vous la suppression du message de ${deletingMessage?.prenom || ""} ${deletingMessage?.nom} (${deletingMessage?.email}) ?`}
        confirmText="Supprimer"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (deletingMessage) {
            await deleteMutation.mutateAsync(deletingMessage.id)
            setDeletingMessage(null)
          }
        }}
      />
    </div>
  )
}
