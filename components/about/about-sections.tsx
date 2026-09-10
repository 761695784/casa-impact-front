"use client"

import Image from "next/image"
import {
  Eye,
  Target,
  Compass,
  Quote,
  MapPin,
  Heart,
  Crown,
  Lightbulb,
  Handshake,
  Award,
  Users,
  Leaf,
  CheckCircle2,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import { Section, SectionHeading } from "@/components/layout/section"
import { BaobabMark } from "@/components/brand/baobab-mark"
import { branding } from "@/lib/config"
import { institution, valeurs, president, territoires } from "@/lib/institution"

/* ---------------- Identité & Fondements ---------------- */
export function AboutIntro() {
  return (
    <Section className="pb-10 pt-16 md:pb-16 md:pt-24 relative overflow-hidden">
      <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
            Identité & Origines
          </div>

          <h2 className="mt-5 text-pretty font-display text-3xl font-bold leading-[1.12] text-foreground sm:text-4xl lg:text-[2.6rem]">
            Une organisation née en Casamance,{" "}
            <span className="text-primary">
              pour la Casamance
            </span>
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {institution.intro}
          </p>

          {/* <p className="mt-4 text-base font-semibold leading-relaxed text-foreground/90">
            {institution.conclusion}
          </p> */}

          {/* Core Foundation Highlights */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: "3 Régions", desc: "Ziguinchor, Kolda, Sédhiou" },
              { label: "Jeunesse au Cœur", desc: "Action & Innovation locale" },
              { label: "Impact Durable", desc: "Transformation inclusive" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border bg-secondary/40 p-4 transition-all hover:bg-secondary/70"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <CheckCircle2 className="size-3.5 text-accent" />
                  <span>{item.label}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tree Emblem Card */}
        <div className="relative mx-auto flex w-full max-w-md flex-col items-center justify-center overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/10 via-background to-secondary/30 p-8 shadow-xl">
          <div className="relative aspect-square w-full max-w-[260px]">
            <Image
              src={branding.tree || "/placeholder.svg"}
              alt="L'arbre Casa Impact — Symbole de vie et d'ancrage territorial"
              fill
              className="object-contain drop-shadow-md"
            />
          </div>

          <div className="mt-6 text-center">
            <p className="font-display text-lg font-bold text-foreground">
              Le Baobab & L'Arbre de Vie
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Symbole des racines profondes, de la force collective et de la transmission intergénérationnelle.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
              <Sparkles className="size-3" />
              <span>Inspirer • Former • Entreprendre</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ---------------- Vision / Mission / Objectif (Triptyque) ---------------- */
export function AboutVisionMission() {
  const items = [
    {
      icon: Eye,
      label: "Notre Vision",
      badge: "Cap Stratégique",
      text: institution.vision,
      border: "border-forest/30 hover:border-forest",
      gradient: "from-forest/10 via-background to-background",
      iconBg: "bg-forest text-white",
      badgeBg: "bg-forest/10 text-forest",
    },
    {
      icon: Target,
      label: "Notre Mission",
      badge: "Action Quotidienne",
      text: institution.mission,
      border: "border-earth/30 hover:border-earth",
      gradient: "from-earth/10 via-background to-background",
      iconBg: "bg-earth text-white",
      badgeBg: "bg-earth/10 text-earth",
    },
    {
      icon: Compass,
      label: "Notre Objectif",
      badge: "Finalité d'Impact",
      text: institution.objectif,
      border: "border-accent/40 hover:border-accent",
      gradient: "from-accent/10 via-background to-background",
      iconBg: "bg-accent text-accent-foreground",
      badgeBg: "bg-accent/20 text-accent-foreground",
    },
  ]

  return (
    <Section tone="muted" className="relative">
      <SectionHeading
        eyebrow="Fondements institutionnels"
        title="Vision, Mission et Objectif"
        description="Une boussole claire pour guider l'ensemble des initiatives et programmes de Casa Impact en Casamance."
        align="center"
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {items.map(({ icon: Icon, label, badge, text, border, gradient, iconBg, badgeBg }) => (
          <div
            key={label}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${border}`}
          >
            {/* Subtle Gradient Accent */}
            <div className={`absolute inset-0 bg-gradient-to-b ${gradient} opacity-50`} aria-hidden />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className={`flex size-12 items-center justify-center rounded-2xl ${iconBg} shadow-sm`}>
                  <Icon className="size-6" />
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${badgeBg}`}>
                  {badge}
                </span>
              </div>

              <h3 className="mt-6 font-display text-2xl font-bold text-foreground">
                {label}
              </h3>

              <p className="mt-4 leading-relaxed text-muted-foreground text-sm sm:text-base">
                {text}
              </p>
            </div>

            <div className="relative mt-8 pt-4 border-t border-border flex items-center gap-1.5 text-xs font-semibold text-primary">
              <CheckCircle2 className="size-3.5 text-accent" />
              <span>Engagement officiel Casa Impact</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ---------------- Valeurs (7 Principes) ---------------- */
const valueIcons: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  Engagement: { icon: Heart, color: "text-forest", bg: "bg-forest/10" },
  Leadership: { icon: Crown, color: "text-accent-foreground", bg: "bg-accent/25" },
  Innovation: { icon: Lightbulb, color: "text-earth", bg: "bg-earth/10" },
  Solidarité: { icon: Handshake, color: "text-forest", bg: "bg-forest/10" },
  Excellence: { icon: Award, color: "text-accent-foreground", bg: "bg-accent/25" },
  Inclusion: { icon: Users, color: "text-earth", bg: "bg-earth/10" },
  "Développement durable": { icon: Leaf, color: "text-forest", bg: "bg-forest/10" },
}

export function AboutValues() {
  return (
    <Section className="relative">
      <SectionHeading
        eyebrow="Ce qui nous anime"
        title="Nos 7 Valeurs Fondamentales"
        description="Sept principes inébranlables qui forgent l'éthique et guident chaque action de notre organisation."
        align="center"
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {valeurs.map((v, i) => {
          const visual = valueIcons[v.nom] ?? { icon: Heart, color: "text-forest", bg: "bg-forest/10" }
          const Icon = visual.icon
          return (
            <div
              key={v.nom}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`flex size-11 items-center justify-center rounded-xl ${visual.bg} ${visual.color}`}>
                    <Icon className="size-5" />
                  </div>
                  <span className="font-display text-xs font-bold text-muted-foreground/50 tabular-nums">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {v.nom}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {v.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-border/60 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                <span className="size-1.5 rounded-full bg-accent" />
                <span>Principe d'action</span>
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}

/* ---------------- Mot du Président (Discours Officiel Intégral) ---------------- */
export function AboutPresident() {
  return (
    <Section id="mot-du-president" tone="muted" className="scroll-mt-24 relative overflow-hidden py-20">
      <SectionHeading
        eyebrow="Discours Officiel"
        title="Le Mot du Président Fondateur"
        description="Une adresse solennelle et fraternelle à la jeunesse, aux acteurs et à tous les amis de la Casamance."
        align="center"
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-[0.85fr_1.35fr] lg:gap-16 items-start">
        
        {/* Left: Sticky Official Portrait Card */}
        <div className="lg:sticky lg:top-28">
          <div className="relative mx-auto overflow-hidden rounded-3xl border-2 border-forest/20 bg-background shadow-2xl">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
              <Image
                src={president.photo || "/placeholder.svg"}
                alt={`${president.nom}, ${president.fonction} de Casa Impact`}
                fill
                sizes="(max-width: 1024px) 80vw, 35vw"
                className="object-cover object-top"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent"
                aria-hidden
              />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-display text-xl font-bold">{president.nom}</p>
                <p className="text-xs text-white/85">{president.fonction}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <MapPin className="size-3.5 text-primary" />
                <span>{president.origine}</span>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs font-bold uppercase tracking-wider text-accent">
                  {president.signature}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: The Complete Address Letter */}
        <div className="relative rounded-3xl border border-border bg-background p-8 shadow-sm sm:p-12">
          {/* Ambient Baobab Watermark */}
          <BaobabMark
            variant="color"
            size={400}
            className="pointer-events-none absolute -bottom-16 -right-16 hidden opacity-[0.05] sm:block"
          />

          <Quote className="size-12 text-accent" />

          {/* Key Citation Highlight */}
          <blockquote className="mt-4 font-display text-2xl font-bold leading-snug text-foreground sm:text-3xl">
            "{president.citation}"
          </blockquote>

          <div className="my-6 h-px w-20 bg-accent" />

          {/* Letter Body */}
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            {president.message.map((para, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "font-semibold text-foreground text-lg"
                    : i === president.message.length - 1
                    ? "font-medium text-foreground italic pt-2"
                    : "text-pretty"
                }
              >
                {para}
              </p>
            ))}

            <div className="pt-6">
              <p className="font-display text-xl font-bold text-primary">
                {president.nom}
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                {president.fonction} de Casa Impact
              </p>
            </div>
          </div>
        </div>

      </div>
    </Section>
  )
}

/* ---------------- Territoires ---------------- */
export function AboutTerritories() {
  const territoryCards = [
    {
      nom: "Ziguinchor",
      role: "Porte d'entrée & Littoral",
      desc: "Terre du Président Fondateur, cœur historique et carrefour stratégique pour le rayonnement de Casa Impact.",
      accent: "bg-forest",
      badge: "bg-forest/15 text-forest",
      border: "hover:border-forest",
    },
    {
      nom: "Sédhiou",
      role: "Traditions & Terroirs d'Avenir",
      desc: "Territoire d'histoire, de culture et de ressources, pleinement engagé dans la vision partagée des trois régions.",
      accent: "bg-earth",
      badge: "bg-earth/15 text-earth",
      border: "hover:border-earth",
    },
    {
      nom: "Kolda",
      role: "Pôle Agro-économique & Jeunesse",
      desc: "Région au potentiel agricole exceptionnel, riche de sa jeunesse talentueuse et de ses opportunités d'entrepreneuriat.",
      accent: "bg-accent",
      badge: "bg-accent/25 text-accent-foreground",
      border: "hover:border-accent",
    },
  ]

  return (
    <Section tone="dark" className="relative overflow-hidden py-20">
      <BaobabMark
        variant="white"
        size={500}
        className="pointer-events-none absolute -bottom-20 -left-20 hidden opacity-[0.06] md:block"
      />

      <SectionHeading
        invert
        eyebrow="Ancrage territorial"
        title="Trois Régions, Une Vision, Un Impact"
        description="Casa Impact bâtit des passerelles solides entre Ziguinchor, Sédhiou et Kolda pour unir les forces vives."
        align="center"
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {territoryCards.map((t, i) => (
          <div
            key={t.nom}
            className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 ${t.border}`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-accent">
                  <MapPin className="size-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">{t.nom}</span>
                </div>
                <span className="font-display text-xl font-bold text-white/40 tabular-nums">
                  0{i + 1}
                </span>
              </div>

              <h3 className="mt-4 font-display text-xl font-bold text-white">
                {t.role}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                {t.desc}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-accent">
              <span className="size-2 rounded-full bg-accent animate-pulse" />
              <span>Pôle régional actif</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
