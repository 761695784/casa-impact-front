"use client"

import React from "react"
import Link from "next/link"
import {
  Eye,
  MoreVertical,
  Edit,
  Sparkles,
  Trash2,
  MapPin,
  Mail,
  Phone,
  FileText,
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
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/format"
import { REGION_LABELS } from "@/types/enums"
import type { Application } from "@/types/models"

interface CandidaturesTableProps {
  applications: Application[]
  onOpenStatusModal: (app: Application) => void
  onOpenPromoteModal: (app: Application) => void
  onDeleteApplication: (app: Application) => void
}

export function CandidaturesTable({
  applications,
  onOpenStatusModal,
  onOpenPromoteModal,
  onDeleteApplication,
}: CandidaturesTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xs">
      <Table>
        <TableHeader className="bg-secondary/40">
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground w-[130px]">
              Réf. & Date
            </TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Candidat
            </TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Appel à Projets
            </TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Région
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
          {applications.map((app) => (
            <TableRow
              key={app.id}
              className="group border-border/60 transition-colors hover:bg-secondary/30"
            >
              {/* Reference & Date */}
              <TableCell className="align-top py-4">
                <span className="font-mono text-xs font-bold text-foreground block">
                  {app.reference}
                </span>
                <span className="text-[11px] text-muted-foreground mt-0.5 block whitespace-nowrap">
                  {app.created_at ? formatDate(app.created_at) : "Récemment"}
                </span>
              </TableCell>

              {/* Candidat Info */}
              <TableCell className="align-top py-4 max-w-xs">
                <Link
                  href={`/admin/candidatures/${app.id}`}
                  className="font-bold text-sm text-foreground hover:text-primary hover:underline transition-colors block truncate"
                >
                  {app.candidat_nom || "Candidat Anonyme"}
                </Link>
                {app.candidat_email && (
                  <span className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
                    <Mail className="size-3 shrink-0 opacity-70" />
                    <span>{app.candidat_email}</span>
                  </span>
                )}
                {app.candidat_telephone && (
                  <span className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Phone className="size-3 shrink-0 opacity-70" />
                    <span>{app.candidat_telephone}</span>
                  </span>
                )}
              </TableCell>

              {/* Appel / Programme */}
              <TableCell className="align-top py-4 max-w-xs">
                <p className="text-xs font-semibold text-foreground line-clamp-2">
                  {app.appel?.titre || `Appel #${app.appel_id}`}
                </p>
                {app.projet_titre && (
                  <span className="text-[11px] text-forest font-medium mt-1 inline-flex items-center gap-1 line-clamp-1">
                    <FileText className="size-3 shrink-0" />
                    <span>{app.projet_titre}</span>
                  </span>
                )}
              </TableCell>

              {/* Région */}
              <TableCell className="align-top py-4 whitespace-nowrap">
                {app.region ? (
                  <div className="flex flex-col gap-0.5">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
                      <MapPin className="size-3.5 text-forest shrink-0" />
                      <span>{REGION_LABELS[app.region] || app.region}</span>
                    </span>
                    {app.ville && (
                      <span className="text-[10px] text-muted-foreground ml-4.5 truncate">
                        {app.ville}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>

              {/* Statut & Badges */}
              <TableCell className="align-top py-4 whitespace-nowrap">
                <div className="flex flex-col gap-1.5 items-start">
                  <StatusBadge status={app.statut} />
                  {app.promu && (
                    <Badge
                      variant="outline"
                      className="border-accent/40 bg-accent/15 text-accent-foreground text-[10px] font-bold gap-1 px-2 py-0"
                    >
                      <Sparkles className="size-2.5 text-accent-foreground" />
                      <span>Promu</span>
                    </Badge>
                  )}
                </div>
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
                    <Link href={`/admin/candidatures/${app.id}`}>
                      <Eye className="size-3.5 text-forest" />
                      <span className="hidden sm:inline">Détail</span>
                    </Link>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full text-muted-foreground hover:text-foreground"
                          aria-label="Actions sur la candidature"
                        />
                      }
                    >
                      <MoreVertical className="size-4" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1.5 shadow-xl border-border">
                      <DropdownMenuItem
                        onClick={() => onOpenStatusModal(app)}
                        className="text-xs cursor-pointer rounded-lg flex items-center gap-2"
                      >
                        <Edit className="size-3.5 text-forest" />
                        <span>Changer le statut</span>
                      </DropdownMenuItem>

                      {!app.promu && (
                        <DropdownMenuItem
                          onClick={() => onOpenPromoteModal(app)}
                          className="text-xs cursor-pointer rounded-lg flex items-center gap-2 text-accent-foreground"
                        >
                          <Sparkles className="size-3.5" />
                          <span>Promouvoir le profil</span>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => onDeleteApplication(app)}
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
