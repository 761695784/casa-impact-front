import Swal, { SweetAlertOptions } from "sweetalert2"

/**
 * Configuration personnalisée de SweetAlert2 avec la charte graphique de Casa Impact.
 */
const customSwal = Swal.mixin({
  customClass: {
    popup: "rounded-3xl border border-border bg-card text-foreground shadow-2xl p-6 sm:p-7 font-sans",
    title: "font-display text-lg sm:text-xl font-bold text-foreground",
    htmlContainer: "text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2",
    confirmButton:
      "inline-flex items-center justify-center rounded-full bg-forest px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-forest/90 focus:outline-none focus:ring-2 focus:ring-forest/30 mx-1.5 cursor-pointer",
    cancelButton:
      "inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-2.5 text-xs sm:text-sm font-semibold text-foreground transition-all hover:bg-secondary focus:outline-none mx-1.5 cursor-pointer",
    actions: "gap-2 mt-4",
  },
  buttonsStyling: false,
  backdrop: "rgba(10, 25, 18, 0.45)",
})

/**
 * Alerte de confirmation de succès
 */
export async function showSuccessAlert(title: string, message?: string, options?: SweetAlertOptions) {
  return customSwal.fire({
    icon: "success",
    title,
    text: message,
    confirmButtonText: "Parfait",
    iconColor: "#1b4332",
    timer: options?.timer || 3500,
    timerProgressBar: true,
    ...options,
  })
}

/**
 * Alerte d'erreur générique ou opérationnelle
 */
export async function showErrorAlert(title: string, message?: string, options?: SweetAlertOptions) {
  return customSwal.fire({
    icon: "error",
    title,
    text: message,
    confirmButtonText: "Compris",
    iconColor: "#dc2626",
    ...options,
  })
}

/**
 * Alerte spécifique pour les erreurs de validation de formulaires avec liste à puces des anomalies
 */
export async function showValidationErrorAlert(
  titleOrErrors: string | Record<string, string | string[]> | string[] = "Informations incomplètes ou invalides",
  errors?: Record<string, string | string[]> | string[],
  summaryText: string = "Veuillez vérifier et corriger les champs surlignés en rouge :"
) {
  let finalTitle = "Informations incomplètes ou invalides"
  let rawErrors: Record<string, string | string[]> | string[] = []

  if (typeof titleOrErrors === "string") {
    finalTitle = titleOrErrors
    rawErrors = errors || []
  } else {
    rawErrors = titleOrErrors
  }

  let errorItemsHtml = ""

  if (Array.isArray(rawErrors)) {
    errorItemsHtml = rawErrors.map((err) => `<li class="flex items-center gap-1.5 text-left text-destructive font-medium">• ${err}</li>`).join("")
  } else if (typeof rawErrors === "object" && rawErrors !== null) {
    const list: string[] = []
    Object.entries(rawErrors).forEach(([field, msg]) => {
      if (Array.isArray(msg)) {
        msg.forEach((m) => list.push(m))
      } else if (typeof msg === "string" && msg.trim()) {
        list.push(msg)
      }
    })
    errorItemsHtml = list.map((err) => `<li class="flex items-center gap-1.5 text-left text-destructive font-medium">• ${err}</li>`).join("")
  }

  const htmlContent = `
    <div class="space-y-3">
      <p class="text-xs sm:text-sm text-muted-foreground">${summaryText}</p>
      ${
        errorItemsHtml
          ? `<div class="rounded-2xl border border-destructive/20 bg-destructive/5 p-3.5 mt-2">
              <ul class="space-y-1.5 text-xs text-destructive">
                ${errorItemsHtml}
              </ul>
            </div>`
          : ""
      }
    </div>
  `

  return customSwal.fire({
    icon: "warning",
    title: finalTitle,
    html: htmlContent,
    confirmButtonText: "Corriger le formulaire",
    iconColor: "#e11d48",
  })
}

/**
 * Alerte de confirmation d'action destructive ou sensible (Suppression, etc.)
 */
export async function showConfirmAlert(
  title: string,
  text: string,
  confirmButtonText: string = "Oui, confirmer",
  cancelButtonText: string = "Annuler"
): Promise<boolean> {
  const result = await customSwal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    iconColor: "#d97706",
    focusCancel: true,
  })

  return result.isConfirmed
}

export { customSwal as swal }
