"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ExternalLink,
  Handshake,
  Landmark,
  Building2,
  GraduationCap,
  Radio,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import { usePartners } from "@/hooks/use-content"
import { CardGridSkeleton } from "@/components/ui/card-grid-skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { getPartnerLogoUrl } from "@/lib/format"
import { PartnerType } from "@/types/enums"
import { cn } from "@/lib/utils"

const CATEGORIES: { id: string; label: string; type?: PartnerType; icon: React.ElementType }[] = [
  { id: "all", label: "Tous les partenaires", icon: Handshake },
  { id: "institutionnel", label: "Institutionnels", type: "institutionnel", icon: Landmark },
  { id: "financier", label: "Financiers & Privés", type: "financier", icon: Building2 },
  { id: "technique", label: "Techniques & Formation", type: "technique", icon: GraduationCap },
  { id: "media", label: "Médias & Rayonnement", type: "media", icon: Radio },
]

const TYPE_CONFIG: Record<
  PartnerType,
  { label: string; badgeClass: string; icon: React.ElementType }
> = {
  institutionnel: {
    label: "Institutionnel",
    badgeClass: "bg-forest/10 text-forest border-forest/20",
    icon: Landmark,
  },
  financier: {
    label: "Financier & Privé",
    badgeClass: "bg-accent/20 text-earth border-accent/40",
    icon: Building2,
  },
  technique: {
    label: "Technique & Académique",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
    icon: GraduationCap,
  },
  media: {
    label: "Média & Partenaire",
    badgeClass: "bg-sand/40 text-foreground border-border",
    icon: Radio,
  },
}

export function PartnersGrid() {
  const { data: partnersData, isLoading } = usePartners()
  const [activeCategory, setActiveCategory] = useState<string>("all")

  // Filtre uniquement les partenaires actifs
  const activePartners = useMemo(() => {
    return (partnersData ?? []).filter((p) => p.statut === "actif")
  }, [partnersData])

  // Filtrage par catégorie sélectionnée
  const filteredPartners = useMemo(() => {
    if (activeCategory === "all") return activePartners
    return activePartners.filter((p) => p.type === activeCategory)
  }, [activePartners, activeCategory])

  // Comptage par catégorie
  const countByCategory = useMemo(() => {
    const counts: Record<string, number> = { all: activePartners.length }
    for (const p of activePartners) {
      if (p.type) {
        counts[p.type] = (counts[p.type] || 0) + 1
      }
    }
    return counts
  }, [activePartners])

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-start gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-28 animate-pulse rounded-full bg-muted" />
          ))}
        </div>
        <CardGridSkeleton count={8} />
      </div>
    )
  }

  if (activePartners.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border/80 bg-card/50 p-8 sm:p-12 text-center">
        <EmptyState
          icon={<Handshake className="size-8 text-forest" />}
          title="Nos partenaires seront bientôt présentés ici"
          description="Casa Impact construit activement un réseau d'alliances stratégiques, institutionnelles et citoyennes pour la Casamance. Vous souhaitez vous associer à notre mission ?"
          action={
            <Button asChild size="lg" className="rounded-full bg-forest text-white hover:bg-forest/90 shadow-md">
              <Link href="/contact">
                <span>Devenir partenaire</span>
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Category Filter Tabs with clean spacing */}
      <div className="flex flex-wrap items-center justify-start gap-2.5 sm:gap-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const isActive = activeCategory === cat.id
          const count = countByCategory[cat.id] || 0

          // N'afficher la catégorie que si elle a des partenaires ou si c'est 'all'
          if (cat.id !== "all" && count === 0) return null

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-forest text-white shadow-md shadow-forest/20 ring-2 ring-forest ring-offset-2 ring-offset-background"
                  : "bg-card text-muted-foreground border border-border/80 hover:bg-secondary hover:text-foreground hover:border-forest/30"
              )}
            >
              <Icon className={cn("size-3.5 sm:size-4 transition-transform group-hover:scale-110", isActive ? "text-accent" : "text-muted-foreground")} />
              <span>{cat.label}</span>
              <span
                className={cn(
                  "ml-1 inline-flex items-center justify-center rounded-full px-1.5 py-0.2 text-[10px] font-bold min-w-[18px]",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Grid of Partner Cards */}
      {filteredPartners.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card/60 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Aucun partenaire actif dans cette catégorie pour le moment.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveCategory("all")}
            className="mt-4 rounded-full text-xs"
          >
            Afficher tous les partenaires
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPartners.map((partner) => {
            const logoUrl = getPartnerLogoUrl(partner)
            const typeConfig = partner.type ? TYPE_CONFIG[partner.type] : null
            const TypeIcon = typeConfig?.icon || Handshake

            const CardWrapper = partner.lien ? "a" : "div"
            const cardProps = partner.lien
              ? {
                  href: partner.lien,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  title: `Visiter le site officiel de ${partner.nom}`,
                }
              : {}

            return (
              <CardWrapper
                key={partner.id}
                {...cardProps}
                className={cn(
                  "group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xs transition-all duration-300",
                  "hover:border-forest/40 hover:bg-card hover:shadow-xl hover:-translate-y-1.5",
                  partner.lien ? "cursor-pointer" : ""
                )}
              >
                <div>
                  {/* Top Bar: Type Badge & External Link Icon */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {typeConfig ? (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                          typeConfig.badgeClass
                        )}
                      >
                        <TypeIcon className="size-3" />
                        <span>{typeConfig.label}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                        <Handshake className="size-3" />
                        <span>Partenaire</span>
                      </span>
                    )}

                    {partner.lien ? (
                      <div className="flex size-7 items-center justify-center rounded-full bg-secondary text-muted-foreground group-hover:bg-forest group-hover:text-white transition-all duration-200">
                        <ExternalLink className="size-3.5" />
                      </div>
                    ) : (
                      <div className="flex size-7 items-center justify-center rounded-full bg-forest/5 text-forest">
                        <CheckCircle2 className="size-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Logo Display Area */}
                  <div className="relative flex h-24 sm:h-28 w-full items-center justify-center rounded-xl border border-border/50 bg-gradient-to-b from-secondary/30 to-secondary/60 p-4 transition-colors group-hover:border-forest/20 group-hover:from-forest/5 group-hover:to-forest/10 overflow-hidden">
                    {logoUrl ? (
                      <Image
                        src={logoUrl}
                        alt={`Logo officiel de ${partner.nom}`}
                        fill
                        sizes="(max-width: 640px) 240px, (max-width: 1024px) 200px, 240px"
                        className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <Building2 className="size-8 text-muted-foreground/40 mb-1" />
                        <span className="font-display text-sm font-bold text-foreground line-clamp-1">
                          {partner.nom}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Partner Info */}
                  <div className="mt-4">
                    <h3 className="font-display text-base font-bold text-foreground group-hover:text-forest transition-colors line-clamp-1">
                      {partner.nom}
                    </h3>
                    {partner.description ? (
                      <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {partner.description}
                      </p>
                    ) : (
                      <p className="mt-1.5 text-xs text-muted-foreground/70 italic">
                        Partenaire engagé pour le développement territorial de la Casamance.
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Link / Info */}
                <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-medium">
                  {partner.lien ? (
                    <span className="inline-flex items-center gap-1.5 text-forest font-semibold group-hover:underline">
                      <span>Consulter le site officiel</span>
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Sparkles className="size-3 text-accent" />
                      <span>Alliance territoriale</span>
                    </span>
                  )}
                </div>
              </CardWrapper>
            )
          })}
        </div>
      )}

      {/* Trust & Transparency Banner */}
      <div className="rounded-2xl border border-forest/15 bg-gradient-to-br from-forest/5 via-card to-accent/5 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-forest text-white shadow-md">
              <Handshake className="size-6 text-accent" />
            </div>
            <div>
              <h4 className="font-display text-base sm:text-lg font-bold text-foreground">
                Vous souhaitez devenir partenaire de Casa Impact ?
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Co-construisons ensemble des solutions à fort impact pour la jeunesse de Ziguinchor, Sédhiou et Kolda.
              </p>
            </div>
          </div>

          <Button
            asChild
            className="rounded-full bg-forest text-white hover:bg-forest/90 shadow-md shrink-0 px-6"
          >
            <Link href="/contact" className="inline-flex items-center gap-2">
              <span>Initier un partenariat</span>
              <ArrowRight className="size-4 text-accent" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
