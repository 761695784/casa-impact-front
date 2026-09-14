import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/config"

/**
 * Généré par Next.js App Router à /robots.txt (accord du 2026-09-14 :
 * "aide moi pour le referencement seo"). `/admin` (panneau d'administration,
 * jamais destiné à être indexé) est explicitement exclu ; tout le reste du
 * site public est autorisé.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
