import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Administration | Casa Impact",
  description: "Espace de gestion et de pilotage officiel de Casa Impact.",
}

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  )
}
