"use client"

import React, { useState } from "react"
import { Section } from "@/components/layout/section"
import { TestimonialsHero } from "./testimonials-hero"
import { TestimonialsGrid } from "./testimonials-grid"
import { TestimonialSubmissionModal } from "./testimonial-submission-modal"
import { CtaBand } from "@/components/layout/cta-band"

export function TestimonialsView() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)

  return (
    <>
      {/* Hero immersif avec stats et badges territoriaux */}
      <TestimonialsHero onOpenSubmitModal={() => setIsSubmitModalOpen(true)} />

      {/* Grille principale avec recherche, filtres et cartes haute définition */}
      <Section className="py-12 sm:py-16">
        <TestimonialsGrid onOpenSubmitModal={() => setIsSubmitModalOpen(true)} />
      </Section>

      {/* Bandeau d'Appel à l'Action Communautaire */}
      <CtaBand
        title="Votre parcours en Casamance mérite d'être raconté"
        description="Bénéficiaire d'une formation, entrepreneur accompagné, artisane ou acteur citoyen des régions de Ziguinchor, Sédhiou et Kolda : inspirez la communauté en partageant votre expérience."
        primary={{
          label: "Partager mon témoignage",
          href: "#",
          onClick: () => setIsSubmitModalOpen(true),
        }}
        secondary={{
          label: "Rejoindre l'organisation",
          href: "/adherer",
        }}
      />

      {/* Modale interactive de soumission de témoignage */}
      <TestimonialSubmissionModal
        open={isSubmitModalOpen}
        onOpenChange={setIsSubmitModalOpen}
      />
    </>
  )
}
