"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Product, buildWhatsAppOrderLink, SHOP_PHONE_DISPLAY } from "@/lib/data/collections"
import { MessageCircle, Sparkles, Plus, Minus, Truck, ShieldCheck, CheckCircle2 } from "lucide-react"
import { ThreeProductCanvas } from "./three-product-canvas"

interface ProductOrderModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductOrderModal({
  product,
  open,
  onOpenChange,
}: ProductOrderModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [city, setCity] = useState<string>("Ziguinchor")
  const [notes, setNotes] = useState<string>("")

  // Reset states on product change
  useEffect(() => {
    if (product?.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0])
    } else {
      setSelectedSize("")
    }
    setQuantity(1)
    setNotes("")
  }, [product])

  if (!product) return null

  const totalPrice = product.price * quantity

  const handleOrder = () => {
    const link = buildWhatsAppOrderLink({
      product,
      size: selectedSize || undefined,
      quantity,
      city,
      notes: notes.trim() || undefined,
    })
    window.open(link, "_blank", "noopener,noreferrer")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[calc(100vw-2rem)] p-0 rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-card text-foreground">
        {/* Top Header with Live Three.js WebGL Product Visual */}
        <div className="bg-gradient-to-br from-[#024424] via-forest to-[#012613] p-5 sm:p-6 text-white relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -top-10 -right-10 size-48 rounded-full bg-accent/20 blur-2xl" />

          <div className="relative z-10 flex items-center gap-4">
            {/* Three.js 3D WebGL Thumbnail Box */}
            <div className="relative size-22 sm:size-26 rounded-2xl bg-black/30 border border-white/20 flex items-center justify-center shrink-0 overflow-hidden">
              <ThreeProductCanvas
                imageUrl={product.image}
                title={product.title}
                autoRotateSpeed={1.2}
                showParticles={false}
                hoverIntensity={0.8}
              />
            </div>

            {/* Product Meta */}
            <div className="min-w-0 flex-1 space-y-1">
              <div className="inline-flex items-center gap-1 rounded-full bg-accent/20 border border-accent/40 px-2 py-0.5 text-[10px] font-extrabold text-accent uppercase tracking-wider">
                <Sparkles className="size-2.5 text-accent" />
                <span>{product.badge || product.categoryLabel}</span>
              </div>

              <DialogTitle className="text-base sm:text-lg font-display font-black text-white leading-snug truncate">
                {product.title}
              </DialogTitle>

              <div className="flex items-baseline gap-1">
                <span className="font-display text-xl font-extrabold text-accent">
                  {product.price.toLocaleString("fr-FR")}
                </span>
                <span className="text-xs font-bold text-white/90">FCFA</span>
                <span className="text-[11px] text-white/60 ml-1">/ unité</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Form Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[55vh] overflow-y-auto">
          {/* Size Selector */}
          {product.sizes && product.sizes.length > 1 && (
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">
                Choisir une taille :
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-10 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-primary text-white shadow-md shadow-primary/30 ring-2 ring-primary scale-105"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quantity and City Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Quantity */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">
                Quantité :
              </label>
              <div className="inline-flex items-center rounded-2xl border border-border bg-secondary/40 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex size-8 items-center justify-center rounded-xl bg-background text-foreground shadow-xs hover:bg-secondary disabled:opacity-40 transition-colors cursor-pointer"
                  aria-label="Diminuer la quantité"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-12 text-center font-display text-base font-bold text-foreground">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex size-8 items-center justify-center rounded-xl bg-background text-foreground shadow-xs hover:bg-secondary transition-colors cursor-pointer"
                  aria-label="Augmenter la quantité"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Delivery Region */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">
                Lieu de livraison :
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-2xl border border-input bg-background px-3.5 py-2 text-xs sm:text-sm font-medium text-foreground shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Ziguinchor">Ziguinchor (Casamance)</option>
                <option value="Sédhiou">Sédhiou (Casamance)</option>
                <option value="Kolda">Kolda (Casamance)</option>
                <option value="Dakar">Dakar & Banlieue</option>
                <option value="Autre région Sénégal">Autre région (Sénégal)</option>
                <option value="International / Diaspora">International / Diaspora</option>
              </select>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">
              Précisions ou remarques (optionnel) :
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Ex : Adresse de livraison exacte, contact secondaire..."
              className="w-full rounded-2xl border border-input bg-background p-2.5 text-xs font-normal text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {/* Notice */}
          <div className="rounded-2xl bg-primary/5 border border-primary/20 p-3 flex items-center gap-2.5 text-xs text-foreground">
            <ShieldCheck className="size-4 text-primary shrink-0" />
            <span className="text-[11px] leading-relaxed">
              Validation instantanée sur WhatsApp, paiement Wave, Orange Money ou à la livraison.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-secondary/40 p-4 sm:p-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Total estimé :
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-xl sm:text-2xl font-black text-primary">
                {totalPrice.toLocaleString("fr-FR")}
              </span>
              <span className="text-xs font-bold text-accent">FCFA</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOrder}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3 px-6 shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm cursor-pointer"
          >
            <MessageCircle className="size-4.5 shrink-0" />
            <span>Valider la commande sur WhatsApp</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
