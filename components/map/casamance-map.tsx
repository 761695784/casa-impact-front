"use client"

import { useEffect } from "react"
import Link from "next/link"
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet"
import type { MapPoint } from "@/types/models"
import { REGION_LABELS } from "@/types/enums"
import "leaflet/dist/leaflet.css"

const typeLabels: Record<MapPoint["type"], string> = {
  program: "Programme",
  "application-call": "Appel à candidatures",
  talent: "Talent",
  implantation: "Implantation",
}

const typeHrefBase: Record<MapPoint["type"], string> = {
  program: "/programmes",
  "application-call": "/appels-a-candidatures",
  talent: "/talents",
  implantation: "/qui-sommes-nous",
}

// Casamance approximate center
const CENTER: [number, number] = [12.75, -15.6]

function FitBounds({ points }: { points: MapPoint[] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 0) return
    const bounds = points.map((p) => [p.latitude, p.longitude] as [number, number])
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 9 })
  }, [map, points])
  return null
}

export default function CasamanceMap({ points }: { points: MapPoint[] }) {
  return (
    <div className="h-[520px] w-full overflow-hidden rounded-2xl border border-border">
      <MapContainer
        center={CENTER}
        zoom={8}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        aria-label="Carte des actions de Casa Impact en Casamance"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        {points.map((p) => (
          <CircleMarker
            key={`${p.type}-${p.id}`}
            center={[p.latitude, p.longitude]}
            radius={11}
            pathOptions={{
              color: "#1f7a3d",
              fillColor: "#1f7a3d",
              fillOpacity: 0.85,
              weight: 2,
            }}
          >
            <Popup>
              <div className="min-w-40">
                <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  {typeLabels[p.type]}
                </span>
                <p className="mt-1 text-sm font-semibold leading-snug text-neutral-900">{p.titre}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{REGION_LABELS[p.region]}</p>
                {p.slug ? (
                  <Link
                    href={`${typeHrefBase[p.type]}/${p.slug}`}
                    className="mt-2 inline-block text-xs font-medium text-emerald-700 underline"
                  >
                    Voir le détail
                  </Link>
                ) : null}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
