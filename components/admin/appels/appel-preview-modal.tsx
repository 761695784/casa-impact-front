"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import {
  MapPin,
  Calendar,
  Users,
  Compass,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react"
import { formatDate } from "@/lib/format"
import { REGION_LABELS } from "@/types/enums"
import type { ApplicationCall } from "@/types/models"

interface AppelPreviewModalProps {
  applicationCall: ApplicationCall | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AppelPreviewModal({
  applicationCall,
  open,
  onOpenChange,
}: AppelPreviewModalProps) {
  if (!applicationCall) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl rounded-3xl p-6 sm:p-8">
        {/* Preview Disclaimer Banner */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4 text-amber-600 shrink-0" />
            <span>
              <strong>Mode Prévisualisation :</strong> Cet aperçu simule l'affichage de l'appel pour les citoyens et candidats.
            </span>
          </div>
          <StatusBadge status={applicationCall.statut} />
        </div>

        {/* Public Hero Simulator */}
        <div className="mt-4 space-y-6 rounded-3xl border border-border/80 bg-gradient-to-b from-forest/10 via-card to-card p-6 sm:p-8 shadow-xs">
          
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {applicationCall.programme && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/15 px-3 py-1 text-xs font-bold text-forest">
                  <Compass className="size-3.5" />
                  <span>{applicationCall.programme.titre}</span>
                </span>
              )}
              {applicationCall.region && (
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                  <MapPin className="size-3 text-forest" />
                  <span>{REGION_LABELS[applicationCall.region] || applicationCall.region}</span>
                </span>
              )}
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {applicationCall.titre}
            </h1>

            {applicationCall.resume && (
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {applicationCall.resume}
              </p>
            )}
          </div>

          {/* Key Facts Grid */}
          <div className="grid gap-3 sm:grid-cols-3 rounded-2xl bg-secondary/50 p-4 border border-border/60 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px] font-semibold">Date Limite :</span>
              <span className="font-bold text-foreground mt-0.5 block">
                {applicationCall.date_limite ? formatDate(applicationCall.date_limite) : "Non précisée"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px] font-semibold">Nombre de Places :</span>
              <span className="font-bold text-foreground mt-0.5 block">
                {applicationCall.nombre_places ? `${applicationCall.nombre_places} lauréats` : "Non limité"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px] font-semibold">Territoire / Lieu :</span>
              <span className="font-bold text-foreground mt-0.5 block truncate">
                {applicationCall.localisation || "Casamance"}
              </span>
            </div>
          </div>

          {/* Description */}
          {applicationCall.description && (
            <div className="space-y-2 pt-2">
              <h3 className="font-display text-base font-bold text-foreground">
                À propos de cette opportunité
              </h3>
              <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed whitespace-pre-line">
                {applicationCall.description}
              </p>
            </div>
          )}

          {/* Documents Demandés */}
          {applicationCall.documents_requis && applicationCall.documents_requis.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="font-display text-base font-bold text-foreground">
                Pièces demandées pour postuler
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {applicationCall.documents_requis.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 rounded-xl border border-border bg-background p-3 text-xs"
                  >
                    <FileText className="size-4 text-forest shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{doc.libelle}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {doc.requis ? "Obligatoire" : "Optionnel"} • {doc.formats?.join(", ") || "PDF"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Simulated CTA */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Formulaire de candidature en ligne</span>
            <Button disabled className="rounded-full bg-forest text-white gap-2 font-semibold shadow-xs opacity-80 cursor-not-allowed">
              <span>Postuler à cet appel</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>

        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full text-xs">
            Fermer la prévisualisation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
