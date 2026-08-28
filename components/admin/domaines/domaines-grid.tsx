"use client"

import React from "react"
import Link from "next/link"
import {
  Eye,
  Edit,
  Power,
  Compass,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import type { Domain } from "@/types/models"

interface DomainesGridProps {
  domains: Domain[]
  onEdit: (domain: Domain) => void
  onToggleStatus: (domain: Domain) => void
}

export function DomainesGrid({
  domains,
  onEdit,
  onToggleStatus,
}: DomainesGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {domains.map((domain, index) => (
        <div
          key={domain.id}
          className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xs transition-all hover:border-forest/40 hover:shadow-md"
        >
          <div>
            {/* Top Bar: Sequence Number, Slug, Status */}
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-xl bg-forest/10 font-mono text-xs font-bold text-forest">
                  0{domain.ordre || index + 1}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[120px]">
                  /{domain.slug}
                </span>
              </div>
              <StatusBadge status={domain.statut} />
            </div>

            {/* Title & Editorial Summary */}
            <div className="mt-4 space-y-2">
              <Link
                href={`/admin/domaines/${domain.id}`}
                className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors block line-clamp-1"
              >
                {domain.nom}
              </Link>
              {domain.resume && (
                <p className="text-xs font-medium text-foreground/85 line-clamp-2 leading-relaxed">
                  {domain.resume}
                </p>
              )}
            </div>

            {/* Description Preview */}
            {domain.description && (
              <p className="mt-3 text-xs text-muted-foreground line-clamp-3 leading-relaxed rounded-2xl bg-secondary/30 p-3 border border-border/40">
                {domain.description}
              </p>
            )}
          </div>

          {/* Bottom Meta & Actions */}
          <div className="mt-6 pt-4 border-t border-border/60 space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 font-semibold text-forest">
                <Compass className="size-3.5" />
                <span>{domain.programmes_count || 0} programme{(domain.programmes_count || 0) > 1 ? "s" : ""}</span>
              </span>
              <Link
                href={`/domaines/${domain.slug}`}
                target="_blank"
                className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
              >
                <span>Site public</span>
                <ExternalLink className="size-3" />
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 h-9 rounded-full text-xs gap-1.5 border-border hover:bg-secondary"
              >
                <Link href={`/admin/domaines/${domain.id}`}>
                  <Eye className="size-3.5 text-forest" />
                  <span>Consulter la fiche</span>
                </Link>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(domain)}
                className="h-9 rounded-full text-xs gap-1 px-3"
              >
                <Edit className="size-3.5" />
                <span>Modifier</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleStatus(domain)}
                className={`size-9 rounded-full ${
                  domain.statut === "actif"
                    ? "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    : "text-emerald-700 hover:bg-emerald-500/10"
                }`}
                title={domain.statut === "actif" ? "Désactiver le domaine" : "Activer le domaine"}
              >
                <Power className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
