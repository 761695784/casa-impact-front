"use client"

import { FileText, Mail, MessageCircle, CreditCard, CheckCircle2, ArrowRight } from "lucide-react"
import { Section, SectionHeading } from "@/components/layout/section"

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Formulaire en Ligne",
    desc: "Remplissez le formulaire d'adhésion ci-dessous avec vos informations personnelles, votre région et votre pôle d'intérêt.",
    icon: FileText,
    accent: "border-forest/30 bg-forest/5",
    iconBg: "bg-forest text-white",
  },
  {
    step: "02",
    title: "E-mail & Paiement 1 000 F",
    desc: "Vous recevez un e-mail de confirmation avec le numéro officiel (Wave / Orange Money) pour vous acquitter des 1 000 FCFA.",
    icon: Mail,
    accent: "border-accent/40 bg-accent/5",
    iconBg: "bg-accent text-accent-foreground",
  },
  {
    step: "03",
    title: "Preuve via WhatsApp",
    desc: "Une fois le paiement effectué, envoyez la capture d'écran attestant de votre transaction sur notre ligne WhatsApp officielle.",
    icon: MessageCircle,
    accent: "border-earth/30 bg-earth/5",
    iconBg: "bg-earth text-white",
  },
  {
    step: "04",
    title: "Carte & Groupe WhatsApp",
    desc: "L'équipe valide votre dossier et vous renvoie par e-mail votre carte de membre officielle ainsi que le lien d'accès au groupe WhatsApp.",
    icon: CreditCard,
    accent: "border-primary/30 bg-primary/5",
    iconBg: "bg-primary text-primary-foreground",
  },
]

export function MembershipProcess() {
  return (
    <Section tone="muted" className="relative overflow-hidden py-20">
      <SectionHeading
        eyebrow="Comment ça marche ?"
        title="Le Parcours d'Adhésion en 4 Étapes"
        description="Un processus simple, rapide et transparent pour formaliser votre engagement auprès de Casa Impact."
        align="center"
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PROCESS_STEPS.map((s, i) => {
          const Icon = s.icon
          return (
            <div
              key={s.step}
              className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${s.accent}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`flex size-12 items-center justify-center rounded-2xl ${s.iconBg} shadow-sm`}>
                    <Icon className="size-6" />
                  </div>
                  <span className="font-display text-2xl font-bold text-accent tabular-nums">
                    {s.step}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-lg font-bold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-border flex items-center gap-1 text-[11px] font-semibold text-primary">
                <CheckCircle2 className="size-3.5 text-accent" />
                <span>Étape {i + 1} validée</span>
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
