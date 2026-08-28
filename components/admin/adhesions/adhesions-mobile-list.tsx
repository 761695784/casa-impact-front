"use client"

import React from "react"
import Link from "next/link"
import { Eye, CheckCircle2, XCircle, Trash2, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { formatDate, formatNumber } from "@/lib/format"
import {
  MEMBERSHIP_REGION_LABELS,
  CONTRIBUTION_DOMAIN_LABELS,
} from "@/types/enums"
import type { Membership } from "@/types/models"

interface AdhesionsMobileListProps {
  memberships: Membership[]
  onValidate: (membership: Membership) => void
  onReject: (membership: Membership) => void
  onDelete: (membership: Membership) => void
}

export function AdhesionsMobileList({
  memberships,
  onValidate,
  onReject,
  onDelete,
}: AdhesionsMobileListProps) {
  return (
    <div className="space-y-4 md:hidden">
      {memberships.map((m) => (
        <div
          key={m.id}
          className="rounded-3xl border border-border bg-card p-5 shadow-2xs space-y-4"
        >
          {/* Header Card */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="font-mono text-xs font-bold text-forest">
              {m.reference || `ADH-#${m.id}`}
            </span>
            <StatusBadge status={m.statut} />
          </div>

          {/* Identity & Contact */}
          <div className="space-y-1">
            <Link
              href={`/admin/adhesions/${m.id}`}
              className="font-display text-base font-bold text-foreground hover:text-primary transition-colors block"
            >
              {m.nom_complet}
            </Link>
            {m.profession && (
              <p className="text-xs text-muted-foreground">{m.profession}</p>
            )}
            <div className="pt-1 flex flex-col gap-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="size-3 text-muted-foreground" />
                <span>{m.email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="size-3 text-muted-foreground" />
                <span>{m.telephone}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3 text-muted-foreground" />
                <span>
                  {MEMBERSHIP_REGION_LABELS[m.region] || m.region}{" "}
                  {m.departement ? `(${m.departement})` : ""}
                </span>
              </span>
            </div>
          </div>

          {/* Pôle & Cotisation */}
          <div className="rounded-2xl bg-secondary/40 p-3 text-xs space-y-1.5 border border-border/50">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-[11px]">Pôle :</span>
              <span className="font-semibold text-foreground truncate max-w-[170px]">
                {CONTRIBUTION_DOMAIN_LABELS[m.domaine_contribution] ||
                  m.domaine_contribution}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-[11px]">Cotisation :</span>
              <span className="font-mono font-bold text-foreground">
                {formatNumber(m.montant || 1000)} FCFA ({m.paiement_statut === "paye" ? "Réglée" : "En attente"})
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1 border-t border-border/60">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1 rounded-full text-xs gap-1.5"
            >
              <Link href={`/admin/adhesions/${m.id}`}>
                <Eye className="size-3.5 text-forest" />
                <span>Détail</span>
              </Link>
            </Button>

            {m.statut !== "validee" && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onValidate(m)}
                className="rounded-full text-xs text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/20"
              >
                <CheckCircle2 className="size-3.5" />
                <span>Valider</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(m)}
              className="size-9 rounded-full text-destructive hover:bg-destructive/10"
              title="Supprimer l'adhésion"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
