"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import { MapPin, Compass, Megaphone, Sparkles, Building2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { CartographyPointCard } from "./cartography-point-card"
import { REGION_LABELS } from "@/types/enums"
import type { MapPoint } from "@/types/models"

const DynamicCasamanceMap = dynamic(
  () => import("@/components/map/casamance-map"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[520px] w-full rounded-2xl bg-secondary/50 flex items-center justify-center border border-border">
        <Skeleton className="h-full w-full rounded-2xl" />
      </div>
    ),
  }
)

interface CartographyMapViewProps {
  points: MapPoint[]
}

const TYPE_ICONS: Record<MapPoint["type"], typeof Compass> = {
  program: Compass,
  "application-call": Megaphone,
  talent: Sparkles,
  implantation: Building2,
}

export function CartographyMapView({ points }: CartographyMapViewProps) {
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(
    points[0] || null
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      
      {/* Left (2 cols): Interactive Map & Points quick selector */}
      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-3xl border border-border bg-card p-3 shadow-2xs overflow-hidden">
          <DynamicCasamanceMap points={points} />
        </div>

        {/* Quick Points List */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground px-1">
            Points d'impact & implantations ({points.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {points.map((p) => {
              const Icon = TYPE_ICONS[p.type] || MapPin
              const isSelected = selectedPoint?.id === p.id && selectedPoint?.type === p.type

              return (
                <div
                  key={`${p.type}-${p.id}`}
                  onClick={() => setSelectedPoint(p)}
                  className={`flex items-start gap-3 rounded-2xl border p-3 cursor-pointer transition-all duration-150 text-left ${
                    isSelected
                      ? "border-forest bg-forest/5 shadow-xs"
                      : "border-border bg-card hover:bg-secondary/40"
                  }`}
                >
                  <div
                    className={`size-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-forest text-white"
                        : "bg-forest/10 text-forest"
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="font-bold text-xs text-foreground truncate">
                      {p.titre}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {REGION_LABELS[p.region] || p.region}
                      </span>
                      {p.commune && (
                        <>
                          <span>•</span>
                          <span className="truncate">{p.commune}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right (1 col): Selected Point Details */}
      <div className="space-y-4 lg:sticky lg:top-24">
        <CartographyPointCard point={selectedPoint} />
      </div>

    </div>
  )
}
