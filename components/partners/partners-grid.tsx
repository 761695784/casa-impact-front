"use client"

import Image from "next/image"
import { usePartners } from "@/hooks/use-content"
import { CardGridSkeleton } from "@/components/ui/card-grid-skeleton"
import Link from "next/link"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Handshake } from "lucide-react"

export function PartnersGrid() {
  const { data: partners, isLoading } = usePartners()

  if (isLoading) return <CardGridSkeleton count={6} />

  if (!partners || partners.length === 0) {
    return (
      <EmptyState
        icon={<Handshake className="size-6" />}
        title="Nos partenaires seront bientôt présentés ici"
        description="Casa Impact construit un réseau de partenaires institutionnels, techniques et financiers engagés aux côtés de la jeunesse casamançaise. Vous souhaitez en faire partie ?"
        action={
          <Button asChild>
            <Link href="/contact">Devenir partenaire</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {partners.map((partner) => (
        <a
          key={partner.id}
          href={partner.lien || undefined}
          target={partner.lien ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
        >
          <div className="relative h-16 w-full">
            <Image
              src={partner.logo || "/placeholder.svg"}
              alt={partner.nom}
              fill
              sizes="200px"
              className="object-contain"
            />
          </div>
        </a>
      ))}
    </div>
  )
}
