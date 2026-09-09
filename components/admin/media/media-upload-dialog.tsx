"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { useCreateMedia } from "@/hooks/use-media"
import { compressImageToWebP } from "@/lib/image-processing"
import {
  UploadCloud,
  FileText,
  Loader2,
  X,
  Check,
  AlertTriangle,
  Sparkles,
} from "lucide-react"
import { MEDIA_CATEGORY_LABELS } from "@/types/enums"
import type { Media } from "@/types/models"

interface MediaUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Appelé une fois le lot terminé, avec tous les médias effectivement créés. */
  onSuccess?: (created: Media[]) => void
}

type ItemStatus = "compressing" | "ready" | "uploading" | "done" | "error"

interface UploadItem {
  key: string
  originalFile: File
  file: File
  previewUrl: string
  nom: string
  isImage: boolean
  status: ItemStatus
  error?: string
}

function humanSize(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} Ko`
    : `${(bytes / (1024 * 1024)).toFixed(2)} Mo`
}

let keySeq = 0
function nextKey() {
  keySeq += 1
  return `f${Date.now()}-${keySeq}`
}

export function MediaUploadDialog({
  open,
  onOpenChange,
  onSuccess,
}: MediaUploadDialogProps) {
  const createMutation = useCreateMedia()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [items, setItems] = useState<UploadItem[]>([])
  const [categorie, setCategorie] = useState<"banniere" | "portrait" | "logo" | "document" | "general">("general")
  const [alt, setAlt] = useState("")
  const [legende, setLegende] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Libère les URL objet de prévisualisation à la fermeture / au démontage.
  useEffect(() => {
    return () => {
      items.forEach((it) => URL.revokeObjectURL(it.previewUrl))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetForm = () => {
    items.forEach((it) => URL.revokeObjectURL(it.previewUrl))
    setItems([])
    setCategorie("general")
    setAlt("")
    setLegende("")
    setIsSubmitting(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    if (selected.length === 0) return
    e.target.value = ""

    const pending: UploadItem[] = selected.map((file) => {
      const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
      return {
        key: nextKey(),
        originalFile: file,
        file,
        previewUrl: URL.createObjectURL(file),
        nom: baseName.charAt(0).toUpperCase() + baseName.slice(1),
        isImage: file.type.startsWith("image/"),
        status: file.type.startsWith("image/") ? "compressing" : "ready",
      }
    })

    setItems((prev) => [...prev, ...pending])

    // Compression WebP en arrière-plan, image par image — chaque carte se
    // met à jour dès que la sienne est prête, sans bloquer les autres.
    pending
      .filter((it) => it.isImage)
      .forEach((it) => {
        compressImageToWebP(it.originalFile).then((compressed) => {
          setItems((prev) =>
            prev.map((cur) => {
              if (cur.key !== it.key) return cur
              if (compressed === it.originalFile) {
                return { ...cur, status: "ready" }
              }
              URL.revokeObjectURL(cur.previewUrl)
              return {
                ...cur,
                file: compressed,
                previewUrl: URL.createObjectURL(compressed),
                status: "ready",
              }
            })
          )
        })
      })
  }

  const removeItem = (key: string) => {
    setItems((prev) => {
      const target = prev.find((it) => it.key === key)
      if (target) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((it) => it.key !== key)
    })
  }

  const updateItemNom = (key: string, nom: string) => {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, nom } : it)))
  }

  const readyCount = items.filter((it) => it.status === "ready").length
  const stillCompressing = items.some((it) => it.status === "compressing")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0 || isSubmitting || stillCompressing) return

    setIsSubmitting(true)
    const created: Media[] = []
    let failures = 0

    for (const item of items) {
      setItems((prev) =>
        prev.map((it) => (it.key === item.key ? { ...it, status: "uploading" } : it))
      )
      try {
        const media = await createMutation.mutateAsync({
          file: item.file,
          nom: item.nom.trim() || undefined,
          alt: alt.trim() || undefined,
          legende: legende.trim() || undefined,
          categorie,
        })
        created.push(media)
        setItems((prev) =>
          prev.map((it) => (it.key === item.key ? { ...it, status: "done" } : it))
        )
      } catch (err) {
        failures += 1
        setItems((prev) =>
          prev.map((it) =>
            it.key === item.key
              ? {
                  ...it,
                  status: "error",
                  error: err instanceof Error ? err.message : "Échec de l'envoi.",
                }
              : it
          )
        )
      }
    }

    setIsSubmitting(false)

    if (failures === 0) {
      resetForm()
      onOpenChange(false)
      onSuccess?.(created)
    } else if (created.length > 0) {
      // Certains ont réussi : on retire les réussites de la liste et on
      // laisse le dialog ouvert sur les échecs, pour permettre de corriger
      // et réessayer sans tout recommencer.
      setItems((prev) => prev.filter((it) => it.status === "error"))
      onSuccess?.(created)
    }
    // Si tout a échoué, le dialog reste ouvert tel quel avec les erreurs affichées.
  }

  const canSubmit = items.length > 0 && !isSubmitting && !stillCompressing

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v && !isSubmitting) resetForm()
        onOpenChange(v)
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-1">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UploadCloud className="size-5" />
          </div>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            Ajouter des médias à l'album
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Importez une ou plusieurs images, logos ou documents. Les photos sont automatiquement
            converties en WebP et redimensionnées pour le web avant l'envoi.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          {/* Zone de sélection */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              multiple
              onChange={handleFilesChange}
              className="hidden"
              id="media-file-upload"
            />
            <label
              htmlFor="media-file-upload"
              className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-primary/30 bg-secondary/30 p-6 text-center cursor-pointer hover:bg-secondary/60 hover:border-primary/60 transition-all group"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-background text-primary shadow-xs group-hover:scale-110 transition-transform">
                <UploadCloud className="size-6" />
              </div>
              <p className="mt-2.5 text-sm font-bold text-foreground">
                Cliquez pour choisir une ou plusieurs photos, ou un document
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPG, WEBP, PDF — les photos sont compressées automatiquement
              </p>
            </label>
          </div>

          {/* Liste des fichiers sélectionnés */}
          {items.length > 0 && (
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="relative overflow-hidden rounded-2xl border border-border bg-card p-3"
                >
                  <div className="flex items-center gap-3">
                    {item.isImage ? (
                      <div className="relative size-14 rounded-xl overflow-hidden bg-secondary shrink-0 border border-border">
                        <img src={item.previewUrl} alt="Aperçu" className="size-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex size-14 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 shrink-0">
                        <FileText className="size-6" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <Input
                        value={item.nom}
                        onChange={(e) => updateItemNom(item.key, e.target.value)}
                        disabled={isSubmitting}
                        className="h-8 rounded-lg text-xs bg-background"
                        placeholder="Titre de ce fichier"
                      />
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>{humanSize(item.file.size)}</span>
                        {item.file !== item.originalFile && (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                            <Sparkles className="size-3" />
                            WebP ({Math.round((1 - item.file.size / item.originalFile.size) * 100)}% plus léger)
                          </span>
                        )}
                        {item.status === "compressing" && <span>Optimisation...</span>}
                      </div>
                      {item.status === "error" && (
                        <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-destructive">
                          <AlertTriangle className="size-3" />
                          {item.error}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0">
                      {item.status === "compressing" && (
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      )}
                      {item.status === "uploading" && (
                        <Loader2 className="size-4 animate-spin text-primary" />
                      )}
                      {item.status === "done" && (
                        <Check className="size-4 text-emerald-600" />
                      )}
                      {(item.status === "ready" || item.status === "error") && !isSubmitting && (
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          className="flex size-7 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Métadonnées communes au lot */}
          {items.length > 0 && (
            <div className="space-y-3 rounded-2xl border border-border/80 bg-secondary/30 p-4">
              <p className="text-[11px] font-semibold text-muted-foreground">
                Ces informations seront appliquées à {items.length > 1 ? "toutes les photos ci-dessus" : "ce fichier"}
                {items.length > 1 ? " (le titre reste modifiable individuellement)" : ""}.
              </p>

              <div>
                <Label htmlFor="media-categorie" className="text-xs font-semibold">
                  Catégorie dans l'album *
                </Label>
                <Select value={categorie} onValueChange={(val) => setCategorie(val as any)}>
                  <SelectTrigger id="media-categorie" className="mt-1.5 h-10 rounded-xl text-xs bg-card">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl text-xs">
                    {Object.entries(MEDIA_CATEGORY_LABELS)
                      .filter(([k]) => k !== "all")
                      .map(([k, label]) => (
                        <SelectItem key={k} value={k}>
                          {label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="media-alt" className="text-xs font-semibold">
                  Texte alternatif (Alt text SEO / Accessibilité)
                </Label>
                <Input
                  id="media-alt"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Description concise pour les lecteurs d'écran..."
                  className="mt-1.5 h-10 rounded-xl text-xs bg-card"
                />
              </div>

              <div>
                <Label htmlFor="media-legende" className="text-xs font-semibold">
                  Légende ou Description détaillée (optionnel)
                </Label>
                <Textarea
                  id="media-legende"
                  rows={2}
                  value={legende}
                  onChange={(e) => setLegende(e.target.value)}
                  placeholder="Précisez le contexte, les personnes présentes ou le lieu de la photo..."
                  className="mt-1.5 rounded-xl resize-none text-xs"
                />
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="rounded-full"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit}
              className="rounded-full bg-primary text-white hover:bg-forest font-semibold gap-2 shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Téléversement...</span>
                </>
              ) : stillCompressing ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Optimisation en cours...</span>
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  <span>
                    Ajouter {readyCount > 1 ? `${readyCount} médias` : "à la médiathèque"}
                  </span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
