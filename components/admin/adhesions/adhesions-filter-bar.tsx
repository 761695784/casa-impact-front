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
import {
  MEMBERSHIP_STATUS_LABELS,
  MEMBERSHIP_REGION_LABELS,
} from "@/types/enums"
import type { MembershipStatus, MembershipRegion } from "@/types/enums"

interface AdhesionsFilterBarProps {
  search: string
  statut: string
  region: string
  onSearchChange: (val: string) => void
  onStatutChange: (val: string) => void
  onRegionChange: (val: string) => void
  onReset: () => void
  totalCount?: number
}

export function AdhesionsFilterBar({
  search,
  statut,
  region,
  onSearchChange,
  onStatutChange,
  onRegionChange,
  onReset,
  totalCount,
}: AdhesionsFilterBarProps) {
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

  const hasActiveFilters = search !== "" || statut !== "all" || region !== "all"

  return (
    <div className="space-y-3 rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        {/* Search Input with Debounce */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Rechercher par nom, email, téléphone, numéro de membre..."
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

        {/* Filter Selects & Reset */}
        <div className="flex flex-wrap items-center gap-2.5">

          {/* Statut Adhésion */}
          <div className="w-[160px]">
            <Select value={statut} onValueChange={(val) => onStatutChange(val || "all")}>
              <SelectTrigger className="h-10 rounded-full text-xs bg-background truncate">
                <SelectValue placeholder="Tous statuts" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl text-xs">
                <SelectItem value="all">Tous statuts</SelectItem>
                {(Object.keys(MEMBERSHIP_STATUS_LABELS) as MembershipStatus[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {MEMBERSHIP_STATUS_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Région */}
          <div className="w-[140px]">
            <Select value={region} onValueChange={(val) => onRegionChange(val || "all")}>
              <SelectTrigger className="h-10 rounded-full text-xs bg-background">
                <SelectValue placeholder="Toutes régions" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl text-xs">
                <SelectItem value="all">Toutes régions</SelectItem>
                {(Object.keys(MEMBERSHIP_REGION_LABELS) as MembershipRegion[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {MEMBERSHIP_REGION_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters */}
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
