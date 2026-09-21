import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Bricolage_Grotesque } from 'next/font/google'
import { QueryProvider } from '@/providers/query-provider'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import { siteConfig, contactInfo, socialLinks, branding } from '@/lib/config'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://casaimpact.org'),
  title: {
    default: 'Casa Impact — Trois Régions, Une vision, Un impact',
    template: '%s | Casa Impact',
  },
  description:
    "Casa Impact est une organisation engagée pour le développement durable et inclusif de la Casamance, fédérant les énergies positives de Ziguinchor, Sédhiou et Kolda au service de la jeunesse et des communautés.",
  keywords: [
    'Casa Impact',
    'Casamance',
    'Ziguinchor',
    'Sédhiou',
    'Kolda',
    'jeunesse',
    'entrepreneuriat',
    'développement territorial',
    'Sénégal',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Casa Impact',
    title: 'Casa Impact — Trois Régions, Une vision, Un impact',
    description:
      "Organisation engagée pour le développement durable et inclusif de la Casamance.",
    images: ['/assets/branding/logo-casa-impact.png'],
  },
  // Ajouté le 2026-09-14 ("aide moi pour le referencement seo") — sans
  // bloc `twitter` explicite, X/Twitter retombe sur un parsing OG
  // générique (ça marchait déjà, mais sans garantie de format "grande
  // image").
  twitter: {
    card: 'summary_large_image',
    title: 'Casa Impact — Trois Régions, Une vision, Un impact',
    description:
      "Organisation engagée pour le développement durable et inclusif de la Casamance.",
    images: ['/assets/branding/logo-casa-impact.png'],
  },
  // Les fichiers existent déjà dans /public (apple-icon.png, icon.svg,
  // icon-light/dark-32x32.png) mais n'étaient rattachés à AUCUNE balise
  // <link> — l'auto-détection de l'App Router ne fonctionne que pour des
  // fichiers placés dans /app, pas /public. On les référence ici
  // explicitement plutôt que de déplacer les fichiers.
  //
  // Ajout du 2026-09-14 ("que quand on fait la recherche de casa impact...
  // il s'affiche [l'arbre de la charte graphique]") : toutes les icônes
  // existantes étaient soit conditionnées à `prefers-color-scheme` (que
  // l'algorithme de favicon de Google ignore), soit un SVG (mal supporté
  // pour la miniature des résultats de recherche), soit trop petites (32px
  // — Google recommande un multiple de 48px). `arbre-couleur.png` (500×559,
  // non carré) a été recadré sur un canevas carré transparent puis décliné
  // en 48/96/192px pour servir d'icône par défaut, sans condition media —
  // c'est celle-là que Google affichera dans les résultats de recherche.
  icons: {
    icon: [
      { url: '/assets/branding/arbre-couleur-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/assets/branding/arbre-couleur-icon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/assets/branding/arbre-couleur-icon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-light-32x32.png', sizes: '32x32', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', sizes: '32x32', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: 'v0.app',
}

/**
 * Données structurées Organisation (schema.org, type NGO) — accord du
 * 2026-09-14 ("aide moi pour le referencement seo"). Injectées une seule
 * fois ici (racine) plutôt que par page : elles décrivent l'organisation
 * elle-même, pas un contenu particulier. Un `<script type="application/
 * ld+json">` est valide n'importe où dans le document, pas seulement dans
 * <head> — c'est le placement recommandé par Next.js pour le JSON-LD en
 * App Router.
 */
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}${branding.logo}`,
  description: siteConfig.description,
  email: contactInfo.email,
  telephone: contactInfo.phoneHref.replace('tel:', ''),
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${contactInfo.address.line1}, ${contactInfo.address.line2}`,
    addressLocality: contactInfo.address.city,
    addressCountry: 'SN',
  },
  areaServed: siteConfig.regions,
  sameAs: [
    socialLinks.linkedin,
    socialLinks.facebook,
    socialLinks.instagram,
    socialLinks.tiktok,
  ],
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#02542D',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${bricolage.variable} bg-background`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <QueryProvider>{children}</QueryProvider>
        {/* Désactivé le 2026-09-15 : Vercel Analytics ne fonctionne que sur
            l'infrastructure Vercel elle-même (le script /_vercel/insights/
            script.js n'existe pas ailleurs) — le site étant hébergé sur
            Hostinger, ça ne faisait qu'ajouter une erreur 404 sans
            conséquence dans la console à chaque visite. À réactiver si le
            site est un jour migré vers Vercel. */}
        {false && <Analytics />}
        {/* Ajouté le 2026-09-21 ("j'aimerai pour avoir l'analytique de mon
            site comment faire") : Google Analytics 4, chargé uniquement
            après consentement du visiteur via la bannière cookies (voir
            components/analytics/google-analytics.tsx). Ne fait rien tant que
            NEXT_PUBLIC_GA_MEASUREMENT_ID n'est pas configuré. */}
        <GoogleAnalytics />
      </body>
    </html>
  )
}
