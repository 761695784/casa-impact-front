import React from "react"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormFieldErrorProps {
  error?: string | null
  className?: string
}

export function FormFieldError({ error, className }: FormFieldErrorProps) {
  if (!error) return null

  return (
    <p
      role="alert"
      className={cn(
        "text-[11px] font-medium text-destructive mt-1.5 flex items-center gap-1.5 animate-in fade-in-50 duration-200",
        className
      )}
    >
      <AlertCircle className="size-3.5 shrink-0 text-destructive" />
      <span>{error}</span>
    </p>
  )
}
