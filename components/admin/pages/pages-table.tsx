"use client"

import React from "react"
import Link from "next/link"
import {
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  MoreHorizontal,
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
import { formatDate } from "@/lib/format"
import type { Page } from "@/types/models"

interface PagesTableProps {
  pages: Page[]
  onEdit: (page: Page) => void
  onPreview: (page: Page) => void
  onDelete: (page: Page) => void
}

export function PagesTable({
  pages,
  onEdit,
  onPreview,
  onDelete,
}: PagesTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xs">
      <div className="overflow-x-auto">
        <Table className="w-full text-xs">
          <TableHeader className="bg-secondary/40">
            <TableRow className="hover:bg-transparent border-border/80">
              <TableHead className="font-semibold text-foreground min-w-[240px]">
                Page Institutionnelle
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[150px]">
                Slug / URL
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[80px] text-center">
                Ordre
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[130px]">
                Dernière modification
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
            {pages.map((page) => (
              <TableRow
                key={page.id}
                className="transition-colors hover:bg-secondary/20 border-border/60"
              >
                {/* 1. Titre & Résumé */}
                <TableCell className="py-4">
                  <div className="space-y-1">
                    <Link
                      href={`/admin/pages/${page.id}`}
                      className="font-bold text-foreground hover:text-primary transition-colors text-sm line-clamp-1"
                    >
                      {page.titre}
                    </Link>
                    {page.resume && (
                      <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[340px]">
                        {page.resume}
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* 2. Slug */}
                <TableCell>
                  <span className="font-mono text-[11px] text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-md">
                    /{page.slug}
                  </span>
                </TableCell>

                {/* 3. Ordre */}
                <TableCell className="text-center font-mono font-bold text-xs text-forest">
                  0{page.ordre || page.id}
                </TableCell>

                {/* 4. Date */}
                <TableCell>
                  <span className="text-[11px] text-muted-foreground">
                    {page.updated_at ? formatDate(page.updated_at) : "—"}
                  </span>
                </TableCell>

                {/* 5. Statut */}
                <TableCell>
                  <StatusBadge status={page.statut} />
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
                    <DropdownMenuContent align="end" className="w-48 rounded-2xl text-xs">
                      <DropdownMenuItem
                        render={
                          <Link href={`/admin/pages/${page.id}`} className="flex items-center gap-2">
                            <Eye className="size-3.5 text-forest" />
                            <span>Consulter la fiche</span>
                          </Link>
                        }
                      />
                      <DropdownMenuItem
                        onClick={() => onPreview(page)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Eye className="size-3.5 text-primary" />
                        <span>Prévisualisation</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onEdit(page)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Edit className="size-3.5 text-muted-foreground" />
                        <span>Modifier</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        render={
                          <Link
                            href={`/${page.slug}`}
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
                        onClick={() => onDelete(page)}
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
