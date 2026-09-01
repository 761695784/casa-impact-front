"use client"

import React from "react"
import { Truck, ShieldCheck, HeartHandshake, MessageCircle, MapPin, Sparkles } from "lucide-react"
import { SHOP_PHONE_DISPLAY, SHOP_WHATSAPP_NUMBER } from "@/lib/data/collections"

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
    <section className="py-16 bg-secondary/40 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent-foreground mb-2">
            <Sparkles className="size-3 text-accent-foreground" />
            <span>Engagements Casa Impact</span>
          </div>
          <h2 className="font-display text-xl sm:text-3xl font-extrabold text-foreground">
            Pourquoi choisir nos articles officiels ?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((g, idx) => {
            const Icon = g.icon
            return (
              <div
                key={idx}
                className="rounded-3xl border border-border bg-card p-6 shadow-xs hover:shadow-md hover:border-primary/30 transition-all text-center flex flex-col items-center justify-center"
              >
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                  <Icon className="size-7" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground">
                  {g.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {g.desc}
                </p>
              </div>
            )
          })}
        </div>

        {/* WhatsApp Banner */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-forest via-[#024424] to-forest p-8 text-white shadow-xl text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="font-display text-xl sm:text-2xl font-bold">
              Besoin d'une commande personnalisée ou d'un lot pour votre structure ?
            </h3>
            <p className="text-sm text-white/85">
              Contactez directement notre service boutique sur WhatsApp au{" "}
              <strong className="text-accent">{SHOP_PHONE_DISPLAY}</strong> pour les commandes groupées, partenariats ou expéditions internationales.
            </p>
            <a
              href={`https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                "Bonjour Casa Impact Boutique, je souhaite passer une commande groupée / personnalisée."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-lg hover:bg-white hover:text-forest transition-all"
            >
              <MessageCircle className="size-4" />
              <span>Contacter le pôle boutique</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
