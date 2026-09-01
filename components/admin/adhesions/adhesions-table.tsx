"use client"

import React from "react"
import Link from "next/link"
import {
  Eye,
  CheckCircle2,
  XCircle,
  Trash2,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Coins,
  User,
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
import { formatDate, formatNumber } from "@/lib/format"
import {
  MEMBERSHIP_REGION_LABELS,
  CONTRIBUTION_DOMAIN_LABELS,
} from "@/types/enums"
import type { Membership } from "@/types/models"

interface AdhesionsTableProps {
  memberships: Membership[]
  onValidate: (membership: Membership) => void
  onReject: (membership: Membership) => void
  onDelete: (membership: Membership) => void
}

export function AdhesionsTable({
  memberships,
  onValidate,
  onReject,
  onDelete,
}: AdhesionsTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xs">
      <div className="overflow-x-auto">
        <Table className="w-full text-xs">
          <TableHeader className="bg-secondary/40">
            <TableRow className="hover:bg-transparent border-border/80">
              <TableHead className="font-semibold text-foreground min-w-[130px]">
                Référence
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[220px]">
                Adhérent & Contact
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[150px]">
                Territoire
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[180px]">
                Pôle d'Engagement
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[130px]">
                Cotisation (1 000 F)
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[130px]">
                Statut Adhésion
              </TableHead>
              <TableHead className="font-semibold text-foreground text-right min-w-[80px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberships.map((m) => (
              <TableRow
                key={m.id}
                className="transition-colors hover:bg-secondary/20 border-border/60"
              >
                {/* 1. Référence & Date */}
                <TableCell className="py-4">
                  <div className="space-y-1">
                    <Link
                      href={`/admin/adhesions/${m.id}`}
                      className="font-mono font-bold text-foreground hover:text-primary transition-colors text-xs"
                    >
                      {m.reference || `ADH-#${m.id}`}
                    </Link>
                    <span className="text-[11px] text-muted-foreground block">
                      {m.created_at ? formatDate(m.created_at) : "—"}
                    </span>
                  </div>
                </TableCell>

                {/* 2. Photo, Nom, Profession & Contact */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/adhesions/${m.id}`}
                      className="relative size-10 rounded-xl overflow-hidden bg-secondary shrink-0 border border-border group"
                    >
                      {m.photo ? (
                        <img
                          src={m.photo}
                          alt={m.nom_complet}
                          className="size-full object-cover transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center bg-primary/10 text-primary">
                          <User className="size-5 opacity-60" />
                        </div>
                      )}
                    </Link>

                    <div className="space-y-0.5 min-w-0">
                      <Link
                        href={`/admin/adhesions/${m.id}`}
                        className="font-bold text-foreground hover:text-primary transition-colors text-sm line-clamp-1"
                      >
                        {m.nom_complet}
                      </Link>
                      {m.profession && (
                        <span className="text-xs text-muted-foreground block line-clamp-1">
                          {m.profession}
                        </span>
                      )}
                      <div className="flex items-center gap-2 pt-0.5 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Mail className="size-3" />
                          <span className="truncate max-w-[120px]">{m.email}</span>
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Phone className="size-3" />
                          <span>{m.telephone}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* 3. Territoire */}
                <TableCell>
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground block">
                      {MEMBERSHIP_REGION_LABELS[m.region] || m.region}
                    </span>
                    {m.departement && (
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-3 shrink-0" />
                        <span>{m.departement}</span>
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* 4. Pôle d'engagement */}
                <TableCell>
                  <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-[11px] font-medium text-foreground block truncate max-w-[170px]">
                    {CONTRIBUTION_DOMAIN_LABELS[m.domaine_contribution] ||
                      m.domaine_contribution}
                  </span>
                </TableCell>

                {/* 5. Cotisation */}
                <TableCell>
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-xs text-foreground block">
                      {formatNumber(m.montant || 1000)} FCFA
                    </span>
                    <span
                      className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                        m.paiement_statut === "paye"
                          ? "bg-emerald-500/10 text-emerald-700"
                          : m.paiement_statut === "echoue"
                          ? "bg-rose-500/10 text-rose-700"
                          : "bg-amber-500/10 text-amber-700"
                      }`}
                    >
                      {m.paiement_statut === "paye"
                        ? "Cotisation Réglée"
                        : m.paiement_statut === "echoue"
                        ? "Paiement Échoué"
                        : "En Attente"}
                    </span>
                  </div>
                </TableCell>

                {/* 6. Statut Adhésion */}
                <TableCell>
                  <StatusBadge status={m.statut} />
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
                          <Link
                            href={`/admin/adhesions/${m.id}`}
                            className="flex items-center gap-2"
                          >
                            <Eye className="size-3.5 text-forest" />
                            <span>Consulter le dossier</span>
                          </Link>
                        }
                      />
                      {m.statut !== "validee" && (
                        <DropdownMenuItem
                          onClick={() => onValidate(m)}
                          className="flex items-center gap-2 text-emerald-700 focus:text-emerald-700 cursor-pointer"
                        >
                          <CheckCircle2 className="size-3.5" />
                          <span>Valider l'adhésion</span>
                        </DropdownMenuItem>
                      )}
                      {m.statut !== "refusee" && (
                        <DropdownMenuItem
                          onClick={() => onReject(m)}
                          className="flex items-center gap-2 text-amber-700 focus:text-amber-700 cursor-pointer"
                        >
                          <XCircle className="size-3.5" />
                          <span>Refuser l'adhésion</span>
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
