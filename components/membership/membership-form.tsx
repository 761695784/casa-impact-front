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
  Briefcase,
  MapPin,
  Layers,
  HeartHandshake,
  MessageCircle,
  CreditCard,
  ArrowRight,
  Sparkles,
  Camera,
  UploadCloud,
  X,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormFieldError } from "@/components/ui/form-field-error"
import {
  showSuccessAlert,
  showErrorAlert,
  showValidationErrorAlert,
} from "@/lib/alerts"
import { cn } from "@/lib/utils"
import { contactInfo } from "@/lib/config"
import {
  MEMBERSHIP_REGION_LABELS,
  CONTRIBUTION_DOMAIN_LABELS,
  CONTRIBUTION_TYPE_LABELS,
  type MembershipRegion,
  type ContributionDomain,
  type ContributionType,
} from "@/types/enums"

const schema = z.object({
  nom_complet: z.string().min(2, "Veuillez renseigner votre nom complet."),
  email: z.string().email("Adresse e-mail invalide."),
  telephone: z.string().min(6, "Numéro de téléphone invalide."),
  profession: z.string().optional(),
  region: z.string().min(1, "Veuillez sélectionner votre région ou localisation."),
  departement: z.string().optional(),
  domaine_contribution: z.string().min(1, "Veuillez sélectionner un domaine de contribution."),
  type_contribution: z.string().min(1, "Veuillez sélectionner un type d'engagement."),
})

type FormValues = z.infer<typeof schema>

function makeRef() {
  return `CI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
}

export function MembershipForm() {
  const [reference, setReference] = useState<string | null>(null)
  const [submittedValues, setSubmittedValues] = useState<FormValues | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      showErrorAlert("Fichier trop volumineux", "La photo ne doit pas dépasser 5 Mo.")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setPhotoPreview(reader.result as string)
      showSuccessAlert("Photo chargée !", "Votre photo d'identité a été importée avec succès.")
    }
    reader.readAsDataURL(file)
  }

  async function onSubmit(values: FormValues) {
    try {
      // Simulated submit delay
      await new Promise((r) => setTimeout(r, 900))
      const ref = makeRef()
      setReference(ref)
      setSubmittedValues(values)
      await showSuccessAlert(
        "Adhésion enregistrée !",
        "Votre demande d'adhésion a été enregistrée avec succès."
      )
    } catch {
      showErrorAlert("Erreur", "Une erreur est survenue lors de l'enregistrement de votre adhésion.")
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
    const whatsappUrl = `https://wa.me/221781033063?text=${encodeURIComponent(
      `Bonjour Casa Impact, je viens de soumettre ma demande d'adhésion au nom de ${submittedValues.nom_complet} (Réf : ${reference}). Voici ma capture de paiement de 1 000 FCFA.`
    )}`

    return (
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 via-background to-secondary/30 p-8 sm:p-12 shadow-xl text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
          <CheckCircle2 className="size-8" />
        </div>

        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
          <Sparkles className="size-3" />
          <span>Demande Enregistrée avec Succès</span>
        </div>

        <h3 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
          Félicitations {submittedValues.nom_complet} !
        </h3>

        <p className="mx-auto mt-3 max-w-lg text-sm sm:text-base leading-relaxed text-muted-foreground">
          Votre demande d'adhésion à Casa Impact a bien été prise en compte. Conservez précieusement votre numéro de référence :
        </p>

        {/* Reference Badge */}
        <div className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-6 py-3 font-mono text-xl font-bold text-primary shadow-inner">
          <span>{reference}</span>
        </div>

        {/* Official Card Preview Mockup */}
        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-border bg-card p-5 text-left shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <Sparkles className="size-3.5 text-accent" />
            <span>Votre Carte de Membre Numérique Officielle :</span>
          </h4>

          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-secondary shadow-md border border-border">
            <Image
              src="/assets/Carte-membres.png"
              alt="Carte de membre Casa Impact"
              fill
              className="object-cover"
            />
            {/* Dynamic member overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-3.5 flex flex-col justify-end text-white">
              <div className="flex items-center gap-3">
                <div className="relative size-11 rounded-lg overflow-hidden border border-white/80 bg-black/40 shrink-0">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Portrait" className="size-full object-cover" />
                  ) : (
                    <div className="size-full flex items-center justify-center bg-white/20">
                      <User className="size-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate drop-shadow">
                    {submittedValues.nom_complet}
                  </p>
                  <p className="text-[10px] text-white/80 font-mono">
                    N° {reference} • {MEMBERSHIP_REGION_LABELS[submittedValues.region as MembershipRegion] || submittedValues.region}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps Checklist Box */}
        <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-border bg-card p-6 text-left shadow-sm">
          <h4 className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-4 border-b border-border pb-3 flex items-center gap-2">
            <CreditCard className="size-4 text-accent" />
            Prochaines étapes pour finaliser votre carte (1 000 FCFA) :
          </h4>

          <ol className="space-y-4 text-xs sm:text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
                1
              </span>
              <span>
                <strong>Vérifiez votre boîte e-mail :</strong> Un e-mail récapitulatif a été envoyé à <em>{submittedValues.email}</em> avec les coordonnées de paiement Wave / Orange Money.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
                2
              </span>
              <span>
                <strong>Effectuez le règlement de 1 000 FCFA</strong> (cotisation pour la carte officielle de membre).
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
                3
              </span>
              <span>
                <strong>Envoyez la capture de votre paiement sur WhatsApp</strong> au <strong>{contactInfo.phone}</strong> pour validation immédiate.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-xs">
                4
              </span>
              <span>
                <strong>Recevez votre carte officielle par e-mail</strong> ainsi que le lien privé d'accès au <strong>Groupe WhatsApp officiel</strong>.
              </span>
            </li>
          </ol>

          <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row items-center gap-3">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" />
                Envoyer ma capture sur WhatsApp
              </a>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setReference(null)
                setSubmittedValues(null)
                setPhotoPreview(null)
              }}
              className="w-full sm:w-auto rounded-full"
            >
              Nouvelle adhésion
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Nom complet */}
        <Field
          label="Nom complet *"
          icon={User}
          error={errors.nom_complet?.message}
        >
          <Input
            {...register("nom_complet")}
            placeholder="Prénom et Nom"
            aria-invalid={!!errors.nom_complet}
            className={cn(
              "h-11 rounded-xl bg-background text-sm",
              errors.nom_complet && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
            )}
          />
        </Field>

        {/* Adresse e-mail */}
        <Field
          label="Adresse e-mail *"
          icon={Mail}
          error={errors.email?.message}
        >
          <Input
            {...register("email")}
            type="email"
            placeholder="nom@exemple.com"
            aria-invalid={!!errors.email}
            className={cn(
              "h-11 rounded-xl bg-background text-sm",
              errors.email && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
            )}
          />
        </Field>

        {/* Téléphone (WhatsApp) */}
        <Field
          label="Numéro WhatsApp *"
          icon={Phone}
          error={errors.telephone?.message}
        >
          <Input
            {...register("telephone")}
            type="tel"
            placeholder="+221 78 123 45 67"
            aria-invalid={!!errors.telephone}
            className={cn(
              "h-11 rounded-xl bg-background text-sm",
              errors.telephone && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
            )}
          />
        </Field>

        {/* Profession */}
        <Field
          label="Profession / Statut"
          icon={Briefcase}
          error={errors.profession?.message}
        >
          <Input
            {...register("profession")}
            placeholder="ex. Étudiant, Entrepreneur, Enseignant..."
            className={cn(
              "h-11 rounded-xl bg-background text-sm",
              errors.profession && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
            )}
          />
        </Field>

        {/* Région */}
        <Field
          label="Région / Localisation *"
          icon={MapPin}
          error={errors.region?.message}
        >
          <SelectField
            {...register("region")}
            aria-invalid={!!errors.region}
            defaultValue=""
            className={cn(
              errors.region && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
            )}
          >
            <option value="" disabled>
              Sélectionnez votre région
            </option>
            {(Object.keys(MEMBERSHIP_REGION_LABELS) as MembershipRegion[]).map((k) => (
              <option key={k} value={k}>
                {MEMBERSHIP_REGION_LABELS[k]}
              </option>
            ))}
          </SelectField>
        </Field>

        {/* Département / Ville */}
        <Field
          label="Département ou Ville"
          icon={MapPin}
          error={errors.departement?.message}
        >
          <Input
            {...register("departement")}
            placeholder="ex. Oussouye, Bignona, Vélingara, Paris..."
            className={cn(
              "h-11 rounded-xl bg-background text-sm",
              errors.departement && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
            )}
          />
        </Field>

        {/* Photo d'Identité pour la Carte de Membre (Optionnel) */}
        <div className="sm:col-span-2 space-y-2 rounded-2xl border border-dashed border-border bg-secondary/20 p-4">
          <Label className="flex items-center gap-1.5 text-xs font-semibold text-foreground uppercase tracking-wide">
            <Camera className="size-3.5 text-forest" />
            <span>Photo d'identité pour votre carte de membre (Facultatif)</span>
          </Label>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
            {photoPreview ? (
              <div className="relative size-16 rounded-2xl overflow-hidden border-2 border-forest shadow-xs shrink-0">
                <img src={photoPreview} alt="Aperçu portrait" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-destructive text-white shadow-xs"
                >
                  <X className="size-3" />
                </button>
              </div>
            ) : (
              <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground shrink-0 border border-border">
                <User className="size-6 opacity-40" />
              </div>
            )}

            <div className="flex-1 text-center sm:text-left">
              <label className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-colors cursor-pointer">
                <UploadCloud className="size-4" />
                <span>{photoPreview ? "Changer la photo" : "Téléverser votre photo d'identité"}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-muted-foreground mt-1">
                Formats acceptés : JPG, PNG, WEBP (Max. 5 Mo). Cette photo figurera sur votre carte de membre.
              </p>
            </div>
          </div>
        </div>

        {/* Domaine de contribution */}
        <Field
          label="Pôle / Commission de prédilection *"
          icon={Layers}
          error={errors.domaine_contribution?.message}
          className="sm:col-span-2"
        >
          <SelectField
            {...register("domaine_contribution")}
            aria-invalid={!!errors.domaine_contribution}
            defaultValue=""
            className={cn(
              errors.domaine_contribution && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
            )}
          >
            <option value="" disabled>
              Sélectionnez un pôle d'action
            </option>
            {(Object.keys(CONTRIBUTION_DOMAIN_LABELS) as ContributionDomain[]).map((k) => (
              <option key={k} value={k}>
                {CONTRIBUTION_DOMAIN_LABELS[k]}
              </option>
            ))}
          </SelectField>
        </Field>

        {/* Type de contribution */}
        <Field
          label="Type d'engagement souhaité *"
          icon={HeartHandshake}
          error={errors.type_contribution?.message}
          className="sm:col-span-2"
        >
          <SelectField
            {...register("type_contribution")}
            aria-invalid={!!errors.type_contribution}
            defaultValue=""
            className={cn(
              errors.type_contribution && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
            )}
          >
            <option value="" disabled>
              Sélectionnez votre type d'engagement
            </option>
            {(Object.keys(CONTRIBUTION_TYPE_LABELS) as ContributionType[]).map((k) => (
              <option key={k} value={k}>
                {CONTRIBUTION_TYPE_LABELS[k]}
              </option>
            ))}
          </SelectField>
        </Field>
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <Button
          type="submit"
          size="lg"
          className="min-h-[3.25rem] h-auto py-3.5 px-6 w-full rounded-full bg-accent text-accent-foreground font-semibold shadow-lg shadow-accent/25 hover:bg-forest hover:text-white hover:scale-[1.01] active:scale-[0.99] transition-all text-sm sm:text-base whitespace-normal leading-snug"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="size-5 shrink-0 animate-spin" />
              <span>Traitement de votre adhésion...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2 text-center">
              <span>Valider et envoyer ma demande d'adhésion</span>
              <ArrowRight className="size-4 shrink-0" />
            </span>
          )}
        </Button>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <CreditCard className="size-3.5 text-accent" />
          <span>Cotisation annuelle de la carte de membre : <strong>1 000 FCFA</strong> (Wave / Orange Money après soumission)</span>
        </div>
      </div>
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

const SelectField = ({ className, ...props }: React.ComponentProps<"select">) => (
  <select
    className={cn(
      "flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
)
