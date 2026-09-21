"use client"

/**
 * Google Analytics 4 + bannière de consentement cookies.
 *
 * Ajouté le 2026-09-21 ("j'aimerai pour avoir l'analytique de mon site
 * comment faire") — le visiteur doit explicitement accepter avant que le
 * moindre cookie de mesure d'audience ne soit déposé (prudence RGPD, accord
 * explicite du 2026-09-21). Le script gtag.js n'est injecté qu'après un clic
 * sur « Accepter » ; un refus (ou aucune décision) ne charge jamais Google
 * Analytics.
 *
 * Le composant ne fait rien tant que NEXT_PUBLIC_GA_MEASUREMENT_ID n'est pas
 * configuré côté Hostinger (voir lib/config.ts) : pas de bannière, pas de
 * script — pour ne pas demander un consentement pour un tracking qui n'existe
 * pas encore.
 */

import { useEffect, useState } from "react"
import Script from "next/script"
import { Cookie } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GA_MEASUREMENT_ID } from "@/lib/config"

const CONSENT_STORAGE_KEY = "casa-impact-cookie-consent"

type ConsentStatus = "accepted" | "declined" | null

export function GoogleAnalytics() {
  const [consent, setConsent] = useState<ConsentStatus>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY)
      if (stored === "accepted" || stored === "declined") {
        setConsent(stored)
      }
    } catch {
      // localStorage indisponible (navigation privée, etc.) — la bannière
      // réapparaîtra simplement à chaque visite, sans planter la page.
    }
    setReady(true)
  }, [])

  const handleChoice = (choice: "accepted" | "declined") => {
    setConsent(choice)
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, choice)
    } catch {
      // ignore
    }
  }

  if (!GA_MEASUREMENT_ID) return null

  return (
    <>
      {consent === "accepted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {ready && consent === null && (
        <div className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-border bg-card/95 p-5 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-forest">
                <Cookie className="size-4" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Nous utilisons des cookies de mesure d'audience (Google Analytics) pour comprendre
                comment le site est utilisé et l'améliorer. Vous pouvez accepter ou refuser à tout
                moment.
              </p>
            </div>
            <div className="flex shrink-0 gap-2 self-end sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => handleChoice("declined")}
              >
                Refuser
              </Button>
              <Button
                size="sm"
                className="rounded-full text-xs bg-forest text-white hover:bg-forest/90"
                onClick={() => handleChoice("accepted")}
              >
                Accepter
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
