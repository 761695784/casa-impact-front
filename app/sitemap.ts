import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/config"
import { contentService } from "@/lib/services/content.service"

/**
 * Toutes les pages statiques du site public (hors `/admin`, jamais
 * indexé — voir app/robots.ts). Les deux redirections `/pages/...` ne
 * sont pas listées : ce sont de simples alias vers `/mentions-legales`
 * et `/politique-de-confidentialite`, déjà présentes ci-dessous.
 */
const STATIC_ROUTES = [
  "",
  "/qui-sommes-nous",
  "/opportunites",
  "/talents",
  "/boutique",
  "/actualites",
  "/domaines",
  "/impact",
  "/carte",
  "/contact",
  "/adherer",
  "/partenaires",
  "/programmes",
  "/temoignages",
  "/mentions-legales",
  "/politique-de-confidentialite",
]

/**
 * Sitemap généré par Next.js App Router à /sitemap.xml (accord du
 * 2026-09-14 : "aide moi pour le referencement seo"). Le contenu
 * dynamique (articles, domaines, programmes, appels à candidatures,
 * profils de talents) est ajouté au meilleur effort : si le backend
 * Laravel est injoignable au moment de la génération, on se rabat
 * silencieusement sur les seules pages statiques plutôt que de faire
 * échouer /sitemap.xml entièrement — un sitemap partiel vaut mieux qu'un
 * sitemap absent.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }))

  const dynamicEntries: MetadataRoute.Sitemap = []

  try {
    const [news, domains, programs, calls, talents] = await Promise.all([
      contentService.listNews(),
      contentService.listDomains(),
      contentService.listPrograms(),
      contentService.listApplicationCalls(),
      contentService.listTalents(),
    ])

    dynamicEntries.push(
      ...news.map((n) => ({
        url: `${siteConfig.url}/actualites/${n.slug}`,
        lastModified: n.updated_at ? new Date(n.updated_at) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...domains.map((d) => ({
        url: `${siteConfig.url}/domaines/${d.slug}`,
        lastModified: d.updated_at ? new Date(d.updated_at) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...programs.map((p) => ({
        url: `${siteConfig.url}/programmes/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...calls.map((c) => ({
        url: `${siteConfig.url}/appels-a-candidatures/${c.slug}`,
        lastModified: c.updated_at ? new Date(c.updated_at) : undefined,
        changeFrequency: "weekly" as const,
        priority: 0.65,
      })),
      ...talents.map((t) => ({
        url: `${siteConfig.url}/talents/${t.slug}`,
        lastModified: t.updated_at ? new Date(t.updated_at) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
    )
  } catch {
    // Backend injoignable au moment de la génération — sitemap partiel
    // (pages statiques seulement), voir docblock ci-dessus.
  }

  return [...staticEntries, ...dynamicEntries]
}
