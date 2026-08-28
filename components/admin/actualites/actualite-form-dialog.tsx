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
import { Checkbox } from "@/components/ui/checkbox"
import { NEWS_STATUS_LABELS, NEWS_TYPE_LABELS } from "@/types/enums"
import { useCreateNews, useUpdateNews } from "@/hooks/use-news"
import { Newspaper, Loader2, Image as ImageIcon } from "lucide-react"
import type { News } from "@/types/models"
import type { NewsStatus, NewsType } from "@/types/enums"

interface ActualiteFormDialogProps {
  news?: News | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ActualiteFormDialog({
  news,
  open,
  onOpenChange,
  onSuccess,
}: ActualiteFormDialogProps) {
  const isEditing = !!news

  const createMutation = useCreateNews()
  const updateMutation = useUpdateNews()

  const [titre, setTitre] = useState("")
  const [extrait, setExtrait] = useState("")
  const [contenu, setContenu] = useState("")
  const [type, setType] = useState<NewsType>("article")
  const [auteur, setAuteur] = useState("")
  const [image, setImage] = useState("")
  const [aLaUne, setALaUne] = useState(false)
  const [statut, setStatut] = useState<NewsStatus>("brouillon")
  const [datePublication, setDatePublication] = useState("")

  useEffect(() => {
    if (news) {
      setTitre(news.titre || "")
      setExtrait(news.extrait || "")
      setContenu(news.contenu || "")
      setType(news.type || "article")
      setAuteur(news.auteur || "")
      setImage(news.image || "")
      setALaUne(!!news.a_la_une)
      setStatut(news.statut || "brouillon")
      setDatePublication(
        news.date_publication ? news.date_publication.split("T")[0] : ""
      )
    } else {
      setTitre("")
      setExtrait("")
      setContenu("")
      setType("article")
      setAuteur("")
      setImage("")
      setALaUne(false)
      setStatut("brouillon")
      setDatePublication(new Date().toISOString().split("T")[0])
    }
  }, [news, open])

  const isPending = createMutation.isPending || updateMutation.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      titre,
      extrait: extrait || undefined,
      contenu: contenu || undefined,
      type,
      auteur: auteur || undefined,
      image: image || undefined,
      a_la_une: aLaUne,
      statut,
      date_publication: datePublication ? `${datePublication}T00:00:00Z` : undefined,
    }

    if (isEditing && news) {
      await updateMutation.mutateAsync({
        id: news.id,
        payload,
      })
    } else {
      await createMutation.mutateAsync(payload as Omit<News, "id">)
    }

    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-1">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
            <Newspaper className="size-5" />
          </div>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            {isEditing ? "Modifier la publication" : "Nouvelle publication éditoriale"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? "Modifiez le contenu, la typologie et le statut de cette actualité."
              : "Rédigez un article, une annonce officielle ou un communiqué de Casa Impact."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          
          {/* Section 1 : Identité & Typologie */}
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest">
              1. Identité de l'Article
            </h4>

            <div>
              <Label htmlFor="news-titre" className="text-xs font-semibold">
                Titre de la publication *
              </Label>
              <Input
                id="news-titre"
                required
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                placeholder="ex. Immersion & Rencontre avec la Jeunesse de Ziguinchor"
                className="mt-1.5 h-11 rounded-xl text-sm"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="news-type" className="text-xs font-semibold">
                  Catégorie / Format éditorial *
                </Label>
                <Select value={type} onValueChange={(val) => setType(val as NewsType)}>
                  <SelectTrigger id="news-type" className="mt-1.5 h-10 rounded-xl text-xs bg-card">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs">
                    {(Object.keys(NEWS_TYPE_LABELS) as NewsType[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {NEWS_TYPE_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="news-auteur" className="text-xs font-semibold">
                  Auteur / Pôle émetteur
                </Label>
                <Input
                  id="news-auteur"
                  value={auteur}
                  onChange={(e) => setAuteur(e.target.value)}
                  placeholder="ex. Pôle Culture & Communication"
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="news-a-la-une"
                checked={aLaUne}
                onCheckedChange={(checked) => setALaUne(!!checked)}
              />
              <Label
                htmlFor="news-a-la-une"
                className="text-xs font-medium cursor-pointer"
              >
                Mettre cet article « À la une » sur la page d'accueil et le flux d'actualités
              </Label>
            </div>
          </div>

          {/* Section 2 : Contenu */}
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest">
              2. Contenu & Rédaction
            </h4>

            <div>
              <Label htmlFor="news-extrait" className="text-xs font-semibold">
                Extrait / Chapeau introductif (court résumé)
              </Label>
              <Textarea
                id="news-extrait"
                rows={2}
                value={extrait}
                onChange={(e) => setExtrait(e.target.value)}
                placeholder="Courte phrase résumant l'essentiel de l'information..."
                className="mt-1.5 rounded-xl resize-none text-xs"
              />
            </div>

            <div>
              <Label htmlFor="news-contenu" className="text-xs font-semibold">
                Corps de l'article / Contenu complet
              </Label>
              <Textarea
                id="news-contenu"
                rows={6}
                value={contenu}
                onChange={(e) => setContenu(e.target.value)}
                placeholder="Rédigez les paragraphes détaillés de l'actualité..."
                className="mt-1.5 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Section 3 : Média & Illustration */}
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest">
                3. Illustration Principale
              </h4>
              <span className="text-[10px] text-muted-foreground">
                Compatible future Médiathèque
              </span>
            </div>

            <div>
              <Label htmlFor="news-image" className="text-xs font-semibold">
                Chemin ou URL de l'image de couverture
              </Label>
              <Input
                id="news-image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="ex. /images/news/immersion-ziguinchor.jpg"
                className="mt-1.5 h-10 rounded-xl text-xs bg-card"
              />
            </div>
          </div>

          {/* Section 4 : Publication */}
          <div className="space-y-3.5 rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest">
              4. Paramètres de Publication
            </h4>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="news-date-pub" className="text-xs font-semibold">
                  Date de publication
                </Label>
                <Input
                  id="news-date-pub"
                  type="date"
                  value={datePublication}
                  onChange={(e) => setDatePublication(e.target.value)}
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                />
              </div>

              <div>
                <Label htmlFor="news-statut" className="text-xs font-semibold">
                  Statut éditorial *
                </Label>
                <Select value={statut} onValueChange={(val) => setStatut(val as NewsStatus)}>
                  <SelectTrigger id="news-statut" className="mt-1.5 h-10 rounded-xl text-xs bg-card">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs">
                    {(Object.keys(NEWS_STATUS_LABELS) as NewsStatus[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {NEWS_STATUS_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              disabled={isPending}
              className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2 shadow-xs"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <span>{isEditing ? "Enregistrer les modifications" : "Créer l'article"}</span>
              )}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}
