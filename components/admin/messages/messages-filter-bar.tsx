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
  CONTACT_CATEGORY_LABELS,
  CONTACT_MESSAGE_STATUS_LABELS,
} from "@/types/enums"
import type { ContactCategory, ContactMessageStatus } from "@/types/enums"

interface MessagesFilterBarProps {
  search: string
  categorie: string
  statut: string
  lu: string
  onSearchChange: (val: string) => void
  onCategorieChange: (val: string) => void
  onStatutChange: (val: string) => void
  onLuChange: (val: string) => void
  onReset: () => void
  totalCount?: number
}

export function MessagesFilterBar({
  search,
  categorie,
  statut,
  lu,
  onSearchChange,
  onCategorieChange,
  onStatutChange,
  onLuChange,
  onReset,
  totalCount,
}: MessagesFilterBarProps) {
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
    search !== "" ||
    categorie !== "all" ||
    statut !== "all" ||
    lu !== "all"

  return (
    <div className="space-y-3 rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Rechercher par expéditeur, email, sujet ou mot-clé..."
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
          
          {/* Lu / Non lu */}
          <div className="w-[130px]">
            <Select value={lu} onValueChange={(val) => onLuChange(val || "all")}>
              <SelectTrigger className="h-10 rounded-full text-xs bg-background">
                <SelectValue placeholder="Lecture" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl text-xs">
                <SelectItem value="all">Tous messages</SelectItem>
                <SelectItem value="false">Non lus uniquement</SelectItem>
                <SelectItem value="true">Messages lus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Catégorie Filter */}
          <div className="w-[170px]">
            <Select
              value={categorie}
              onValueChange={(val) => onCategorieChange(val || "all")}
            >
              <SelectTrigger className="h-10 rounded-full text-xs bg-background truncate">
                <SelectValue placeholder="Toutes catégories" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl text-xs">
                <SelectItem value="all">Toutes catégories</SelectItem>
                {(Object.keys(CONTACT_CATEGORY_LABELS) as ContactCategory[]).map(
                  (key) => (
                    <SelectItem key={key} value={key}>
                      {CONTACT_CATEGORY_LABELS[key]}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Statut Filter */}
          <div className="w-[150px]">
            <Select
              value={statut}
              onValueChange={(val) => onStatutChange(val || "all")}
            >
              <SelectTrigger className="h-10 rounded-full text-xs bg-background truncate">
                <SelectValue placeholder="Tous statuts" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl text-xs">
                <SelectItem value="all">Tous statuts</SelectItem>
                {(
                  Object.keys(
                    CONTACT_MESSAGE_STATUS_LABELS
                  ) as ContactMessageStatus[]
                ).map((key) => (
                  <SelectItem key={key} value={key}>
                    {CONTACT_MESSAGE_STATUS_LABELS[key]}
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
