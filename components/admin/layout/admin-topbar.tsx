"use client"

import React from "react"
import Link from "next/link"
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink,
  LogOut,
  User as UserIcon,
  Shield,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminBreadcrumbs } from "./admin-breadcrumbs"
import { useAuth } from "@/lib/auth/auth-context"
import { DATA_SOURCE } from "@/lib/config"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { AdminRoleSlug } from "@/types/admin"

interface AdminTopbarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  onOpenMobileDrawer: () => void
}

const ROLE_LABELS: Record<AdminRoleSlug, string> = {
  "administrateur-principal": "Administrateur Principal",
  communication: "Responsable Communication",
  "gestionnaire-candidatures": "Gestionnaire Candidatures",
}

export function AdminTopbar({
  isCollapsed,
  onToggleCollapse,
  onOpenMobileDrawer,
}: AdminTopbarProps) {
  const { user, role, logout, switchMockRole } = useAuth()

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "CI"

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Toggles & Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile Drawer Trigger */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenMobileDrawer}
          className="lg:hidden size-9 rounded-xl"
          aria-label="Ouvrir le menu latéral"
        >
          <Menu className="size-5" />
        </Button>

        {/* Desktop / Tablet Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="hidden lg:flex size-9 rounded-xl text-muted-foreground hover:text-foreground"
          aria-label={isCollapsed ? "Déplier le menu" : "Replier le menu"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="size-4.5" />
          ) : (
            <PanelLeftClose className="size-4.5" />
          )}
        </Button>

        <div className="h-5 w-px bg-border hidden sm:block" />

        <AdminBreadcrumbs />
      </div>

      {/* Right: Actions, Environment badge & User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Environment Badge */}
        {DATA_SOURCE === "mock" && (
          <Badge
            variant="outline"
            className="hidden md:inline-flex border-amber-500/30 bg-amber-500/10 text-amber-700 font-mono text-[10px]"
          >
            MODE MOCK / DÉMO
          </Badge>
        )}

        {/* View Public Site */}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="hidden sm:inline-flex h-9 rounded-xl gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <span>Site public</span>
            <ExternalLink className="size-3.5" />
          </Link>
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                className="flex items-center gap-2.5 rounded-full border border-border/80 bg-secondary/50 p-1 pr-2.5 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Menu du profil"
              />
            }
          >
            <Avatar className="size-7 rounded-full bg-forest text-white font-bold text-xs">
              <AvatarFallback className="bg-forest text-white text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left md:block">
              <p className="text-xs font-semibold text-foreground leading-none">
                {user?.name || "Administrateur"}
              </p>
              <p className="text-[10px] text-muted-foreground leading-none mt-1">
                {role ? ROLE_LABELS[role] || role : "Accès sécurisé"}
              </p>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 shadow-xl border-border">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-2">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold text-foreground leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <div className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-forest/10 px-2 py-0.5 text-[10px] font-semibold text-forest w-fit">
                    <Shield className="size-3" />
                    <span>{role ? ROLE_LABELS[role] || role : "Rôle"}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            {/* Test Role Switcher (Mock Mode only) */}
            {DATA_SOURCE === "mock" && switchMockRole && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground/70">
                    Simuler un Rôle (Démo)
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => switchMockRole("administrateur-principal")}
                    className="text-xs flex items-center justify-between cursor-pointer"
                  >
                    <span>Admin Principal</span>
                    {role === "administrateur-principal" && <Check className="size-3.5 text-forest" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => switchMockRole("communication")}
                    className="text-xs flex items-center justify-between cursor-pointer"
                  >
                    <span>Communication</span>
                    {role === "communication" && <Check className="size-3.5 text-forest" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => switchMockRole("gestionnaire-candidatures")}
                    className="text-xs flex items-center justify-between cursor-pointer"
                  >
                    <span>Gestionnaire Candidatures</span>
                    {role === "gestionnaire-candidatures" && <Check className="size-3.5 text-forest" />}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              render={<Link href="/" target="_blank" />}
              className="text-xs cursor-pointer rounded-lg flex items-center gap-2"
            >
              <ExternalLink className="size-3.5" />
              <span>Ouvrir le site public</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={logout}
              className="text-xs text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg flex items-center gap-2"
            >
              <LogOut className="size-3.5" />
              <span>Se déconnecter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
