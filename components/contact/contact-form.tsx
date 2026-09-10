"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  CheckCircle2,
  Loader2,
  User,
  Mail,
  Phone,
  Layers,
  FileText,
  MessageSquare,
  Send,
  Sparkles,
} from "lucide-react"
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
import { ApiError } from "@/lib/api-client"
import { publicContactService } from "@/lib/services/public-contact.service"
import { cn } from "@/lib/utils"
import { CONTACT_CATEGORY_LABELS, type ContactCategory } from "@/types/enums"

const schema = z.object({
  nom: z.string().min(2, "Veuillez renseigner votre nom complet."),
  email: z.string().email("Adresse e-mail invalide."),
  telephone: z.string().optional(),
  categorie: z.string().min(1, "Veuillez choisir un objet pour votre message."),
  sujet: z.string().optional(),
  message: z.string().min(15, "Votre message doit contenir au moins 15 caractères."),
})

type FormValues = z.infer<typeof schema>

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    try {
      await publicContactService.submitContactMessage({
        categorie: values.categorie as ContactCategory,
        nom: values.nom,
        email: values.email,
        telephone: values.telephone,
        sujet: values.sujet,
        message: values.message,
      })
      await showSuccessAlert(
        "Message envoyé !",
        "Votre message a bien été transmis à l'équipe Casa Impact."
      )
      setSubmitted(true)
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        showValidationErrorAlert(err.errors)
      } else {
        showErrorAlert(
          "Erreur",
          err instanceof Error ? err.message : "Une erreur est survenue lors de l'envoi de votre message."
        )
      }
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

  if (submitted) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 via-background to-secondary/30 p-8 sm:p-12 shadow-xl text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
          <CheckCircle2 className="size-8" />
        </div>

        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
          <Sparkles className="size-3" />
          <span>Message Transmis</span>
        </div>

        <h3 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
          Merci pour votre message !
        </h3>

        <p className="mx-auto mt-3 max-w-md text-sm sm:text-base leading-relaxed text-muted-foreground">
          Notre équipe a bien reçu votre demande. Nous l'examinerons avec attention et reviendrons vers vous sous 48 heures.
        </p>

        <div className="mt-8">
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(false)
              reset()
            }}
            className="rounded-full px-6"
          >
            Envoyer un autre message
          </Button>
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
          Formulaire de Contact
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Remplissez les champs ci-dessous pour joindre notre équipe.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Nom */}
        <Field label="Nom complet *" icon={User} error={errors.nom?.message}>
          <Input
            {...register("nom")}
            placeholder="Votre prénom et nom"
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
        <Field label="Téléphone (facultatif)" icon={Phone} error={errors.telephone?.message}>
          <Input
            {...register("telephone")}
            placeholder="+221 ..."
            className={cn(
              "h-11 rounded-xl",
              errors.telephone && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
            )}
          />
        </Field>

        {/* Objet */}
        <Field label="Objet de votre message *" icon={Layers} error={errors.categorie?.message}>
          <select
            {...register("categorie")}
            defaultValue=""
            aria-invalid={!!errors.categorie}
            className={cn(
              "flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              errors.categorie && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
            )}
          >
            <option value="" disabled>
              Sélectionnez un motif
            </option>
            {(Object.keys(CONTACT_CATEGORY_LABELS) as ContactCategory[]).map((k) => (
              <option key={k} value={k}>
                {CONTACT_CATEGORY_LABELS[k]}
              </option>
            ))}
          </select>
        </Field>

        {/* Sujet */}
        <Field label="Sujet précis (facultatif)" icon={FileText} error={errors.sujet?.message} className="sm:col-span-2">
          <Input
            {...register("sujet")}
            placeholder="Ex : Proposition de partenariat pour le programme entrepreneuriat"
            className={cn(
              "h-11 rounded-xl",
              errors.sujet && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
            )}
          />
        </Field>
      </div>

      {/* Message */}
      <div className="mt-5">
        <Field label="Votre message *" icon={MessageSquare} error={errors.message?.message}>
          <Textarea
            {...register("message")}
            rows={5}
            placeholder="Expliquez-nous en détail votre demande ou votre projet..."
            aria-invalid={!!errors.message}
            className={cn(
              "rounded-2xl resize-none p-4",
              errors.message && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
            )}
          />
        </Field>
      </div>

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
            <span>Transmission en cours...</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2 text-center">
            <Send className="size-4 shrink-0" />
            <span>Envoyer mon message</span>
          </span>
        )}
      </Button>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        En soumettant ce formulaire, vous acceptez d'être recontacté par l'équipe Casa Impact.
      </p>
    </form>
  )
}

function Field({
  label,
  icon: Icon,
  error,
  className,
  children,
}: {
  label: string
  icon?: typeof User
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
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
