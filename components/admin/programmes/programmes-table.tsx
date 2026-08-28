"use client"

import React from "react"
import Link from "next/link"
import {
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  MapPin,
  Calendar,
  Layers,
  Tag,
  Megaphone,
  MoreHorizontal,
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
import type { Program } from "@/types/models"

interface ProgrammesTableProps {
  programs: Program[]
  onEdit: (program: Program) => void
  onDelete: (program: Program) => void
}

export function ProgrammesTable({
  programs,
  onEdit,
  onDelete,
}: ProgrammesTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xs">
      <div className="overflow-x-auto">
        <Table className="w-full text-xs">
          <TableHeader className="bg-secondary/40">
            <TableRow className="hover:bg-transparent border-border/80">
              <TableHead className="font-semibold text-foreground min-w-[220px]">
                Programme d'action
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[170px]">
                Domaine
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[150px]">
                Modalité / Type
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[140px]">
                Région & Lieu
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[100px] text-center">
                Appels liés
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[100px]">
                Statut
              </TableHead>
              <TableHead className="font-semibold text-foreground text-right min-w-[100px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.map((program) => (
              <TableRow
                key={program.id}
                className="transition-colors hover:bg-secondary/20 border-border/60"
              >
                {/* 1. Titre & Résumé */}
                <TableCell className="py-4">
                  <div className="space-y-1">
                    <Link
                      href={`/admin/programmes/${program.id}`}
                      className="font-bold text-foreground hover:text-primary transition-colors text-sm line-clamp-1"
                    >
                      {program.titre}
                    </Link>
                    {program.resume && (
                      <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[320px]">
                        {program.resume}
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* 2. Domaine */}
                <TableCell>
                  {program.domaine ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-forest/10 px-2 py-0.5 text-[11px] font-semibold text-forest">
                      <Layers className="size-3 shrink-0" />
                      <span className="truncate max-w-[160px]">{program.domaine.nom}</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>

                {/* 3. Type */}
                <TableCell>
                  {program.type ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-foreground font-medium">
                      <Tag className="size-3 text-muted-foreground shrink-0" />
                      <span className="truncate max-w-[140px]">{program.type.nom}</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>

                {/* 4. Région & Lieu */}
                <TableCell>
                  <div className="space-y-0.5">
                    {program.region ? (
                      <span className="font-semibold text-[11px] text-foreground">
                        {REGION_LABELS[program.region] || program.region}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-[11px]">Multi-régional</span>
                    )}
                    {program.localisation && (
                      <p className="text-[10px] text-muted-foreground truncate max-w-[130px]">
                        {program.localisation}
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* 5. Appels Liés */}
                <TableCell className="text-center">
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 font-mono text-[11px] font-bold ${
                      (program.appels_count || 0) > 0
                        ? "bg-forest/15 text-forest"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {program.appels_count || 0}
                  </span>
                </TableCell>

                {/* 6. Statut */}
                <TableCell>
                  <StatusBadge status={program.statut} />
                </TableCell>

                {/* 7. Actions Dropdown */}
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
                    <DropdownMenuContent align="end" className="w-48 rounded-2xl text-xs">
                      <DropdownMenuItem
                        render={
                          <Link href={`/admin/programmes/${program.id}`} className="flex items-center gap-2">
                            <Eye className="size-3.5 text-forest" />
                            <span>Consulter la fiche</span>
                          </Link>
                        }
                      />
                      <DropdownMenuItem
                        onClick={() => onEdit(program)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Edit className="size-3.5 text-muted-foreground" />
                        <span>Modifier</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        render={
                          <Link
                            href={`/programmes/${program.slug}`}
                            target="_blank"
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="size-3.5 text-muted-foreground" />
                            <span>Page publique</span>
                          </Link>
                        }
                      />
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(program)}
                        className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                        <span>Supprimer</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
