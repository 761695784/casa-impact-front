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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DOMAIN_STATUS_LABELS } from "@/types/enums"
import { useUpdateProgramType } from "@/hooks/use-program-types"
import { Tag, Loader2 } from "lucide-react"
import type { ProgramType } from "@/types/models"
import type { DomainStatus } from "@/types/enums"

interface ProgramTypeEditDialogProps {
  programType: ProgramType | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ProgramTypeEditDialog({
  programType,
  open,
  onOpenChange,
  onSuccess,
}: ProgramTypeEditDialogProps) {
  const [nom, setNom] = useState("")
  const [description, setDescription] = useState("")
  const [statut, setStatut] = useState<DomainStatus>("actif")
  const [ordre, setOrdre] = useState<string>("1")

  const updateMutation = useUpdateProgramType()

  useEffect(() => {
    if (programType) {
      setNom(programType.nom || "")
      setDescription(programType.description || "")
      setStatut(programType.statut || "actif")
      setOrdre(programType.ordre ? String(programType.ordre) : "1")
    }
  }, [programType, open])

  if (!programType) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await updateMutation.mutateAsync({
      id: programType.id,
      payload: {
        nom,
        description,
        statut,
        ordre: Number(ordre) || 1,
      },
    })

    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-1">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
            <Tag className="size-5" />
          </div>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            Modifier le type de programme
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Ajustez l'intitulé et la description de cette modalité d'action.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <div>
              <Label htmlFor="type-nom" className="text-xs font-semibold">
                Nom de la modalité *
              </Label>
              <Input
                id="type-nom"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="mt-1.5 h-11 rounded-xl text-sm"
              />
            </div>

            <div>
              <Label htmlFor="type-description" className="text-xs font-semibold">
                Description de la typologie
              </Label>
              <Textarea
                id="type-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explication du format d'intervention..."
                className="mt-1.5 rounded-xl resize-none text-xs"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 pt-1">
              <div>
                <Label htmlFor="type-statut" className="text-xs font-semibold">
                  Statut
                </Label>
                <Select value={statut} onValueChange={(val) => setStatut(val as DomainStatus)}>
                  <SelectTrigger id="type-statut" className="mt-1.5 h-10 rounded-xl text-xs bg-card">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs">
                    {(Object.keys(DOMAIN_STATUS_LABELS) as DomainStatus[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {DOMAIN_STATUS_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type-ordre" className="text-xs font-semibold">
                  Ordre d'affichage
                </Label>
                <Input
                  id="type-ordre"
                  type="number"
                  min={1}
                  max={20}
                  value={ordre}
                  onChange={(e) => setOrdre(e.target.value)}
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
              ) : (
                <span>Enregistrer les modifications</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
