import type { Metadata } from "next"
import { AuthProvider } from "@/lib/auth/auth-context"

export const metadata: Metadata = {
  title: "Administration | Casa Impact",
  description: "Espace de gestion et de pilotage officiel de Casa Impact.",
}

// Point de montage unique de l'AuthProvider pour tout l'arbre /admin —
// login et pages protégées partagent la même session (voir
// lib/auth/auth-context.tsx pour la garde de redirection).
export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AuthProvider>{children}</AuthProvider>
    </div>
  )
}
