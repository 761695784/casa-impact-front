"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTestimonials } from "@/hooks/use-content"
import { getTestimonialPhotoUrl } from "@/lib/format"
import { Quote, Sparkles, ChevronLeft, ChevronRight, Star, ArrowRight, CheckCircle2 } from "lucide-react"
import { BaobabMark } from "@/components/brand/baobab-mark"

export function HomeTestimonials() {
  const { data: testimonials = [] } = useTestimonials()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  // Pas de repli sur des données mockées : une liste réelle vide reste vide
  // (on ne substitue jamais du contenu fictif à de vraies données absentes).
  const publishedList = testimonials.filter((t) => t.statut === "publie")
  const total = publishedList.length

  const nextSlide = useCallback(() => {
    if (total === 0) return
    setCurrentIndex((prev) => (prev + 1) % total)
  }, [total])

  const prevSlide = useCallback(() => {
    if (total === 0) return
    setCurrentIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  // Auto-play interval
  useEffect(() => {
    if (isPaused || total <= 1) return
    autoPlayRef.current = setInterval(nextSlide, 5500)
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [isPaused, nextSlide, total])

  if (total === 0 || !publishedList[currentIndex]) return null

  const currentTestimonial = publishedList[currentIndex] || publishedList[0]

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-secondary/40 via-background to-secondary/30 py-20 sm:py-28"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Témoignages de nos bénéficiaires"
    >
      {/* Background Decorative Baobab Watermark */}
      <BaobabMark
        variant="color"
        size={500}
        className="pointer-events-none absolute -bottom-24 -left-20 opacity-[0.03] select-none"
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-bold text-primary mb-3">
              <Sparkles className="size-3.5 text-accent" />
              <span>Témoignages</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Ils ont osé, ils ont réussi
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              Découvrez les récits authentiques de jeunes, d'entrepreneurs et de créateurs accompagnés par Casa Impact à Ziguinchor, Sédhiou et Kolda.
            </p>
          </div>

          {/* Navigation Controls (Desktop) */}
          <div className="hidden sm:flex items-center gap-3 self-end">
            <button
              type="button"
              onClick={prevSlide}
              className="flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xs hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95"
              aria-label="Témoignage précédent"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xs hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95"
              aria-label="Témoignage suivant"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* Featured Showcase Slider */}
        <div className="relative mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-6 sm:p-10 lg:p-12 shadow-xl shadow-primary/5">
            {/* Ambient Background Accents */}
            <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-accent/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-primary/10 blur-2xl" />

            {/* Giant Gold Quote Icon */}
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 opacity-20 pointer-events-none">
              <Quote className="size-16 sm:size-24 text-accent" />
            </div>

            {/* Star Rating Badge */}
            <div className="flex items-center gap-1 mb-6 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Impact Vérifié sur le Terrain
              </span>
            </div>

            {/* Testimonial Quote Text */}
            <blockquote className="relative break-words text-base sm:text-xl lg:text-2xl font-display font-medium text-foreground leading-relaxed transition-opacity duration-300 [overflow-wrap:anywhere]">
              « {currentTestimonial.citation} »
            </blockquote>

            {/* Author Profile Footer */}
            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Photo with Glowing Ring */}
                <div className="relative size-14 sm:size-16 rounded-full overflow-hidden bg-secondary ring-2 ring-accent/60 shadow-md shrink-0">
                  <Image
                    src={getTestimonialPhotoUrl(currentTestimonial) || "/assets/team/placeholder.svg"}
                    alt={currentTestimonial.auteur}
                    fill
                    sizes="64px"
                    className="object-cover object-top"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
                      {currentTestimonial.auteur}
                    </h3>
                    <CheckCircle2 className="size-4 text-primary shrink-0" aria-label="Profil validé" />
                  </div>
                  {/* `fonction`/`organisation` n'existent pas séparément côté API réelle :
                      un seul champ combiné `role_organisation`. */}
                  {currentTestimonial.role_organisation && (
                    <p className="text-xs sm:text-sm font-semibold text-primary">
                      {currentTestimonial.role_organisation}
                    </p>
                  )}
                </div>
              </div>

              {/* Le badge "programme lié" a été retiré : sur l'index public des
                  témoignages, la relation `program` n'est jamais chargée par
                  l'API (toujours null/absente). */}
            </div>
          </div>

          {/* Dots Indicator & Mobile Navigation */}
          <div className="mt-8 flex items-center justify-between sm:justify-center gap-4">
            <button
              type="button"
              onClick={prevSlide}
              className="sm:hidden flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xs"
              aria-label="Précédent"
            >
              <ChevronLeft className="size-4" />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {publishedList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${currentIndex === idx
                      ? "w-8 bg-primary"
                      : "w-2.5 bg-border hover:bg-muted-foreground/50"
                    }`}
                  aria-label={`Aller au témoignage ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextSlide}
              className="sm:hidden flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xs"
              aria-label="Suivant"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Bottom CTA to View All Testimonials */}
        <div className="mt-12 text-center">
          <Link
            href="/temoignages"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-forest transition-colors group"
          >
            <span>Lire tous les témoignages de la communauté</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
