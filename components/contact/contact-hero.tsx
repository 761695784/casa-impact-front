"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Sparkles, MapPin, Clock, MessageCircle, Mail } from "lucide-react"
import { BaobabMark } from "@/components/brand/baobab-mark"
import { contactInfo } from "@/lib/config"

interface Crumb {
  label: string
  href?: string
}

export function ContactHero({
  breadcrumbs = [{ label: "Accueil", href: "/" }, { label: "Contactez-nous" }],
}: {
  breadcrumbs?: Crumb[]
}) {
  return (
    <section className="relative isolate overflow-hidden bg-forest text-forest-foreground min-h-[480px] sm:min-h-[520px] lg:min-h-[560px] flex items-center">
      {/* Background Image with Ken Burns Zoom */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <div className="relative h-full w-full animate-ken-burns">
          <Image
            src="/assets/hero/DSC08011%20copie.jpg"
            alt="Équipe et communauté Casa Impact en Casamance"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* Multi-layered Cinematic Gradient Overlay */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-forest/95 via-forest/85 to-forest/50 md:from-forest/95 md:via-forest/80 md:to-forest/40"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-forest via-transparent to-black/50"
        aria-hidden
      />

      {/* Baobab Ambient Watermark */}
      <BaobabMark
        variant="white"
        size={600}
        className="pointer-events-none absolute -bottom-24 -right-16 hidden opacity-[0.08] lg:block lg:w-[480px]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-white/75">
              {breadcrumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  {c.href ? (
                    <Link href={c.href} className="hover:text-accent transition-colors">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-white font-semibold">{c.label}</span>
                  )}
                  {i < breadcrumbs.length - 1 && (
                    <ChevronRight className="size-3.5 text-white/40" aria-hidden />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/95 backdrop-blur-md">
          <Sparkles className="size-3 text-accent" />
          <span>Échange & Collaboration</span>
        </div>

        {/* Title */}
        <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl drop-shadow-sm">
          Parlons de vos projets pour la{" "}
          <span className="relative inline-block text-accent">
            Casamance
            <span className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-accent/60" aria-hidden />
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl font-normal drop-shadow">
          Une question sur nos programmes, une proposition de partenariat, une initiative pour le territoire ou une envie de vous engager ? Notre équipe vous répond depuis le cœur de la Casamance.
        </p>

        {/* Quick Contact Badges */}
        <div className="mt-8 flex flex-wrap items-center gap-3 pt-4 border-t border-white/15">
          <div className="flex items-center gap-1.5 rounded-lg bg-black/25 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm border border-white/10">
            <MapPin className="size-3.5 text-accent" />
            <span>Siège : {contactInfo.address.city}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-black/25 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm border border-white/10">
            <Clock className="size-3.5 text-accent" />
            <span>Réponse garantie sous 48h</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-black/25 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm border border-white/10">
            <MessageCircle className="size-3.5 text-accent" />
            <span>Ligne directe & WhatsApp</span>
          </div>
        </div>
      </div>
    </section>
  )
}
