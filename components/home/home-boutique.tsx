"use client"

import React, { useState } from "react"
import Link from "next/link"
import { products, Product, SHOP_PHONE_DISPLAY, SHOP_WHATSAPP_NUMBER } from "@/lib/data/collections"
import { Sparkles, ArrowRight, MessageCircle, ShoppingBag } from "lucide-react"
import { ProductOrderModal } from "@/components/boutique/product-order-modal"

export function HomeBoutique() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Select 4 featured items
  const featuredProducts = products.filter((p) => p.featuredOnHome).slice(0, 4)

  const handleOrder = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-background via-secondary/20 to-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-bold text-primary mb-3">
              <Sparkles className="size-3.5 text-accent" />
              <span>Notre Collection</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Portez l'identité de Casa Impact
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              Polos, t-shirts, casquettes et goodies. Commandez directement en quelques secondes via WhatsApp au <strong className="text-foreground">{SHOP_PHONE_DISPLAY}</strong>.
            </p>
          </div>

          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 self-start md:self-auto text-sm font-bold text-primary hover:text-forest transition-colors group"
          >
            <span>Découvrir toute la collection</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Products Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300"
            >
              {/* Product Visual */}
              <div className="relative aspect-square w-full overflow-hidden bg-secondary/30">
                <img
                  src={product.image}
                  alt={product.title}
                  className="size-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 rounded-full bg-primary/95 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Product Info & CTA */}
              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {product.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="font-display text-base font-extrabold text-primary">
                    {product.price.toLocaleString("fr-FR")} <span className="text-[11px] font-medium">FCFA</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleOrder(product)}
                    className="inline-flex items-center gap-1 rounded-full bg-primary hover:bg-[#024424] text-white text-xs font-bold px-3 py-2 shadow-sm transition-all hover:scale-105 active:scale-95"
                  >
                    <MessageCircle className="size-3.5 text-accent" />
                    <span>Commander</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner Callout */}
        <div className="mt-12 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-white shadow-md shrink-0">
              <ShoppingBag className="size-7" />
            </div>
            <div>
              <h4 className="font-display text-base sm:text-lg font-bold text-foreground">
                Livraison rapide sur Ziguinchor, Sédhiou, Kolda, Dakar et Diaspora
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Chaque article vendu contribue au financement de nos caravanes et programmes jeunesse.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 w-full sm:w-auto shrink-0">
            <Link
              href="/boutique"
              className="rounded-full bg-primary px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-forest transition-all text-center whitespace-nowrap"
            >
              Voir tous les articles
            </Link>
            <a
              href={`https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                "Bonjour Casa Impact Boutique, je souhaite commander un article."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-xs sm:text-sm font-bold text-foreground hover:bg-secondary transition-all shadow-xs whitespace-nowrap"
            >
              <MessageCircle className="size-4 text-[#25D366] shrink-0" />
              <span>Commander sur WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Order Modal */}
        <ProductOrderModal
          product={selectedProduct}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </div>
    </section>
  )
}
