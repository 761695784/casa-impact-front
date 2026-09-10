"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ShoppingBag, Sparkles, MessageCircle, Truck, ShieldCheck, HeartHandshake, ChevronRight, Rotate3d } from "lucide-react"
import { BaobabMark } from "@/components/brand/baobab-mark"
import { SHOP_PHONE_DISPLAY, SHOP_WHATSAPP_NUMBER, products, Product } from "@/lib/data/collections"
import { ThreeProductCanvas } from "./three-product-canvas"
import { ProductOrderModal } from "./product-order-modal"

export function BoutiqueHero() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const featuredProduct = products[0] // Polo Officiel Vert (Homme)

  const handleOrderHeroProduct = () => {
    setSelectedProduct(featuredProduct)
    setIsModalOpen(true)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#024424] via-forest to-[#012d17] text-white pt-8 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20">
      {/* Background Decorative Baobab Watermark */}
      <BaobabMark
        variant="white"
        size={540}
        className="pointer-events-none absolute -bottom-20 -right-16 opacity-[0.06] select-none"
      />

      {/* Radiant Glow Halos */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 size-80 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="mb-4 flex items-center gap-1.5 text-xs text-white/70">
          <Link href="/" className="hover:text-accent transition-colors">
            Accueil
          </Link>
          <ChevronRight className="size-3.5 opacity-60" />
          <span className="font-semibold text-white">Boutique Officielle</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading & Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 backdrop-blur-md">
              <Sparkles className="size-4 text-accent animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-accent uppercase">
                Boutique Officielle Casa Impact
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Portez les couleurs de la{" "}
              <span className="bg-gradient-to-r from-accent via-amber-300 to-accent bg-clip-text text-transparent">
                transformation
              </span>
            </h1>

            <p className="text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed font-sans">
              Découvrez les collections exclusives de Casa Impact : polos brodés, t-shirts collectors, casquettes et goodies officiels en rendu 3D WebGL temps réel. Chaque acquisition soutient directement nos actions de formation et d’accompagnement des jeunes en Casamance.
            </p>

            {/* Quick Actions & WhatsApp Callout */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={`https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  "Bonjour Casa Impact Boutique, je souhaite découvrir le catalogue et passer une commande."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3.5 text-sm sm:text-base font-bold text-accent-foreground shadow-lg shadow-accent/25 transition-all duration-300 hover:bg-white hover:text-forest hover:scale-[1.02] active:scale-98 whitespace-nowrap cursor-pointer"
              >
                <MessageCircle className="size-5 text-[#024424] shrink-0" />
                <span>Commander sur WhatsApp</span>
              </a>

              <a
                href="#catalogue"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3.5 text-sm sm:text-base font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-white/40 cursor-pointer"
              >
                <ShoppingBag className="size-4 text-accent" />
                <span>Explorer la collection</span>
              </a>
            </div>

            {/* Reassurance Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/80">
                <Truck className="size-4 text-accent shrink-0" />
                <span>Livraison 3 Régions & Dakar</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/80">
                <ShieldCheck className="size-4 text-accent shrink-0" />
                <span>100% Produits Officiels</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/80 col-span-2 sm:col-span-1">
                <HeartHandshake className="size-4 text-accent shrink-0" />
                <span>Achats Solidaires</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Highlight with Real Three.js WebGL Scene */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl border border-white/20 bg-white/10 p-4 sm:p-6 backdrop-blur-xl shadow-2xl overflow-hidden group">
              <div className="absolute top-3.5 right-3.5 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground text-xs font-extrabold px-3 py-1 shadow-md">
                  <Rotate3d className="size-3" />
                  Three.js 3D Live
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
                  <p className="text-xs text-white/70">
                    Coton piqué lourd brodé • Édition limitée
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-display text-xl font-extrabold text-accent block">
                    10 000 FCFA
                  </span>
                  <button
                    type="button"
                    onClick={handleOrderHeroProduct}
                    className="mt-1 text-[11px] font-bold text-white/80 hover:text-white underline decoration-accent underline-offset-2 cursor-pointer"
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
