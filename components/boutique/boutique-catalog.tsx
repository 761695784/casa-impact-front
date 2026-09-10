"use client"

import React, { useState, useMemo } from "react"
import { products, productCategories, Product } from "@/lib/data/collections"
import { ProductCard } from "./product-card"
import { ProductOrderModal } from "./product-order-modal"
import { Search, Sparkles, ShoppingBag } from "lucide-react"

export function BoutiqueCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCategory =
        selectedCategory === "all" || item.category === selectedCategory
      const matchSearch =
        searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())

      return matchCategory && matchSearch
    })
  }, [selectedCategory, searchQuery])

  const handleOpenOrder = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  return (
    <section id="catalogue" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-bold text-primary mb-3">
            <Sparkles className="size-3.5 text-accent" />
            <span>Catalogue Officiel 2026</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Les collections de la Casamance en mouvement
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Sélectionnez votre article et commandez en un clic via WhatsApp avec livraison dans toute la Casamance et au Sénégal.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-border">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
            {productCategories.map((cat) => {
              const isActive = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un article..."
              className="w-full rounded-full border border-input bg-card pl-10 pr-4 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
            />
          </div>
        </div>

        {/* Product Grid with Autonomous 3D Moving Images */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                index={idx}
                onSelectProduct={handleOpenOrder}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-3xl border border-dashed border-border bg-secondary/20 p-8">
            <ShoppingBag className="size-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <h3 className="font-display text-lg font-bold text-foreground">
              Aucun article trouvé
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Essayez de modifier votre recherche ou sélectionnez une autre catégorie.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all")
                setSearchQuery("")
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Interactive Order Modal */}
        <ProductOrderModal
          product={selectedProduct}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </div>
    </section>
  )
}
