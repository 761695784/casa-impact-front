"use client"

import dynamic from "next/dynamic"
import { useMapPoints } from "@/hooks/use-content"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { MapPin } from "lucide-react"

const CasamanceMap = dynamic(() => import("./casamance-map"), {
  ssr: false,
  loading: () => <Skeleton className="h-[520px] w-full rounded-2xl" />,
})

export function CasamanceMapSection() {
  const { data: points, isLoading } = useMapPoints()

  if (isLoading) {
    return <Skeleton className="h-[520px] w-full rounded-2xl" />
  }

  if (!points || points.length === 0) {
    return (
      <EmptyState
        icon={<MapPin className="size-6" />}
        title="Aucun point à afficher"
        description="Les programmes et appels géolocalisés apparaîtront ici prochainement."
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
      <CasamanceMap points={points} />
    </div>
  )
}
