"use client"

import React, { useState, useEffect, useRef } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMemberships } from "@/hooks/use-memberships"
import { useSendBroadcastMessage } from "@/hooks/use-broadcast-message"
import {
  Send,
  Loader2,
  Search,
  X,
  Users,
  AtSign,
  Bold,
  Italic,
  Underline,
  List,
  Link2,
} from "lucide-react"
import type { Membership } from "@/types/models"

interface SelectedRecipient {
  email: string
  label: string
  source: "membre" | "libre"
}

interface SendMessageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /**
   * Pré-remplit les destinataires à l'ouverture (ex. "Répondre par e-mail"
   * depuis le détail d'un message de contact — accord du 2026-09-11,
   * réutilise cette même modal plutôt qu'un mailto:). Reste modifiable :
   * l'admin peut retirer/ajouter d'autres destinataires normalement.
   */
  initialRecipients?: SelectedRecipient[]
  /** Pré-remplit le sujet à l'ouverture (ex. "Re: {sujet du message}"). */
  initialSubject?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Modal "Envoyer un message" de la section admin Messages (accord du
 * 2026-09-11) — compose un email libre (sujet + corps) envoyé au format
 * officiel Casa Impact (logo, filigrane, couleurs, signature — voir
 * emails/admin-message.blade.php côté backend, qui réutilise le même
 * layout que les emails d'adhésion). Les destinataires combinent deux
 * sources, choix explicite de l'utilisateur ("Membres + adresse libre") :
 * - des membres existants, recherchés/cochés dans une liste
 * - des adresses email tapées librement (non liées à un membre)
 * Les deux sont fusionnées en une seule liste d'emails dédupliquée avant
 * l'envoi — le backend ne distingue pas leur origine.
 */
export function SendMessageDialog({
  open,
  onOpenChange,
  initialRecipients,
  initialSubject,
}: SendMessageDialogProps) {
  const sendMutation = useSendBroadcastMessage()

  const [memberSearch, setMemberSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selected, setSelected] = useState<SelectedRecipient[]>([])
  const [freeEmailInput, setFreeEmailInput] = useState("")
  const [freeEmailError, setFreeEmailError] = useState<string | null>(null)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const messageRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(memberSearch), 300)
    return () => clearTimeout(timer)
  }, [memberSearch])

  useEffect(() => {
    if (open) {
      // Pré-remplissage (réponse depuis un message de contact) — voir
      // SendMessageDialogProps. Reste entièrement modifiable ensuite.
      if (initialRecipients && initialRecipients.length > 0) {
        setSelected(initialRecipients)
      }
      if (initialSubject) {
        setSubject(initialSubject)
      }
    } else {
      setMemberSearch("")
      setDebouncedSearch("")
      setSelected([])
      setFreeEmailInput("")
      setFreeEmailError(null)
      setSubject("")
      setMessage("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const { data: searchResults, isFetching: isSearching } = useMemberships({
    search: debouncedSearch,
    per_page: 8,
  })

  const memberOptions = debouncedSearch.trim().length >= 2 ? searchResults?.data ?? [] : []

  const isSelected = (email: string) =>
    selected.some((r) => r.email.toLowerCase() === email.toLowerCase())

  const toggleMember = (membership: Membership, checked: boolean) => {
    if (checked) {
      if (isSelected(membership.email)) return
      setSelected((prev) => [
        ...prev,
        { email: membership.email, label: membership.nom_complet, source: "membre" },
      ])
    } else {
      setSelected((prev) => prev.filter((r) => r.email.toLowerCase() !== membership.email.toLowerCase()))
    }
  }

  const removeRecipient = (email: string) => {
    setSelected((prev) => prev.filter((r) => r.email.toLowerCase() !== email.toLowerCase()))
  }

  const addFreeEmail = () => {
    const candidate = freeEmailInput.trim().replace(/,$/, "")
    if (!candidate) return

    if (!EMAIL_REGEX.test(candidate)) {
      setFreeEmailError("Adresse email invalide.")
      return
    }
    if (isSelected(candidate)) {
      setFreeEmailError("Cette adresse est déjà dans la liste.")
      return
    }

    setSelected((prev) => [...prev, { email: candidate, label: candidate, source: "libre" }])
    setFreeEmailInput("")
    setFreeEmailError(null)
  }

  const handleFreeEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addFreeEmail()
    }
  }

  /**
   * Mise en forme du message (accord du 2026-09-11 : barre d'outils simple,
   * pas d'éditeur WYSIWYG). Entoure/préfixe le texte sélectionné dans le
   * textarea avec une mini-syntaxe (**gras**, *italique*, __souligné__,
   * "- " pour une liste, [texte](url) pour un lien) — le texte reste du
   * texte brut à tout moment, jamais du HTML : c'est le backend
   * (AdminMessageController::renderMessageHtml) qui convertit ces marqueurs
   * en HTML sûr au moment de l'envoi. Même principe que la barre d'outils
   * Markdown de GitHub.
   */
  const wrapSelection = (before: string, after: string = before, placeholder = "") => {
    const textarea = messageRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = message.slice(start, end) || placeholder
    const newValue = message.slice(0, start) + before + selected + after + message.slice(end)

    setMessage(newValue)

    requestAnimationFrame(() => {
      textarea.focus()
      const selStart = start + before.length
      textarea.setSelectionRange(selStart, selStart + selected.length)
    })
  }

  const applyBulletList = () => {
    const textarea = messageRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const lineStart = message.lastIndexOf("\n", start - 1) + 1
    const nextBreak = message.indexOf("\n", end)
    const lineEnd = nextBreak === -1 ? message.length : nextBreak

    const block = message.slice(lineStart, lineEnd) || "élément de liste"
    const lines = block.split("\n")
    const alreadyList = lines.every((l) => l.trim() === "" || l.startsWith("- "))
    const newLines = lines.map((l) => {
      if (l.trim() === "") return l
      return alreadyList ? l.replace(/^- /, "") : `- ${l}`
    })
    const newBlock = newLines.join("\n")
    const newValue = message.slice(0, lineStart) + newBlock + message.slice(lineEnd)

    setMessage(newValue)

    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(lineStart, lineStart + newBlock.length)
    })
  }

  const canSend =
    subject.trim().length > 0 && message.trim().length > 0 && selected.length > 0

  const handleSend = async () => {
    if (!canSend) return
    try {
      await sendMutation.mutateAsync({
        subject: subject.trim(),
        message: message.trim(),
        recipients: selected.map((r) => r.email),
      })
      onOpenChange(false)
    } catch {
      // Le toast d'erreur est déjà affiché par le hook (onError).
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
            <Send className="size-5" />
          </div>
          <DialogTitle className="font-display text-lg font-bold text-foreground">
            Envoyer un message
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Le message sera envoyé au format officiel Casa Impact (logo, couleurs, signature).
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 space-y-5">
          {/* Destinataires */}
          <div className="space-y-2.5">
            <Label className="text-xs font-semibold text-foreground">Destinataires</Label>

            {/* Recherche membres */}
            <div className="space-y-1.5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="Rechercher un membre par nom, email..."
                  className="h-9 rounded-full pl-8 text-xs bg-background"
                />
              </div>

              {debouncedSearch.trim().length >= 2 && (
                <div className="rounded-2xl border border-border bg-card/60">
                  <ScrollArea className="max-h-36">
                    <div className="p-1.5 space-y-0.5">
                      {isSearching ? (
                        <p className="px-2.5 py-2 text-xs text-muted-foreground">Recherche...</p>
                      ) : memberOptions.length === 0 ? (
                        <p className="px-2.5 py-2 text-xs text-muted-foreground">Aucun membre trouvé.</p>
                      ) : (
                        memberOptions.map((m) => (
                          <label
                            key={m.id}
                            className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 cursor-pointer hover:bg-secondary/60"
                          >
                            <Checkbox
                              checked={isSelected(m.email)}
                              onCheckedChange={(checked) => toggleMember(m, checked)}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-foreground">{m.nom_complet}</p>
                              <p className="truncate text-[11px] text-muted-foreground">{m.email}</p>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>

            {/* Adresse libre */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    value={freeEmailInput}
                    onChange={(e) => {
                      setFreeEmailInput(e.target.value)
                      if (freeEmailError) setFreeEmailError(null)
                    }}
                    onKeyDown={handleFreeEmailKeyDown}
                    placeholder="Ou saisissez une adresse email libre..."
                    className="h-9 rounded-full pl-8 text-xs bg-background"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFreeEmail}
                  disabled={!freeEmailInput.trim()}
                  className="h-9 rounded-full text-xs shrink-0"
                >
                  Ajouter
                </Button>
              </div>
              {freeEmailError && (
                <p className="text-[11px] text-destructive">{freeEmailError}</p>
              )}
            </div>

            {/* Liste des destinataires sélectionnés */}
            {selected.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Users className="size-3.5" />
                  <span>
                    {selected.length} destinataire{selected.length > 1 ? "s" : ""} sélectionné{selected.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.map((r) => (
                    <Badge
                      key={r.email}
                      variant="secondary"
                      className="h-auto gap-1 rounded-full py-1 pl-2.5 pr-1.5 text-[11px]"
                    >
                      <span className="truncate max-w-[160px]">{r.label}</span>
                      <button
                        type="button"
                        onClick={() => removeRecipient(r.email)}
                        className="rounded-full p-0.5 hover:bg-foreground/10"
                        aria-label={`Retirer ${r.label}`}
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sujet */}
          <div className="space-y-1.5">
            <Label htmlFor="broadcast-subject" className="text-xs font-semibold text-foreground">
              Sujet
            </Label>
            <Input
              id="broadcast-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Objet de l'email..."
              className="h-10 rounded-2xl text-xs bg-background"
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label htmlFor="broadcast-message" className="text-xs font-semibold text-foreground">
              Message
            </Label>

            {/* Barre d'outils de mise en forme — sélectionnez du texte puis cliquez sur un bouton */}
            <div className="flex items-center gap-1 rounded-full border border-border bg-secondary/40 p-1 w-fit">
              <button
                type="button"
                title="Gras"
                onClick={() => wrapSelection("**", "**", "texte en gras")}
                className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
              >
                <Bold className="size-3.5" />
              </button>
              <button
                type="button"
                title="Italique"
                onClick={() => wrapSelection("*", "*", "texte en italique")}
                className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
              >
                <Italic className="size-3.5" />
              </button>
              <button
                type="button"
                title="Souligné"
                onClick={() => wrapSelection("__", "__", "texte souligné")}
                className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
              >
                <Underline className="size-3.5" />
              </button>
              <button
                type="button"
                title="Liste à puces"
                onClick={applyBulletList}
                className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
              >
                <List className="size-3.5" />
              </button>
              <button
                type="button"
                title="Lien"
                onClick={() => wrapSelection("[", "](https://)", "texte du lien")}
                className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
              >
                <Link2 className="size-3.5" />
              </button>
            </div>

            <Textarea
              id="broadcast-message"
              ref={messageRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Rédigez votre message..."
              rows={6}
              className="rounded-2xl text-xs bg-background resize-none"
            />
            <p className="text-[11px] text-muted-foreground">
              Sélectionnez du texte puis cliquez sur un bouton pour le mettre en forme. Inséré automatiquement dans le modèle email officiel de Casa Impact (le sujet sera affiché en gras, en belle police, en haut du message).
            </p>
          </div>
        </div>

        <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleSend}
            disabled={!canSend || sendMutation.isPending}
            className="rounded-full bg-forest text-white hover:bg-forest/90 font-semibold gap-2 shadow-xs"
          >
            {sendMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Envoi...</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                <span>Envoyer</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
