"use client"

import React, { useState, useEffect } from "react"
import { Search, X, RotateCcw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { REGION_LABELS } from "@/types/enums"
import type { Region } from "@/types/enums"

interface CartographyFilterBarProps {
  search: string
  type: string
  region: string
  onSearchChange: (val: string) => void
  onTypeChange: (val: string) => void
  onRegionChange: (val: string) => void
  onReset: () => void
  totalCount?: number
}

const TYPE_LABELS: Record<string, string> = {
  all: "Tous types",
  program: "Programmes",
  "application-call": "Appels à candidatures",
  talent: "Talents & Lauréats",
  implantation: "Points Relais & Hubs",
}

export function CartographyFilterBar({
  search,
  type,
  region,
  onSearchChange,
  onTypeChange,
  onRegionChange,
  onReset,
  totalCount,
}: CartographyFilterBarProps) {
  const [localSearch, setLocalSearch] = useState(search)

  useEffect(() => {
    setLocalSearch(search)
  }, [search])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearch, search, onSearchChange])

  const hasActiveFilters =
    search !== "" || type !== "all" || region !== "all"

  return (
    <div className="space-y-3 rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Rechercher une commune, un département, un hub ou une action..."
            className="h-10 rounded-full pl-9 pr-9 text-xs sm:text-sm bg-background"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch("")
                onSearchChange("")
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Effacer la recherche"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Type Filter */}
          <div className="w-[180px]">
            <Select value={type} onValueChange={(val) => onTypeChange(val || "all")}>
              <SelectTrigger className="h-10 rounded-full text-xs bg-background truncate">
                <SelectValue placeholder="Tous types" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl text-xs">
                {Object.entries(TYPE_LABELS).map(([k, label]) => (
                  <SelectItem key={k} value={k}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Region Filter */}
          <div className="w-[150px]">
            <Select
              value={region}
              onValueChange={(val) => onRegionChange(val || "all")}
            >
              <SelectTrigger className="h-10 rounded-full text-xs bg-background truncate">
                <SelectValue placeholder="Toutes régions" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl text-xs">
                <SelectItem value="all">Toutes régions</SelectItem>
                {(Object.keys(REGION_LABELS) as Region[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {REGION_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-10 rounded-full text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-3.5" />
              <span>Réinitialiser</span>
            </Button>
          )}

        </div>

      </div>
    </div>
  )
}
