"use client"

import { useState, useMemo } from "react"
import { Newspaper, Search, Filter } from "lucide-react"
import { useNews } from "@/hooks/use-content"
import { NewsCard } from "@/components/cards/news-card"
import { CardGridSkeleton } from "@/components/ui/card-grid-skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import type { NewsType } from "@/types/enums"

const FILTER_TYPES: { key: string; label: string }[] = [
  { key: "all", label: "Toutes les actualités" },
  { key: "annonce", label: "Annonces" },
  { key: "compte-rendu", label: "Comptes-rendus" },
  { key: "communique", label: "Communiqués" },
  { key: "article", label: "Articles" },
]

export function NewsList() {
  const { data, isLoading, isError } = useNews()
  const [selectedType, setSelectedType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const filteredNews = useMemo(() => {
    if (!data) return []
    return data.filter((n) => {
      const matchType = selectedType === "all" || n.type === (selectedType as NewsType)
      const matchSearch =
        searchQuery === "" ||
        n.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.extrait && n.extrait.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (n.contenu && n.contenu.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchType && matchSearch
    })
  }, [data, selectedType, searchQuery])

  if (isLoading) return <CardGridSkeleton count={6} />

  if (isError) {
    return (
      <EmptyState
        icon={<Newspaper className="size-8" />}
        title="Impossible de charger les actualités"
        description="Une erreur est survenue lors de la récupération des articles. Veuillez réessayer ultérieurement."
      />
    )
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={<Newspaper className="size-8" />}
        title="Aucune actualité publiée"
        description="Les actualités, reportages et communiqués officiels de Casa Impact seront publiés ici très prochainement."
      />
    )
  }

  const featuredArticle = selectedType === "all" && searchQuery === "" ? filteredNews[0] : null
  const regularArticles =
    selectedType === "all" && searchQuery === "" ? filteredNews.slice(1) : filteredNews

  return (
    <div className="space-y-10">
      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        {/* Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_TYPES.map((t) => {
            const isSelected = selectedType === t.key
            return (
              <button
                key={t.key}
                onClick={() => setSelectedType(t.key)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une actualité..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-border bg-background pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Filtered Results */}
      {filteredNews.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">
            Aucun article ne correspond à votre recherche.
          </p>
          <Button
            variant="link"
            onClick={() => {
              setSelectedType("all")
              setSearchQuery("")
            }}
            className="mt-2 text-primary"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Featured Headline Lead Card */}
          {featuredArticle && <NewsCard article={featuredArticle} featured />}

          {/* Grid of Other Articles */}
          {regularArticles.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {regularArticles.map((n) => (
                <NewsCard key={n.id} article={n} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
