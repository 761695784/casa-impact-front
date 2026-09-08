"use client"

import React from "react"
import Link from "next/link"
import {
  Eye,
  Edit,
  Power,
  Trash2,
  ExternalLink,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { PARTNER_TYPE_LABELS } from "@/types/enums"
import { getPartnerLogoUrl } from "@/lib/format"
import type { Partner } from "@/types/models"

interface PartenairesGridProps {
  partners: Partner[]
  onEdit: (partner: Partner) => void
  onToggleStatus: (partner: Partner) => void
  onDelete: (partner: Partner) => void
}

export function PartenairesGrid({
  partners,
  onEdit,
  onToggleStatus,
  onDelete,
}: PartenairesGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {partners.map((partner, index) => {
        const logoUrl = getPartnerLogoUrl(partner)
        return (
        <div
          key={partner.id}
          className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xs transition-all hover:border-forest/40 hover:shadow-md"
        >
          <div>
            {/* Top Bar: Sequence Number, Typology & Status */}
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-xl bg-forest/10 font-mono text-xs font-bold text-forest">
                  0{partner.ordre || index + 1}
                </span>
                <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground uppercase">
                  {PARTNER_TYPE_LABELS[partner.type] || partner.type}
                </span>
              </div>
              <StatusBadge status={partner.statut} />
            </div>

            {/* Logo / Initial & Name */}
            <div className="mt-4 flex items-start gap-3.5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-secondary/40 text-forest font-bold font-display text-base overflow-hidden">
                {logoUrl ? (
                  <img src={logoUrl} alt={partner.nom} className="size-full object-contain p-1.5" />
                ) : (
                  <span>{partner.nom.substring(0, 2).toUpperCase()}</span>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <Link
                  href={`/admin/partenaires/${partner.id}`}
                  className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors block line-clamp-2 leading-snug"
                >
                  {partner.nom}
                </Link>
                {partner.lien && (
                  <a
                    href={partner.lien}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors truncate max-w-[200px]"
                  >
                    <span>{partner.lien.replace(/^https?:\/\//, "")}</span>
                    <ExternalLink className="size-2.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Description */}
            {partner.description && (
              <p className="mt-4 text-xs text-muted-foreground line-clamp-3 leading-relaxed rounded-2xl bg-secondary/30 p-3 border border-border/40">
                {partner.description}
              </p>
            )}
          </div>

          {/* Bottom Meta & Actions */}
          <div className="mt-6 pt-4 border-t border-border/60 space-y-3">
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 h-9 rounded-full text-xs gap-1.5 border-border hover:bg-secondary"
              >
                <Link href={`/admin/partenaires/${partner.id}`}>
                  <Eye className="size-3.5 text-forest" />
                  <span>Fiche</span>
                </Link>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(partner)}
                className="h-9 rounded-full text-xs gap-1 px-3"
              >
                <Edit className="size-3.5" />
                <span>Modifier</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleStatus(partner)}
                className={`size-9 rounded-full ${
                  partner.statut === "inactif"
                    ? "text-emerald-700 hover:bg-emerald-500/10"
                    : "text-muted-foreground hover:text-amber-700 hover:bg-amber-500/10"
                }`}
                title={partner.statut === "inactif" ? "Activer le partenaire" : "Désactiver le partenaire"}
              >
                <Power className="size-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(partner)}
                className="size-9 rounded-full text-destructive hover:bg-destructive/10"
                title="Supprimer le partenaire"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        </div>
        )
      })}
    </div>
  )
}
