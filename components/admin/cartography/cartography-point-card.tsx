"use client"

import React from "react"
import Link from "next/link"
import {
  MapPin,
  Compass,
  Megaphone,
  Sparkles,
  Building2,
  ExternalLink,
  Layers,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { REGION_LABELS } from "@/types/enums"
import type { MapPoint } from "@/types/models"

interface CartographyPointCardProps {
  point: MapPoint | null
  onClose?: () => void
}

const TYPE_ICONS: Record<MapPoint["type"], typeof Compass> = {
  program: Compass,
  "application-call": Megaphone,
  talent: Sparkles,
  implantation: Building2,
}

const TYPE_LABELS: Record<MapPoint["type"], string> = {
  program: "Programme d'Action",
  "application-call": "Appel à Candidatures",
  talent: "Talent & Champion",
  implantation: "Implantation / Hub",
}

const TYPE_LINKS: Record<MapPoint["type"], string> = {
  program: "/admin/programmes",
  "application-call": "/admin/appels-a-candidatures",
  talent: "/admin/talents",
  implantation: "/admin/dashboard",
}

export function CartographyPointCard({
  point,
  onClose,
}: CartographyPointCardProps) {
  if (!point) {
    return (
      <Card className="rounded-3xl border-border bg-card p-6 shadow-2xs text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
          <MapPin className="size-6" />
        </div>
        <h4 className="mt-3 font-bold text-sm text-foreground">
          Sélectionnez un point
        </h4>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          Cliquez sur un marqueur de la carte ou sur un élément de la liste pour afficher ses indicateurs et détails territoriaux.
        </p>
      </Card>
    )
  }

  const Icon = TYPE_ICONS[point.type] || MapPin

  return (
    <Card className="rounded-3xl border-border bg-card shadow-2xs overflow-hidden animate-in fade-in-50 duration-200">
      <CardHeader className="border-b border-border/60 pb-4 bg-secondary/30">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-forest/10 px-2.5 py-1 text-xs font-semibold text-forest">
            <Icon className="size-3.5" />
            <span>{TYPE_LABELS[point.type]}</span>
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
          </span>
        </div>
        <CardTitle className="mt-2 text-base font-bold text-foreground">
          {point.titre}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-5 space-y-4 text-xs sm:text-sm">
        {/* Localisation */}
        <div className="space-y-2 rounded-2xl bg-secondary/40 p-3.5 border border-border/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Région naturelle :</span>
            <span className="font-bold text-foreground">
              {point.region ? (REGION_LABELS[point.region] || point.region) : "—"}
            </span>
          </div>
          {point.departement && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Département :</span>
              <span className="font-semibold text-foreground">
                {point.departement}
              </span>
            </div>
          )}
          {point.commune && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Commune / Localité :</span>
              <span className="font-semibold text-foreground">
                {point.commune}
              </span>
            </div>
          )}
        </div>

        {/* Domaine / Description */}
        {point.domaine_nom && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Layers className="size-3.5 text-forest shrink-0" />
            <span>Domaine : </span>
            <strong className="text-foreground">{point.domaine_nom}</strong>
          </div>
        )}

        {point.description && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {point.description}
          </p>
        )}

        {/* Action button */}
        <div className="pt-2">
          <Button
            asChild
            size="sm"
            className="w-full rounded-full text-xs gap-1.5 bg-forest text-white hover:bg-forest/90 font-medium"
          >
            <Link href={TYPE_LINKS[point.type]}>
              <span>Voir dans le module {TYPE_LABELS[point.type]}</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
