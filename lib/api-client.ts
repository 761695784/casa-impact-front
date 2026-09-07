import { API_URL } from "@/lib/config"

/**
 * Erreur typée pour tous les appels API réels.
 * `errors` porte le détail champ par champ d'une réponse 422 Laravel
 * (`{ message, errors: { email: ["..."] } }`), à utiliser pour afficher
 * les erreurs de validation au bon endroit dans les formulaires plutôt
 * que le seul message générique.
 */
export class ApiError extends Error {
  status: number
  errors?: Record<string, string[]>

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.errors = errors
  }
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

/**
 * Initialise (ou rafraîchit) le cookie CSRF Sanctum. À appeler avant le
 * login. Les mutations suivantes lisent ensuite le cookie XSRF-TOKEN et
 * l'envoient automatiquement (voir apiFetch) — Laravel régénère ce cookie
 * à chaque réponse, donc un seul appel explicite par session suffit
 * normalement, mais apiFetch se rattrape tout seul si jamais le cookie
 * est absent (session neuve, cookie expiré, etc.).
 */
export async function ensureCsrfCookie(): Promise<void> {
  await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    method: "GET",
    credentials: "include",
  })
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  /** Objet JSON classique, ou un FormData (détecté automatiquement, pas de JSON.stringify ni de Content-Type manuel dans ce cas). */
  body?: unknown
}

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"])

/**
 * Client HTTP central pour l'API Laravel (authentification Sanctum SPA
 * par cookie de session + CSRF). Règles appliquées systématiquement :
 * - `credentials: 'include'` sur chaque requête
 * - En-tête `X-XSRF-TOKEN` lu depuis le cookie et envoyé sur toute
 *   mutation (POST/PUT/PATCH/DELETE) — s'auto-amorce via
 *   `ensureCsrfCookie()` si le cookie n'existe pas encore
 * - `FormData` transmis tel quel (uploads), sinon JSON
 * - Erreurs levées sous forme d'`ApiError` typée, avec le détail des
 *   champs (422) accessible sur `error.errors`
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { body, headers, method = "GET", ...rest } = options
  const httpMethod = method.toUpperCase()
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string> | undefined),
  }

  if (!isFormData && body !== undefined) {
    finalHeaders["Content-Type"] = "application/json"
  }

  if (MUTATING_METHODS.has(httpMethod)) {
    let xsrfToken = readCookie("XSRF-TOKEN")
    if (!xsrfToken) {
      await ensureCsrfCookie()
      xsrfToken = readCookie("XSRF-TOKEN")
    }
    if (xsrfToken) {
      finalHeaders["X-XSRF-TOKEN"] = xsrfToken
    }
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    method: httpMethod,
    headers: finalHeaders,
    credentials: "include",
    body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) {
    return undefined as T
  }

  const contentType = res.headers.get("content-type") || ""
  const payload = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : null

  if (!res.ok) {
    const message = payload?.message || `Erreur ${res.status} lors de l'appel à ${path}`
    throw new ApiError(message, res.status, payload?.errors)
  }

  return payload as T
}
