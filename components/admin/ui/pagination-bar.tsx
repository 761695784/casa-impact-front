"use client"

import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationBarProps {
  currentPage: number
  lastPage: number
  total: number
  perPage: number
  onPageChange: (page: number) => void
  disabled?: boolean
  className?: string
}

export function PaginationBar({
  currentPage,
  lastPage,
  total,
  perPage,
  onPageChange,
  disabled = false,
  className,
}: PaginationBarProps) {
  if (total === 0 || lastPage <= 1) {
    return (
      <div className={`flex items-center justify-between text-xs text-muted-foreground pt-4 ${className || ""}`}>
        <span>
          Affichage de <strong>{total}</strong> résultat{total > 1 ? "s" : ""}
        </span>
      </div>
    )
  }

  const start = (currentPage - 1) * perPage + 1
  const end = Math.min(currentPage * perPage, total)

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/80 pt-4 text-xs text-muted-foreground ${
        className || ""
      }`}
    >
      <div>
        Affichage de <strong>{start}</strong> à <strong>{end}</strong> sur{" "}
        <strong>{total}</strong> candidature{total > 1 ? "s" : ""}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1 || disabled}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 rounded-full px-3 text-xs gap-1"
        >
          <ChevronLeft className="size-3.5" />
          <span>Précédent</span>
        </Button>

        <div className="flex items-center gap-1 px-2">
          <span className="font-semibold text-foreground">{currentPage}</span>
          <span className="opacity-50">/</span>
          <span>{lastPage}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= lastPage || disabled}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 rounded-full px-3 text-xs gap-1"
        >
          <span>Suivant</span>
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
