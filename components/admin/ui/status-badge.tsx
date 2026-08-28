import React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  label?: string
  className?: string
}

const STATUS_CONFIGS: Record<
  string,
  { label: string; className: string; dotColor: string }
> = {
  // Statuts candidatures
  nouvelle: {
    label: "Nouvelle",
    className: "border-sky-500/20 bg-sky-500/10 text-sky-700",
    dotColor: "bg-sky-500",
  },
  en_cours_etude: {
    label: "En cours d'étude",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-700",
    dotColor: "bg-amber-500",
  },
  preselectionnee: {
    label: "Présélectionnée",
    className: "border-indigo-500/20 bg-indigo-500/10 text-indigo-700",
    dotColor: "bg-indigo-500",
  },
  retenue: {
    label: "Retenue",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
    dotColor: "bg-emerald-500",
  },
  non_retenue: {
    label: "Non retenue",
    className: "border-rose-500/20 bg-rose-500/10 text-rose-700",
    dotColor: "bg-rose-500",
  },
  en_liste_attente: {
    label: "Liste d'attente",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-700",
    dotColor: "bg-amber-500",
  },

  // Statuts adhésions
  en_attente_paiement: {
    label: "En attente paiement (1 000 F)",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-700",
    dotColor: "bg-amber-500",
  },
  validee: {
    label: "Adhésion Validée",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
    dotColor: "bg-emerald-500",
  },
  refusee: {
    label: "Refusée",
    className: "border-rose-500/20 bg-rose-500/10 text-rose-700",
    dotColor: "bg-rose-500",
  },

  // Statuts messages
  nouveau: {
    label: "Non lu",
    className: "border-sky-500/20 bg-sky-500/10 text-sky-700",
    dotColor: "bg-sky-500",
  },
  traite: {
    label: "Traité",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
    dotColor: "bg-emerald-500",
  },

  // Statuts contenus (programmes, actualités, etc.)
  publie: {
    label: "Publié",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
    dotColor: "bg-emerald-500",
  },
  actif: {
    label: "Actif",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
    dotColor: "bg-emerald-500",
  },
  inactif: {
    label: "Inactif",
    className: "border-border bg-secondary/80 text-muted-foreground",
    dotColor: "bg-muted-foreground",
  },
  brouillon: {
    label: "Brouillon",
    className: "border-border bg-secondary/80 text-muted-foreground",
    dotColor: "bg-muted-foreground",
  },
  previsualisation: {
    label: "En relecture",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-700",
    dotColor: "bg-amber-500",
  },
  archive: {
    label: "Archivé",
    className: "border-border bg-secondary/50 text-muted-foreground/80",
    dotColor: "bg-muted-foreground/60",
  },
  ferme: {
    label: "Clôturé",
    className: "border-rose-500/20 bg-rose-500/10 text-rose-700",
    dotColor: "bg-rose-500",
  },
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = STATUS_CONFIGS[status] || {
    label: label || status,
    className: "border-border bg-secondary text-foreground",
    dotColor: "bg-muted-foreground",
  }

  const displayText = label || config.label

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full shadow-2xs",
        config.className,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full shrink-0", config.dotColor)} aria-hidden />
      <span>{displayText}</span>
    </Badge>
  )
}
