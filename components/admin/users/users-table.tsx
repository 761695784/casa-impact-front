"use client"

import React from "react"
import Link from "next/link"
import {
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  Mail,
  Shield,
  Clock,
  UserCheck,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { PermissionGate } from "@/components/admin/permission-gate"
import { formatDate, initials } from "@/lib/format"
import { ADMIN_ROLE_LABELS } from "@/types/enums"
import { useAuth } from "@/lib/auth/auth-context"
import type { User } from "@/types/models"

interface UsersTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  const { user: currentUser } = useAuth()

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xs">
      <div className="overflow-x-auto">
        <Table className="w-full text-xs">
          <TableHeader className="bg-secondary/40">
            <TableRow className="hover:bg-transparent border-border/80">
              <TableHead className="font-semibold text-foreground min-w-[220px]">
                Utilisateur & Contact
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[180px]">
                Rôle Administratif
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[120px]">
                Statut
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[140px]">
                Dernière Connexion
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[120px]">
                Créé le
              </TableHead>
              <TableHead className="font-semibold text-foreground text-right min-w-[80px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => {
              const isMe = currentUser?.id === u.id
              const fullName = `${u.prenom || ""} ${u.nom}`.trim()

              return (
                <TableRow
                  key={u.id}
                  className="transition-colors hover:bg-secondary/20 border-border/60"
                >
                  {/* 1. Utilisateur & Avatar */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-forest/10 border border-forest/20 text-forest flex items-center justify-center font-bold text-xs shrink-0">
                        {initials(fullName || u.email)}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/admin/utilisateurs/${u.id}`}
                            className="font-bold text-foreground hover:text-primary transition-colors text-sm truncate"
                          >
                            {fullName}
                          </Link>
                          {isMe && (
                            <span className="rounded-md bg-forest/15 px-1.5 py-0.2 text-[9px] font-bold text-forest">
                              Vous
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                          <Mail className="size-3 shrink-0" />
                          <span>{u.email}</span>
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* 2. Rôle Administratif */}
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold ${
                        u.role?.slug === "administrateur-principal"
                          ? "bg-purple-500/10 text-purple-700"
                          : u.role?.slug === "gestionnaire-candidatures"
                          ? "bg-blue-500/10 text-blue-700"
                          : "bg-emerald-500/10 text-emerald-700"
                      }`}
                    >
                      <Shield className="size-3 shrink-0" />
                      <span>{(u.role?.slug && ADMIN_ROLE_LABELS[u.role.slug]) || u.role?.nom || "Utilisateur"}</span>
                    </span>
                  </TableCell>

                  {/* 3. Statut */}
                  <TableCell>
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-bold uppercase ${
                        u.statut === "actif"
                          ? "bg-emerald-500/10 text-emerald-700"
                          : u.statut === "suspendu"
                          ? "bg-rose-500/10 text-rose-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {u.statut || "actif"}
                    </span>
                  </TableCell>

                  {/* 4. Dernière Connexion */}
                  <TableCell>
                    <span className="text-muted-foreground text-xs flex items-center gap-1.5">
                      <Clock className="size-3 shrink-0" />
                      <span>
                        {u.derniere_connexion
                          ? formatDate(u.derniere_connexion)
                          : "Jamais connecté"}
                      </span>
                    </span>
                  </TableCell>

                  {/* 5. Date de Création */}
                  <TableCell>
                    <span className="text-muted-foreground text-xs">
                      {u.created_at ? formatDate(u.created_at) : "—"}
                    </span>
                  </TableCell>

                  {/* 6. Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-full text-muted-foreground hover:text-foreground"
                            aria-label="Actions"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="w-44 rounded-2xl text-xs">
                        <DropdownMenuItem
                          render={
                            <Link
                              href={`/admin/utilisateurs/${u.id}`}
                              className="flex items-center gap-2"
                            >
                              <Eye className="size-3.5 text-forest" />
                              <span>Voir le profil</span>
                            </Link>
                          }
                        />
                        <PermissionGate roles={["administrateur-principal"]}>
                          <DropdownMenuItem
                            onClick={() => onEdit(u)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Pencil className="size-3.5 text-amber-600" />
                            <span>Modifier les accès</span>
                          </DropdownMenuItem>

                          {!isMe && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onDelete(u)}
                                className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                                <span>Supprimer le compte</span>
                              </DropdownMenuItem>
                            </>
                          )}
                        </PermissionGate>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
