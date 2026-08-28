"use client"

import React, { useState, useMemo } from "react"
import { ShieldCheck, UserPlus, Users, ShieldAlert, Key } from "lucide-react"
import { UsersFilterBar } from "@/components/admin/users/users-filter-bar"
import { UsersTable } from "@/components/admin/users/users-table"
import { UsersMobileList } from "@/components/admin/users/users-mobile-list"
import { UserFormDialog } from "@/components/admin/users/user-form-dialog"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { ErrorState } from "@/components/admin/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { PermissionGate } from "@/components/admin/permission-gate"
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/use-users"
import type { User } from "@/types/models"
import type { AdminRoleSlug } from "@/types/admin"

export default function AdminUtilisateursPage() {
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("all")
  const [statut, setStatut] = useState("all")

  // Modal dialog states
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useUsers({ search, role, statut })

  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()

  const handleReset = () => {
    setSearch("")
    setRole("all")
    setStatut("all")
  }

  const handleOpenCreate = () => {
    setEditingUser(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (u: User) => {
    setEditingUser(u)
    setFormOpen(true)
  }

  const handleSubmitForm = async (payload: {
    nom: string
    prenom?: string
    email: string
    role_slug: AdminRoleSlug
    statut?: "actif" | "inactif" | "suspendu"
  }) => {
    if (editingUser) {
      await updateMutation.mutateAsync({
        id: editingUser.id,
        payload,
      })
    } else {
      await createMutation.mutateAsync(payload)
    }
  }

  // Summary counts
  const counts = useMemo(() => {
    return {
      total: users.length,
      superAdmins: users.filter(
        (u) => u.role?.slug === "administrateur-principal"
      ).length,
      comm: users.filter((u) => u.role?.slug === "communication").length,
      candidatures: users.filter(
        (u) => u.role?.slug === "gestionnaire-candidatures"
      ).length,
    }
  }, [users])

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">
            <Users className="size-3.5" />
            <span>Sécurité & Rôles</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Gestion des Utilisateurs
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Administration des comptes d'accès, attribution des rôles et contrôle des permissions de l'équipe.
          </p>
        </div>

        <PermissionGate roles={["administrateur-principal"]}>
          <Button
            onClick={handleOpenCreate}
            className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2 shadow-xs shrink-0 self-start sm:self-auto"
          >
            <UserPlus className="size-4" />
            <span>Nouvel utilisateur</span>
          </Button>
        </PermissionGate>
      </div>

      {/* 2. KPI Counters */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-3xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Users className="size-4 text-forest" />
            <span>Total Comptes</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {counts.total}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Key className="size-4 text-purple-600" />
            <span>Admins Principaux</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-purple-700">
            {counts.superAdmins}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>Communication</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-emerald-600">
            {counts.comm}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <ShieldAlert className="size-4 text-blue-600" />
            <span>Candidatures</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-blue-600">
            {counts.candidatures}
          </p>
        </div>
      </div>

      {/* 3. Filters Bar */}
      <UsersFilterBar
        search={search}
        role={role}
        statut={statut}
        onSearchChange={setSearch}
        onRoleChange={setRole}
        onStatutChange={setStatut}
        onReset={handleReset}
        onOpenCreate={handleOpenCreate}
        totalCount={users.length}
      />

      {/* 4. Content State */}
      {isLoading ? (
        <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      ) : isError ? (
        <ErrorState
          title="Impossible de charger les utilisateurs"
          message={
            error instanceof Error ? error.message : "Erreur de connexion."
          }
          onRetry={() => refetch()}
        />
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
            <Users className="size-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            Aucun utilisateur trouvé
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {search || role !== "all" || statut !== "all"
              ? "Aucun compte ne correspond aux filtres appliqués."
              : "Aucun utilisateur administratif enregistré pour le moment."}
          </p>
          {(search || role !== "all" || statut !== "all") && (
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
            <UsersTable
              users={users}
              onEdit={handleOpenEdit}
              onDelete={(u) => setDeletingUser(u)}
            />
          </div>

          {/* Mobile Cards View */}
          <UsersMobileList
            users={users}
            onEdit={handleOpenEdit}
            onDelete={(u) => setDeletingUser(u)}
          />
        </div>
      )}

      {/* Form Dialog (Create / Edit) */}
      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editingUser}
        onSubmit={handleSubmitForm}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Deletion Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        title="Supprimer définitivement ce compte utilisateur ?"
        description={`Cette action est irréversible. L'accès pour ${deletingUser?.prenom || ""} ${deletingUser?.nom} (${deletingUser?.email}) sera définitivement révoqué.`}
        confirmText="Supprimer le compte"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (deletingUser) {
            await deleteMutation.mutateAsync(deletingUser.id)
            setDeletingUser(null)
          }
        }}
      />
    </div>
  )
}
