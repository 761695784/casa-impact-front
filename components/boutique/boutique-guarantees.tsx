"use client"

import React from "react"
import { Truck, ShieldCheck, HeartHandshake, MessageCircle, Sparkles } from "lucide-react"
import { SHOP_PHONE_DISPLAY, SHOP_WHATSAPP_NUMBER } from "@/lib/data/collections"
import { Button } from "@/components/ui/button"

const guarantees = [
  {
    icon: Truck,
    title: "Livraison 3 Régions & Sénégal",
    desc: "Acheminement rapide à Ziguinchor, Sédhiou, Kolda, Dakar et prise en charge des envois pour la diaspora.",
  },
  {
    icon: ShieldCheck,
    title: "Qualité Officielle Certifiée",
    desc: "Coton piqué lourd, broderies haute définition et matières sélectionnées pour une excellente durabilité.",
  },
  {
    icon: HeartHandshake,
    title: "Achat Solidaire & Impact",
    desc: "Chaque commande soutient directement les formations, les caravanes citoyennes et l’auto-emploi des jeunes.",
  },
  {
    icon: MessageCircle,
    title: "Assistance WhatsApp Dédiée",
    desc: `Commandes simples et réponse rapide assurée au ${SHOP_PHONE_DISPLAY} par notre pôle logistique.`,
  },
]

export function BoutiqueGuarantees() {
  return (
    <section className="py-16 sm:py-20 bg-secondary/30 border-t border-border">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-3">
            <Sparkles className="size-3.5 text-accent" />
            <span>Engagements & Garanties</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground tracking-tight">
            Pourquoi choisir nos articles officiels ?
          </h2>
        </div>

        {/* 4 Guarantees Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((g, idx) => {
            const Icon = g.icon
            return (
              <div
                key={idx}
                className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-primary/30 transition-all text-center flex flex-col items-center justify-center group"
              >
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Icon className="size-7" />
                </div>
                <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
                  {g.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                  {g.desc}
                </p>
              </div>
            )
          })}
        </div>

        {/* WhatsApp Group Order Banner */}
        <div className="mt-14 rounded-3xl bg-forest border border-white/20 p-8 sm:p-10 text-white shadow-xl text-center relative overflow-hidden">
          {/* Ambient Lighting */}
          <div className="pointer-events-none absolute -top-16 -right-16 size-60 rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-60 rounded-full bg-emerald-400/15 blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 border border-accent/40 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              <Sparkles className="size-3.5" />
              <span>Commandes Groupées & Personnalisations</span>
            </div>

            <h3 className="font-display text-xl sm:text-3xl font-bold text-white leading-snug">
              Besoin d'une commande personnalisée ou d'un lot pour votre structure ?
            </h3>

            <p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto leading-relaxed font-sans">
              Contactez directement notre service boutique sur WhatsApp au{" "}
              <strong className="text-accent">{SHOP_PHONE_DISPLAY}</strong> pour les commandes d'entreprises, associations, caravanes ou expéditions internationales.
            </p>

            <div className="pt-2">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-accent text-accent-foreground hover:bg-white hover:text-forest font-bold px-7 shadow-lg shadow-accent/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <a
                  href={`https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    "Bonjour Casa Impact Boutique, je souhaite passer une commande groupée / personnalisée."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5"
                >
                  <MessageCircle className="size-4.5" />
                  <span>Contacter le pôle boutique</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
