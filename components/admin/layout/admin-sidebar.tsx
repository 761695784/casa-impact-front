"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/brand/logo"
import { ADMIN_NAV_GROUPS } from "@/lib/admin-nav"
import { usePermissions } from "@/hooks/use-permissions"
import { BaobabMark } from "@/components/brand/baobab-mark"
import { Badge } from "@/components/ui/badge"

interface AdminSidebarProps {
  isCollapsed?: boolean
  onItemClick?: () => void
  className?: string
  badgeCounts?: {
    candidaturesNouvelles?: number
    messagesNonLus?: number
    adhesionsEnAttente?: number
  }
}

export function AdminSidebar({
  isCollapsed = false,
  onItemClick,
  className,
  badgeCounts = {
    candidaturesNouvelles: 7,
    messagesNonLus: 4,
    adhesionsEnAttente: 6,
  },
}: AdminSidebarProps) {
  const pathname = usePathname()
  const { hasPermission } = usePermissions()

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-card transition-all duration-300 select-none",
        isCollapsed ? "w-20" : "w-[270px]",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
        {isCollapsed ? (
          <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-forest/10 text-forest">
            <BaobabMark variant="color" size={28} />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Logo width={125} href="/admin/dashboard" />
            <span className="rounded-md bg-forest/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest">
              Admin
            </span>
          </div>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        <div className="space-y-6">
          {ADMIN_NAV_GROUPS.map((group) => {
            // Filter items user has permission to see
            const visibleItems = group.items.filter((item) =>
              item.permission ? hasPermission(item.permission) : true
            )

            if (visibleItems.length === 0) return null

            return (
              <div key={group.groupTitle} className="space-y-1">
                {!isCollapsed && (
                  <p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground/70">
                    {group.groupTitle}
                  </p>
                )}
                <div className="mt-1 space-y-0.5">
                  {visibleItems.map((item) => {
                    const Icon = item.icon
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/admin/dashboard" &&
                        pathname.startsWith(item.href + "/"))

                    const badgeVal =
                      item.badgeKey && badgeCounts?.[item.badgeKey]
                        ? badgeCounts[item.badgeKey]
                        : null

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onItemClick}
                        title={isCollapsed ? item.title : undefined}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150",
                          isActive
                            ? "bg-forest/10 text-forest font-semibold shadow-xs"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                          isCollapsed && "justify-center px-0 py-2.5"
                        )}
                      >
                        {/* Active Left indicator */}
                        {isActive && (
                          <span
                            className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-forest"
                            aria-hidden
                          />
                        )}

                        <Icon
                          className={cn(
                            "size-4.5 shrink-0 transition-transform group-hover:scale-105",
                            isActive ? "text-forest" : "text-muted-foreground group-hover:text-foreground"
                          )}
                        />

                        {!isCollapsed && (
                          <>
                            <span className="flex-1 truncate">{item.title}</span>
                            {badgeVal ? (
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "h-5 px-1.5 text-[10px] font-bold",
                                  item.badgeKey === "messagesNonLus"
                                    ? "bg-amber-500/15 text-amber-800"
                                    : "bg-forest/15 text-forest"
                                )}
                              >
                                {badgeVal}
                              </Badge>
                            ) : null}
                          </>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer System Info */}
      {!isCollapsed && (
        <div className="border-t border-border p-3.5 text-center">
          <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Back-office V1</span>
            </span>
            <span className="font-mono text-[10px] opacity-70">Casa Impact</span>
          </div>
        </div>
      )}
    </aside>
  )
}
