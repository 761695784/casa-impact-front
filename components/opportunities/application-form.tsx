"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  CheckCircle2,
  Loader2,
  UploadCloud,
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Hourglass,
  GraduationCap,
  Briefcase,
  CheckCircle,
} from "lucide-react"
import type { ApplicationCall } from "@/types/models"
import type { Region } from "@/types/enums"
import { REGION_LABELS } from "@/types/enums"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormFieldError } from "@/components/ui/form-field-error"
import {
  showSuccessAlert,
  showErrorAlert,
  showValidationErrorAlert,
} from "@/lib/alerts"
import { ApiError } from "@/lib/api-client"
import { publicApplicationsService } from "@/lib/services/public-applications.service"
import { cn } from "@/lib/utils"

// Pas d'énumération côté backend pour ces deux champs (simple string,
// voir StoreApplicationRequest) — options éditoriales côté frontend
// uniquement, la valeur envoyée reste une chaîne libre.
const TRANCHE_AGE_OPTIONS = [
  { value: "moins-18", label: "Moins de 18 ans" },
  { value: "18-25", label: "18 - 25 ans" },
  { value: "26-35", label: "26 - 35 ans" },
  { value: "36-45", label: "36 - 45 ans" },
  { value: "46-plus", label: "46 ans et plus" },
]

const NIVEAU_ETUDES_OPTIONS = [
  { value: "aucun", label: "Aucun diplôme" },
  { value: "bepc", label: "BEPC / Brevet" },
  { value: "baccalaureat", label: "Baccalauréat" },
  { value: "licence", label: "Licence / Bac+3" },
  { value: "master", label: "Master / Bac+5" },
  { value: "doctorat", label: "Doctorat" },
  { value: "autre", label: "Autre" },
]

const SITUATION_PROFESSIONNELLE_OPTIONS = [
  { value: "etudiant", label: "Étudiant(e)" },
  { value: "sans-emploi", label: "Sans emploi" },
  { value: "employe", label: "Employé(e)" },
  { value: "entrepreneur", label: "Entrepreneur / Indépendant(e)" },
  { value: "autre", label: "Autre" },
]

const schema = z.object({
  prenom: z.string().min(2, "Veuillez renseigner votre prénom."),
  nom: z.string().min(2, "Veuillez renseigner votre nom."),
  email: z.string().email("Adresse e-mail invalide."),
  telephone: z.string().min(6, "Numéro de téléphone invalide."),
  region: z.enum(["ziguinchor", "sedhiou", "kolda"], {
    errorMap: () => ({ message: "Veuillez sélectionner votre région." }),
  }),
  lieu: z.string().optional(),
  tranche_age: z.string().min(1, "Veuillez sélectionner votre tranche d'âge."),
  niveau_etudes: z.string().min(1, "Veuillez sélectionner votre niveau d'études."),
  situation_professionnelle: z.string().optional(),
  motivation: z.string().min(20, "Décrivez votre motivation en quelques lignes (20 caractères min.)."),
  competences: z.string().optional(),
  experience: z.string().optional(),
  projet: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function ApplicationForm({ call }: { call: ApplicationCall }) {
  const [reference, setReference] = useState<string | null>(null)
  const [waitlisted, setWaitlisted] = useState(false)
  const [submittedValues, setSubmittedValues] = useState<FormValues | null>(null)
  const [documents, setDocuments] = useState<Record<string, File | null>>({})
  const [documentErrors, setDocumentErrors] = useState<Record<string, string>>({})

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const requiredDocuments = (call.documents_requis || []).filter((d) => d.requis)

  async function onSubmit(values: FormValues) {
    // Les documents obligatoires ne sont pas dans le schéma zod (clés
    // dynamiques par appel) — validés séparément juste avant l'envoi.
    const missing: Record<string, string> = {}
    requiredDocuments.forEach((doc) => {
      if (!documents[doc.cle]) {
        missing[doc.cle] = `Le document « ${doc.libelle} » est requis.`
      }
    })
    if (Object.keys(missing).length > 0) {
      setDocumentErrors(missing)
      showValidationErrorAlert(Object.values(missing))
      return
    }
    setDocumentErrors({})

    try {
      const providedDocuments: Record<string, File> = {}
      Object.entries(documents).forEach(([cle, file]) => {
        if (file) providedDocuments[cle] = file
      })

      const confirmation = await publicApplicationsService.submitApplication({
        application_call_id: call.id,
        nom: values.nom.trim(),
        prenom: values.prenom.trim(),
        email: values.email.trim(),
        telephone: values.telephone.trim(),
        region: values.region as Region,
        lieu: values.lieu?.trim() || undefined,
        tranche_age: values.tranche_age,
        niveau_etudes: values.niveau_etudes,
        situation_professionnelle: values.situation_professionnelle || undefined,
        motivation: values.motivation.trim(),
        competences: values.competences?.trim() || undefined,
        experience: values.experience?.trim() || undefined,
        projet: values.projet?.trim() || undefined,
        documents: Object.keys(providedDocuments).length > 0 ? providedDocuments : undefined,
      })

      setReference(confirmation.reference)
      setWaitlisted(confirmation.statut === "en_liste_attente")
      setSubmittedValues(values)
      await showSuccessAlert(
        "Candidature transmise !",
        `Votre dossier pour « ${call.titre} » a bien été enregistré.`
      )
    } catch (err: unknown) {
      if (err instanceof ApiError && err.errors) {
        const messages = Object.values(err.errors).flat()
        showValidationErrorAlert(messages.length > 0 ? messages : [err.message])
      } else {
        showErrorAlert(
          "Erreur",
          err instanceof Error ? err.message : "Une erreur est survenue lors de l'envoi de votre candidature."
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

        {waitlisted && (
          <p className="mx-auto mt-3 max-w-lg text-xs sm:text-sm font-semibold text-amber-700 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-4 py-2">
            Le nombre de places disponibles est atteint : votre dossier a été placé en liste d'attente et sera examiné si une place se libère.
          </p>
        )}

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

        {/* Région */}
        <Field label="Région *" icon={MapPin} error={errors.region?.message}>
          <Controller
            name="region"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={cn(
                    "h-11 w-full rounded-xl",
                    errors.region && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                  )}
                >
                  <SelectValue placeholder="Sélectionner votre région" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {(Object.keys(REGION_LABELS) as Region[]).map((r) => (
                    <SelectItem key={r} value={r}>
                      {REGION_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        {/* Ville / localité */}
        <Field label="Ville / localité">
          <Input
            {...register("lieu")}
            placeholder="Ex : Ziguinchor centre"
            className="h-11 rounded-xl"
          />
        </Field>

        {/* Tranche d'âge */}
        <Field label="Tranche d'âge *" icon={Hourglass} error={errors.tranche_age?.message}>
          <Controller
            name="tranche_age"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={cn(
                    "h-11 w-full rounded-xl",
                    errors.tranche_age && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                  )}
                >
                  <SelectValue placeholder="Sélectionner votre tranche d'âge" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {TRANCHE_AGE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        {/* Niveau d'études */}
        <Field label="Niveau d'études *" icon={GraduationCap} error={errors.niveau_etudes?.message}>
          <Controller
            name="niveau_etudes"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={cn(
                    "h-11 w-full rounded-xl",
                    errors.niveau_etudes && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                  )}
                >
                  <SelectValue placeholder="Sélectionner votre niveau d'études" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {NIVEAU_ETUDES_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        {/* Situation professionnelle */}
        <Field label="Situation professionnelle" icon={Briefcase}>
          <Controller
            name="situation_professionnelle"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11 w-full rounded-xl">
                  <SelectValue placeholder="Sélectionner (facultatif)" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {SITUATION_PROFESSIONNELLE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

      {/* Compétences & expérience (facultatif) */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field label="Compétences clés">
          <Textarea
            {...register("competences")}
            rows={3}
            placeholder="Ex : gestion de projet, prise de parole, comptabilité..."
            className="rounded-2xl resize-none p-4"
          />
        </Field>
        <Field label="Expérience pertinente">
          <Textarea
            {...register("experience")}
            rows={3}
            placeholder="Expériences professionnelles, associatives ou de formation en lien avec cet appel..."
            className="rounded-2xl resize-none p-4"
          />
        </Field>
      </div>

      {/* Projet (facultatif) */}
      <div className="mt-5">
        <Field label="Votre projet">
          <Textarea
            {...register("projet")}
            rows={3}
            placeholder="Si votre candidature porte sur un projet précis, décrivez-le brièvement..."
            className="rounded-2xl resize-none p-4"
          />
        </Field>
      </div>

      {/* Required Documents Upload */}
      {call.documents_requis && call.documents_requis.length > 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <UploadCloud className="size-4" />
            Documents justificatifs à joindre :
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {call.documents_requis.map((doc) => (
              <div key={doc.cle} className="space-y-1.5">
                <Label
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-semibold",
                    documentErrors[doc.cle] ? "text-destructive" : "text-foreground"
                  )}
                >
                  <span>
                    {doc.libelle}
                    {doc.requis ? " *" : " (facultatif)"}
                  </span>
                  {documents[doc.cle] && <CheckCircle className="size-3.5 text-emerald-600" />}
                </Label>
                <input
                  type="file"
                  accept={doc.formats?.map((f) => `.${f}`).join(",")}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setDocuments((prev) => ({ ...prev, [doc.cle]: file }))
                    if (file) {
                      setDocumentErrors((prev) => {
                        const next = { ...prev }
                        delete next[doc.cle]
                        return next
                      })
                    }
                  }}
                  className={cn(
                    "block w-full rounded-xl border bg-background text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20",
                    documentErrors[doc.cle] ? "border-destructive" : "border-border"
                  )}
                />
                <p className="text-[10px] text-muted-foreground">
                  {doc.formats?.length ? `Formats acceptés : ${doc.formats.join(", ")}` : "PDF, JPG, PNG, DOC, DOCX"}
                  {doc.taille_max ? ` • ${doc.taille_max} Mo max` : ""}
                </p>
                <FormFieldError error={documentErrors[doc.cle]} />
              </div>
            ))}
          </div>
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
