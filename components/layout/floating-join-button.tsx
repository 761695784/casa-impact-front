"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, UserPlus } from "lucide-react"

export function FloatingJoinButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  if (!visible) return null

  return (
    <aside
      aria-label="Action rapide adhésion"
      className="fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6 animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      <Link
        href="/adherer"
        aria-label="Rejoindre l'organisation Casa Impact et devenir membre"
        className="group relative flex items-center gap-2 rounded-full bg-gradient-to-r from-earth via-[#663016] to-earth px-3.5 py-2 sm:px-4 sm:py-2.5 text-white shadow-lg shadow-black/20 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:brightness-110 active:scale-95 ring-1 ring-white/30"
      >
        {/* Subtle Warm Halo */}
        <span
          className="absolute -inset-0.5 rounded-full bg-earth/30 opacity-60 blur-xs group-hover:opacity-100 transition-opacity pointer-events-none"
          aria-hidden="true"
        />

        {/* Small Icon Badge */}
        <span className="relative flex size-6 sm:size-6.5 items-center justify-center rounded-full bg-white/15 text-white transition-transform duration-200 group-hover:scale-105">
          <UserPlus className="size-3.5 text-white" />
        </span>

        {/* Bold White Text */}
        <span className="relative font-display text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
          <span>Nous rejoindre</span>
          <ArrowRight className="size-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </Link>
    </aside>
  )
}
