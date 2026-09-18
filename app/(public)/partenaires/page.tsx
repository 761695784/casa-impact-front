import type { Metadata } from "next"
import { PartnersHero } from "@/components/partners/partners-hero"
import { Section, SectionHeading } from "@/components/layout/section"
import { PartnersGrid } from "@/components/partners/partners-grid"
import { CtaBand } from "@/components/layout/cta-band"
import { Building2, Landmark, HeartHandshake, GraduationCap, ArrowUpRight } from "lucide-react"

export const metadata: Metadata = {
  alternates: { canonical: "/partenaires" },
  title: "Partenaires & Alliances Stratégiques",
  description:
    "Institutions, entreprises, ONG et collectivités : rejoignez le réseau de partenaires de Casa Impact pour accompagner la jeunesse et les communautés de la Casamance.",
}

const partnerTypes = [
  {
    icon: Landmark,
    title: "Partenaires institutionnels",
    text: "Collectivités territoriales, services de l'État et institutions publiques engagés pour la décentralisation et le développement régional.",
    badge: "Secteur Public",
  },
  {
    icon: Building2,
    title: "Partenaires privés & mécènes",
    text: "Entreprises et acteurs économiques soutenant l'entrepreneuriat, la création d'emplois et l'autonomie des jeunes en Casamance.",
    badge: "Entreprises",
  },
  {
    icon: HeartHandshake,
    title: "ONG & société civile",
    text: "Organisations et associations partageant notre vision d'un développement durable, solidaire et porté par les communautés locales.",
    badge: "Impact Social",
  },
  {
    icon: GraduationCap,
    title: "Partenaires techniques & écoles",
    text: "Universités, centres de formation et experts renforçant nos parcours d'excellence par leur savoir-faire et leur ingénierie.",
    badge: "Académique",
  },
]

export default function PartenairesPage() {
  return (
    <>
      {/* Hero Section Uniformisé */}
      <PartnersHero />

      {/* Section Types de partenariats */}
      <Section className="relative overflow-hidden">
        <SectionHeading
          eyebrow="Types d'engagements"
          title="Plusieurs façons de co-construire l'impact"
          description="Quel que soit votre profil ou votre secteur, il existe une passerelle concrète pour contribuer à la transformation des terroirs de la Casamance."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {partnerTypes.map((t) => (
            <div
              key={t.title}
              className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-2xs transition-all duration-300 hover:border-forest/40 hover:bg-card hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-forest/10 text-forest transition-colors group-hover:bg-forest group-hover:text-white shadow-xs">
                    <t.icon className="size-6" />
                  </div>
                  <span className="rounded-full border border-border/70 bg-secondary/60 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {t.badge}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-lg font-bold text-foreground group-hover:text-forest transition-colors">
                  {t.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {t.text}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-1.5 text-xs font-semibold text-forest">
                <span>Engagement sur-mesure</span>
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section Ils nous font confiance (Redesignée) */}
      <Section muted className="border-t border-border/60 bg-gradient-to-b from-secondary/30 via-background to-secondary/20">
        <SectionHeading
          eyebrow="Ils nous font confiance"
          title="Un réseau solide d'alliances engagées"
          description="Découvrez les acteurs institutionnels, techniques, financiers et médias qui soutiennent concrètement nos actions en Casamance."
        />
        <PartnersGrid />
      </Section>

      {/* Bandeau d'Appel à l'Action */}
      <CtaBand
        title="Devenez partenaire de Casa Impact"
        description="Associez votre organisation à une dynamique citoyenne d'excellence au service de la jeunesse casamançaise à Ziguinchor, Sédhiou et Kolda."
        primary={{ label: "Initier une collaboration", href: "/contact" }}
        secondary={{ label: "Découvrir nos programmes", href: "/programmes" }}
      />
    </>
  )
}
