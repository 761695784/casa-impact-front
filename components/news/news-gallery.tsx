"use client"

import React, { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Sparkles,
} from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { Media } from "@/types/models"

interface NewsGalleryProps {
  medias?: Media[]
}

export function NewsGallery({ medias }: NewsGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const items = medias || []

  const handleNext = useCallback(() => {
    if (activeIndex === null || items.length === 0) return
    setActiveIndex((prev) => ((prev ?? 0) + 1) % items.length)
  }, [activeIndex, items.length])

  const handlePrev = useCallback(() => {
    if (activeIndex === null || items.length === 0) return
    setActiveIndex((prev) => ((prev ?? 0) - 1 + items.length) % items.length)
  }, [activeIndex, items.length])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activeIndex === null) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "ArrowLeft") handlePrev()
      if (e.key === "Escape") setActiveIndex(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeIndex, handleNext, handlePrev])

  if (!items || items.length === 0) return null

  const activeMedia = activeIndex !== null ? items[activeIndex] : null

  return (
    <div className="mt-10 border-t border-border pt-10">
      {/* Gallery Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-1.5 border border-primary/20">
            <Camera className="size-3.5" />
            <span>Album Photos • Reportage Terrain</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
            Galerie Photos de l'événement ({items.length})
          </h3>
        </div>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          Cliquez sur une photo pour l'agrandir
        </span>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {items.map((media, idx) => (
          <div
            key={media.id || idx}
            onClick={() => setActiveIndex(idx)}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-secondary shadow-xs hover:shadow-xl transition-all duration-300 border border-border"
          >
            <Image
              src={media.url}
              alt={media.alt || media.nom || `Photo ${idx + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Dark Overlay with Zoom Icon & Caption */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white">
              <div className="self-end rounded-full bg-black/60 p-1.5 backdrop-blur-xs text-white/90">
                <Maximize2 className="size-3.5" />
              </div>
              <p className="text-xs font-bold line-clamp-2 leading-tight">
                {media.nom || media.description || `Photo ${idx + 1}`}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeMedia && (
        <Dialog
          open={activeIndex !== null}
          onOpenChange={(open) => !open && setActiveIndex(null)}
        >
          <DialogContent className="max-w-5xl w-[95vw] h-[85vh] p-0 rounded-3xl overflow-hidden border-0 bg-black/95 text-white flex flex-col justify-between shadow-2xl">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 to-transparent z-10">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white border border-white/20">
                  {(activeIndex ?? 0) + 1} / {items.length}
                </span>
                <p className="text-sm font-bold text-white/90 truncate max-w-md hidden sm:block">
                  {activeMedia.nom || activeMedia.nom_fichier}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
                aria-label="Fermer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Main Center Image Container */}
            <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 select-none">
              <div className="relative max-h-full max-w-full aspect-[16/10] w-full h-full">
                <Image
                  src={activeMedia.url}
                  alt={activeMedia.alt || activeMedia.nom || "Photo plein écran"}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Navigation Arrows */}
              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePrev()
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex size-12 items-center justify-center rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-all backdrop-blur-md shadow-lg"
                    aria-label="Photo précédente"
                  >
                    <ChevronLeft className="size-6" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleNext()
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex size-12 items-center justify-center rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-all backdrop-blur-md shadow-lg"
                    aria-label="Photo suivante"
                  >
                    <ChevronRight className="size-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Caption Bar */}
            <div className="p-4 sm:p-6 bg-gradient-to-t from-black/90 to-transparent text-center z-10">
              <p className="text-sm font-semibold text-white">
                {activeMedia.nom}
              </p>
              {activeMedia.description && (
                <p className="text-xs text-white/70 mt-1 max-w-xl mx-auto">
                  {activeMedia.description}
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
