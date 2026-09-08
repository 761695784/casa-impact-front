"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Sparkles,
  MapPin,
  ExternalLink,
  ArrowRight,
  UserCheck,
  Search,
  Filter,
  Flame,
  Award,
} from "lucide-react"
import { useTalents } from "@/hooks/use-content"
import { CardGridSkeleton } from "@/components/ui/card-grid-skeleton"
import { Button } from "@/components/ui/button"
import { BaobabMark } from "@/components/brand/baobab-mark"
import { resolveMediaUrl } from "@/lib/format"
import { REGION_LABELS, type Region } from "@/types/enums"

// Clés alignées sur le vrai type Region ('ziguinchor' | 'sedhiou' | 'kolda'),
// libellés via REGION_LABELS — l'API ne renvoie jamais "Ziguinchor"/"Sédhiou".
const REGIONS: { key: string; label: string }[] = [
  { key: "all", label: "Toutes les régions" },
  { key: "ziguinchor", label: REGION_LABELS.ziguinchor },
  { key: "kolda", label: REGION_LABELS.kolda },
  { key: "sedhiou", label: REGION_LABELS.sedhiou },
]

const regionBadgeColors: Record<Region, string> = {
  ziguinchor: "bg-forest/15 text-forest border-forest/30",
  kolda: "bg-accent/25 text-accent-foreground border-accent/40",
  sedhiou: "bg-earth/15 text-earth border-earth/30",
}

export function TalentsList() {
  const { data, isLoading, isError } = useTalents()
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const filteredTalents = useMemo(() => {
    if (!data) return []
    return data.filter((t) => {
      const matchRegion =
        selectedRegion === "all" || t.region === (selectedRegion as Region)
      const matchSearch =
        searchQuery === "" ||
        t.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // domain reste undefined tant que Domaines n'est pas rebranché sur l'API réelle
        (t.domain?.nom && t.domain.nom.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.presentation && t.presentation.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchRegion && matchSearch
    })
  }, [data, selectedRegion, searchQuery])

  if (isLoading) return <CardGridSkeleton count={6} />

  // If no talents from API yet, show the prestigious interactive invitation showcase
  if (!data || data.length === 0) {
    return (
      <div className="space-y-12">
        {/* Showcase Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/40 p-8 sm:p-12 shadow-sm">
          <BaobabMark
            size={400}
            variant="color"
            className="pointer-events-none absolute -bottom-16 -right-16 hidden opacity-[0.07] sm:block"
          />

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground border border-accent/30">
              <Flame className="size-3.5" />
              <span>Appel à Recensement des Talents</span>
            </div>

            <h3 className="mt-5 font-display text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Le Mur des Talents est en cours de constitution
            </h3>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Casa Impact met en lumière les entrepreneurs, créateurs, artistes, sportifs et leaders qui bâtissent l'avenir de la Casamance. Vous portez un projet remarquable ou souhaitez faire rayonner un champion de votre région ?
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-accent px-7 font-semibold text-accent-foreground shadow-lg shadow-accent/20 hover:bg-forest hover:text-white transition-all"
              >
                <Link href="/adherer" className="flex items-center gap-2">
                  Proposer un talent
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-border bg-background hover:bg-secondary"
              >
                <Link href="/qui-sommes-nous">En savoir plus sur nos critères</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* 3 Illustrative Pillar Cards */}
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              region: "Ziguinchor",
              role: "Entrepreneuriat & Innovation",
              caption: "Startups, tech, agro-transformation & écotourisme",
            },
            {
              region: "Kolda",
              role: "Agro-écologie & Savoir-faire",
              caption: "Initiatives agricoles, artisanat d'art & leadership rural",
            },
            {
              region: "Sédhiou",
              role: "Culture, Arts & Patrimoine",
              caption: "Musique, contes, créations textiles & traditions vivantes",
            },
          ].map((item, i) => (
            <div
              key={item.region}
              className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-card p-6 text-center"
            >
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Award className="size-6" />
              </div>
              <span className="mt-4 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
                {item.region}
              </span>
              <h4 className="mt-3 font-display text-base font-bold text-foreground">
                {item.role}
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Search & Region Filter Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        {/* Region Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {REGIONS.map((r) => {
            const isSelected = selectedRegion === r.key
            return (
              <button
                key={r.key}
                onClick={() => setSelectedRegion(r.key)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un talent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-border bg-background pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Talents */}
      {filteredTalents.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">
            Aucun talent ne correspond à vos critères de recherche.
          </p>
          <Button
            variant="link"
            onClick={() => {
              setSelectedRegion("all")
              setSearchQuery("")
            }}
            className="mt-2 text-primary"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTalents.map((talent) => (
            <article
              key={talent.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
            >
              <div>
                {/* Photo container — pas de champ `photo` direct, image via `media` (premier élément) */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary">
                  <Image
                    src={resolveMediaUrl(talent.media?.[0]?.url) || "/assets/team/placeholder.svg"}
                    alt={talent.nom}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {talent.region && (
                    <span
                      className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md shadow-sm border ${
                        regionBadgeColors[talent.region] || "bg-background text-foreground"
                      }`}
                    >
                      <MapPin className="size-3" />
                      {REGION_LABELS[talent.region]}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* domain reste undefined tant que Domaines n'est pas rebranché sur l'API réelle */}
                  {talent.domain?.nom && (
                    <span className="inline-block rounded-md bg-secondary px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-primary">
                      {talent.domain.nom}
                    </span>
                  )}

                  <h3 className="mt-3 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {talent.nom}
                  </h3>

                  {talent.presentation && (
                    <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {talent.presentation}
                    </p>
                  )}
                </div>
              </div>

              {/* Links and Actions — liens_externes est un tableau de simples URLs (string[]) */}
              {talent.liens_externes && talent.liens_externes.length > 0 && (
                <div className="p-6 pt-0 border-t border-border/60 mt-4 flex flex-wrap gap-2">
                  {talent.liens_externes.map((url, idx) => {
                    let label = url
                    try {
                      label = new URL(url).hostname
                    } catch {
                      // URL non parsable : on garde l'URL brute comme libellé
                    }
                    return (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        <span>{label}</span>
                        <ExternalLink className="size-3" />
                      </a>
                    )
                  })}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
