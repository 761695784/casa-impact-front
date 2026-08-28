"use client"

import React, { useState, useEffect } from "react"
import { Search, X, RotateCcw, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PermissionGate } from "@/components/admin/permission-gate"
import { ADMIN_ROLE_LABELS, USER_STATUS_LABELS } from "@/types/enums"
import type { AdminRoleSlug } from "@/types/admin"

interface UsersFilterBarProps {
  search: string
  role: string
  statut: string
  onSearchChange: (val: string) => void
  onRoleChange: (val: string) => void
  onStatutChange: (val: string) => void
  onReset: () => void
  onOpenCreate: () => void
  totalCount?: number
}

export function UsersFilterBar({
  search,
  role,
  statut,
  onSearchChange,
  onRoleChange,
  onStatutChange,
  onReset,
  onOpenCreate,
  totalCount,
}: UsersFilterBarProps) {
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

  const hasActiveFilters = search !== "" || role !== "all" || statut !== "all"

  return (
    <div className="space-y-3 rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Search Input with Debounce */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Rechercher par nom, prénom, email..."
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

        {/* Filter Selects & Create Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Role Filter */}
          <div className="w-[180px]">
            <Select value={role} onValueChange={(val) => onRoleChange(val || "all")}>
              <SelectTrigger className="h-10 rounded-full text-xs bg-background truncate">
                <SelectValue placeholder="Tous les rôles" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl text-xs">
                <SelectItem value="all">Tous les rôles</SelectItem>
                {(Object.keys(ADMIN_ROLE_LABELS) as AdminRoleSlug[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {ADMIN_ROLE_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-[130px]">
            <Select value={statut} onValueChange={(val) => onStatutChange(val || "all")}>
              <SelectTrigger className="h-10 rounded-full text-xs bg-background">
                <SelectValue placeholder="Tous statuts" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl text-xs">
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="inactif">Inactif</SelectItem>
                <SelectItem value="suspendu">Suspendu</SelectItem>
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

          {/* Create User Button (SuperAdmin only) */}
          <PermissionGate roles={["administrateur-principal"]}>
            <Button
              size="sm"
              onClick={onOpenCreate}
              className="h-10 rounded-full text-xs gap-1.5 bg-forest hover:bg-forest/90 text-white font-medium"
            >
              <UserPlus className="size-3.5" />
              <span>Nouvel utilisateur</span>
            </Button>
          </PermissionGate>

        </div>

      </div>
    </div>
  )
}
