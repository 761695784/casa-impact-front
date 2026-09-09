"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Calendar, Clock, Sparkles, Camera } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { NEWS_TYPE_LABELS } from "@/types/enums"
import { formatDate, getNewsCoverUrl, getNewsGalleryMedia } from "@/lib/format"
import type { News } from "@/types/models"

const newsTypeBadgeColors: Record<string, string> = {
  article: "bg-forest text-white hover:bg-forest",
  annonce: "bg-accent text-accent-foreground hover:bg-accent font-bold",
  communique: "bg-earth text-white hover:bg-earth",
  "compte-rendu": "bg-primary text-primary-foreground hover:bg-primary",
}

export function NewsCard({ article, featured = false }: { article: News; featured?: boolean }) {
  // Pas de champ `image` direct côté API réelle — visuel via `media` (collection "cover", sinon fallback).
  const cover = getNewsCoverUrl(article) || "/assets/news/default-news.png"
  const galleryCount = getNewsGalleryMedia(article).length

  return (
    <Link
      href={`/actualites/${article.slug}`}
      className={`group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl ${
        featured ? "grid md:grid-cols-[1.1fr_1fr]" : "flex flex-col"
      }`}
    >
      {/* Image Cover */}
      <div
        className={`relative overflow-hidden bg-secondary ${
          featured ? "aspect-[16/10] md:aspect-auto md:min-h-[320px]" : "aspect-[16/10]"
        }`}
      >
        <Image
          src={cover}
          alt={article.titre}
          fill
          sizes={featured ? "(max-width: 768px) 100vw, 55vw" : "(max-width: 768px) 100vw, 33vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Type Badge */}
        <span
          className={`absolute left-3.5 top-3.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm ${
            newsTypeBadgeColors[article.type] || "bg-primary text-white"
          }`}
        >
          {NEWS_TYPE_LABELS[article.type]}
        </span>

        {featured && (
          <span className="absolute right-3.5 top-3.5 inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white border border-white/20">
            <Sparkles className="size-3 text-accent" />
            À la Une
          </span>
        )}

        {galleryCount > 0 && (
          <span className="absolute right-3.5 bottom-3.5 inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/20">
            <Camera className="size-3 text-accent" />
            <span>{galleryCount} photo{galleryCount > 1 ? "s" : ""}</span>
          </span>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-1 flex-col justify-between p-6 sm:p-7 ${featured ? "justify-center" : ""}`}>
        <div>
          {/* Metadata Row */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
            {/* Pas de `date_publication` côté API réelle — `created_at` utilisé comme repère temporel */}
            {article.created_at && (
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5 text-primary" />
                <time>{formatDate(article.created_at)}</time>
              </span>
            )}
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              2 min de lecture
            </span>
          </div>

          {/* Title */}
          <h3
            className={`mt-3 font-display font-bold leading-snug text-foreground transition-colors group-hover:text-primary ${
              featured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
            }`}
          >
            {article.titre}
          </h3>

          {/* Pas d'`extrait` côté API réelle — pas d'aperçu textuel sur la carte */}
        </div>

        {/* Read More Link */}
        <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs sm:text-sm font-semibold text-primary">
          <span className="group-hover:underline">Lire l'article complet</span>
          <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:translate-x-1 group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
