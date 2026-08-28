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
import { PAGE_STATUS_LABELS } from "@/types/enums"
import { useCreatePage, useUpdatePage } from "@/hooks/use-pages"
import { FileText, Loader2 } from "lucide-react"
import type { Page } from "@/types/models"
import type { PageStatus } from "@/types/enums"

interface PageFormDialogProps {
  page?: Page | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function PageFormDialog({
  page,
  open,
  onOpenChange,
  onSuccess,
}: PageFormDialogProps) {
  const isEditing = !!page

  const createMutation = useCreatePage()
  const updateMutation = useUpdatePage()

  const [titre, setTitre] = useState("")
  const [slug, setSlug] = useState("")
  const [resume, setResume] = useState("")
  const [contenu, setContenu] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [ordre, setOrdre] = useState<string>("1")
  const [statut, setStatut] = useState<PageStatus>("publie")

  useEffect(() => {
    if (page) {
      setTitre(page.titre || "")
      setSlug(page.slug || "")
      setResume(page.resume || "")
      setContenu(page.contenu || "")
      setMetaDescription(page.meta_description || "")
      setOrdre(page.ordre ? String(page.ordre) : "1")
      setStatut(page.statut || "publie")
    } else {
      setTitre("")
      setSlug("")
      setResume("")
      setContenu("")
      setMetaDescription("")
      setOrdre("1")
      setStatut("publie")
    }
  }, [page, open])

  const isPending = createMutation.isPending || updateMutation.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      titre,
      slug: slug || undefined,
      resume: resume || undefined,
      contenu,
      meta_description: metaDescription || undefined,
      ordre: Number(ordre) || 1,
      statut,
    }

    if (isEditing && page) {
      await updateMutation.mutateAsync({
        id: page.id,
        payload,
      })
    } else {
      await createMutation.mutateAsync(payload as Omit<Page, "id">)
    }

    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-1">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
            <FileText className="size-5" />
          </div>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            {isEditing ? "Modifier la page institutionnelle" : "Nouvelle page institutionnelle"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? "Modifiez le contenu éditorial et les métadonnées de cette page."
              : "Créez une nouvelle page de présentation ou section informative de Casa Impact."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          
          {/* Section 1 : Identité & URL */}
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest">
              1. Identité de la Page
            </h4>

            <div>
              <Label htmlFor="page-titre" className="text-xs font-semibold">
                Titre de la page *
              </Label>
              <Input
                id="page-titre"
                required
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                placeholder="ex. Qui sommes-nous — Histoire, Vision & Équipe"
                className="mt-1.5 h-11 rounded-xl text-sm"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="page-slug" className="text-xs font-semibold">
                  Slug / URL relative
                </Label>
                <Input
                  id="page-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="qui-sommes-nous"
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card font-mono"
                />
              </div>

              <div>
                <Label htmlFor="page-ordre" className="text-xs font-semibold">
                  Ordre d'affichage
                </Label>
                <Input
                  id="page-ordre"
                  type="number"
                  min={1}
                  value={ordre}
                  onChange={(e) => setOrdre(e.target.value)}
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                />
              </div>
            </div>
          </div>

          {/* Section 2 : Contenu */}
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest">
              2. Textes & Contenu
            </h4>

            <div>
              <Label htmlFor="page-resume" className="text-xs font-semibold">
                Résumé d'accroche / Chapô
              </Label>
              <Textarea
                id="page-resume"
                rows={2}
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Courte phrase résumant l'objet de cette page..."
                className="mt-1.5 rounded-xl resize-none text-xs"
              />
            </div>

            <div>
              <Label htmlFor="page-contenu" className="text-xs font-semibold">
                Corps du texte institutionnel *
              </Label>
              <Textarea
                id="page-contenu"
                required
                rows={7}
                value={contenu}
                onChange={(e) => setContenu(e.target.value)}
                placeholder="Rédigez les paragraphes et sections de la page..."
                className="mt-1.5 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Section 3 : Référencement & Statut */}
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest">
              3. Métadonnées & Publication
            </h4>

            <div>
              <Label htmlFor="page-meta" className="text-xs font-semibold">
                Meta description (balise SEO)
              </Label>
              <Input
                id="page-meta"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Courte description pour les moteurs de recherche..."
                className="mt-1.5 h-10 rounded-xl text-xs bg-card"
              />
            </div>

            <div>
              <Label htmlFor="page-statut" className="text-xs font-semibold">
                Statut de publication *
              </Label>
              <Select value={statut} onValueChange={(val) => setStatut(val as PageStatus)}>
                <SelectTrigger id="page-statut" className="mt-1.5 h-10 rounded-xl text-xs bg-card">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl text-xs">
                  {(Object.keys(PAGE_STATUS_LABELS) as PageStatus[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {PAGE_STATUS_LABELS[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              disabled={isPending}
              className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2 shadow-xs"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <span>{isEditing ? "Enregistrer les modifications" : "Créer la page"}</span>
              )}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}
