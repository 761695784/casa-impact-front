"use client"

import Link from "next/link"
import { ArrowLeft, MapPin, Tag, LayoutGrid } from "lucide-react"
import { useProgram } from "@/hooks/use-content"
import { Section } from "@/components/layout/section"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { RegionBadge } from "@/components/cards/region-badge"

export function ProgramDetail({ slug }: { slug: string }) {
  const { data: program, isLoading, isError } = useProgram(slug)

  if (isLoading) {
    return (
      <Section>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-6 h-10 w-2/3" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
      </Section>
    )
  }

  if (isError || !program) {
    return (
      <Section>
        <EmptyState
          title="Programme introuvable"
          description="Ce programme n'existe pas ou n'est plus disponible."
          action={<Button render={<Link href="/programmes" />}>Retour aux programmes</Button>}
        />
      </Section>
    )
  }

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <Link
            href="/programmes"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Tous les programmes
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {program.region ? <RegionBadge region={program.region} /> : null}
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold text-foreground text-balance sm:text-4xl">
            {program.titre}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">
            {program.resume}
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          <div className="max-w-2xl">
            <p className="text-base leading-relaxed text-foreground/90 text-pretty">{program.description}</p>
          </div>
          <aside className="h-fit rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-base font-semibold text-foreground">Informations</h2>
            <dl className="mt-4 space-y-4 text-sm">
              {program.type ? (
                <InfoRow icon={<Tag className="size-4" />} label="Type" value={program.type.nom} />
              ) : null}
              {program.domaine ? (
                <InfoRow icon={<LayoutGrid className="size-4" />} label="Domaine" value={program.domaine.nom} />
              ) : null}
              {program.localisation ? (
                <InfoRow icon={<MapPin className="size-4" />} label="Localisation" value={program.localisation} />
              ) : null}
            </dl>
            <Button className="mt-6 w-full" render={<Link href="/opportunites" />}>
              Voir les opportunités
            </Button>
          </aside>
        </div>
      </Section>
    </>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-primary">{icon}</span>
      <div>
        <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
        <dd className="font-medium text-foreground">{value}</dd>
      </div>
    </div>
  )
}
