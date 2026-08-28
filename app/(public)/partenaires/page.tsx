import type { Metadata } from "next"
import { PageHero } from "@/components/layout/page-hero"
import { Section, SectionHeading } from "@/components/layout/section"
import { PartnersGrid } from "@/components/partners/partners-grid"
import { CtaBand } from "@/components/layout/cta-band"
import { Building2, Landmark, HeartHandshake, GraduationCap } from "lucide-react"

export const metadata: Metadata = {
  title: "Partenaires",
  description:
    "Institutions, entreprises, ONG et collectivités : rejoignez le réseau de partenaires de Casa Impact pour accompagner la jeunesse et les communautés de la Casamance.",
}

const partnerTypes = [
  {
    icon: Landmark,
    title: "Partenaires institutionnels",
    text: "Collectivités territoriales, services de l'État et institutions publiques engagés pour le développement régional.",
  },
  {
    icon: Building2,
    title: "Partenaires privés",
    text: "Entreprises et acteurs économiques soutenant l'entrepreneuriat et l'emploi des jeunes de la Casamance.",
  },
  {
    icon: HeartHandshake,
    title: "ONG & société civile",
    text: "Organisations partageant notre vision d'un développement durable, inclusif et porté par les communautés.",
  },
  {
    icon: GraduationCap,
    title: "Partenaires techniques",
    text: "Universités, centres de formation et experts renforçant nos programmes par leur savoir-faire.",
  },
]

export default function PartenairesPage() {
  return (
    <>
      <PageHero
        eyebrow="Ensemble"
        title="Nos partenaires"
        description="Casa Impact avance en synergie avec des partenaires qui partagent son ambition pour la Casamance. Construisons ensemble un impact durable."
      />

      <Section>
        <SectionHeading
          eyebrow="Types de partenariats"
          title="Plusieurs façons de s'engager"
          description="Quel que soit votre profil, il existe une manière de contribuer à la transformation de la Casamance."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {partnerTypes.map((t) => (
            <div key={t.title} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <t.icon className="size-6" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{t.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section muted>
        <SectionHeading eyebrow="Ils nous font confiance" title="Notre réseau" />
        <PartnersGrid />
      </Section>

      <CtaBand
        title="Devenez partenaire de Casa Impact"
        description="Associez votre organisation à une dynamique citoyenne au service de la jeunesse casamançaise."
        primary={{ label: "Nous contacter", href: "/contact" }}
        secondary={{ label: "Qui sommes-nous", href: "/qui-sommes-nous" }}
      />
    </>
  )
}
