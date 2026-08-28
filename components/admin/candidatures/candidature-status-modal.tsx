"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { APPLICATION_STATUS_LABELS } from "@/types/enums"
import { useUpdateApplicationStatus } from "@/hooks/use-applications"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import type { Application } from "@/types/models"
import type { ApplicationStatus } from "@/types/enums"

interface CandidatureStatusModalProps {
  application: Application | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const SENSITIVE_STATUSES: ApplicationStatus[] = ["retenue", "non_retenue", "en_liste_attente"]

export function CandidatureStatusModal({
  application,
  open,
  onOpenChange,
  onSuccess,
}: CandidatureStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>("nouvelle")
  const [notes, setNotes] = useState("")
  const [showConfirmSensitive, setShowConfirmSensitive] = useState(false)

  const updateMutation = useUpdateApplicationStatus()

  useEffect(() => {
    if (application) {
      setSelectedStatus(application.statut)
      setNotes(application.notes_internes || "")
      setShowConfirmSensitive(false)
    }
  }, [application, open])

  if (!application) return null

  const isSensitive =
    SENSITIVE_STATUSES.includes(selectedStatus) && selectedStatus !== application.statut

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // If changing to a sensitive status and hasn't confirmed yet, trigger confirmation step
    if (isSensitive && !showConfirmSensitive) {
      setShowConfirmSensitive(true)
      return
    }

    await updateMutation.mutateAsync({
      id: application.id,
      statut: selectedStatus,
      notes_internes: notes,
    })

    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-6">
        <DialogHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-muted-foreground">
              {application.reference}
            </span>
            <StatusBadge status={application.statut} />
          </div>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            Évaluer la candidature
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Candidat : <strong>{application.candidat_nom || "Non renseigné"}</strong> • {application.appel?.titre}
          </DialogDescription>
        </DialogHeader>

        {showConfirmSensitive && (
          <div className="my-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="size-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-bold">Confirmation d'attribution de statut :</p>
              <p className="mt-0.5 leading-relaxed">
                Vous êtes sur le point de passer cette candidature au statut <strong>« {APPLICATION_STATUS_LABELS[selectedStatus]} »</strong>. Cette décision engage le processus officiel d'admission.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Nouveau Statut */}
          <div className="space-y-1.5">
            <Label htmlFor="statut-select" className="text-xs font-semibold">
              Statut de la décision
            </Label>
            <Select
              value={selectedStatus}
              onValueChange={(val) => {
                if (val) {
                  setSelectedStatus(val as ApplicationStatus)
                  setShowConfirmSensitive(false)
                }
              }}
            >
              <SelectTrigger id="statut-select" className="h-11 rounded-xl text-sm">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl text-sm">
                {(Object.keys(APPLICATION_STATUS_LABELS) as ApplicationStatus[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {APPLICATION_STATUS_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes Internes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes-internes" className="text-xs font-semibold">
              Notes d'évaluation internes (visibles uniquement par l'équipe)
            </Label>
            <Textarea
              id="notes-internes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex : Avis favorable du jury, projet pertinent, dossier complet..."
              className="rounded-2xl resize-none text-xs leading-relaxed"
            />
          </div>

          <DialogFooter className="pt-3 flex flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (showConfirmSensitive) {
                  setShowConfirmSensitive(false)
                } else {
                  onOpenChange(false)
                }
              }}
              className="rounded-full"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2 shadow-xs"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : showConfirmSensitive ? (
                <>
                  <CheckCircle2 className="size-4" />
                  <span>Confirmer définitivement</span>
                </>
              ) : (
                <span>Enregistrer la décision</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
