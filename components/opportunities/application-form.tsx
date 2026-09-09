"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  CheckCircle2,
  Loader2,
  UploadCloud,
  User,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react"
import type { ApplicationCall } from "@/types/models"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FormFieldError } from "@/components/ui/form-field-error"
import {
  showSuccessAlert,
  showErrorAlert,
  showValidationErrorAlert,
} from "@/lib/alerts"
import { cn } from "@/lib/utils"

const schema = z.object({
  prenom: z.string().min(2, "Veuillez renseigner votre prénom."),
  nom: z.string().min(2, "Veuillez renseigner votre nom."),
  email: z.string().email("Adresse e-mail invalide."),
  telephone: z.string().min(6, "Numéro de téléphone invalide."),
  motivation: z.string().min(20, "Décrivez votre motivation en quelques lignes (20 caractères min.)."),
})

type FormValues = z.infer<typeof schema>

function makeDossierRef() {
  return `CAND-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
}

export function ApplicationForm({ call }: { call: ApplicationCall }) {
  const [reference, setReference] = useState<string | null>(null)
  const [submittedValues, setSubmittedValues] = useState<FormValues | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    try {
      // Demonstration submit — replace with POST /api/public/applications
      await new Promise((r) => setTimeout(r, 900))
      const ref = makeDossierRef()
      setReference(ref)
      setSubmittedValues(values)
      await showSuccessAlert(
        "Candidature transmise !",
        `Votre dossier pour « ${call.titre} » a bien été enregistré.`
      )
    } catch {
      showErrorAlert("Erreur", "Une erreur est survenue lors de l'envoi de votre candidature.")
    }
  }

  const onInvalid = (formErrors: typeof errors) => {
    const messages = Object.values(formErrors)
      .map((e) => e?.message)
      .filter((m): m is string => Boolean(m))
    if (messages.length > 0) {
      showValidationErrorAlert(messages)
    }
  }

  if (reference && submittedValues) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 via-background to-secondary/30 p-8 sm:p-12 shadow-xl text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
          <CheckCircle2 className="size-8" />
        </div>

        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
          <Sparkles className="size-3" />
          <span>Candidature Enregistrée avec Succès</span>
        </div>

        <h3 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
          Félicitations {submittedValues.prenom} {submittedValues.nom} !
        </h3>

        <p className="mx-auto mt-3 max-w-lg text-sm sm:text-base leading-relaxed text-muted-foreground">
          Votre candidature au programme <strong>« {call.titre} »</strong> a bien été enregistrée.
        </p>

        {/* Reference Badge */}
        <div className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-6 py-3 font-mono text-xl font-bold text-primary shadow-inner">
          <span>N° Dossier : {reference}</span>
        </div>

        <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-border bg-card p-6 text-left shadow-sm">
          <h4 className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-4 border-b border-border pb-3 flex items-center gap-2">
            <ShieldCheck className="size-4 text-accent" />
            Prochaines étapes de votre sélection :
          </h4>

          <ol className="space-y-3 text-xs sm:text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
                1
              </span>
              <span>
                <strong>Confirmation par e-mail :</strong> Un récapitulatif a été envoyé à <em>{submittedValues.email}</em>.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
                2
              </span>
              <span>
                <strong>Examen par le jury :</strong> Le comité régional étudiera votre profil après la clôture de l'appel.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-xs">
                3
              </span>
              <span>
                <strong>Entretien :</strong> Si votre profil est retenu, vous serez convoqué(e) pour la phase d'entretien.
              </span>
            </li>
          </ol>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm"
    >
      <div className="mb-6 border-b border-border pb-4">
        <h3 className="font-display text-xl font-bold text-foreground">
          Formulaire de Candidature
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Renseignez vos coordonnées pour postuler à cette promotion.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Prénom */}
        <Field label="Prénom *" icon={User} error={errors.prenom?.message}>
          <Input
            {...register("prenom")}
            placeholder="Ex : Fatou"
            aria-invalid={!!errors.prenom}
            className={cn(
              "h-11 rounded-xl",
              errors.prenom && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
            )}
          />
        </Field>

        {/* Nom */}
        <Field label="Nom de famille *" icon={User} error={errors.nom?.message}>
          <Input
            {...register("nom")}
            placeholder="Ex : Sagna"
            aria-invalid={!!errors.nom}
            className={cn(
              "h-11 rounded-xl",
              errors.nom && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
            )}
          />
        </Field>

        {/* E-mail */}
        <Field label="Adresse e-mail *" icon={Mail} error={errors.email?.message}>
          <Input
            type="email"
            {...register("email")}
            placeholder="vous@exemple.com"
            aria-invalid={!!errors.email}
            className={cn(
              "h-11 rounded-xl",
              errors.email && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
            )}
          />
        </Field>

        {/* Téléphone */}
        <Field label="Numéro WhatsApp *" icon={Phone} error={errors.telephone?.message}>
          <Input
            {...register("telephone")}
            placeholder="+221 78 ... .. .."
            aria-invalid={!!errors.telephone}
            className={cn(
              "h-11 rounded-xl",
              errors.telephone && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
            )}
          />
        </Field>
      </div>

      {/* Motivation */}
      <div className="mt-5">
        <Field label="Votre motivation & parcours *" icon={MessageSquare} error={errors.motivation?.message}>
          <Textarea
            {...register("motivation")}
            rows={5}
            placeholder="Expliquez vos motivations, vos compétences et ce que vous attendez de ce programme..."
            aria-invalid={!!errors.motivation}
            className={cn(
              "rounded-2xl resize-none p-4",
              errors.motivation && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
            )}
          />
        </Field>
      </div>

      {/* Required Documents Notice */}
      {call.documents_requis && call.documents_requis.length > 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <UploadCloud className="size-4" />
            Documents justificatifs à fournir lors de l'entretien :
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-xs text-foreground/80">
            {call.documents_requis.map((doc) => (
              <li key={doc.cle} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary shrink-0" />
                <span>{doc.libelle}</span>
                {doc.formats?.length ? (
                  <span className="text-[10px] text-muted-foreground">({doc.formats.join(", ")})</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="mt-8 min-h-[3.25rem] h-auto py-3.5 px-6 w-full rounded-full bg-accent text-accent-foreground font-semibold shadow-lg shadow-accent/25 hover:bg-forest hover:text-white hover:scale-[1.01] active:scale-[0.99] transition-all text-sm sm:text-base whitespace-normal leading-snug"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-5 shrink-0 animate-spin" />
            <span>Envoi de votre candidature...</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2 text-center">
            <span>Soumettre ma candidature</span>
            <ArrowRight className="size-4 shrink-0" />
          </span>
        )}
      </Button>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Votre candidature est strictement confidentielle et examinée par le comité Casa Impact.
      </p>
    </form>
  )
}

function Field({
  label,
  icon: Icon,
  error,
  children,
}: {
  label: string
  icon?: typeof User
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className={cn(
        "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide",
        error ? "text-destructive" : "text-foreground"
      )}>
        {Icon && <Icon className={cn("size-3.5", error ? "text-destructive" : "text-primary")} />}
        <span>{label}</span>
      </Label>
      {children}
      <FormFieldError error={error} />
    </div>
  )
}
