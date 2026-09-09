// Les médias de la Médiathèque sont servis par le backend Laravel
// (Storage::disk('public')->url(...)). `lib/format.ts::resolveMediaUrl`
// reconstruit systématiquement leur URL en préfixant le chemin
// `/storage/...` par `NEXT_PUBLIC_API_URL` (voir ce fichier pour le
// détail) — donc toute image de la Médiathèque affichée par le site
// arrive TOUJOURS sur cette origine exacte, jamais une autre. On peut
// donc la déclarer précisément à l'optimiseur d'images de Next.js plutôt
// que de le désactiver entièrement (ce qui pénalisait le temps de
// chargement : chaque logo/photo était alors téléchargé en pleine
// résolution, sans redimensionnement ni mise en cache).
const mediaRemotePatterns = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
    pathname: "/**",
  },
]
try {
  const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL || "")
  mediaRemotePatterns.push({
    protocol: apiUrl.protocol.replace(":", ""),
    hostname: apiUrl.hostname,
    port: apiUrl.port || "",
    pathname: "/storage/**",
  })
} catch {
  // NEXT_PUBLIC_API_URL absent/invalide au moment de la config
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: mediaRemotePatterns,
    // Le backend tourne en local (localhost/127.0.0.1) en développement —
    // une IP privée que l'optimiseur refuse de contacter par défaut
    // (protection anti-SSRF), même quand l'origine est explicitement
    // déclarée ci-dessus via remotePatterns. Sans risque ici : la seule
    // origine autorisée est celle de notre propre API, jamais une URL
    // fournie par un tiers.
    dangerouslyAllowLocalIP: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  },
}

export default nextConfig
