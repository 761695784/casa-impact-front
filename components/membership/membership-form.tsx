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
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    // Simulated submit delay
    await new Promise((r) => setTimeout(r, 900))
    const ref = makeRef()
    setReference(ref)
    setSubmittedValues(values)
    toast.success("Votre demande d'adhésion a bien été enregistrée !")
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
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Nom complet */}
        <Field
          label="Nom complet"
          icon={User}
          error={errors.nom_complet?.message}
          className="sm:col-span-2"
        >
          <Input
            {...register("nom_complet")}
            placeholder="Ex : Ousmane Diédhiou"
            aria-invalid={!!errors.nom_complet}
            className="h-11 rounded-xl"
          />
        </Field>

        {/* E-mail */}
        <Field label="Adresse e-mail" icon={Mail} error={errors.email?.message}>
          <Input
            type="email"
            {...register("email")}
            placeholder="vous@exemple.com"
            aria-invalid={!!errors.email}
            className="h-11 rounded-xl"
          />
        </Field>

        {/* Téléphone */}
        <Field label="Numéro de téléphone (WhatsApp)" icon={Phone} error={errors.telephone?.message}>
          <Input
            {...register("telephone")}
            placeholder="+221 78 ... .. .."
            aria-invalid={!!errors.telephone}
            className="h-11 rounded-xl"
          />
        </Field>

        {/* Profession */}
        <Field label="Profession / Activité (facultatif)" icon={Briefcase} error={errors.profession?.message}>
          <Input
            {...register("profession")}
            placeholder="Ex : Étudiant, Entrepreneur, Enseignant..."
            className="h-11 rounded-xl"
          />
        </Field>

        {/* Région */}
        <Field label="Région ou Localisation" icon={MapPin} error={errors.region?.message}>
          <SelectField {...register("region")} aria-invalid={!!errors.region} defaultValue="">
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

        {/* Département */}
        <Field label="Département / Ville (facultatif)" icon={MapPin} error={errors.departement?.message}>
          <Input
            {...register("departement")}
            placeholder="Ex : Bignona, Oussouye, Vélingara, Bounkiling..."
            className="h-11 rounded-xl"
          />
        </Field>

        {/* Domaine de contribution */}
        <Field
          label="Pôle ou Domaine d'intérêt"
          icon={Layers}
          error={errors.domaine_contribution?.message}
        >
          <SelectField
            {...register("domaine_contribution")}
            aria-invalid={!!errors.domaine_contribution}
            defaultValue=""
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
          label="Type d'engagement souhaité"
          icon={HeartHandshake}
          error={errors.type_contribution?.message}
          className="sm:col-span-2"
        >
          <SelectField
            {...register("type_contribution")}
            aria-invalid={!!errors.type_contribution}
            defaultValue=""
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
    <div className={cn("space-y-2", className)}>
      <Label className="flex items-center gap-1.5 text-xs font-semibold text-foreground uppercase tracking-wide">
        {Icon && <Icon className="size-3.5 text-primary" />}
        <span>{label}</span>
      </Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  )
}

const SelectField = ({ className, ...props }: React.ComponentProps<"select">) => (
  <select
    className={cn(
      "flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive",
      className
    )}
    {...props}
  />
)
