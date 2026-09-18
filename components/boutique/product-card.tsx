"use client"

import React from "react"
import { Product } from "@/lib/data/collections"
import { MessageCircle, Sparkles } from "lucide-react"
import { ThreeProductCanvas } from "./three-product-canvas"

interface ProductCardProps {
  product: Product
  onSelectProduct: (product: Product) => void
  index?: number
}

export function ProductCard({ product, onSelectProduct, index = 0 }: ProductCardProps) {
  const speed = 0.85 + (index % 3) * 0.15

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300">
      {/* Three.js Real WebGL 3D Canvas Box */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-secondary/40 via-secondary/15 to-transparent flex items-center justify-center">
        {/* Three.js WebGL Scene */}
        <ThreeProductCanvas
          imageUrl={product.image}
          title={product.title}
          autoRotateSpeed={speed}
          showParticles={true}
          hoverIntensity={0.6}
        />

        {/* Floating Badge */}
        {product.badge && (
          <div className="absolute top-3.5 left-3.5 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground border border-accent/40 backdrop-blur-md px-3 py-1 text-[11px] font-bold shadow-xs">
              {/* <Sparkles className="size-3 text-accent-foreground" /> */}
              {product.badge}
            </span>
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-md border border-border/80 px-2.5 py-0.5 text-[10px] font-semibold text-foreground shadow-xs">
            {product.categoryLabel}
          </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between gap-4">
        <div>
          <h3 className="font-display text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
            {product.title}
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed font-sans">
            {product.description}
          </p>

          {/* Size Pills */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-3.5 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mr-1">
                Tailles :
              </span>
              {product.sizes.map((size) => (
                <span
                  key={size}
                  className="inline-block rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground border border-border/60"
                >
                  {size}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action Button */}
        {/* Prix masqué (accord du 2026-09-18) : la boutique n'est pas
            encore ouverte à la vente — "Bientôt disponible" remplace le
            prix tant que ce n'est pas le cas, dans la grille catalogue
            uniquement (voir aussi home-boutique.tsx pour le même
            traitement sur la vitrine de la page d'accueil). */}
        <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
              Disponibilité
            </span>
            <span className="font-display text-sm sm:text-base font-bold text-accent">
              Bientôt disponible
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelectProduct(product)}
            className="inline-flex items-center gap-2 rounded-full bg-forest hover:bg-forest/90 text-white text-xs sm:text-sm font-semibold px-4.5 py-2.5 shadow-md shadow-forest/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            aria-label={`Commander ${product.title} sur WhatsApp`}
          >
            {/* <MessageCircle className="size-4 text-accent shrink-0" /> */}
            <span>Commander</span>
          </button>
        </div>
      </div>
    </article>
  )
}
