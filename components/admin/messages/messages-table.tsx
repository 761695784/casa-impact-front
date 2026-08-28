"use client"

import React from "react"
import Link from "next/link"
import {
  Eye,
  CheckCircle,
  Trash2,
  MoreHorizontal,
  Mail,
  MailOpen,
  Phone,
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
import { formatDate } from "@/lib/format"
import {
  CONTACT_CATEGORY_LABELS,
  CONTACT_MESSAGE_STATUS_LABELS,
} from "@/types/enums"
import type { ContactMessage } from "@/types/models"

interface MessagesTableProps {
  messages: ContactMessage[]
  onMarkAsRead: (message: ContactMessage) => void
  onDelete: (message: ContactMessage) => void
}

export function MessagesTable({
  messages,
  onMarkAsRead,
  onDelete,
}: MessagesTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xs">
      <div className="overflow-x-auto">
        <Table className="w-full text-xs">
          <TableHeader className="bg-secondary/40">
            <TableRow className="hover:bg-transparent border-border/80">
              <TableHead className="w-8"></TableHead>
              <TableHead className="font-semibold text-foreground min-w-[200px]">
                Expéditeur & Contact
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[150px]">
                Catégorie
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[280px]">
                Sujet & Message
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[120px]">
                Statut
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[110px]">
                Date
              </TableHead>
              <TableHead className="font-semibold text-foreground text-right min-w-[80px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((m) => {
              const fullName = `${m.prenom || ""} ${m.nom}`.trim()
              const isUnread = !m.lu

              return (
                <TableRow
                  key={m.id}
                  className={`transition-colors hover:bg-secondary/20 border-border/60 ${
                    isUnread ? "bg-forest/[0.03] font-medium" : ""
                  }`}
                >
                  {/* Read indicator */}
                  <TableCell className="pl-4 pr-1 py-4">
                    {isUnread ? (
                      <span
                        className="size-2 rounded-full bg-forest block shrink-0"
                        title="Message non lu"
                      />
                    ) : (
                      <span className="size-2 rounded-full bg-transparent block shrink-0" />
                    )}
                  </TableCell>

                  {/* 1. Expéditeur & Contact */}
                  <TableCell>
                    <div className="space-y-0.5">
                      <Link
                        href={`/admin/messages/${m.id}`}
                        className={`hover:text-primary transition-colors text-sm line-clamp-1 ${
                          isUnread ? "font-bold text-foreground" : "font-semibold text-foreground"
                        }`}
                      >
                        {fullName}
                      </Link>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="truncate max-w-[130px]">{m.email}</span>
                        {m.telephone && (
                          <>
                            <span>•</span>
                            <span>{m.telephone}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* 2. Catégorie */}
                  <TableCell>
                    <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-[11px] font-medium text-foreground block truncate max-w-[140px]">
                      {CONTACT_CATEGORY_LABELS[m.categorie] || m.categorie}
                    </span>
                  </TableCell>

                  {/* 3. Sujet & Aperçu */}
                  <TableCell>
                    <div className="space-y-0.5 max-w-[320px]">
                      <Link
                        href={`/admin/messages/${m.id}`}
                        className={`hover:text-primary transition-colors block truncate ${
                          isUnread ? "font-bold text-foreground" : "font-semibold text-foreground"
                        }`}
                      >
                        {m.sujet || "Sans sujet"}
                      </Link>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        {m.message}
                      </p>
                    </div>
                  </TableCell>

                  {/* 4. Statut */}
                  <TableCell>
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                        m.statut === "nouveau"
                          ? "bg-forest/15 text-forest"
                          : m.statut === "en_cours"
                          ? "bg-amber-500/10 text-amber-700"
                          : m.statut === "traite"
                          ? "bg-emerald-500/10 text-emerald-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {CONTACT_MESSAGE_STATUS_LABELS[m.statut] || m.statut}
                    </span>
                  </TableCell>

                  {/* 5. Date */}
                  <TableCell>
                    <span className="text-muted-foreground text-[11px] whitespace-nowrap">
                      {m.created_at ? formatDate(m.created_at) : "—"}
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
                              href={`/admin/messages/${m.id}`}
                              className="flex items-center gap-2"
                            >
                              <Eye className="size-3.5 text-forest" />
                              <span>Consulter le message</span>
                            </Link>
                          }
                        />
                        {isUnread && (
                          <DropdownMenuItem
                            onClick={() => onMarkAsRead(m)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <MailOpen className="size-3.5 text-emerald-600" />
                            <span>Marquer comme lu</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(m)}
                          className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                          <span>Supprimer</span>
                        </DropdownMenuItem>
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
