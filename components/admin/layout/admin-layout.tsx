"use client"

import React, { useState } from "react"
import { AdminSidebar } from "./admin-sidebar"
import { AdminTopbar } from "./admin-topbar"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useAdminDashboard } from "@/hooks/use-admin-dashboard"
import { useMembershipStats } from "@/hooks/use-memberships"

// AuthProvider est monté une seule fois dans app/admin/layout.tsx, pas ici.
export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  // Compteurs des badges de la sidebar (Candidatures / Messages / Adhésions
  // "nouveaux") — accord du 2026-09-11 : auparavant codés en dur (7/4/6)
  // dans AdminSidebar, jamais mis à jour. `dashboard` fournit candidatures
  // + messages ; les adhésions en attente n'existent pas dans
  // GET /api/admin/dashboard, donc on les lit directement via la même
  // requête `meta.total` déjà utilisée par la page Adhésions
  // (useMembershipStats), plutôt que d'attendre une évolution backend.
  const { data: dashboard } = useAdminDashboard()
  const { data: membershipStats } = useMembershipStats()

  const badgeCounts = {
    candidaturesNouvelles: dashboard?.candidatures.par_statut?.nouvelle ?? 0,
    messagesNonLus: dashboard?.messages_contact.nouveaux ?? 0,
    adhesionsEnAttente: membershipStats?.enAttente ?? 0,
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased font-sans">
      {/* Desktop / Tablet Sidebar (fixed/sticky) */}
      <div className="hidden lg:flex shrink-0">
        <AdminSidebar
          isCollapsed={isCollapsed}
          className="sticky top-0 h-screen"
          badgeCounts={badgeCounts}
        />
      </div>

      {/* Mobile Drawer */}
      <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <SheetContent side="left" className="w-[280px] p-0 border-r border-border">
          <SheetTitle className="sr-only">Menu de navigation administration</SheetTitle>
          <AdminSidebar
            onItemClick={() => setMobileDrawerOpen(false)}
            className="w-full border-none h-full"
            badgeCounts={badgeCounts}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <AdminTopbar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
