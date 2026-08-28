import React from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = "Une erreur est survenue",
  message = "Impossible de charger les informations depuis le serveur.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center sm:p-12 ${className || ""}`}
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertCircle className="size-6" />
      </div>

      <h3 className="mt-4 font-display text-lg font-bold text-foreground">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {message}
      </p>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="mt-6 rounded-full gap-2 border-destructive/30 hover:bg-destructive/10 text-destructive hover:text-destructive"
        >
          <RefreshCw className="size-4" />
          <span>Réessayer</span>
        </Button>
      )}
    </div>
  )
}
