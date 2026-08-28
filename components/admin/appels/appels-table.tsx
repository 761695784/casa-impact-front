"use client"

import React from "react"
import Link from "next/link"
import {
  Eye,
  MoreVertical,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Users,
  Compass,
  FileCheck,
  ExternalLink,
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
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { formatDate } from "@/lib/format"
import { REGION_LABELS } from "@/types/enums"
import type { ApplicationCall } from "@/types/models"

interface AppelsTableProps {
  applicationCalls: ApplicationCall[]
  onEdit: (call: ApplicationCall) => void
  onPreview: (call: ApplicationCall) => void
  onToggleStatus: (call: ApplicationCall) => void
  onDelete: (call: ApplicationCall) => void
}

export function AppelsTable({
  applicationCalls,
  onEdit,
  onPreview,
  onToggleStatus,
  onDelete,
}: AppelsTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xs">
      <Table>
        <TableHeader className="bg-secondary/40">
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Appel à Candidatures
            </TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Programme
            </TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Région / Lieu
            </TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Clôture
            </TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Candidatures
            </TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Statut
            </TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-border/60">
          {applicationCalls.map((call) => (
            <TableRow
              key={call.id}
              className="group border-border/60 transition-colors hover:bg-secondary/30"
            >
              {/* Titre & Résumé */}
              <TableCell className="align-top py-4 max-w-sm">
                <Link
                  href={`/admin/appels-a-candidatures/${call.id}`}
                  className="font-bold text-sm text-foreground hover:text-primary hover:underline transition-colors block line-clamp-2"
                >
                  {call.titre}
                </Link>
                {call.resume && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {call.resume}
                  </p>
                )}
              </TableCell>

              {/* Programme */}
              <TableCell className="align-top py-4 whitespace-nowrap">
                {call.programme ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Compass className="size-3.5 text-forest shrink-0" />
                    <span>{call.programme.titre}</span>
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>

              {/* Région & Localisation */}
              <TableCell className="align-top py-4 whitespace-nowrap">
                {call.region ? (
                  <div className="flex flex-col gap-0.5">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
                      <MapPin className="size-3 text-forest shrink-0" />
                      <span>{REGION_LABELS[call.region] || call.region}</span>
                    </span>
                    {call.localisation && (
                      <span className="text-[10px] text-muted-foreground ml-4 truncate">
                        {call.localisation}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>

              {/* Date limite */}
              <TableCell className="align-top py-4 whitespace-nowrap">
                {call.date_limite ? (
                  <div className="flex flex-col gap-0.5">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
                      <Calendar className="size-3 text-muted-foreground" />
                      <span>{formatDate(call.date_limite)}</span>
                    </span>
                    {call.date_ouverture && (
                      <span className="text-[10px] text-muted-foreground ml-4">
                        Ouv. {formatDate(call.date_ouverture)}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Illimité</span>
                )}
              </TableCell>

              {/* Candidatures & Places */}
              <TableCell className="align-top py-4 whitespace-nowrap">
                <div className="flex flex-col gap-1 items-start">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-6 rounded-full px-2 text-xs font-semibold text-sky-700 bg-sky-500/10 hover:bg-sky-500/20 gap-1"
                  >
                    <Link href={`/admin/candidatures`}>
                      <FileCheck className="size-3" />
                      <span>{call.candidatures_count || 0} reçue{call.candidatures_count && call.candidatures_count > 1 ? "s" : ""}</span>
                    </Link>
                  </Button>
                  {call.nombre_places && (
                    <span className="text-[10px] text-muted-foreground">
                      {call.nombre_places} places au total
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Statut */}
              <TableCell className="align-top py-4 whitespace-nowrap">
                <StatusBadge status={call.statut} />
              </TableCell>

              {/* Actions */}
              <TableCell className="align-top py-4 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-full px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1"
                  >
                    <Link href={`/admin/appels-a-candidatures/${call.id}`}>
                      <Eye className="size-3.5 text-forest" />
                      <span className="hidden sm:inline">Fiche</span>
                    </Link>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full text-muted-foreground hover:text-foreground"
                          aria-label="Options de l'appel"
                        />
                      }
                    >
                      <MoreVertical className="size-4" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1.5 shadow-xl border-border">
                      <DropdownMenuItem
                        onClick={() => onEdit(call)}
                        className="text-xs cursor-pointer rounded-lg flex items-center gap-2"
                      >
                        <Edit className="size-3.5 text-forest" />
                        <span>Modifier l'appel</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onPreview(call)}
                        className="text-xs cursor-pointer rounded-lg flex items-center gap-2 text-primary"
                      >
                        <Eye className="size-3.5" />
                        <span>Prévisualisation</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        render={<Link href={`/opportunites/${call.slug}`} target="_blank" />}
                        className="text-xs cursor-pointer rounded-lg flex items-center gap-2"
                      >
                        <ExternalLink className="size-3.5" />
                        <span>Voir page publique</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => onToggleStatus(call)}
                        className="text-xs cursor-pointer rounded-lg flex items-center gap-2 font-medium"
                      >
                        {call.statut === "publie" ? "Clôturer l'appel" : "Publier l'appel"}
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => onDelete(call)}
                        className="text-xs cursor-pointer rounded-lg flex items-center gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                        <span>Supprimer</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
