import type { Metadata } from "next"
import { MembershipHero } from "@/components/membership/membership-hero"
import { MembershipCardShowcase } from "@/components/membership/membership-card-showcase"
import { MembershipProcess } from "@/components/membership/membership-process"
import { MembershipForm } from "@/components/membership/membership-form"
import { Section, SectionHeading } from "@/components/layout/section"
import { CtaBand } from "@/components/layout/cta-band"

export const metadata: Metadata = {
  title: "Adhérer — Rejoindre le Mouvement Casa Impact",
  description:
    "Rejoignez Casa Impact : obtenez votre carte de membre officielle (1 000 FCFA), intégrez le groupe WhatsApp et participez activement à la transformation de la Casamance.",
}

export default function AdhererPage() {
  return (
    <>
      {/* Immersive Photo Hero */}
      <MembershipHero
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Adhérer à Casa Impact" },
        ]}
      />

      {/* Showcase de la Carte de Membre Officielle */}
      <MembershipCardShowcase />

      {/* Le Parcours d'Adhésion en 4 Étapes */}
      <MembershipProcess />

      {/* Formulaire d'Adhésion */}
      <Section id="formulaire" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Formulaire d'adhésion"
            title="Remplissez Votre Demande en Ligne"
            description="Rejoignez la communauté des bâtisseurs de Casamance. Vous recevrez les instructions de règlement (1 000 FCFA) par e-mail immédiatement après validation."
            align="center"
          />
          <div className="mt-12">
            <MembershipForm />
          </div>
        </div>
      </Section>

      {/* Bandeau d'Appel à l'Action */}
      <CtaBand
        title="Vous souhaitez soutenir Casa Impact en tant qu'entreprise ou partenaire ?"
        description="Découvrez nos formules de partenariat institutionnel, technique et financier pour financer les programmes de développement."
        primary={{ label: "Devenir Partenaire", href: "/contact" }}
        secondary={{ label: "Découvrir nos actions", href: "/qui-sommes-nous" }}
      />
    </>
  )
}
