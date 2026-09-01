"use client"

import { useState, useMemo } from "react"
import { Newspaper, Search, Filter } from "lucide-react"
import { useNews } from "@/hooks/use-content"
import { mockNews } from "@/lib/mock/news.mock"
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
  const { data } = useNews()
  const [selectedType, setSelectedType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const rawData = data && data.length > 0 ? data : mockNews

  const filteredNews = useMemo(() => {
    return rawData.filter((n) => {
      // Show only published articles on public page
      if (n.statut && n.statut !== "publie") return false

      const matchType = selectedType === "all" || n.type === (selectedType as NewsType)
      const matchSearch =
        searchQuery === "" ||
        n.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.extrait && n.extrait.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (n.contenu && n.contenu.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchType && matchSearch
    })
  }, [rawData, selectedType, searchQuery])

  if (filteredNews.length === 0) {
    return (
      <div className="space-y-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-border bg-card p-4 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une actualité..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-full border border-input bg-background pl-9 pr-4 text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            {FILTER_TYPES.map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedType(f.key)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                  selectedType === f.key
                    ? "bg-primary text-white shadow-xs"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <EmptyState
          icon={<Newspaper className="size-8" />}
          title="Aucun article ne correspond à votre recherche"
          description="Essayez un autre mot-clé ou réinitialisez les filtres pour voir les actualités."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSelectedType("all")
                setSearchQuery("")
              }}
              className="rounded-full"
            >
              Réinitialiser les filtres
            </Button>
          }
        />
      </div>
    )
  }

  const featuredArticle = selectedType === "all" && searchQuery === "" ? filteredNews[0] : null
  const standardArticles = featuredArticle ? filteredNews.slice(1) : filteredNews

  return (
    <div className="space-y-10">
      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une actualité, un événement, une région..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-full border border-input bg-background pl-9 pr-4 text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {FILTER_TYPES.map((f) => (
            <button
              key={f.key}
              onClick={() => setSelectedType(f.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                selectedType === f.key
                  ? "bg-primary text-white shadow-xs"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Article Card */}
      {featuredArticle && (
        <div className="mb-10">
          <NewsCard article={featuredArticle} featured />
        </div>
      )}

      {/* Standard Grid Cards */}
      {standardArticles.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {standardArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
