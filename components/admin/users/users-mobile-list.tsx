"use client"

import React from "react"
import Link from "next/link"
import { Eye, Pencil, Trash2, Mail, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PermissionGate } from "@/components/admin/permission-gate"
import { formatDate, initials } from "@/lib/format"
import { ADMIN_ROLE_LABELS } from "@/types/enums"
import { useAuth } from "@/lib/auth/auth-context"
import type { User } from "@/types/models"

interface UsersMobileListProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function UsersMobileList({
  users,
  onEdit,
  onDelete,
}: UsersMobileListProps) {
  const { user: currentUser } = useAuth()

  return (
    <div className="space-y-4 md:hidden">
      {users.map((u) => {
        const isMe = currentUser?.id === u.id
        const fullName = `${u.prenom || ""} ${u.nom}`.trim()

        return (
          <div
            key={u.id}
            className="rounded-3xl border border-border bg-card p-5 shadow-2xs space-y-4"
          >
            {/* Header Card */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-full bg-forest/10 border border-forest/20 text-forest flex items-center justify-center font-bold text-xs shrink-0">
                  {initials(fullName || u.email)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/admin/utilisateurs/${u.id}`}
                      className="font-bold text-sm text-foreground hover:text-primary transition-colors truncate"
                    >
                      {fullName}
                    </Link>
                    {isMe && (
                      <span className="rounded-md bg-forest/15 px-1.5 py-0.2 text-[9px] font-bold text-forest">
                        Vous
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Mail className="size-3" />
                    <span className="truncate">{u.email}</span>
                  </span>
                </div>
              </div>

              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                  u.statut === "actif"
                    ? "bg-emerald-500/10 text-emerald-700"
                    : u.statut === "suspendu"
                    ? "bg-rose-500/10 text-rose-700"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {u.statut || "actif"}
              </span>
            </div>

            {/* Role & Connection Info */}
            <div className="rounded-2xl bg-secondary/40 p-3 text-xs space-y-1.5 border border-border/50">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-[11px]">Rôle :</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <Shield className="size-3 text-forest" />
                  <span>{ADMIN_ROLE_LABELS[u.role?.slug] || u.role?.nom}</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-[11px]">Dernière activité :</span>
                <span className="text-muted-foreground">
                  {u.derniere_connexion
                    ? formatDate(u.derniere_connexion)
                    : "Jamais connecté"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1 border-t border-border/60">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 rounded-full text-xs gap-1.5"
              >
                <Link href={`/admin/utilisateurs/${u.id}`}>
                  <Eye className="size-3.5 text-forest" />
                  <span>Profil</span>
                </Link>
              </Button>

              <PermissionGate roles={["administrateur-principal"]}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(u)}
                  className="rounded-full text-xs gap-1"
                >
                  <Pencil className="size-3.5 text-amber-600" />
                  <span>Modifier</span>
                </Button>

                {!isMe && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(u)}
                    className="size-9 rounded-full text-destructive hover:bg-destructive/10"
                    title="Supprimer l'utilisateur"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </PermissionGate>
            </div>
          </div>
        )
      })}
    </div>
  )
}
