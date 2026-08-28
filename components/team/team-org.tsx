"use client"

import { useState } from "react"
import { Users, Crown, Layers, MapPin, Sparkles, BookOpen } from "lucide-react"
import { teamCategories, getTeamByCategory, teamMembers } from "@/lib/data/team"
import { TeamMemberCard } from "@/components/team/team-member-card"
import type { TeamCategory } from "@/types/team"

type FilterTab = "all" | "direction" | "poles" | "regions" | "commission"

const FILTER_TABS: { key: FilterTab; label: string; icon: typeof Users }[] = [
  { key: "all", label: "Toute l'organisation", icon: Users },
  { key: "direction", label: "Présidence & Direction", icon: Crown },
  { key: "poles", label: "Pôles Opérationnels", icon: Layers },
  { key: "regions", label: "Coordinations Régionales", icon: MapPin },
  { key: "commission", label: "Commission Scientifique", icon: BookOpen },
]

const TAB_CATEGORIES: Record<FilterTab, TeamCategory[]> = {
  all: [
    "presidence",
    "administration",
    "pole_capital_humain",
    "pole_economie",
    "pole_culture",
    "pole_support",
    "coordination_regionale",
    "commission_scientifique",
  ],
  direction: ["presidence", "administration"],
  poles: ["pole_capital_humain", "pole_economie", "pole_culture", "pole_support"],
  regions: ["coordination_regionale"],
  commission: ["commission_scientifique"],
}

export function TeamOrg() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all")

  const categoriesToShow = teamCategories.filter((cat) =>
    TAB_CATEGORIES[activeTab].includes(cat.key)
  )

  return (
    <div className="space-y-12">
      {/* Filter Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {FILTER_TABS.map((tab) => {
          const isActive = activeTab === tab.key
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                  : "border border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Leadership Spotlight when 'all' or 'direction' is selected */}
      {(activeTab === "all" || activeTab === "direction") && (
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/30 p-6 sm:p-10 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5 mb-8">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Crown className="size-5 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Présidence & Direction Exécutive
                </h3>
                <p className="text-xs text-muted-foreground">
                  Instance d'orientation et de pilotage stratégique de Casa Impact
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
              <Sparkles className="size-3" />
              Gouvernance
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {teamMembers
              .filter((m) => m.categorie === "presidence" || m.categorie === "administration")
              .map((member) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  featured={member.categorie === "presidence"}
                />
              ))}
          </div>
        </div>
      )}

      {/* Regional Coordinations Spotlight when 'all' or 'regions' is selected */}
      {(activeTab === "all" || activeTab === "regions") && (
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-secondary/40 via-background to-secondary/20 p-6 sm:p-10 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5 mb-8">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-forest text-white">
                <MapPin className="size-5 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Coordinations Régionales
                </h3>
                <p className="text-xs text-muted-foreground">
                  Les relais territoriaux permanents à Ziguinchor, Sédhiou et Kolda
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              Ancrage 3 Régions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {teamMembers
              .filter((m) => m.categorie === "coordination_regionale")
              .map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
          </div>
        </div>
      )}

      {/* Other Categories by Pôles */}
      <div className="space-y-12">
        {categoriesToShow
          .filter((cat) => {
            // Avoid repeating Presidence/Administration and Coordination if already displayed above
            if (activeTab === "all") {
              return (
                cat.key !== "presidence" &&
                cat.key !== "administration" &&
                cat.key !== "coordination_regionale"
              );
            }
            if (activeTab === "direction") return false;
            if (activeTab === "regions") return false;
            return true;
          })
          .map((cat) => {
            const members = getTeamByCategory(cat.key)
            if (members.length === 0) return null

            return (
              <div
                key={cat.key}
                className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm"
              >
                <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                      {cat.titre}
                    </h3>
                    {cat.sousTitre && (
                      <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                        {cat.sousTitre}
                      </p>
                    )}
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {members.length} {members.length > 1 ? "membres" : "membre"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                  {members.map((m) => (
                    <TeamMemberCard key={m.id} member={m} />
                  ))}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
