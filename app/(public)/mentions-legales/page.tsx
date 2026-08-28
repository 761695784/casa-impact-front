import type { Metadata } from "next"
import Link from "next/link"
import {
  ShieldCheck,
  Building2,
  Cpu,
  Copyright,
  FileCheck2,
  Scale,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Lock,
} from "lucide-react"
import { Section } from "@/components/layout/section"
import { siteConfig, contactInfo } from "@/lib/config"

export const metadata: Metadata = {
  title: "Mentions Légales | Casa Impact",
  description:
    "Consultez les mentions légales de l'organisation Casa Impact : éditeur, hébergement, conception par Majeli Connect, propriété intellectuelle et conditions d'utilisation.",
}

const SECTIONS = [
  { id: "editeur", title: "1. Éditeur de la plateforme" },
  { id: "conception", title: "2. Conception & Hébergement" },
  { id: "propriete", title: "3. Propriété intellectuelle" },
  { id: "cgu", title: "4. Conditions d'utilisation" },
  { id: "donnees", title: "5. Données personnelles" },
  { id: "juridiction", title: "6. Droit applicable & Litiges" },
  { id: "contact", title: "7. Contact légal" },
]

export default function MentionsLegalesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-forest/15 via-background to-background py-16 md:py-24 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Accueil
            </Link>
            <ChevronRight className="size-3.5 opacity-60" />
            <span className="text-foreground">Mentions Légales</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-forest/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-forest">
            <ShieldCheck className="size-3.5" />
            <span>Transparence & Cadre Juridique</span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Mentions Légales
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Informations légales, droits d'auteur, responsabilités et conditions régissant l'utilisation de la plateforme officielle de <strong>Casa Impact</strong>.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span>Dernière mise à jour : <strong>Août 2026</strong></span>
            <span>•</span>
            <span>Version conforme à la réglementation sénégalaise</span>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <Section className="py-12 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          
          {/* Table of Contents (Sticky Sidebar) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-primary">
                <FileCheck2 className="size-4" />
                <span>Sommaire</span>
              </h2>
              <ul className="mt-4 space-y-2 text-sm">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block rounded-xl px-3 py-2 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground font-medium"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl bg-secondary/60 p-4 text-xs text-muted-foreground border border-border">
                <p className="font-semibold text-foreground">Besoin d'un renseignement ?</p>
                <p className="mt-1">
                  Notre équipe est joignable pour toute question relative aux mentions légales.
                </p>
                <Link
                  href="/contact"
                  className="mt-3 inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
                >
                  <span>Nous contacter</span>
                  <ChevronRight className="size-3" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Legal Articles */}
          <div className="space-y-12 lg:col-span-8">
            
            {/* 1. Éditeur */}
            <article id="editeur" className="scroll-mt-32 rounded-3xl border border-border bg-card p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-forest/10 text-forest">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-forest">Article 1</span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    Éditeur de la plateforme
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-foreground/85">
                <p>
                  Le présent site web <strong>casaimpact.org</strong> est édité par l'organisation <strong>Casa Impact</strong>, mouvement citoyen et associatif œuvrant pour le développement socio-économique, culturel et entrepreneurial des trois régions de la Casamance (Ziguinchor, Sédhiou, Kolda).
                </p>

                <div className="grid gap-3 rounded-2xl border border-border/80 bg-secondary/40 p-5 text-sm">
                  <div className="flex items-start gap-2.5">
                    <Building2 className="size-4 shrink-0 text-primary mt-0.5" />
                    <span><strong>Dénomination :</strong> Casa Impact</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="size-4 shrink-0 text-primary mt-0.5" />
                    <span><strong>Siège social :</strong> {contactInfo.address.line1}, {contactInfo.address.line2}, {contactInfo.address.city}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Mail className="size-4 shrink-0 text-primary mt-0.5" />
                    <span><strong>Courriel de contact :</strong> <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline">{contactInfo.email}</a></span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Phone className="size-4 shrink-0 text-primary mt-0.5" />
                    <span><strong>Téléphone :</strong> <a href={contactInfo.phoneHref} className="text-primary hover:underline">{contactInfo.phone}</a></span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="size-4 shrink-0 text-primary mt-0.5" />
                    <span><strong>Direction de la publication :</strong> Présidence de l'organisation Casa Impact</span>
                  </div>
                </div>
              </div>
            </article>

            {/* 2. Conception & Hébergement */}
            <article id="conception" className="scroll-mt-32 rounded-3xl border border-border bg-card p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent/20 text-accent-foreground">
                  <Cpu className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-accent-foreground">Article 2</span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    Conception technique & Hébergement
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-foreground/85">
                <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
                  <p className="font-semibold text-foreground">Conception, Développement & Design :</p>
                  <p className="mt-1">
                    La conception graphique, l'architecture technologique et le développement de la plateforme ont été réalisés par l'agence technologique <strong>Majeli Connect</strong>.
                  </p>
                  <a
                    href="https://majeliconnect.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 font-semibold text-accent-foreground hover:underline"
                  >
                    <span>Visiter le site officiel de Majeli Connect (majeliconnect.com)</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>

                <div className="rounded-2xl border border-border bg-secondary/40 p-5">
                  <p className="font-semibold text-foreground">Hébergement & Infrastructure :</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    La plateforme est hébergée sur des infrastructures cloud haute disponibilité assurant un chiffrement complet des données en transit (HTTPS / SSL/TLS) et une continuité de service conforme aux normes internationales de sécurité.
                  </p>
                </div>
              </div>
            </article>

            {/* 3. Propriété intellectuelle */}
            <article id="propriete" className="scroll-mt-32 rounded-3xl border border-border bg-card p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-earth/15 text-earth">
                  <Copyright className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-earth">Article 3</span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    Propriété intellectuelle
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-foreground/85">
                <p>
                  L'ensemble des éléments constituant le site <strong>casaimpact.org</strong> (notamment les textes, logos, emblèmes dont le <em>Baobab stylisé Casa Impact</em>, photographies du territoire casamançais, vidéos, chartes graphiques, icônes, animations et bases de données) est la propriété exclusive de <strong>Casa Impact</strong> ou fait l'objet d'une autorisation d'utilisation régulière.
                </p>
                <p>
                  Toute reproduction, représentation, modification, publication, adaptation totale ou partielle des éléments du site, quel que soit le moyen ou le procédé utilisé, est strictement interdite sans autorisation écrite préalable de la direction de Casa Impact.
                </p>
              </div>
            </article>

            {/* 4. Conditions Générales d'Utilisation */}
            <article id="cgu" className="scroll-mt-32 rounded-3xl border border-border bg-card p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-forest/10 text-forest">
                  <FileCheck2 className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-forest">Article 4</span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    Conditions Générales d'Utilisation
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-foreground/85">
                <p>
                  L'accès au site est gratuit pour tout utilisateur disposant d'un accès à Internet. L'utilisateur s'engage à utiliser la plateforme dans le respect des lois en vigueur au Sénégal et des principes de bienveillance communautaire.
                </p>
                <p>
                  Casa Impact s'efforce de fournir sur son site des informations aussi précises que possible. Toutefois, l'organisation ne saurait être tenue responsable des omissions, inexactitudes ou retards dans la mise à jour des appels à projets ou des actualités.
                </p>
              </div>
            </article>

            {/* 5. Données personnelles */}
            <article id="donnees" className="scroll-mt-32 rounded-3xl border border-border bg-card p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Lock className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Article 5</span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    Données personnelles & Confidentialité
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-foreground/85">
                <p>
                  Les informations recueillies via les formulaires d'adhésion, de contact et d'appels à candidatures font l'objet d'un traitement informatique destiné à la gestion des membres et au suivi des cohortes.
                </p>
                <p>
                  Pour consulter en détail vos droits d'accès, de rectification et de suppression conformément à la <strong>Loi sénégalaise n° 2008-12</strong>, veuillez vous référer à notre politique dédiée.
                </p>
                <div className="pt-2">
                  <Link
                    href="/politique-de-confidentialite"
                    className="inline-flex items-center gap-2 font-bold text-primary hover:underline"
                  >
                    <span>Consulter la Politique de Confidentialité</span>
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              </div>
            </article>

            {/* 6. Juridiction */}
            <article id="juridiction" className="scroll-mt-32 rounded-3xl border border-border bg-card p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-earth/15 text-earth">
                  <Scale className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-earth">Article 6</span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    Droit applicable & Règlement des litiges
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-foreground/85">
                <p>
                  Tout litige en relation avec l'utilisation du site <strong>casaimpact.org</strong> est soumis au <strong>droit sénégalais</strong>.
                </p>
                <p>
                  En cas de différend non résolu à l'amiable, attribution exclusive de juridiction est faite aux tribunaux compétents du ressort de <strong>Ziguinchor</strong>.
                </p>
              </div>
            </article>

            {/* 7. Contact légal */}
            <article id="contact" className="scroll-mt-32 rounded-3xl border border-forest/30 bg-forest/5 p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-forest text-white">
                  <Mail className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-forest">Article 7</span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    Contact Légal & Notifications
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm sm:text-base leading-relaxed text-foreground/85">
                <p>
                  Pour toute notification légale ou signalement de contenu illicite, vous pouvez écrire à notre secrétariat général :
                </p>
                <p className="font-medium text-forest">
                  Courriel : <a href={`mailto:${contactInfo.email}`} className="underline">{contactInfo.email}</a>
                </p>
                <p className="text-sm text-muted-foreground">
                  Adresse postale : {siteConfig.name}, {contactInfo.address.line1}, {contactInfo.address.line2}, {contactInfo.address.city}.
                </p>
              </div>
            </article>

          </div>

        </div>
      </Section>
    </div>
  )
}
