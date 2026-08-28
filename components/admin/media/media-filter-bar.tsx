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
import { MEDIA_TYPE_LABELS, MEDIA_CATEGORY_LABELS } from "@/types/enums"
import type { MediaType } from "@/types/enums"

interface MediaFilterBarProps {
  search: string
  type: string
  categorie: string
  onSearchChange: (val: string) => void
  onTypeChange: (val: string) => void
  onCategorieChange: (val: string) => void
  onReset: () => void
  totalCount?: number
}

export function MediaFilterBar({
  search,
  type,
  categorie,
  onSearchChange,
  onTypeChange,
  onCategorieChange,
  onReset,
  totalCount,
}: MediaFilterBarProps) {
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
    search !== "" || type !== "all" || categorie !== "all"

  return (
    <div className="space-y-3 rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Rechercher par nom de fichier, titre, description, alt..."
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
          <div className="w-[150px]">
            <Select value={type} onValueChange={(val) => onTypeChange(val || "all")}>
              <SelectTrigger className="h-10 rounded-full text-xs bg-background truncate">
                <SelectValue placeholder="Tous types" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl text-xs">
                <SelectItem value="all">Tous types</SelectItem>
                {(Object.keys(MEDIA_TYPE_LABELS) as MediaType[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {MEDIA_TYPE_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Categorie Filter */}
          <div className="w-[160px]">
            <Select
              value={categorie}
              onValueChange={(val) => onCategorieChange(val || "all")}
            >
              <SelectTrigger className="h-10 rounded-full text-xs bg-background truncate">
                <SelectValue placeholder="Toutes catégories" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl text-xs">
                {Object.entries(MEDIA_CATEGORY_LABELS).map(([k, label]) => (
                  <SelectItem key={k} value={k}>
                    {label}
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
