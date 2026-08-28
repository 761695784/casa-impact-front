"use client"

import React from "react"
import Link from "next/link"
import {
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Sparkles,
  User,
  Calendar,
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
import { NEWS_TYPE_LABELS } from "@/types/enums"
import type { News } from "@/types/models"

interface ActualitesTableProps {
  newsList: News[]
  onEdit: (news: News) => void
  onPreview: (news: News) => void
  onDelete: (news: News) => void
}

export function ActualitesTable({
  newsList,
  onEdit,
  onPreview,
  onDelete,
}: ActualitesTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xs">
      <div className="overflow-x-auto">
        <Table className="w-full text-xs">
          <TableHeader className="bg-secondary/40">
            <TableRow className="hover:bg-transparent border-border/80">
              <TableHead className="font-semibold text-foreground min-w-[260px]">
                Publication & Titre
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[130px]">
                Format / Type
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[140px]">
                Auteur / Pôle
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[120px]">
                Date
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[90px] text-center">
                À la une
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
            {newsList.map((item) => (
              <TableRow
                key={item.id}
                className="transition-colors hover:bg-secondary/20 border-border/60"
              >
                {/* 1. Titre & Extrait */}
                <TableCell className="py-4">
                  <div className="space-y-1">
                    <Link
                      href={`/admin/actualites/${item.id}`}
                      className="font-bold text-foreground hover:text-primary transition-colors text-sm line-clamp-1"
                    >
                      {item.titre}
                    </Link>
                    {item.extrait && (
                      <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[340px]">
                        {item.extrait}
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* 2. Format / Type */}
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-forest/10 px-2 py-0.5 text-[11px] font-bold text-forest uppercase tracking-wider">
                    {NEWS_TYPE_LABELS[item.type] || item.type}
                  </span>
                </TableCell>

                {/* 3. Auteur */}
                <TableCell>
                  <span className="text-[11px] text-foreground font-medium">
                    {item.auteur || "Rédaction"}
                  </span>
                </TableCell>

                {/* 4. Date de publication */}
                <TableCell>
                  <span className="text-[11px] text-muted-foreground">
                    {item.date_publication ? formatDate(item.date_publication) : "—"}
                  </span>
                </TableCell>

                {/* 5. À la une */}
                <TableCell className="text-center">
                  {item.a_la_une ? (
                    <span className="inline-flex items-center justify-center rounded-full bg-accent/20 p-1 text-accent">
                      <Sparkles className="size-3.5 fill-accent" />
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-[11px]">—</span>
                  )}
                </TableCell>

                {/* 6. Statut */}
                <TableCell>
                  <StatusBadge status={item.statut} />
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
                          <Link href={`/admin/actualites/${item.id}`} className="flex items-center gap-2">
                            <Eye className="size-3.5 text-forest" />
                            <span>Consulter la fiche</span>
                          </Link>
                        }
                      />
                      <DropdownMenuItem
                        onClick={() => onPreview(item)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Eye className="size-3.5 text-primary" />
                        <span>Prévisualisation</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onEdit(item)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Edit className="size-3.5 text-muted-foreground" />
                        <span>Modifier</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        render={
                          <Link
                            href={`/actualites/${item.slug}`}
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
                        onClick={() => onDelete(item)}
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
