"use client"

import React, { useState, useEffect } from "react"
import { Search, X, Download, Filter, RotateCcw, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { APPLICATION_STATUS_LABELS, REGION_LABELS } from "@/types/enums"
import { mockApplicationCalls } from "@/lib/mock/application-calls.mock"
import type { ApplicationStatus, Region } from "@/types/enums"
import { useExportApplications } from "@/hooks/use-applications"

interface CandidaturesFilterBarProps {
  search: string
  statut: string
  region: string
  appelId: string
  onSearchChange: (val: string) => void
  onStatutChange: (val: string) => void
  onRegionChange: (val: string) => void
  onAppelIdChange: (val: string) => void
  onReset: () => void
  totalCount?: number
}

export function CandidaturesFilterBar({
  search,
  statut,
  region,
  appelId,
  onSearchChange,
  onStatutChange,
  onRegionChange,
  onAppelIdChange,
  onReset,
  totalCount,
}: CandidaturesFilterBarProps) {
  // Local state for debounced search
  const [localSearch, setLocalSearch] = useState(search)
  const exportMutation = useExportApplications()

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
    search !== "" || statut !== "all" || region !== "all" || appelId !== "all"

  const handleExport = () => {
    exportMutation.mutate({
      search: search || undefined,
      statut: statut !== "all" ? statut : undefined,
      region: region !== "all" ? region : undefined,
      appel_id: appelId !== "all" ? appelId : undefined,
    })
  }

  return (
    <div className="space-y-3 rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Search Input with Debounce */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Rechercher par candidat, référence, email, projet..."
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

        {/* Filter Selects & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Statut Filter */}
          <div className="w-[160px]">
            <Select value={statut} onValueChange={(val) => onStatutChange(val || "all")}>
              <SelectTrigger className="h-10 rounded-full text-xs bg-background">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl text-xs">
                <SelectItem value="all">Tous les statuts</SelectItem>
                {(Object.keys(APPLICATION_STATUS_LABELS) as ApplicationStatus[]).map(
                  (key) => (
                    <SelectItem key={key} value={key}>
                      {APPLICATION_STATUS_LABELS[key]}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Région Filter */}
          <div className="w-[140px]">
            <Select value={region} onValueChange={(val) => onRegionChange(val || "all")}>
              <SelectTrigger className="h-10 rounded-full text-xs bg-background">
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

          {/* Appel Filter */}
          <div className="w-[180px]">
            <Select value={appelId} onValueChange={(val) => onAppelIdChange(val || "all")}>
              <SelectTrigger className="h-10 rounded-full text-xs bg-background truncate">
                <SelectValue placeholder="Tous les appels" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl text-xs max-w-xs">
                <SelectItem value="all">Tous les appels</SelectItem>
                {mockApplicationCalls.map((call) => (
                  <SelectItem key={call.id} value={String(call.id)}>
                    {call.titre}
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

          {/* Export Button */}
          <Button
            variant="outline"
            size="sm"
            disabled={exportMutation.isPending}
            onClick={handleExport}
            className="h-10 rounded-full text-xs gap-1.5 border-border hover:bg-secondary ml-auto lg:ml-0"
          >
            {exportMutation.isPending ? (
              <Loader2 className="size-3.5 animate-spin text-primary" />
            ) : (
              <Download className="size-3.5 text-forest" />
            )}
            <span>Exporter CSV</span>
          </Button>

        </div>

      </div>
    </div>
  )
}
