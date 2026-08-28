"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"
import { usePromoteApplication } from "@/hooks/use-applications"
import type { Application } from "@/types/models"

interface CandidaturePromoteModalProps {
  application: Application | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CandidaturePromoteModal({
  application,
  open,
  onOpenChange,
  onSuccess,
}: CandidaturePromoteModalProps) {
  const promoteMutation = usePromoteApplication()

  if (!application) return null

  const handlePromote = async () => {
    await promoteMutation.mutateAsync(application.id)
    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader className="space-y-2">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-accent/20 text-accent-foreground">
            <Sparkles className="size-5" />
          </div>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            Promouvoir cette candidature
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground pt-1 leading-relaxed">
            Êtes-vous sûr de vouloir promouvoir le profil de <strong>{application.candidat_nom || application.reference}</strong> ?
          </DialogDescription>
        </DialogHeader>

        <div className="my-3 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-xs text-foreground/90">
          <p className="font-semibold text-accent-foreground">Effet de l'action :</p>
          <p className="mt-1 leading-relaxed text-muted-foreground">
            La candidature sera marquée comme promue (Talent d'impact / cohorte d'excellence) et signalée dans le système d'accompagnement de Casa Impact.
          </p>
        </div>

        <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={promoteMutation.isPending}
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            Annuler
          </Button>
          <Button
            type="button"
            disabled={promoteMutation.isPending}
            onClick={handlePromote}
            className="rounded-full bg-accent text-accent-foreground hover:bg-forest hover:text-white font-semibold gap-2 transition-all shadow-xs"
          >
            {promoteMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Promotion en cours...</span>
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                <span>Confirmer la promotion</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
