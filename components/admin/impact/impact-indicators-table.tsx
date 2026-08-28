"use client"

import React from "react"
import Link from "next/link"
import {
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Compass,
  Layers,
  TrendingUp,
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
import { formatNumber } from "@/lib/format"
import type { ImpactIndicator } from "@/types/models"

interface ImpactIndicatorsTableProps {
  indicators: ImpactIndicator[]
  onEdit: (indicator: ImpactIndicator) => void
  onDelete: (indicator: ImpactIndicator) => void
}

export function ImpactIndicatorsTable({
  indicators,
  onEdit,
  onDelete,
}: ImpactIndicatorsTableProps) {
  const getSumOrLatest = (indicator: ImpactIndicator): number => {
    if (!indicator.valeurs || indicator.valeurs.length === 0) return 0
    return indicator.valeurs.reduce((acc, v) => acc + (v.valeur || 0), 0)
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xs">
      <div className="overflow-x-auto">
        <Table className="w-full text-xs">
          <TableHeader className="bg-secondary/40">
            <TableRow className="hover:bg-transparent border-border/80">
              <TableHead className="font-semibold text-foreground min-w-[240px]">
                Indicateur d'Impact
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[140px]">
                Catégorie
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[130px]">
                Valeur Mesurée
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[150px]">
                Progression / Cible
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[150px]">
                Rattachement
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[90px]">
                Statut
              </TableHead>
              <TableHead className="font-semibold text-foreground text-right min-w-[90px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {indicators.map((ind) => {
              const currentVal = getSumOrLatest(ind)
              const progress = ind.cible
                ? Math.min(100, Math.round((currentVal / ind.cible) * 100))
                : null

              return (
                <TableRow
                  key={ind.id}
                  className="transition-colors hover:bg-secondary/20 border-border/60"
                >
                  {/* 1. Libellé & Description */}
                  <TableCell className="py-4">
                    <div className="space-y-1">
                      <Link
                        href={`/admin/impact/${ind.id}`}
                        className="font-bold text-foreground hover:text-primary transition-colors text-sm line-clamp-1"
                      >
                        {ind.libelle}
                      </Link>
                      {ind.description && (
                        <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[340px]">
                          {ind.description}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* 2. Catégorie */}
                  <TableCell>
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-foreground">
                      {ind.categorie || "Général"}
                    </span>
                  </TableCell>

                  {/* 3. Valeur Mesurée */}
                  <TableCell>
                    <div className="flex items-baseline gap-1 font-mono font-bold text-sm text-foreground">
                      <span>{formatNumber(currentVal)}</span>
                      {ind.unite && (
                        <span className="text-[10px] font-medium text-muted-foreground">
                          {ind.unite}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* 4. Cible & Progression */}
                  <TableCell>
                    {progress !== null ? (
                      <div className="space-y-1 w-32">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="font-bold text-forest">{progress}%</span>
                          <span className="text-muted-foreground">
                            {formatNumber(ind.cible!)}
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-forest transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>

                  {/* 5. Rattachement Domaine / Programme */}
                  <TableCell>
                    <div className="space-y-1">
                      {ind.domaine && (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate max-w-[160px]">
                          <Layers className="size-3 shrink-0 text-forest" />
                          <span className="truncate">{ind.domaine.nom}</span>
                        </div>
                      )}
                      {ind.programme && (
                        <div className="flex items-center gap-1 text-[11px] text-forest font-medium truncate max-w-[160px]">
                          <Compass className="size-3 shrink-0" />
                          <span className="truncate">{ind.programme.titre}</span>
                        </div>
                      )}
                      {!ind.domaine && !ind.programme && (
                        <span className="text-muted-foreground text-xs">Global</span>
                      )}
                    </div>
                  </TableCell>

                  {/* 6. Statut */}
                  <TableCell>
                    <StatusBadge status={ind.statut || "actif"} />
                  </TableCell>

                  {/* 7. Actions */}
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
                            <Link href={`/admin/impact/${ind.id}`} className="flex items-center gap-2">
                              <Eye className="size-3.5 text-forest" />
                              <span>Consulter la fiche</span>
                            </Link>
                          }
                        />
                        <DropdownMenuItem
                          onClick={() => onEdit(ind)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Edit className="size-3.5 text-muted-foreground" />
                          <span>Modifier l'indicateur</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(ind)}
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
