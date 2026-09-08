"use client"

import React from "react"
import Link from "next/link"
import { Eye, Edit, Trash2, MoreHorizontal, BarChart3 } from "lucide-react"
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
import { formatNumber } from "@/lib/format"
import type { ImpactIndicator } from "@/types/models"

interface ImpactIndicatorsTableProps {
  indicators: ImpactIndicator[]
  onEdit: (indicator: ImpactIndicator) => void
  onDelete: (indicator: ImpactIndicator) => void
}

/**
 * Colonnes Catégorie / Progression-Cible / Rattachement / Statut retirées :
 * l'indicateur d'impact réel (voir types/models.ts) n'a ni `categorie`, ni
 * `cible`, ni `domaine`/`programme`, ni `statut`. On garde libellé,
 * description, valeur mesurée (somme des `values`) et le nombre de points
 * de mesure enregistrés.
 */
export function ImpactIndicatorsTable({
  indicators,
  onEdit,
  onDelete,
}: ImpactIndicatorsTableProps) {
  const getSumOrLatest = (indicator: ImpactIndicator): number => {
    if (!indicator.values || indicator.values.length === 0) return 0
    return indicator.values.reduce((acc, v) => acc + (v.valeur || 0), 0)
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
              <TableHead className="font-semibold text-foreground min-w-[130px]">
                Valeur Mesurée
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[150px]">
                Points de Mesure
              </TableHead>
              <TableHead className="font-semibold text-foreground text-right min-w-[90px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {indicators.map((ind) => {
              const currentVal = getSumOrLatest(ind)
              const valuesCount = ind.values?.length || 0

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

                  {/* 2. Valeur Mesurée */}
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

                  {/* 3. Points de mesure enregistrés */}
                  <TableCell>
                    {valuesCount > 0 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-foreground">
                        <BarChart3 className="size-3 text-forest" />
                        <span>
                          {valuesCount} valeur{valuesCount > 1 ? "s" : ""}
                        </span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">Aucune</span>
                    )}
                  </TableCell>

                  {/* 4. Actions */}
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
