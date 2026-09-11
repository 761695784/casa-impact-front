"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ShoppingBag, Sparkles, MessageCircle, Truck, ShieldCheck, HeartHandshake, ChevronRight, ArrowRight } from "lucide-react"
import { BaobabMark } from "@/components/brand/baobab-mark"
import { SHOP_PHONE_DISPLAY, SHOP_WHATSAPP_NUMBER, products, Product } from "@/lib/data/collections"
import { ThreeProductCanvas } from "./three-product-canvas"
import { ProductOrderModal } from "./product-order-modal"
import { Button } from "@/components/ui/button"

export function BoutiqueHero() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const featuredProduct = products[0] // Polo Officiel Vert (Homme)

  const handleOrderHeroProduct = () => {
    setSelectedProduct(featuredProduct)
    setIsModalOpen(true)
  }

  return (
    <section className="relative isolate overflow-hidden bg-forest text-forest-foreground pt-3 pb-10 sm:pt-4 sm:pb-14 lg:pt-5 lg:pb-16">
      {/* Background Image / Texture Layer with Forest Overlays */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-forest/98 via-forest/92 to-forest/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/40 to-transparent" />
      </div>

      {/* Decorative Baobab Watermark */}
      <BaobabMark
        variant="white"
        size={540}
        className="pointer-events-none absolute -bottom-20 -right-16 opacity-[0.07] select-none -z-10"
      />

      {/* Radiant Glow Halos */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-accent/15 blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-0 right-10 size-80 rounded-full bg-emerald-500/10 blur-3xl -z-10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="mb-3">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-current/70">
            <li>
              <Link href="/" className="hover:text-current transition-colors">
                Accueil
              </Link>
            </li>
            <li>
              <ChevronRight className="size-4 opacity-60" aria-hidden />
            </li>
            <li className="font-semibold text-current">
              Boutique Officielle
            </li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading & Copy */}
          <div className="lg:col-span-7 space-y-5">
            {/* Eyebrow Badge */}
            {/* <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent backdrop-blur-md shadow-xs">
              <Sparkles className="size-3.5 text-accent animate-pulse" />
              <span>Collections Officielles Casa Impact</span>
            </div> */}

            <h1 className="text-balance font-display text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-white drop-shadow-sm">
              Portez les couleurs de la{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-amber-300 to-accent">
                transformation
              </span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-forest-foreground/90 max-w-2xl font-sans">
              Découvrez les collections exclusives de Casa Impact : polos brodés, t-shirts collectors, casquettes et goodies officiels en 3D temps réel. Chaque acquisition soutient directement nos actions de formation et d’accompagnement des jeunes en Casamance.
            </p>

            {/* Quick Actions & WhatsApp Callout */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                asChild
                size="lg"
                className="h-12 sm:h-13 rounded-full bg-accent text-accent-foreground hover:bg-white hover:text-forest font-bold px-7 shadow-lg shadow-accent/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <a
                  href={`https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    "Bonjour Casa Impact Boutique, je souhaite découvrir le catalogue et passer une commande."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5"
                >
                  {/* <MessageCircle className="size-5 shrink-0" /> */}
                  <span>Commander sur WhatsApp</span>
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 sm:h-13 rounded-full border-white/30 bg-black/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-md font-semibold px-6 shadow-md cursor-pointer"
              >
                <a href="#catalogue" className="flex items-center gap-2">
                  {/* <ShoppingBag className="size-4 text-accent" /> */}
                  <span>Explorer le catalogue</span>
                  <ArrowRight className="size-4 ml-1" />
                </a>
              </Button>
            </div>

            {/* Reassurance Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-5 border-t border-white/15">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/90">
                <Truck className="size-4 text-accent shrink-0" />
                <span>Livraison 3 Régions et Dakar</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/90">
                <ShieldCheck className="size-4 text-accent shrink-0" />
                <span>100% Produits Officiels</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/90 col-span-2 sm:col-span-1">
                <HeartHandshake className="size-4 text-accent shrink-0" />
                <span>Achats Solidaires</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Highlight with Real Three.js WebGL Scene */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl border border-white/20 bg-black/35 p-4 sm:p-6 backdrop-blur-xl shadow-2xl overflow-hidden group">
              <div className="absolute top-3.5 right-3.5 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold px-3 py-1 shadow-md">
                  {/* <Sparkles className="size-3" /> */}
                  Collection 2026
                </span>
              </div>

              {/* Three.js Hero 3D Stage */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/20 flex items-center justify-center">
                <ThreeProductCanvas
                  imageUrl={featuredProduct.image}
                  title={featuredProduct.title}
                  isHero={true}
                  showParticles={true}
                  showPedestal={true}
                  autoRotateSpeed={1}
                  hoverIntensity={0.8}
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    Polo Signature Casa Impact
                  </h3>
                  <p className="text-xs text-white/75">
                    Coton piqué lourd brodé • Édition officielle
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-display text-xl font-bold text-accent block">
                    10 000 FCFA
                  </span>
                  <button
                    type="button"
                    onClick={handleOrderHeroProduct}
                    className="mt-1 text-[11px] font-semibold text-accent hover:text-white underline decoration-accent underline-offset-2 cursor-pointer transition-colors"
                  >
                    Commander ce modèle →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ProductOrderModal
        product={selectedProduct}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </section>
  )
}
