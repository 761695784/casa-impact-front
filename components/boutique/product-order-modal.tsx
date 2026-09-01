"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Product, buildWhatsAppOrderLink, SHOP_PHONE_DISPLAY } from "@/lib/data/collections"
import { MessageCircle, Sparkles, Plus, Minus, Truck } from "lucide-react"

interface ProductOrderModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductOrderModal({ product, open, onOpenChange }: ProductOrderModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [city, setCity] = useState<string>("Ziguinchor")
  const [notes, setNotes] = useState<string>("")

  // Update default size when product changes
  React.useEffect(() => {
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
      <DialogContent className="max-w-md w-[calc(100vw-2rem)] sm:w-full p-0 rounded-3xl overflow-hidden border border-border shadow-2xl bg-card">
        {/* Top Header with Product Preview */}
        <div className="bg-gradient-to-br from-[#024424] via-forest to-[#012d17] p-4 sm:p-5 text-white relative">
          <div className="flex items-center gap-3.5">
            <div className="relative size-16 sm:size-18 rounded-2xl overflow-hidden bg-white/10 shrink-0 border border-white/20">
              <img
                src={product.image}
                alt={product.title}
                className="size-full object-cover object-top"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent mb-1 uppercase tracking-wider">
                <Sparkles className="size-2.5" />
                {product.categoryLabel}
              </div>
              <DialogTitle className="text-base sm:text-lg font-display font-bold text-white leading-snug truncate">
                {product.title}
              </DialogTitle>
              <p className="text-accent font-extrabold text-base sm:text-lg mt-0.5">
                {product.price.toLocaleString("fr-FR")} FCFA{" "}
                <span className="text-[11px] font-normal text-white/70">/ unité</span>
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body Form */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Size Selector (if product has sizes) */}
          {product.sizes && product.sizes.length > 1 && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Choisir une taille :
              </label>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-9 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-primary text-white shadow-md shadow-primary/25 ring-2 ring-primary"
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

          {/* Quantity Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Quantité :
            </label>
            <div className="inline-flex items-center rounded-2xl border border-border bg-secondary/40 p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="flex size-8 items-center justify-center rounded-xl bg-background text-foreground shadow-xs hover:bg-secondary disabled:opacity-40 transition-colors"
                aria-label="Diminuer la quantité"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-10 text-center font-display text-sm font-bold text-foreground">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex size-8 items-center justify-center rounded-xl bg-background text-foreground shadow-xs hover:bg-secondary transition-colors"
                aria-label="Augmenter la quantité"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Delivery Region / City */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Lieu de livraison souhaité :
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

          {/* Optional notes */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Précisions ou questions (optionnel) :
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Ex : Adresse précise, heure de contact préférée..."
              className="w-full rounded-2xl border border-input bg-background p-2.5 text-xs font-normal text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {/* Reassurance Notice */}
          <div className="rounded-2xl bg-secondary/50 p-2.5 border border-border text-[11px] text-muted-foreground flex items-center gap-2">
            <Truck className="size-3.5 text-primary shrink-0" />
            <span>
              Paiement à la livraison ou Wave / Orange Money après confirmation WhatsApp.
            </span>
          </div>
        </div>

        {/* Modal Footer with Clean Stacked Layout */}
        <div className="bg-secondary/40 p-4 sm:p-5 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">Montant total :</span>
            <span className="font-display text-lg sm:text-xl font-extrabold text-foreground">
              {totalPrice.toLocaleString("fr-FR")} FCFA
            </span>
          </div>

          <button
            type="button"
            onClick={handleOrder}
            className="w-full rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3 px-4 shadow-md shadow-emerald-500/20 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <MessageCircle className="size-4.5 shrink-0" />
            <span>Commander sur WhatsApp</span>
            <span className="text-xs opacity-90 font-medium hidden sm:inline">({SHOP_PHONE_DISPLAY})</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
