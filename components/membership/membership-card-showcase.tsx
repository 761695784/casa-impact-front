"use client"

import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, CreditCard, Sparkles, ArrowRight, ShieldCheck, Award } from "lucide-react"
import { Section, SectionHeading } from "@/components/layout/section"
import { Button } from "@/components/ui/button"

const memberPrivileges = [
  "Accès prioritaire à l'ensemble des programmes d'incubation, formations et cohortes de Casa Impact",
  "Intégration immédiate au Groupe WhatsApp officiel des membres actifs de la Casamance",
  "Droit de vote et participation aux Assemblées Générales et consultations citoyennes",
  "Accès privilégié aux événements de networking, forums économiques et masterclasses",
  "Mise en relation directe avec les mentors, la diaspora et les partenaires de l'organisation",
  "Carte physique et numérique nominative avec identifiant unique vérifié",
]

export function MembershipCardShowcase() {
  return (
    <Section className="py-16 sm:py-24 border-b border-border">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] items-center">
        
        {/* Left Column: Official Member Card Visual */}
        <div className="relative">
          {/* Glowing Ambient Backdrop */}
          <div
            className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/20 via-accent/20 to-transparent blur-2xl -z-10 opacity-70"
            aria-hidden
          />

          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-background to-secondary/30 p-6 sm:p-8 shadow-2xl">
            {/* Card Badge Header */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
                <Sparkles className="size-3" />
                <span>Modèle Officiel 2026</span>
              </div>
              <span className="font-mono text-xs font-bold text-muted-foreground">
                CASA IMPACT • CASAMANCE
              </span>
            </div>

            {/* Official Member Card Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-secondary shadow-lg transition-transform duration-500 hover:scale-[1.02]">
              <Image
                src="/assets/Cartes-Membre.png"
                alt="Modèle officiel de la Carte de Membre Casa Impact"
                fill
                sizes="(max-width: 1024px) 100vw, 550px"
                className="object-contain p-2"
                priority
              />
            </div>

            {/* Pricing Banner Box */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-primary/10 border border-primary/20 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <CreditCard className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Cotisation Annuelle
                  </p>
                  <p className="font-display text-2xl font-black text-primary">
                    1 000 FCFA <span className="text-xs font-normal text-muted-foreground">/ an</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>Règlement sécurisé Wave / OM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Privileges & Benefits */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Award className="size-3.5" />
            <span>Statut de Membre Actif</span>
          </div>

          <h2 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Pourquoi Obtenir Votre Carte de Membre ?
          </h2>

          <p className="text-base leading-relaxed text-muted-foreground">
            En adhérant à Casa Impact, vous ne rejoignez pas seulement une organisation : vous devenez acteur d&apos;une dynamique collective qui transforme durablement l&apos;économie, l&apos;éducation et la culture en Casamance.
          </p>

          {/* Privileges Checklist */}
          <ul className="space-y-3.5 pt-2">
            {memberPrivileges.map((privilege, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground/90">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary mt-0.5">
                  <CheckCircle2 className="size-3.5" />
                </div>
                <span>{privilege}</span>
              </li>
            ))}
          </ul>

          {/* CTA Link to Form */}
          <div className="pt-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-accent text-accent-foreground font-semibold shadow-lg shadow-accent/25 hover:bg-forest hover:text-white transition-all"
            >
              <a href="#formulaire" className="flex items-center gap-2">
                <span>Remplir le formulaire d&apos;adhésion</span>
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>

      </div>
    </Section>
  )
}
