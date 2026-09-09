"use client"

/**
 * Compression/conversion d'image côté navigateur, avant upload.
 *
 * Les photos issues d'un smartphone ou d'un appareil photo récent pèsent
 * couramment 10 à 25 Mo pour 6000x4000px+ — inutilement lourd pour un
 * usage web, et surtout au-dessus de la limite de taille acceptée par
 * l'API (`StoreMediaRequest::fichier`), ce qui provoquait un échec 422
 * silencieux à l'import ("ça ne passe pas") sans qu'aucune conversion ne
 * soit jamais tentée. On convertit ici en WebP (bien meilleur ratio poids/
 * qualité que JPEG/PNG à qualité visuelle égale) et on redimensionne à une
 * dimension maximale raisonnable pour le web, avant même que le fichier
 * ne quitte le navigateur.
 *
 * Best-effort : les fichiers non-image (PDF...), les SVG (la rasterisation
 * leur ferait perdre leur caractère vectoriel) et tout échec de
 * compression (navigateur sans support Canvas/WebP, etc.) renvoient le
 * fichier ORIGINAL inchangé — on ne bloque jamais un import pour une
 * limitation technique du navigateur ; au pire il reste plus lourd que
 * l'optimal et retombe sur la limite serveur (voir StoreMediaRequest,
 * relevée à 10 Mo pour absorber ce cas de repli).
 */
export interface CompressImageOptions {
  /** Plus grande dimension (largeur ou hauteur) autorisée après compression. */
  maxDimension?: number
  /** Qualité WebP, de 0 à 1. */
  quality?: number
}

const DEFAULT_MAX_DIMENSION = 2500
const DEFAULT_QUALITY = 0.82

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("Impossible de décoder l'image"))
    img.src = src
  })
}

export async function compressImageToWebP(
  file: File,
  options: CompressImageOptions = {}
): Promise<File> {
  if (!file.type.startsWith("image/")) return file
  if (file.type === "image/svg+xml") return file
  if (typeof document === "undefined") return file

  const { maxDimension = DEFAULT_MAX_DIMENSION, quality = DEFAULT_QUALITY } = options

  let objectUrl: string | null = null
  try {
    objectUrl = URL.createObjectURL(file)
    const img = await loadImage(objectUrl)

    let { naturalWidth: width, naturalHeight: height } = img
    if (width <= 0 || height <= 0) return file

    if (width > maxDimension || height > maxDimension) {
      const ratio = Math.min(maxDimension / width, maxDimension / height)
      width = Math.round(width * ratio)
      height = Math.round(height * ratio)
    }

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) return file
    ctx.drawImage(img, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality)
    )
    if (!blob) return file

    // Un navigateur sans encodeur WebP peut renvoyer un blob quand même,
    // mais silencieusement dans un autre format (souvent PNG) — on ne
    // garde le résultat que si c'est vraiment du WebP.
    if (blob.type !== "image/webp") return file

    // Garde-fou : sur une image déjà petite/optimisée, la "compression"
    // peut occasionnellement produire un fichier plus lourd — dans ce cas
    // on garde l'original tel quel.
    if (blob.size >= file.size) return file

    const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp"
    return new File([blob], newName, { type: "image/webp", lastModified: Date.now() })
  } catch {
    return file
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl)
  }
}

/** Compresse un lot de fichiers en parallèle (voir compressImageToWebP). */
export async function compressImagesToWebP(
  files: File[],
  options?: CompressImageOptions
): Promise<File[]> {
  return Promise.all(files.map((f) => compressImageToWebP(f, options)))
}
