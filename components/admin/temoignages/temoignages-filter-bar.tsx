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
import { TESTIMONIAL_STATUS_LABELS } from "@/types/enums"
import { usePrograms } from "@/hooks/use-programs"
import type { TestimonialStatus } from "@/types/enums"

interface TemoignagesFilterBarProps {
  search: string
  statut: string
  programmeId: string
  onSearchChange: (val: string) => void
  onStatutChange: (val: string) => void
  onProgrammeIdChange: (val: string) => void
  onReset: () => void
  totalCount?: number
}

export function TemoignagesFilterBar({
  search,
  statut,
  programmeId,
  onSearchChange,
  onStatutChange,
  onProgrammeIdChange,
  onReset,
  totalCount,
}: TemoignagesFilterBarProps) {
  const [localSearch, setLocalSearch] = useState(search)
  const { data: programsData } = usePrograms()
  const programs = programsData?.data || []

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

  const hasActiveFilters = search !== "" || statut !== "all" || programmeId !== "all"

  return (
    <div className="space-y-3 rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Search Input with Debounce */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Rechercher par auteur, rôle/organisation, citation..."
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
          
          {/* Statut Filter */}
          <div className="w-[140px]">
            <Select value={statut} onValueChange={(val) => onStatutChange(val || "all")}>
              <SelectTrigger className="h-10 rounded-full text-xs bg-background">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl text-xs">
                <SelectItem value="all">Tous les statuts</SelectItem>
                {(Object.keys(TESTIMONIAL_STATUS_LABELS) as TestimonialStatus[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {TESTIMONIAL_STATUS_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Programme Filter */}
          <div className="w-[170px]">
            <Select value={programmeId} onValueChange={(val) => onProgrammeIdChange(val || "all")}>
              <SelectTrigger className="h-10 rounded-full text-xs bg-background truncate">
                <SelectValue placeholder="Tous les programmes" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl text-xs max-w-xs">
                <SelectItem value="all">Tous les programmes</SelectItem>
                {programs.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.titre}
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
