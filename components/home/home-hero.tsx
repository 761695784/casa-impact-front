"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Sparkles, MapPin, Compass, Users, Lightbulb, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BaobabMark } from "@/components/brand/baobab-mark"
import { siteConfig } from "@/lib/config"

interface HeroSlide {
  src: string
  alt: string
  region: string
  highlight: string
  caption: string
}

const HERO_SLIDES: HeroSlide[] = [
  {
    src: "/assets/hero/DSC08011%20copie.jpg",
    alt: "Jeunesse et acteurs réunis pour le développement de la Casamance",
    region: "Ziguinchor • Sédhiou • Kolda",
    highlight: "Dynamique Collective",
    caption: "Fédérer les énergies positives des trois régions",
  },
  {
    src: "/assets/hero/DSC07982%20copie.jpg",
    alt: "Session de formation et d'échange avec les jeunes talents",
    region: "Ziguinchor",
    highlight: "Leadership & Formation",
    caption: "Accompagner la jeunesse vers l'excellence et la prise de responsabilité",
  },
  {
    src: "/assets/hero/DSC08045%20copie.jpg",
    alt: "Engagement communautaire et esprit d'innovation",
    region: "Kolda",
    highlight: "Entrepreneuriat & Terroirs",
    caption: "Stimuler l'auto-emploi et la création de valeur locale",
  },
  {
    src: "/assets/hero/DSC08058%20copie.jpg",
    alt: "Mobilisation et cohésion territoriale",
    region: "Sédhiou",
    highlight: "Culture & Patrimoine",
    caption: "Faire rayonner la richesse culturelle et les traditions",
  },
  {
    src: "/assets/hero/casamance-landscape.png",
    alt: "Paysage naturel et potentiel de la Casamance",
    region: "Casamance Naturelle",
    highlight: "Attractivité & Avenir",
    caption: "Un territoire d'opportunités, d'investissement et de développement",
  },
]

const SLIDE_DURATION = 3500 // 3.5 seconds

export function HomeHero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    setProgress(0)
    startTimeRef.current = Date.now()
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
    setProgress(0)
    startTimeRef.current = Date.now()
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setProgress(0)
    startTimeRef.current = Date.now()
  }

  // Animation loop for smooth progress bar and slide change
  useEffect(() => {
    if (!isPlaying) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      return
    }

    startTimeRef.current = Date.now() - (progress / 100) * SLIDE_DURATION

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const newProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100)
      setProgress(newProgress)

      if (elapsed >= SLIDE_DURATION) {
        nextSlide()
      }
    }, 50)

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [isPlaying, currentSlide, nextSlide, progress])

  const activeSlideData = HERO_SLIDES[currentSlide]

  return (
    <section 
      className="relative isolate overflow-hidden bg-forest text-forest-foreground"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      aria-label="Section d'accueil immersive"
    >
      {/* Background Images Carousel with smooth crossfade & Ken Burns */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <div className={`relative h-full w-full ${isActive ? "animate-ken-burns" : ""}`}>
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Multi-layered Cinematic Gradient & Mesh Overlays for Perfect Contrast & Elegance */}
      <div 
        className="absolute inset-0 -z-10 bg-gradient-to-r from-forest/95 via-forest/80 to-forest/40 md:from-forest/95 md:via-forest/75 md:to-forest/30"
        aria-hidden
      />
      <div 
        className="absolute inset-0 -z-10 bg-gradient-to-t from-forest via-transparent to-black/40"
        aria-hidden
      />
      
      {/* Ambient Baobab Watermark */}
      <BaobabMark
        variant="white"
        size={800}
        className="pointer-events-none absolute -bottom-36 -right-24 hidden opacity-[0.08] lg:block lg:w-[650px]"
      />

      {/* Main Content Container */}
      <div className="relative mx-auto flex min-h-[calc(100dvh-4.5rem)] max-w-7xl flex-col justify-between px-4 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8 lg:pt-28">
        
        {/* Top Badges: Regions & Live Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
            <span className="flex size-2 rounded-full bg-accent animate-pulse" aria-hidden />
            <span>3 Régions • 1 Vision • 1 Impact</span>
          </div> */}

          {/* Region Tabs / Navigation */}
          {/* <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-black/20 p-1 backdrop-blur-md">
            {siteConfig.regions.map((r, i) => (
              <span
                key={r}
                className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white/80"
              >
                <span className="text-accent font-bold">0{i + 1}</span>
                {r}
              </span>
            ))}
          </div> */}
        </div>

        {/* Center Hero Message */}
        <div className="my-auto max-w-3xl pt-8 pb-10">
          <div className="inline-flex items-center gap-2 rounded-lg bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent backdrop-blur-sm border border-accent/30">
            <Sparkles className="size-3.5" />
            <span>Plateforme d'action & de transformation</span>
          </div>

          <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-[1.02] sm:text-6xl lg:text-7xl text-white drop-shadow-sm">
            La Casamance se construit avec{" "}
            <span className="relative inline-block text-accent">
              sa jeunesse
              <span className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-accent/60" aria-hidden />
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl font-normal drop-shadow">
            Casa Impact fédère les énergies de <strong>Ziguinchor</strong>, <strong>Kolda</strong> et <strong>Sédhiou</strong> pour former les talents, encourager l'entrepreneuriat et accélérer la transformation durable de notre territoire.
          </p>

          {/* <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-accent/90">
            {siteConfig.signature}
          </p> */}

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-13 rounded-full bg-accent px-8 font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:bg-forest hover:text-white hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link href="/adherer" className="flex items-center gap-2">
                Rejoindre le mouvement
                <ArrowRight className="size-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="h-13 rounded-full border border-white/40 bg-white/10 px-7 font-medium text-white backdrop-blur-md transition-all hover:bg-white/25 hover:text-white hover:border-white/60"
            >
              <Link href="/qui-sommes-nous">
                Découvrir Casa Impact
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom Bar: Slide Controls & Pillar Badges */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-t border-white/15 pt-6">
          
          {/* Active Slide Info & Indicators */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-white/80">
              <MapPin className="size-3.5 text-accent" />
              <span className="font-semibold text-accent">{activeSlideData.region}</span>
              <span className="text-white/40">•</span>
              <span className="truncate max-w-[280px] sm:max-w-md text-white/90">{activeSlideData.caption}</span>
            </div>

            {/* Slide Progress Indicators */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {HERO_SLIDES.map((_, idx) => {
                  const isActive = idx === currentSlide
                  return (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      aria-label={`Aller à la diapositive ${idx + 1}`}
                      className="group relative flex h-2 rounded-full transition-all focus:outline-none"
                      style={{ width: isActive ? "3.5rem" : "1.25rem" }}
                    >
                      <div className="absolute inset-0 rounded-full bg-white/25 group-hover:bg-white/40" />
                      {isActive && (
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-accent transition-all duration-75"
                          style={{ width: `${progress}%` }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Play / Pause & Controls */}
              <div className="flex items-center gap-1.5 pl-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? "Mettre en pause le diaporama" : "Lancer le diaporama"}
                  className="flex size-7 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                >
                  {isPlaying ? <Pause className="size-3" /> : <Play className="size-3 ml-0.5" />}
                </button>
                <button
                  onClick={prevSlide}
                  aria-label="Diapositive précédente"
                  className="flex size-7 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Diapositive suivante"
                  className="flex size-7 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Pillars Strip */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {[
              { icon: Lightbulb, label: "Inspirer", sub: "Éveiller les vocations" },
              { icon: Users, label: "Former", sub: "Compétences & IA" },
              { icon: Rocket, label: "Entreprendre", sub: "Auto-emploi local" },
              { icon: Compass, label: "Transformer", sub: "Impact durable" },
            ].map((pillar) => (
              <div
                key={pillar.label}
                className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/25"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent">
                  <pillar.icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white leading-tight">{pillar.label}</p>
                  <p className="text-[10px] text-white/70 leading-tight truncate">{pillar.sub}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
