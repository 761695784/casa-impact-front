import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Bricolage_Grotesque } from 'next/font/google'
import { QueryProvider } from '@/providers/query-provider'
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
  generator: 'v0.app',
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
        <QueryProvider>{children}</QueryProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
