import type { Metadata } from "next"
import { ContactHero } from "@/components/contact/contact-hero"
import { ContactForm } from "@/components/contact/contact-form"
import { Section, SectionHeading } from "@/components/layout/section"
import { CtaBand } from "@/components/layout/cta-band"
import { LinkedinIcon, FacebookIcon, InstagramIcon, TiktokIcon } from "@/components/brand/social-icons"
import { contactInfo, socialLinks } from "@/lib/config"
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Contact — Échanger avec l'Équipe Casa Impact",
  description:
    "Contactez l'équipe de Casa Impact : information générale, partenariats, projets, investissement ou adhésion. Siège à Ziguinchor, au cœur de la Casamance.",
}

const socials = [
  { href: socialLinks.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  { href: socialLinks.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: socialLinks.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: socialLinks.tiktok, label: "TikTok", Icon: TiktokIcon },
]

const faqs = [
  {
    q: "Comment soumettre un projet pour accompagnement ?",
    a: "Vous pouvez nous écrire via le formulaire ci-dessous en sélectionnant l'objet « Projet » ou répondre directement à l'un de nos appels à candidatures ouverts dans la rubrique Opportunités.",
  },
  {
    q: "Comment devenir partenaire technique ou financier ?",
    a: "Sélectionnez l'objet « Partenariat » ou « Investissement ». Notre bureau exécutif et notre pôle partenariats planifieront une session d'échange pour étudier les synergies d'impact.",
  },
  {
    q: "Où se situent vos représentations régionales ?",
    a: "Notre siège central est établi à Ziguinchor (Rue 26 Boukot Ouest, Villa n°268). Des coordinateurs régionaux permanents animent également les activités à Kolda et Sédhiou.",
  },
]

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/221781033063?text=${encodeURIComponent(
    "Bonjour Casa Impact, je souhaite échanger avec votre équipe concernant une opportunité / demande d'information."
  )}`

  return (
    <>
      {/* Immersive Photo Hero */}
      <ContactHero
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Contact" },
        ]}
      />

      {/* Main Contact Section */}
      <Section className="py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16 items-start">
          
          {/* Left: Contact Info & Channels */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                Nos Coordonnées
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold text-foreground">
                Toujours ravis d'échanger avec vous
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Que vous soyez un jeune porteur de projet, une entreprise, une institution ou un membre de la diaspora, nos portes sont grandes ouvertes.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-forest text-white shadow-sm">
                  <Mail className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Courrier Électronique
                  </p>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="mt-1 block font-display text-base font-bold text-foreground hover:text-primary transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                  <p className="mt-0.5 text-xs text-muted-foreground">Réponse assurée sous 24 à 48h</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-sm">
                  <Phone className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Téléphone & Ligne Directe
                  </p>
                  <a
                    href={contactInfo.phoneHref}
                    className="mt-1 block font-display text-base font-bold text-foreground hover:text-primary transition-colors"
                  >
                    +221 {contactInfo.phone}
                  </a>
                  <p className="mt-0.5 text-xs text-muted-foreground">Du Lundi au Samedi de 8h à 19h</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-earth text-white shadow-sm">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Siège de l'Organisation
                  </p>
                  <p className="mt-1 font-display text-base font-bold text-foreground">
                    {contactInfo.address.line1}, {contactInfo.address.line2}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{contactInfo.address.city}</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Direct Action Button */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <MessageCircle className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    Échange Instantané
                  </p>
                  <p className="text-xs text-muted-foreground">Discutez directement avec notre secrétariat</p>
                </div>
              </div>
              <Button
                asChild
                className="mt-4 w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  <MessageCircle className="size-4" />
                  Ouvrir WhatsApp (+221 {contactInfo.phone})
                </a>
              </Button>
            </div>

            {/* Social Media Channels */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Rejoignez nos réseaux sociaux
              </p>
              <div className="mt-3 flex items-center gap-3">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-11 items-center justify-center rounded-2xl border border-border bg-card text-foreground shadow-sm transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground hover:scale-105"
                  >
                    <Icon className="size-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div>
            <ContactForm />
          </div>

        </div>
      </Section>

      {/* Frequently Asked Questions */}
      <Section tone="muted" className="py-20">
        <SectionHeading
          eyebrow="Besoin d'aide rapide ?"
          title="Questions Fréquentes"
          description="Quelques réponses immédiates aux demandes les plus récurrentes."
          align="center"
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-3xl border border-border bg-background p-7 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HelpCircle className="size-5" />
              </div>
              <h3 className="mt-5 font-display text-base font-bold text-foreground">
                {faq.q}
              </h3>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Final CTA Band */}
      <CtaBand
        title="Vous souhaitez nous rejoindre comme membre actif ?"
        description="Obtenez votre carte officielle de membre (1 000 FCFA) et participez directement à toutes nos actions."
        primary={{ label: "Adhérer à Casa Impact", href: "/adherer" }}
        secondary={{ label: "Découvrir nos talents", href: "/talents" }}
      />
    </>
  )
}
