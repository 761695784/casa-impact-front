"use client"

import React from "react"
import Link from "next/link"
import { Eye, CheckCircle2, XCircle, Trash2, Mail, Phone, MapPin, User } from "lucide-react"
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

          {/* Photo, Identity & Contact */}
          <div className="flex items-start gap-3.5">
            <Link
              href={`/admin/adhesions/${m.id}`}
              className="relative size-12 rounded-2xl overflow-hidden bg-secondary shrink-0 border border-border shadow-xs"
            >
              {m.photo ? (
                <img
                  src={m.photo}
                  alt={m.nom_complet}
                  className="size-full object-cover"
                />
              ) : (
                <div className="size-full flex items-center justify-center bg-primary/10 text-primary">
                  <User className="size-6 opacity-60" />
                </div>
              )}
            </Link>

            <div className="space-y-1 min-w-0 flex-1">
              <Link
                href={`/admin/adhesions/${m.id}`}
                className="font-display text-base font-bold text-foreground hover:text-primary transition-colors block truncate"
              >
                {m.nom_complet}
              </Link>
              {m.profession && (
                <p className="text-xs text-muted-foreground truncate">{m.profession}</p>
              )}
              <div className="pt-1 flex flex-col gap-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 truncate">
                  <Mail className="size-3 text-muted-foreground shrink-0" />
                  <span className="truncate">{m.email}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3 text-muted-foreground shrink-0" />
                  <span>{m.telephone}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Details Pill grid */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-secondary/30 p-3 rounded-2xl border border-border/60">
            <div>
              <span className="text-[11px] text-muted-foreground block">Région</span>
              <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="size-3 text-forest" />
                <span>{MEMBERSHIP_REGION_LABELS[m.region] || m.region}</span>
              </span>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block">Cotisation</span>
              <span className="font-mono font-bold text-foreground block mt-0.5">
                {formatNumber(m.montant || 1000)} FCFA
              </span>
            </div>
            <div className="col-span-2 pt-1 border-t border-border/40">
              <span className="text-[11px] text-muted-foreground block">Engagement</span>
              <span className="font-medium text-foreground text-[11px] line-clamp-1 mt-0.5">
                {CONTRIBUTION_DOMAIN_LABELS[m.domaine_contribution] || m.domaine_contribution}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/60">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full text-xs gap-1 flex-1"
            >
              <Link href={`/admin/adhesions/${m.id}`}>
                <Eye className="size-3.5" />
                <span>Voir le dossier</span>
              </Link>
            </Button>

            {m.statut !== "validee" && (
              <Button
                size="sm"
                onClick={() => onValidate(m)}
                className="rounded-full text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                title="Valider"
              >
                <CheckCircle2 className="size-3.5" />
                <span>Valider</span>
              </Button>
            )}

            {m.statut !== "refusee" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onReject(m)}
                className="size-8 rounded-full text-amber-700 hover:bg-amber-500/10"
                title="Refuser"
              >
                <XCircle className="size-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(m)}
              className="size-8 rounded-full text-destructive hover:bg-destructive/10"
              title="Supprimer"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
