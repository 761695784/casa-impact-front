"use client"

import Link from "next/link"
import { ArrowRight, ArrowUpRight, Calendar, Newspaper } from "lucide-react"
import { Section, SectionHeading } from "@/components/layout/section"
import { NewsCard } from "@/components/cards/news-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/format"
import { useNews } from "@/hooks/use-content"

// L'API réelle n'expose pas d'extrait dédié (pas de champ `extrait`) : on en
// dérive un court aperçu à partir du corps de l'article (`corps`), en
// retirant les balises HTML éventuelles et en tronquant proprement.
function newsTeaser(corps?: string, maxLength = 140): string | null {
  if (!corps) return null
  const text = corps.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
  if (!text) return null
  return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text
}

export function HomeNews() {
  const { data, isLoading } = useNews()
  const items = (data ?? []).slice(0, 3)
  const [lead, ...rest] = items

  if (!isLoading && items.length === 0) return null

  return (
    <Section tone="muted" className="relative">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Actualités & Événements"
          title="Ce qui fait vibrer Casa Impact"
          description="Retrouvez les dernières annonces, reportages de terrain et temps forts de notre organisation."
          className="mb-0"
        />
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/actualites" className="flex items-center gap-2">
            Toutes les actualités
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
          <div className="flex flex-col gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-3 rounded-2xl border border-border bg-background p-5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          {lead && <NewsCard article={lead} featured />}
          <div className="flex flex-col gap-4">
            {rest.map((a) => {
              // Pas de `date_publication` côté API réelle : `created_at` est
              // le seul horodatage disponible pour l'affichage.
              const teaser = newsTeaser(a.corps)
              return (
              <Link
                key={a.id}
                href={`/actualites/${a.slug}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-background p-6 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <Calendar className="size-3.5 text-primary" />
                    {a.created_at ? (
                      <time>{formatDate(a.created_at)}</time>
                    ) : (
                      <span>Récemment</span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                    {a.titre}
                  </h3>
                  {teaser && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {teaser}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary">
                  <span>Lire l'article</span>
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
              )
            })}
          </div>
        </div>
      )}
    </Section>
  )
}
