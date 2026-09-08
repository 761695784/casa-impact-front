/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Les médias de la Médiathèque sont servis par le backend Laravel
    // (Storage::disk('public')->url(...)), sur une origine et un port qui
    // peuvent varier selon la config locale de chaque poste (APP_URL) et
    // qui pointent vers localhost/127.0.0.1 en développement. L'optimiseur
    // d'images intégré de Next.js refuse par défaut ces deux cas — origine
    // externe non déclarée (remotePatterns) et IP privée (protection
    // anti-SSRF) — ce qui casse le rendu au lieu de simplement dégrader
    // l'image. Comme le backend n'est pas sous notre contrôle depuis ce
    // dépôt, on désactive l'optimisation plutôt que de recourir à des
    // règles d'hôte fragiles : les images sont alors chargées telles
    // quelles par le navigateur (même comportement qu'une balise <img>
    // classique), pour toute origine.
    unoptimized: true,
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
