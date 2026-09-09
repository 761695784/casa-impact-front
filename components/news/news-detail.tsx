"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  ChevronRight,
} from "lucide-react"
import { LinkedinIcon, FacebookIcon } from "@/components/brand/social-icons"
import { useNewsArticle, useNews } from "@/hooks/use-content"
import { Section, SectionHeading } from "@/components/layout/section"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { NewsGallery } from "@/components/news/news-gallery"
import { Badge } from "@/components/ui/badge"
import { NEWS_TYPE_LABELS } from "@/types/enums"
import { formatDate, getNewsCoverUrl, getNewsGalleryMedia } from "@/lib/format"
import { NewsCard } from "@/components/cards/news-card"
import { BaobabMark } from "@/components/brand/baobab-mark"
import { toast } from "sonner"

const newsTypeBadgeColors: Record<string, string> = {
  article: "bg-forest text-white",
  annonce: "bg-accent text-accent-foreground font-bold",
  communique: "bg-earth text-white",
  "compte-rendu": "bg-primary text-primary-foreground",
}

export function NewsDetail({ slug }: { slug: string }) {
  const { data: article, isLoading, isError } = useNewsArticle(slug)
  const { data: allNews } = useNews()

  // Pas de repli sur des données mockées : un article réel introuvable doit afficher l'état vide, jamais du faux contenu.
  const otherArticles = (allNews ?? []).filter((n) => n.slug !== slug).slice(0, 3)

  if (isLoading) {
    return (
      <Section className="py-24">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-6 h-10 w-2/3" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
      </Section>
    )
  }

  if (isError || !article) {
    return (
      <Section className="py-24">
        <EmptyState
          title="Article introuvable"
          description="Cet article n'existe pas ou n'est plus disponible."
          action={
            <Button asChild className="rounded-full">
              <Link href="/actualites">Retour aux actualités</Link>
            </Button>
          }
        />
      </Section>
    )
  }

  const currentArticle = article
  // Pas de champ `image` direct côté API réelle — visuel via `media` (collection "cover", sinon fallback).
  const cover = getNewsCoverUrl(currentArticle) || "/assets/hero/DSC08016%20copie.jpg"
  const galleryMedia = getNewsGalleryMedia(currentArticle)

  const shareOnSocial = (platform: string) => {
    if (typeof window === "undefined") return
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(currentArticle.titre)

    let shareUrl = ""
    if (platform === "whatsapp") {
      shareUrl = `https://wa.me/?text=${title}%20${url}`
    } else if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
    } else if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    } else if (platform === "copy") {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Lien copié dans le presse-papiers !")
      return
    }

    if (shareUrl) window.open(shareUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <article className="overflow-hidden">
      {/* 1. Article Hero Section with Background Photo */}
      <section className="relative isolate overflow-hidden bg-forest text-forest-foreground min-h-[480px] sm:min-h-[520px] flex items-center">
        {/* Background Image with Ken Burns */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <div className="relative h-full w-full animate-ken-burns">
            <Image
              src={cover}
              alt={currentArticle.titre}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Multi-layered Cinematic Gradient Overlay */}
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-forest/95 via-forest/85 to-forest/60 md:from-forest/95 md:via-forest/85 md:to-forest/50"
          aria-hidden
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-t from-forest via-transparent to-black/60"
          aria-hidden
        />

        {/* Baobab Ambient Watermark */}
        <BaobabMark
          variant="white"
          size={560}
          className="pointer-events-none absolute -bottom-20 -right-20 hidden opacity-[0.08] lg:block"
        />

        <div className="relative mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          {/* Breadcrumbs & Back Link */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Link
              href="/actualites"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 hover:text-accent transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              Retour aux actualités
            </Link>

            <nav aria-label="Fil d'Ariane" className="hidden sm:block">
              <ol className="flex items-center gap-1.5 text-xs text-white/70">
                <li>
                  <Link href="/" className="hover:text-accent">
                    Accueil
                  </Link>
                </li>
                <li>
                  <ChevronRight className="size-3 text-white/40" />
                </li>
                <li>
                  <Link href="/actualites" className="hover:text-accent">
                    Actualités
                  </Link>
                </li>
                <li>
                  <ChevronRight className="size-3 text-white/40" />
                </li>
                <li className="text-white font-medium truncate max-w-[200px]">
                  {currentArticle.titre}
                </li>
              </ol>
            </nav>
          </div>

          {/* Badges & Meta */}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider shadow-sm ${
                newsTypeBadgeColors[currentArticle.type] || "bg-primary text-white"
              }`}
            >
              {NEWS_TYPE_LABELS[currentArticle.type]}
            </span>

            {/* Pas de `date_publication` côté API réelle — `created_at` utilisé comme repère temporel */}
            {currentArticle.created_at && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm border border-white/15">
                <Calendar className="size-3 text-accent" />
                <time>{formatDate(currentArticle.created_at)}</time>
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm border border-white/15">
              <Clock className="size-3 text-accent" />
              2 min de lecture
            </span>
          </div>

          {/* Headline */}
          <h1 className="mt-6 text-balance font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl drop-shadow-sm">
            {currentArticle.titre}
          </h1>

          {/* Pas d'`extrait` côté API réelle — pas de chapeau introductif dans le hero */}
        </div>
      </section>

      {/* 2. Article Body & Content */}
      <Section className="py-14 sm:py-20">
        <div className="mx-auto max-w-4xl">
          {/* Main Content Box */}
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-sm">
            {/* Featured Image inside Article if distinct */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-secondary shadow-md mb-8">
              <Image
                src={cover}
                alt={currentArticle.titre}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>

            {/* Editorial Body Text — le champ réel est `corps` (pas `contenu`) */}
            <div className="prose prose-lg prose-neutral max-w-none dark:prose-invert space-y-4">
              {currentArticle.corps?.split("\n\n").map((para, idx) => (
                <p key={idx} className="text-base sm:text-lg leading-relaxed text-foreground/90 font-normal">
                  {para}
                </p>
              ))}
            </div>

            {/* Photo Gallery with Lightbox if available — couverture exclue, déjà affichée dans le hero */}
            {galleryMedia.length > 0 && (
              <NewsGallery medias={galleryMedia} />
            )}

            {/* Author / Publisher Footnote */}
            <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BaobabMark size={24} variant="color" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Équipe Communication Casa Impact</p>
                  <p className="text-xs text-muted-foreground">Publication officielle pour Ziguinchor, Kolda & Sédhiou</p>
                </div>
              </div>

              {/* Social Share Bar */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground mr-1 hidden sm:inline">
                  Partager :
                </span>
                <button
                  onClick={() => shareOnSocial("whatsapp")}
                  aria-label="Partager sur WhatsApp"
                  className="flex size-9 items-center justify-center rounded-full bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                >
                  <MessageCircle className="size-4" />
                </button>
                <button
                  onClick={() => shareOnSocial("facebook")}
                  aria-label="Partager sur Facebook"
                  className="flex size-9 items-center justify-center rounded-full bg-blue-600/15 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <FacebookIcon className="size-4" />
                </button>
                <button
                  onClick={() => shareOnSocial("linkedin")}
                  aria-label="Partager sur LinkedIn"
                  className="flex size-9 items-center justify-center rounded-full bg-sky-600/15 text-sky-700 hover:bg-sky-600 hover:text-white transition-colors"
                >
                  <LinkedinIcon className="size-4" />
                </button>
                <button
                  onClick={() => shareOnSocial("copy")}
                  aria-label="Copier le lien"
                  className="flex size-9 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Share2 className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Back */}
          <div className="mt-8 text-center">
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link href="/actualites" className="flex items-center gap-2">
                <ArrowLeft className="size-4" />
                Voir toutes les autres actualités
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* 3. Related Articles Section */}
      {otherArticles.length > 0 && (
        <Section tone="muted" className="py-20 border-t border-border">
          <SectionHeading
            eyebrow="Poursuivre la lecture"
            title="Autres Actualités Récentes"
            description="Découvrez les dernières publications et initiatives de Casa Impact."
            align="center"
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherArticles.map((n) => (
              <NewsCard key={n.id} article={n} />
            ))}
          </div>
        </Section>
      )}
    </article>
  )
}
