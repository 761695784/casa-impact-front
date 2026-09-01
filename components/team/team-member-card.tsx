"use client"

import Image from "next/image"
import { MapPin, User, Phone } from "lucide-react"
import { BaobabMark } from "@/components/brand/baobab-mark"
import type { TeamMember } from "@/types/team"

const regionColors: Record<string, string> = {
  Ziguinchor: "bg-forest/90 text-white border-forest/30",
  Kolda: "bg-accent text-accent-foreground border-accent/40 font-bold",
  Sédhiou: "bg-earth text-white border-earth/30",
}

export function TeamMemberCard({
  member,
  featured = false,
}: {
  member: TeamMember
  featured?: boolean
}) {
  const hasRealPhoto = member.image && !member.image.includes("placeholder")

  return (
    <figure
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg ${
        featured ? "border-primary/30 ring-1 ring-primary/20" : ""
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-secondary/80 to-secondary">
        {hasRealPhoto ? (
          <Image
            src={member.image!}
            alt={`Portrait de ${member.nom}, ${member.fonction}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
              <BaobabMark size={36} variant="color" />
            </div>
            <p className="mt-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Membre Exécutif
            </p>
          </div>
        )}

        {/* Region Badge Pill */}
        {member.region && (
          <span
            className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md shadow-sm border ${
              regionColors[member.region] || "bg-background/90 text-foreground"
            }`}
          >
            <MapPin className="size-3" />
            {member.region}
          </span>
        )}

        {/* Featured Tag for Presidency */}
        {featured && (
          <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground shadow-sm">
            Direction
          </span>
        )}
      </div>

      {/* Card Info */}
      <figcaption className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <h3 className="text-pretty font-display text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
            {member.nom}
          </h3>
          <p className="mt-1 text-xs sm:text-sm leading-snug text-muted-foreground">
            {member.fonction}
          </p>
        </div>

        {member.pole && (
          <div className="mt-3 pt-2.5 border-t border-border/60">
            <span className="inline-block rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              {member.pole}
            </span>
          </div>
        )}

        {member.telephone && (
          <div className="mt-3 pt-2.5 border-t border-border/60">
            <a
              href={`tel:${member.telephone.replace(/[^+\d]/g, "")}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-forest transition-colors"
              title={`Appeler ${member.nom} (${member.region || ""})`}
            >
              <Phone className="size-3.5 text-forest" />
              <span>{member.telephone}</span>
            </a>
          </div>
        )}
      </figcaption>
    </figure>
  )
}
