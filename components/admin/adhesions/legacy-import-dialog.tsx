"use client"

import React, { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  usePreviewLegacyImport,
  useCommitLegacyImport,
  useCancelLegacyImport,
} from "@/hooks/use-memberships"
import { cn } from "@/lib/utils"
import {
  FileSpreadsheet,
  Upload,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Users,
  Clock,
  ShieldCheck,
} from "lucide-react"

interface LegacyImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step = "select" | "preview" | "done"

/**
 * Bouton "Importer l'historique (Excel)" — équivalent panneau admin de la
 * commande Artisan ponctuelle `membership:import-legacy` (accord explicite
 * du 2026-09-11, les deux utilisent le même service backend
 * LegacyMembershipImporter, donc produisent exactement le même résultat).
 *
 * Flux en 2 temps, comme la commande CLI :
 *   1. "select" : on choisit le fichier Excel, on clique "Analyser" —
 *      preview() envoie le fichier, ne l'écrit jamais en base, renvoie un
 *      résumé chiffré (combien seront créés/ignorés) + des avertissements.
 *   2. "preview" : on relit le résumé, puis soit "Annuler" (supprime le
 *      fichier temporaire côté serveur sans rien importer), soit "Confirmer
 *      l'import" (commit()) qui écrit réellement en base. Aucun email n'est
 *      envoyé pour les membres importés.
 *   3. "done" : résultat final (nombre réellement créé + éventuels échecs).
 */
export function LegacyImportDialog({ open, onOpenChange }: LegacyImportDialogProps) {
  const [step, setStep] = useState<Step>("select")
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const previewMutation = usePreviewLegacyImport()
  const commitMutation = useCommitLegacyImport()
  const cancelMutation = useCancelLegacyImport()

  const reset = () => {
    setStep("select")
    setFile(null)
    previewMutation.reset()
    commitMutation.reset()
  }

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      // Aperçu en cours et pas encore confirmé : on supprime le fichier
      // temporaire côté serveur plutôt que de le laisser traîner jusqu'au
      // nettoyage automatique (30 min) — le fichier est confidentiel.
      if (step === "preview" && previewMutation.data?.import_token) {
        cancelMutation.mutate(previewMutation.data.import_token)
      }
      reset()
    }
    onOpenChange(nextOpen)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
  }

  const handleAnalyze = async () => {
    if (!file) return
    try {
      await previewMutation.mutateAsync(file)
      setStep("preview")
    } catch {
      // Le toast d'erreur est déjà affiché par le hook (onError).
    }
  }

  const handleCancelPreview = () => {
    if (previewMutation.data?.import_token) {
      cancelMutation.mutate(previewMutation.data.import_token)
    }
    reset()
  }

  const handleConfirm = async () => {
    if (!previewMutation.data?.import_token) return
    try {
      await commitMutation.mutateAsync(previewMutation.data.import_token)
      setStep("done")
    } catch {
      // Le toast d'erreur est déjà affiché par le hook (onError). Le
      // fichier temporaire est de toute façon supprimé côté serveur (voir
      // MembershipImportController::commit(), bloc finally).
    }
  }

  const preview = previewMutation.data
  const result = commitMutation.data

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-1">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
            <FileSpreadsheet className="size-5" />
          </div>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            Importer l'historique (Excel)
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Importe en une fois tous les membres ayant adhéré avant la mise en ligne du
            site, à partir du fichier Excel Google Forms (onglets « Form_Responses » et
            « Cartes »). Chaque membre garde son ID existant.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-5">
          {step === "select" && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={handleFileChange}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all group",
                  file
                    ? "border-forest/50 bg-forest/5"
                    : "border-border bg-card/60 hover:border-primary/50 hover:bg-secondary/60"
                )}
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  {file ? (
                    <FileSpreadsheet className="size-5 text-forest" />
                  ) : (
                    <Upload className="size-5" />
                  )}
                </div>
                <p className="mt-2.5 text-xs font-bold text-foreground truncate max-w-full">
                  {file ? file.name : "Sélectionner le fichier .xlsx"}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {file ? "Cliquez pour changer de fichier" : "Format attendu : export Google Forms (.xlsx)"}
                </p>
              </div>

              <div className="flex items-start gap-2 rounded-2xl bg-secondary/50 border border-border p-3 text-[11px] text-muted-foreground">
                <ShieldCheck className="size-4 text-forest shrink-0 mt-0.5" />
                <span>
                  Rien n'est écrit en base à cette étape — un aperçu chiffré est d'abord
                  affiché pour confirmation. Le fichier est supprimé du serveur dès la
                  confirmation (ou l'annulation).
                </span>
              </div>
            </>
          )}

          {step === "preview" && preview && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border bg-card p-3.5">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                    <Users className="size-3.5 text-forest" />
                    <span>À créer</span>
                  </div>
                  <p className="mt-1 font-display text-xl font-bold text-foreground">
                    {preview.counts.to_create}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-3.5">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>Validés</span>
                  </div>
                  <p className="mt-1 font-display text-xl font-bold text-emerald-600">
                    {preview.counts.validees}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-3.5">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                    <Clock className="size-3.5 text-amber-600" />
                    <span>En attente de paiement</span>
                  </div>
                  <p className="mt-1 font-display text-xl font-bold text-amber-600">
                    {preview.counts.en_attente}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-3.5">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                    <ShieldCheck className="size-3.5 text-muted-foreground" />
                    <span>Déjà présents (ignorés)</span>
                  </div>
                  <p className="mt-1 font-display text-xl font-bold text-foreground">
                    {preview.counts.skipped_existing}
                  </p>
                </div>
              </div>

              {preview.warnings.length > 0 && (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-50/50 p-3.5 dark:bg-amber-500/5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-500">
                    <AlertTriangle className="size-3.5" />
                    <span>{preview.warnings.length} avertissement(s)</span>
                  </div>
                  <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-[11px] text-muted-foreground">
                    {preview.warnings.map((w, i) => (
                      <li key={i}>• {w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {preview.counts.to_create === 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  Aucun nouveau membre à importer — tous les ID de ce fichier sont déjà
                  présents en base.
                </p>
              )}
            </>
          )}

          {step === "done" && result && (
            <div className="flex flex-col items-center text-center py-4">
              <div className="flex size-14 items-center justify-center rounded-3xl bg-forest/10 text-forest">
                <CheckCircle2 className="size-7" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                Import terminé
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {result.created} membre(s) importé(s) avec succès.
              </p>
              {result.failed.length > 0 && (
                <div className="mt-3 w-full rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-left">
                  <p className="text-xs font-bold text-destructive">
                    {result.failed.length} ligne(s) en échec :
                  </p>
                  <ul className="mt-1.5 max-h-32 space-y-1 overflow-y-auto text-[11px] text-muted-foreground">
                    {result.failed.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row gap-2">
          {step === "select" && (
            <>
              <Button type="button" variant="outline" onClick={() => handleClose(false)} className="rounded-full">
                Annuler
              </Button>
              <Button
                type="button"
                onClick={handleAnalyze}
                disabled={!file || previewMutation.isPending}
                className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2 shadow-xs"
              >
                {previewMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Analyse en cours...</span>
                  </>
                ) : (
                  <span>Analyser le fichier</span>
                )}
              </Button>
            </>
          )}

          {step === "preview" && (
            <>
              <Button type="button" variant="outline" onClick={handleCancelPreview} className="rounded-full">
                Annuler
              </Button>
              {preview && preview.counts.to_create > 0 && (
                <Button
                  type="button"
                  onClick={handleConfirm}
                  disabled={commitMutation.isPending}
                  className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2 shadow-xs"
                >
                  {commitMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Import en cours...</span>
                    </>
                  ) : (
                    <span>Confirmer l'import de {preview.counts.to_create} membre(s)</span>
                  )}
                </Button>
              )}
            </>
          )}

          {step === "done" && (
            <Button
              type="button"
              onClick={() => handleClose(false)}
              className="w-full rounded-full bg-forest text-white hover:bg-forest/90 font-semibold"
            >
              Fermer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
