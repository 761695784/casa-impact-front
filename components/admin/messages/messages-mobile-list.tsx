"use client"

import React from "react"
import Link from "next/link"
import { Eye, MailOpen, Trash2, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/format"
import {
  CONTACT_CATEGORY_LABELS,
  CONTACT_MESSAGE_STATUS_LABELS,
} from "@/types/enums"
import type { ContactMessage } from "@/types/models"

interface MessagesMobileListProps {
  messages: ContactMessage[]
  onMarkAsRead: (message: ContactMessage) => void
  onDelete: (message: ContactMessage) => void
}

export function MessagesMobileList({
  messages,
  onMarkAsRead,
  onDelete,
}: MessagesMobileListProps) {
  return (
    <div className="space-y-4 md:hidden">
      {messages.map((m) => {
        const fullName = `${m.prenom || ""} ${m.nom}`.trim()
        const isUnread = !m.lu

        return (
          <div
            key={m.id}
            className={`rounded-3xl border border-border bg-card p-5 shadow-2xs space-y-4 ${
              isUnread ? "ring-1 ring-forest/30 bg-forest/[0.02]" : ""
            }`}
          >
            {/* Header Card */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                {isUnread && (
                  <span className="size-2 rounded-full bg-forest block shrink-0" />
                )}
                <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-semibold text-foreground">
                  {CONTACT_CATEGORY_LABELS[m.categorie] || m.categorie}
                </span>
              </div>

              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                  m.statut === "nouveau"
                    ? "bg-forest/15 text-forest"
                    : m.statut === "en_cours"
                    ? "bg-amber-500/10 text-amber-700"
                    : m.statut === "traite"
                    ? "bg-emerald-500/10 text-emerald-700"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {CONTACT_MESSAGE_STATUS_LABELS[m.statut] || m.statut}
              </span>
            </div>

            {/* Expéditeur & Sujet */}
            <div className="space-y-1">
              <div className="flex items-baseline justify-between gap-2">
                <Link
                  href={`/admin/messages/${m.id}`}
                  className="font-bold text-sm text-foreground hover:text-primary transition-colors block"
                >
                  {fullName}
                </Link>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {m.created_at ? formatDate(m.created_at) : "—"}
                </span>
              </div>

              <p className="font-semibold text-xs text-foreground line-clamp-1">
                {m.sujet || "Sans sujet"}
              </p>

              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed pt-1">
                {m.message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1 border-t border-border/60">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 rounded-full text-xs gap-1.5"
              >
                <Link href={`/admin/messages/${m.id}`}>
                  <Eye className="size-3.5 text-forest" />
                  <span>Consulter</span>
                </Link>
              </Button>

              {isUnread && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onMarkAsRead(m)}
                  className="rounded-full text-xs text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/20"
                >
                  <MailOpen className="size-3.5" />
                  <span>Lu</span>
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(m)}
                className="size-9 rounded-full text-destructive hover:bg-destructive/10"
                title="Supprimer le message"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
