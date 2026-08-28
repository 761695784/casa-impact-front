"use client"

import React from "react"
import Link from "next/link"
import { Eye, Edit, Sparkles, MapPin, Calendar, FileText, ChevronRight } from "lucide-react"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/format"
import { REGION_LABELS } from "@/types/enums"
import type { Application } from "@/types/models"

interface CandidaturesMobileListProps {
  applications: Application[]
  onOpenStatusModal: (app: Application) => void
  onOpenPromoteModal: (app: Application) => void
}

export function CandidaturesMobileList({
  applications,
  onOpenStatusModal,
  onOpenPromoteModal,
}: CandidaturesMobileListProps) {
  return (
    <div className="space-y-3.5">
      {applications.map((app) => (
        <div
          key={app.id}
          className="rounded-3xl border border-border bg-card p-4 shadow-2xs space-y-3"
        >
          {/* Top Bar: Ref & Status */}
          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
            <span className="font-mono text-xs font-bold text-foreground">
              {app.reference}
            </span>
            <div className="flex items-center gap-1.5">
              <StatusBadge status={app.statut} />
              {app.promu && (
                <Badge
                  variant="outline"
                  className="border-accent/40 bg-accent/15 text-accent-foreground text-[10px] font-bold px-1.5 py-0"
                >
                  <Sparkles className="size-2.5" />
                </Badge>
              )}
            </div>
          </div>

          {/* Candidate Info */}
          <div>
            <Link
              href={`/admin/candidatures/${app.id}`}
              className="font-bold text-base text-foreground hover:text-primary transition-colors flex items-center justify-between"
            >
              <span>{app.candidat_nom || "Candidat Anonyme"}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
            <p className="text-xs text-muted-foreground mt-0.5">
              {app.candidat_email} • {app.candidat_telephone}
            </p>
          </div>

          {/* Call & Project */}
          <div className="rounded-2xl bg-secondary/40 p-3 space-y-1 text-xs">
            <p className="font-semibold text-foreground line-clamp-1">
              {app.appel?.titre || `Appel #${app.appel_id}`}
            </p>
            {app.projet_titre && (
              <p className="text-[11px] text-forest font-medium line-clamp-1 flex items-center gap-1">
                <FileText className="size-3 shrink-0" />
                <span>{app.projet_titre}</span>
              </p>
            )}
            <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground">
              {app.region && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3 text-forest" />
                  <span>{REGION_LABELS[app.region] || app.region}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3" />
                <span>{app.created_at ? formatDate(app.created_at) : "Récemment"}</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1 h-9 rounded-full text-xs gap-1.5"
            >
              <Link href={`/admin/candidatures/${app.id}`}>
                <Eye className="size-3.5 text-forest" />
                <span>Consulter la fiche</span>
              </Link>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onOpenStatusModal(app)}
              className="h-9 rounded-full text-xs gap-1 px-3"
            >
              <Edit className="size-3.5" />
              <span>Statut</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
