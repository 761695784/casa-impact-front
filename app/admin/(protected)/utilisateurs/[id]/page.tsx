"use client"

import React, { useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Shield,
  Clock,
  Key,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { UserFormDialog } from "@/components/admin/users/user-form-dialog"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { PermissionGate } from "@/components/admin/permission-gate"
import { formatDate, initials } from "@/lib/format"
import { ADMIN_ROLE_LABELS } from "@/types/enums"
import { useAuth } from "@/lib/auth/auth-context"
import {
  useUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/use-users"
import type { AdminRoleSlug } from "@/types/admin"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function AdminUserDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const id = resolvedParams.id
  const { user: currentUser } = useAuth()

  const [formOpen, setFormOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { data: user, isLoading, isError, error, refetch } = useUser(id)
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()

  const isMe = currentUser?.id === user?.id
  const fullName = user ? `${user.prenom || ""} ${user.nom}`.trim() : ""

  const handleUpdate = async (payload: {
    nom: string
    prenom?: string
    email: string
    role_slug: AdminRoleSlug
    statut?: "actif" | "inactif" | "suspendu"
  }) => {
    if (user) {
      await updateMutation.mutateAsync({
        id: user.id,
        payload,
      })
    }
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

  if (isError || !user) {
    return (
      <div className="space-y-6">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-full text-xs gap-1.5"
        >
          <Link href="/admin/utilisateurs">
            <ArrowLeft className="size-3.5" />
            <span>Retour aux utilisateurs</span>
          </Link>
        </Button>
        <ErrorState
          title="Utilisateur introuvable"
          message={
            error instanceof Error
              ? error.message
              : "Impossible de récupérer ce compte."
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
              <Link href="/admin/utilisateurs">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">
              <Shield className="size-3.5" />
              <span>Profil Utilisateur</span>
            </div>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {fullName}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Compte administratif #{user.id} • {(user.role?.slug && ADMIN_ROLE_LABELS[user.role.slug]) || user.role?.nom || "Utilisateur"}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <PermissionGate roles={["administrateur-principal"]}>
            <Button
              size="sm"
              onClick={() => setFormOpen(true)}
              className="rounded-full text-xs gap-1.5 bg-forest hover:bg-forest/90 text-white"
            >
              <Pencil className="size-3.5" />
              <span>Modifier le compte</span>
            </Button>

            {!isMe && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setConfirmDelete(true)}
                className="size-8 rounded-full text-destructive hover:bg-destructive/10"
                title="Supprimer l'utilisateur"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </PermissionGate>
        </div>
      </div>

      {/* 2. Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column (2 spans): Profile & Permissions */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Card: Profil */}
          <Card className="rounded-3xl border-border shadow-2xs">
            <CardHeader className="border-b border-border/60 pb-4">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-full bg-forest/10 border border-forest/20 text-forest flex items-center justify-center font-display font-bold text-lg shrink-0">
                  {initials(fullName || user.email)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl font-bold text-foreground">
                      {fullName}
                    </CardTitle>
                    {isMe && (
                      <span className="rounded-md bg-forest/15 px-2 py-0.5 text-xs font-bold text-forest">
                        Votre compte
                      </span>
                    )}
                  </div>
                  <a
                    href={`mailto:${user.email}`}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="size-3.5" />
                    <span>{user.email}</span>
                  </a>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-5 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Prénom
                  </span>
                  <span className="font-semibold text-foreground">
                    {user.prenom || "Non renseigné"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Nom
                  </span>
                  <span className="font-semibold text-foreground">
                    {user.nom}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Statut du compte
                  </span>
                  <span
                    className={`inline-block mt-1 rounded-md px-2 py-0.5 text-xs font-bold uppercase ${
                      user.statut === "actif"
                        ? "bg-emerald-500/10 text-emerald-700"
                        : user.statut === "suspendu"
                        ? "bg-rose-500/10 text-rose-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {user.statut || "actif"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Date de création
                  </span>
                  <span className="font-semibold text-foreground">
                    {user.created_at ? formatDate(user.created_at) : "—"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Rôle & Permissions */}
          <Card className="rounded-3xl border-border shadow-2xs">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Key className="size-4 text-forest" />
                <span>Privilèges & Droits d'Accès</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4 text-xs sm:text-sm">
              <div>
                <span className="text-xs text-muted-foreground block">
                  Rôle administratif officiel
                </span>
                <span className="font-bold text-foreground text-base mt-0.5 flex items-center gap-2">
                  <Shield className="size-4 text-forest" />
                  <span>
                    {(user.role?.slug && ADMIN_ROLE_LABELS[user.role.slug]) || user.role?.nom || "Utilisateur"}
                  </span>
                </span>
              </div>

              <div className="pt-3 border-t border-border/50">
                <span className="text-xs text-muted-foreground block mb-2">
                  Périmètre des permissions accordées :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(user.role?.permissions || user.permissions || ["*"]).map(
                    (perm, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-md bg-secondary/80 px-2.5 py-1 text-xs font-mono text-foreground"
                      >
                        <CheckCircle className="size-3 text-forest" />
                        <span>{perm}</span>
                      </span>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column (1 span): Metas & Logs */}
        <div className="space-y-6">
          
          <Card className="rounded-3xl border-border shadow-2xs">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Clock className="size-4 text-forest" />
                <span>Activité & Sécurité</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4 text-xs">
              <div className="space-y-2">
                <div>
                  <span className="text-muted-foreground block">
                    Dernière connexion enregistrée :
                  </span>
                  <span className="font-semibold text-foreground text-xs block mt-0.5">
                    {user.derniere_connexion
                      ? formatDate(user.derniere_connexion, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Aucune connexion"}
                  </span>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <span className="text-muted-foreground block">
                    Dernière mise à jour du profil :
                  </span>
                  <span className="font-semibold text-foreground text-xs block mt-0.5">
                    {user.updated_at
                      ? formatDate(user.updated_at)
                      : "Non modifiée"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* Edit Dialog */}
      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={user}
        onSubmit={handleUpdate}
        loading={updateMutation.isPending}
      />

      {/* Deletion Dialog */}
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Supprimer cet utilisateur ?"
        description={`Confirmez-vous la suppression définitive du compte de ${fullName} (${user.email}) ?`}
        confirmText="Supprimer"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          await deleteMutation.mutateAsync(user.id)
          setConfirmDelete(false)
          router.push("/admin/utilisateurs")
        }}
      />
    </div>
  )
}
