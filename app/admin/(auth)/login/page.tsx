"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth/auth-context"
import { ApiError } from "@/lib/api-client"
import { DATA_SOURCE } from "@/lib/config"

function LoginForm() {
  const { login, isLoading } = useAuth()
  // Pré-remplissage uniquement en mode démo — en mode API réel, champs vides.
  const [email, setEmail] = useState(DATA_SOURCE === "mock" ? "admin@casaimpact.org" : "")
  const [password, setPassword] = useState(DATA_SOURCE === "mock" ? "password123" : "")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login({ email, password })
    } catch (err: unknown) {
      // Un échec de connexion réel est un 422 Laravel (ValidationException),
      // pas un 401 — le message de champ (err.errors.email[0]) est plus
      // précis que le message générique quand il est disponible.
      if (err instanceof ApiError) {
        setError(err.errors?.email?.[0] || err.message)
      } else {
        setError(err instanceof Error ? err.message : "Identifiants invalides.")
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-b from-forest/10 via-background to-background py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo width={160} href="/" priority className="mx-auto" />
        
        <div className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-forest/20 bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
          <ShieldCheck className="size-3.5" />
          <span>Espace d'Administration Sécurisé</span>
        </div>

        <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Connexion Back-Office
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">
          Accès réservé aux membres de la coordination et administrateurs Casa Impact.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="rounded-3xl border border-border bg-card p-7 sm:p-9 shadow-xl">
          {error && (
            <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs font-semibold text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                Adresse e-mail institutionnelle
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@casaimpact.org"
                  className="h-11 rounded-xl pl-10"
                />
                <Mail className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-foreground">
                  Mot de passe
                </Label>
              </div>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-11 rounded-xl pl-10"
                />
                <Lock className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="mt-6 h-12 w-full rounded-full bg-forest text-white hover:bg-forest/90 font-semibold shadow-md shadow-forest/20 gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <span>Accéder au tableau de bord</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          {DATA_SOURCE === "mock" && (
            <div className="mt-6 pt-5 border-t border-border/80">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 text-center">
                Comptes de test (Mode Démo)
              </p>
              <div className="mt-2.5 grid gap-1.5 text-xs text-muted-foreground">
                <button
                  type="button"
                  onClick={() => setEmail("admin@casaimpact.org")}
                  className="text-left px-2.5 py-1.5 rounded-lg hover:bg-secondary transition-colors text-[11px]"
                >
                  👑 <strong>admin@casaimpact.org</strong> (Admin Principal)
                </button>
                <button
                  type="button"
                  onClick={() => setEmail("communication@casaimpact.org")}
                  className="text-left px-2.5 py-1.5 rounded-lg hover:bg-secondary transition-colors text-[11px]"
                >
                  📢 <strong>communication@casaimpact.org</strong> (Com)
                </button>
                <button
                  type="button"
                  onClick={() => setEmail("candidatures@casaimpact.org")}
                  className="text-left px-2.5 py-1.5 rounded-lg hover:bg-secondary transition-colors text-[11px]"
                >
                  📥 <strong>candidatures@casaimpact.org</strong> (Candidatures)
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            <span>← Retourner sur le site public</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return <LoginForm />
}
