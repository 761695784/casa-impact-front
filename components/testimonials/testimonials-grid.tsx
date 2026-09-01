"use client"

import React, { useState, useMemo } from "react"
import Image from "next/image"
import { Quote, Sparkles, Star, CheckCircle2 } from "lucide-react"
import { useTestimonials } from "@/hooks/use-content"
import { mockTestimonials } from "@/lib/mock/testimonials.mock"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function TestimonialsGrid() {
  const { data: testimonials = [] } = useTestimonials()
  const [selectedFilter, setSelectedFilter] = useState<string>("all")

  // Use dynamic testimonials or fallback to mockTestimonials
  const rawList = testimonials.length > 0 ? testimonials : mockTestimonials

  // Filter only published
  const published = useMemo(() => {
    return rawList.filter((t) => t.statut === "publie")
  }, [rawList])

  // Extract unique programs
  const programs = useMemo(() => {
    const list: { id: string; label: string }[] = [{ id: "all", label: "Tous les témoignages" }]
    published.forEach((t) => {
      if (t.programme && !list.find((p) => p.id === String(t.programme?.id))) {
        list.push({ id: String(t.programme.id), label: t.programme.titre })
      }
    })
    return list
  }, [published])

  const filteredList = useMemo(() => {
    if (selectedFilter === "all") return published
    return published.filter((t) => String(t.programme_id) === selectedFilter || String(t.programme?.id) === selectedFilter)
  }, [published, selectedFilter])

  if (published.length === 0) {
    return (
      <EmptyState
        icon={<Quote className="size-6" />}
        title="Les premiers témoignages arrivent bientôt"
        description="Bénéficiaires, membres et partenaires partageront ici leur expérience de l'organisation Casa Impact. Vous avez une histoire à raconter ?"
        action={
          <Button asChild className="rounded-full bg-primary text-white">
            <Link href="/contact">Partager mon témoignage</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-10">
      {/* Category Filter Pills */}
      {programs.length > 2 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
          {programs.map((p) => {
            const isActive = selectedFilter === p.id
            return (
              <button
                key={p.id}
                onClick={() => setSelectedFilter(p.id)}
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                }`}
              >
                {p.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Grid of Testimonial Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredList.map((t) => (
          <figure
            key={t.id}
            className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300"
          >
            {/* Top Row: Stars & Quote Icon */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <Quote className="size-6 text-accent/50 group-hover:text-accent transition-colors" />
            </div>

            {/* Quote Content */}
            <blockquote className="flex-1 text-sm sm:text-base leading-relaxed text-foreground/90 font-medium font-sans">
              « {t.contenu} »
            </blockquote>

            {/* Author Profile Footer */}
            <figcaption className="mt-6 flex items-center gap-3.5 border-t border-border pt-4">
              <div className="relative size-12 overflow-hidden rounded-full bg-secondary ring-2 ring-accent/60 shadow-sm shrink-0">
                <Image
                  src={t.photo || "/assets/team/placeholder.svg"}
                  alt={t.auteur}
                  fill
                  sizes="48px"
                  className="object-cover object-top"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="font-display text-sm font-bold text-foreground truncate">
                    {t.auteur}
                  </p>
                  <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                </div>
                {t.fonction && (
                  <p className="text-xs font-semibold text-primary truncate">
                    {t.fonction}
                  </p>
                )}
                {t.organisation && (
                  <p className="text-[11px] text-muted-foreground truncate">
                    {t.organisation}
                  </p>
                )}
              </div>
            </figcaption>

            {/* Program Tag */}
            {t.programme && (
              <div className="mt-3 pt-2">
                <span className="inline-block rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-bold text-secondary-foreground border border-border">
                  {t.programme.titre}
                </span>
              </div>
            )}
          </figure>
        ))}
      </div>
    </div>
  )
}
