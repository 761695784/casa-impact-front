"use client"

import React, { useState, useEffect } from "react"
import { Search, X, Download, RotateCcw, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PROGRAM_STATUS_LABELS, REGION_LABELS } from "@/types/enums"
import { useDomains } from "@/hooks/use-domains"
import { useProgramTypes } from "@/hooks/use-program-types"
import { useExportPrograms } from "@/hooks/use-programs"
import type { ProgramStatus, Region } from "@/types/enums"

interface ProgrammesFilterBarProps {
  search: string
  statut: string
  domaineId: string
  typeId: string
  region: string
  onSearchChange: (val: string) => void
  onStatutChange: (val: string) => void
  onDomaineIdChange: (val: string) => void
  onTypeIdChange: (val: string) => void
  onRegionChange: (val: string) => void
  onReset: () => void
  totalCount?: number
}

export function ProgrammesFilterBar({
  search,
  statut,
  domaineId,
  typeId,
  region,
  onSearchChange,
  onStatutChange,
  onDomaineIdChange,
  onTypeIdChange,
  onRegionChange,
  onReset,
  totalCount,
}: ProgrammesFilterBarProps) {
  const [localSearch, setLocalSearch] = useState(search)
  const exportMutation = useExportPrograms()

  const { data: domains = [] } = useDomains()
  const { data: programTypes = [] } = useProgramTypes()

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
    search !== "" || statut !== "all" || domaineId !== "all" || typeId !== "all" || region !== "all"

  const handleExport = () => {
    exportMutation.mutate({
      search: search || undefined,
      statut: statut !== "all" ? statut : undefined,
      domaine_id: domaineId !== "all" ? domaineId : undefined,
      type_id: typeId !== "all" ? typeId : undefined,
      region: region !== "all" ? region : undefined,
    })
  }

  return (
    <div className="space-y-3 rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Search Input with Debounce */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Rechercher un programme, localisation, mot-clé..."
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
          <div className="w-[140px]">
            <Select value={statut} onValueChange={(val) => onStatutChange(val || "all")}>
              <SelectTrigger className="h-10 rounded-full text-xs bg-background">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl text-xs">
                <SelectItem value="all">Tous les statuts</SelectItem>
                {(Object.keys(PROGRAM_STATUS_LABELS) as ProgramStatus[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {PROGRAM_STATUS_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Domaine Filter */}
          <div className="w-[170px]">
            <Select value={domaineId} onValueChange={(val) => onDomaineIdChange(val || "all")}>
              <SelectTrigger className="h-10 rounded-full text-xs bg-background truncate">
                <SelectValue placeholder="Tous les domaines" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl text-xs max-w-xs">
                <SelectItem value="all">Tous les domaines</SelectItem>
                {domains.map((d) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    {d.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div className="w-[160px]">
            <Select value={typeId} onValueChange={(val) => onTypeIdChange(val || "all")}>
              <SelectTrigger className="h-10 rounded-full text-xs bg-background truncate">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl text-xs max-w-xs">
                <SelectItem value="all">Tous les types</SelectItem>
                {programTypes.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {t.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Région Filter */}
          <div className="w-[130px]">
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
