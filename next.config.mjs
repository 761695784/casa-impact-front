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
  // Note 2026-09-15 : l'hébergement de production ne dispose pas des
  // liaisons natives Turbopack pour Linux (GLIBC trop ancienne). La bascule
  // vers Webpack se fait uniquement via `next build --webpack` dans le
  // script `build` de package.json — `experimental.turbopack` a été
  // essayé ici mais Next.js 16.3.3 le rejette avec un avertissement
  // ("Unrecognized key(s) in object: 'turbopack' at experimental" — ce
  // n'est pas une option reconnue), donc retiré. Le build passe déjà par le
  // flag CLI, aucune configuration supplémentaire n'est nécessaire ; si un
  // jour l'hébergeur ignore le script `build` de package.json et lance
  // `next build` directement, il faudra le configurer pour utiliser
  // `npm run build` (ou passer `--webpack` explicitement côté hébergeur).
  images: {
    remotePatterns: mediaRemotePatterns,
    // Le backend tourne en local (localhost/127.0.0.1) en développement —
    // une IP privée que l'optimiseur refuse de contacter par défaut
    // (protection anti-SSRF), même quand l'origine est explicitement
    // déclarée ci-dessus via remotePatterns. Sans risque ici : la seule
    // origine autorisée est celle de notre propre API, jamais une URL
    // fournie par un tiers.
    dangerouslyAllowLocalIP: true,
    // Ajouté le 2026-09-15 : en production sur Hostinger, `/_next/image`
    // échouait en 400 même pour les images locales de /public (ex.
    // photos de l'équipe sur /qui-sommes-nous), alors que ça fonctionnait
    // en local. Cause la plus probable : l'optimiseur d'images intégré de
    // Next.js dépend du paquet natif `sharp`, absent de package.json —
    // et vu le souci GLIBC déjà rencontré avec les liaisons natives de
    // Turbopack sur cet hébergeur, l'ajouter risquait de reproduire le
    // même genre de plantage plutôt que de le résoudre à coup sûr. On
    // désactive donc l'optimisation à la volée : les images sont servies
    // telles quelles (un peu plus lourdes, mais l'affichage est garanti
    // sur n'importe quel hébergeur, sans dépendance native). `remotePatterns`
    // ci-dessus reste en place, prêt à resservir si l'optimisation est un
    // jour réactivée (ex. paquet `sharp` ajouté et confirmé fonctionnel).
    unoptimized: false,
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
