"use client"

import React from "react"
import Link from "next/link"
import { Eye, Edit, MapPin, Calendar, Compass, FileCheck, ChevronRight } from "lucide-react"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/format"
import { REGION_LABELS } from "@/types/enums"
import type { ApplicationCall } from "@/types/models"

interface AppelsMobileListProps {
  applicationCalls: ApplicationCall[]
  onEdit: (call: ApplicationCall) => void
  onPreview: (call: ApplicationCall) => void
}

export function AppelsMobileList({
  applicationCalls,
  onEdit,
  onPreview,
}: AppelsMobileListProps) {
  return (
    <div className="space-y-3.5">
      {applicationCalls.map((call) => (
        <div
          key={call.id}
          className="rounded-3xl border border-border bg-card p-4 shadow-2xs space-y-3"
        >
          {/* Top Bar: Program & Status */}
          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
            <span className="text-xs font-semibold text-forest flex items-center gap-1 truncate">
              <Compass className="size-3 shrink-0" />
              <span>{call.programme?.titre || "Programme Casa Impact"}</span>
            </span>
            <StatusBadge status={call.statut} />
          </div>

          {/* Call Title & Resume */}
          <div>
            <Link
              href={`/admin/appels-a-candidatures/${call.id}`}
              className="font-bold text-base text-foreground hover:text-primary transition-colors flex items-center justify-between"
            >
              <span>{call.titre}</span>
              <ChevronRight className="size-4 text-muted-foreground shrink-0 ml-1" />
            </Link>
            {call.resume && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {call.resume}
              </p>
            )}
          </div>

          {/* Details Box */}
          <div className="rounded-2xl bg-secondary/40 p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              {call.region && (
                <span className="inline-flex items-center gap-1 font-medium text-foreground">
                  <MapPin className="size-3 text-forest" />
                  <span>{REGION_LABELS[call.region] || call.region}</span>
                </span>
              )}
              {call.date_limite && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3" />
                  <span>Clôture : {formatDate(call.date_limite)}</span>
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[11px]">
              <span className="text-sky-700 font-semibold flex items-center gap-1">
                <FileCheck className="size-3" />
                <span>{call.candidatures_count || 0} candidatures</span>
              </span>
              {call.nombre_places && (
                <span className="text-muted-foreground">
                  {call.nombre_places} places
                </span>
              )}
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
              <Link href={`/admin/appels-a-candidatures/${call.id}`}>
                <Eye className="size-3.5 text-forest" />
                <span>Consulter la fiche</span>
              </Link>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(call)}
              className="h-9 rounded-full text-xs gap-1 px-3"
            >
              <Edit className="size-3.5" />
              <span>Modifier</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
