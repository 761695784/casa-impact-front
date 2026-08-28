import type { Metadata } from "next"
import Link from "next/link"
import {
  Lock,
  ShieldCheck,
  UserCheck,
  Database,
  Eye,
  Trash2,
  Bell,
  Mail,
  ChevronRight,
  Sparkles,
  FileText,
  KeyRound,
  CheckCircle2,
} from "lucide-react"
import { Section } from "@/components/layout/section"
import { siteConfig, contactInfo } from "@/lib/config"

export const metadata: Metadata = {
  title: "Politique de Confidentialité | Casa Impact",
  description:
    "Découvrez notre politique de protection des données personnelles, conforme à la loi sénégalaise n° 2008-12 et aux exigences de la CDP.",
}

const PRIVACY_SECTIONS = [
  { id: "engagement", title: "1. Notre engagement & Cadre légal" },
  { id: "collecte", title: "2. Données collectées" },
  { id: "finalites", title: "3. Finalités des traitements" },
  { id: "destinataires", title: "4. Destinataires & Non-cession" },
  { id: "conservation", title: "5. Durée de conservation" },
  { id: "securite", title: "6. Sécurité des données" },
  { id: "droits", title: "7. Vos droits & Recours CDP" },
  { id: "cookies", title: "8. Cookies & Navigation" },
  { id: "dpo", title: "9. Exercer vos droits" },
]

export default function PolitiqueConfidentialitePage() {
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
            <span className="text-foreground">Politique de Confidentialité</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-forest/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-forest">
            <Lock className="size-3.5" />
            <span>Protection des Données • Loi n° 2008-12 (Sénégal)</span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Politique de Confidentialité
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            La protection de vos données personnelles et de votre vie privée est au cœur de la relation de confiance que <strong>Casa Impact</strong> bâtit avec sa communauté en Casamance et dans le monde.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span>Dernière mise à jour : <strong>Août 2026</strong></span>
            <span>•</span>
            <span>Régie par la Commission des Données Personnelles du Sénégal (CDP)</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <Section className="py-12 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          
          {/* Table of Contents (Sticky Sidebar) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-primary">
                <ShieldCheck className="size-4" />
                <span>Sommaire</span>
              </h2>
              <ul className="mt-4 space-y-2 text-sm">
                {PRIVACY_SECTIONS.map((s) => (
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
                <p className="font-semibold text-foreground">Délégué aux données :</p>
                <p className="mt-1">
                  Pour toute demande de rectification ou d'effacement de vos informations :
                </p>
                <a
                  href={`mailto:${contactInfo.email}?subject=Demande%20protection%20donnees%20Casa%20Impact`}
                  className="mt-3 inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
                >
                  <span>{contactInfo.email}</span>
                  <ChevronRight className="size-3" />
                </a>
              </div>
            </div>
          </aside>

          {/* Privacy Articles */}
          <div className="space-y-12 lg:col-span-8">
            
            {/* 1. Engagement & Cadre */}
            <article id="engagement" className="scroll-mt-32 rounded-3xl border border-border bg-card p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-forest/10 text-forest">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-forest">Article 1</span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    Notre engagement & Cadre légal
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-foreground/85">
                <p>
                  L'organisation <strong>Casa Impact</strong> s'engage à traiter l'ensemble des données à caractère personnel dans le strict respect de la <strong>Loi sénégalaise n° 2008-12 du 25 janvier 2008</strong> portant sur la protection des données à caractère personnel, sous l'égide de la <strong>Commission des Données Personnelles du Sénégal (CDP)</strong>.
                </p>
                <p>
                  Cette politique s'applique à tous les utilisateurs du site web <em>casaimpact.org</em>, qu'il s'agisse des membres adhérents, des candidats aux programmes d'incubation, des talents recommandés, des partenaires ou des simples visiteurs.
                </p>
              </div>
            </article>

            {/* 2. Données collectées */}
            <article id="collecte" className="scroll-mt-32 rounded-3xl border border-border bg-card p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent/20 text-accent-foreground">
                  <Database className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-accent-foreground">Article 2</span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    Les données que nous collectons
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-foreground/85">
                <p>Nous collectons uniquement les informations strictement nécessaires à nos missions d'intérêt général :</p>
                
                <div className="space-y-3">
                  <div className="rounded-2xl border border-border/80 bg-secondary/40 p-4">
                    <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                      <UserCheck className="size-4 text-primary" />
                      <span>Formulaire d'adhésion (Carte Membre) :</span>
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Nom complet, adresse e-mail, numéro de téléphone / WhatsApp, région de rattachement (Ziguinchor, Kolda, Sédhiou ou Diaspora), profession ou domaine d'activité, et type d'engagement souhaité.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-secondary/40 p-4">
                    <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                      <FileText className="size-4 text-primary" />
                      <span>Appels à candidatures & Programmes :</span>
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Données de profil, parcours professionnel ou académique, présentation du projet ou de l'entreprise, CV et pièces justificatives requises pour l'instruction par le comité de sélection.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-secondary/40 p-4">
                    <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                      <Mail className="size-4 text-primary" />
                      <span>Formulaire de contact & Partenariats :</span>
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Identité, organisme ou structure, coordonnées de contact, catégorie de la demande et message transmis.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* 3. Finalités */}
            <article id="finalites" className="scroll-mt-32 rounded-3xl border border-border bg-card p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-forest/10 text-forest">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-forest">Article 3</span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    Finalités des traitements
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-foreground/85">
                <p>Vos données sont exclusivement utilisées pour les finalités suivantes :</p>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="size-4 shrink-0 text-primary mt-1" />
                    <span><strong>Émission de la carte de membre :</strong> Création de la carte personnalisée et confirmation d'adhésion.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="size-4 shrink-0 text-primary mt-1" />
                    <span><strong>Intégration au réseau :</strong> Ajout au groupe WhatsApp officiel et mise en réseau avec les cellules régionales.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="size-4 shrink-0 text-primary mt-1" />
                    <span><strong>Instruction des candidatures :</strong> Évaluation des dossiers pour les incubateurs, cohortes et bourses de formation.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="size-4 shrink-0 text-primary mt-1" />
                    <span><strong>Communication associative :</strong> Envoi des actualités, invitations aux événements et opportunités exclusives.</span>
                  </li>
                </ul>
              </div>
            </article>

            {/* 4. Destinataires */}
            <article id="destinataires" className="scroll-mt-32 rounded-3xl border border-border bg-card p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-earth/15 text-earth">
                  <Eye className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-earth">Article 4</span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    Destinataires & Non-cession des données
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-foreground/85">
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                  <p className="font-bold text-foreground">Principe fondamental : Aucune commercialisation</p>
                  <p className="mt-2 text-sm text-foreground/85">
                    <strong>Casa Impact ne vend, ne loue et ne cède aucune donnée personnelle</strong> à des tiers ou des régies publicitaires. Vos données demeurent strictement confidentielles.
                  </p>
                </div>
                <p>
                  Les seuls destinataires autorisés sont les membres dûment habilités de l'équipe de coordination de Casa Impact et, le cas échéant, les membres des jurys d'évaluation dans le strict cadre d'un appel à projets auquel vous avez postulé.
                </p>
              </div>
            </article>

            {/* 5. Conservation */}
            <article id="conservation" className="scroll-mt-32 rounded-3xl border border-border bg-card p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Trash2 className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Article 5</span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    Durée de conservation
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm sm:text-base leading-relaxed text-foreground/85">
                <p>
                  • <strong>Données des membres adhérents :</strong> Conservées pendant toute la durée de validité de l'adhésion, puis archivées pendant une durée de 3 ans après la fin du lien associatif.
                </p>
                <p>
                  • <strong>Données des candidats aux programmes :</strong> Conservées pendant la durée de la cohorte et du suivi d'impact (maximum 2 ans pour les dossiers non retenus).
                </p>
                <p>
                  • <strong>Messages de contact :</strong> Conservés pendant le temps nécessaire au traitement complet de votre requête.
                </p>
              </div>
            </article>

            {/* 6. Sécurité */}
            <article id="securite" className="scroll-mt-32 rounded-3xl border border-border bg-card p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-forest/10 text-forest">
                  <KeyRound className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-forest">Article 6</span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    Sécurité des informations
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-foreground/85">
                <p>
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour garantir la sécurité et l'intégrité de vos données contre tout accès non autorisé, altération ou perte :
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Protocole de chiffrement SSL/TLS (HTTPS) sur l'ensemble de la plateforme.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Bases de données sécurisées avec contrôle d'accès strict par double authentification.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-forest shrink-0" />
                    <span>Sensibilisation continue de nos équipes aux bonnes pratiques de confidentialité.</span>
                  </li>
                </ul>
              </div>
            </article>

            {/* 7. Vos Droits & CDP */}
            <article id="droits" className="scroll-mt-32 rounded-3xl border border-border bg-card p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent/20 text-accent-foreground">
                  <Bell className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-accent-foreground">Article 7</span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    Vos droits & Recours légal
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-foreground/85">
                <p>
                  Conformément à la législation en vigueur, vous disposez des droits suivants sur vos données personnelles :
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                    <p className="font-bold text-foreground text-sm">Droit d'accès</p>
                    <p className="mt-1 text-xs text-muted-foreground">Obtenir la confirmation et la copie des données détenues sur vous.</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                    <p className="font-bold text-foreground text-sm">Droit de rectification</p>
                    <p className="mt-1 text-xs text-muted-foreground">Faire corriger toute donnée inexacte ou incomplète.</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                    <p className="font-bold text-foreground text-sm">Droit de suppression</p>
                    <p className="mt-1 text-xs text-muted-foreground">Demander l'effacement de vos informations de nos registres.</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                    <p className="font-bold text-foreground text-sm">Droit d'opposition</p>
                    <p className="mt-1 text-xs text-muted-foreground">Vous opposer à tout moment à l'envoi de nos communications.</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-border bg-secondary/50 p-4 text-xs text-muted-foreground">
                  <p>
                    Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la <strong>Commission des Données Personnelles du Sénégal (CDP)</strong> sur <a href="https://cdp.sn" target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline">cdp.sn</a>.
                  </p>
                </div>
              </div>
            </article>

            {/* 8. Cookies */}
            <article id="cookies" className="scroll-mt-32 rounded-3xl border border-border bg-card p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-earth/15 text-earth">
                  <Database className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-earth">Article 8</span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    Cookies & Traceurs
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm sm:text-base leading-relaxed text-foreground/85">
                <p>
                  Le site <strong>casaimpact.org</strong> utilise uniquement des cookies techniques strictement nécessaires à son bon fonctionnement, à la sécurité et à la fluidité de la navigation.
                </p>
                <p>
                  Aucun cookie de traçage publicitaire tiers n'est déposé sans votre consentement exprès.
                </p>
              </div>
            </article>

            {/* 9. Exercer vos droits */}
            <article id="dpo" className="scroll-mt-32 rounded-3xl border border-forest/30 bg-forest/5 p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-forest text-white">
                  <Mail className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-forest">Article 9</span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    Comment exercer vos droits ?
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-foreground/85">
                <p>
                  Pour exercer l'un de vos droits ou pour toute question relative à la protection de vos données, il vous suffit de nous adresser une demande par courrier électronique :
                </p>
                <div className="rounded-2xl bg-background/80 p-5 border border-forest/20">
                  <p className="font-bold text-forest">Pôle Protection des Données — Casa Impact</p>
                  <p className="mt-1">
                    Courriel : <a href={`mailto:${contactInfo.email}?subject=Exercice%20de%20droit%20donnees%20personnelles`} className="font-semibold text-primary underline">{contactInfo.email}</a>
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Nous nous engageons à vous répondre dans un délai maximum de 30 jours à compter de la réception de votre demande.
                  </p>
                </div>
              </div>
            </article>

          </div>

        </div>
      </Section>
    </div>
  )
}
