"use client"

import React from "react"
import { Target, LineChart, ShieldCheck, CheckCircle2 } from "lucide-react"
import { Section, SectionHeading } from "@/components/layout/section"

const principles = [
  {
    icon: Target,
    titre: "Des Objectifs Clairs & Structurés",
    description:
      "Chaque programme et atelier déployé en Casamance repose sur un cahier des charges précis, des cibles quantifiées et un profil de bénéficiaires défini.",
    points: [
      "Critères de sélection transparents",
      "Indicateurs de succès pré-établis",
      "Alignement sur les 6 domaines stratégiques",
    ],
    badgeColor: "bg-forest/10 text-forest",
    border: "hover:border-forest/50",
  },
  {
    icon: LineChart,
    titre: "Une Mesure Rigoureuse sur le Terrain",
    description:
      "Nous suivons l'évolution de chaque participant, jeune entrepreneur et talent accompagné sur la durée grâce à nos coordinateurs régionaux.",
    points: [
      "Suivi longitudinal post-formation",
      "Évaluation des compétences acquises",
      "Mesure de l'insertion et des emplois créés",
    ],
    badgeColor: "bg-accent/20 text-accent-foreground",
    border: "hover:border-accent/60",
  },
  {
    icon: ShieldCheck,
    titre: "Une Transparence Totale & Zéro Artifice",
    description:
      "Aucune statistique n'est publiée sans avoir été préalablement constatée et enregistrée sur le terrain. Nos rapports reflètent fidèlement la réalité.",
    points: [
      "Données issues des registres d'adhésion",
      "Contrôle par la Commission scientifique",
      "Publication ouverte et accessible à tous",
    ],
    badgeColor: "bg-primary/10 text-primary",
    border: "hover:border-primary/50",
  },
]

export function ImpactPrinciples() {
  return (
    <Section tone="muted" className="py-16 sm:py-24 border-b border-border/70">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Déontologie & Méthode"
          title="Notre Approche de la Mesure d'Impact"
          description="Trois engagements fondamentaux garantissent la fiabilité et la pertinence de nos résultats."
          align="center"
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {principles.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.titre}
                className={`group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${p.border}`}
              >
                <div>
                  <div
                    className={`flex size-14 items-center justify-center rounded-2xl ${p.badgeColor} transition-transform duration-300 group-hover:scale-110 shadow-2xs`}
                  >
                    <Icon className="size-7" />
                  </div>

                  <h3 className="mt-6 font-display text-xl font-bold text-foreground">
                    {p.titre}
                  </h3>

                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {p.description}
                  </p>

                  <ul className="mt-6 space-y-2.5 pt-6 border-t border-border/60">
                    {p.points.map((pt, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs font-medium text-foreground/90">
                        <CheckCircle2 className="size-4 text-forest shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
