"use client"

import React, { useState } from "react"
import { AdminSidebar } from "./admin-sidebar"
import { AdminTopbar } from "./admin-topbar"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { AuthProvider } from "@/lib/auth/auth-context"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-background text-foreground antialiased font-sans">
        {/* Desktop / Tablet Sidebar (fixed/sticky) */}
        <div className="hidden lg:flex shrink-0">
          <AdminSidebar
            isCollapsed={isCollapsed}
            className="sticky top-0 h-screen"
          />
        </div>

        {/* Mobile Drawer */}
        <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
          <SheetContent side="left" className="w-[280px] p-0 border-r border-border">
            <SheetTitle className="sr-only">Menu de navigation administration</SheetTitle>
            <AdminSidebar
              onItemClick={() => setMobileDrawerOpen(false)}
              className="w-full border-none h-full"
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
    </AuthProvider>
  )
}
