import type {
  DashboardStats,
  User,
  ApplicationCall,
  News,
  ContactMessage,
  Membership,
} from "./models"

export type AdminRoleSlug =
  | "administrateur-principal"
  | "communication"
  | "gestionnaire-candidatures"

export interface AdminActivityItem {
  id: string
  type:
    | "candidature"
    | "adhesion"
    | "message"
    | "actualite"
    | "programme"
    | "appel"
  titre: string
  description: string
  date: string
  statut?: string
  auteur?: string
  lien?: string
}

export interface AdminDashboardData {
  stats: DashboardStats
  actionsRequises: {
    candidaturesNouvelles: number
    messagesNonLus: number
    adhesionsEnAttente: number
    appelsEnCours: number
  }
  candidaturesRecentes: Array<{
    id: number
    reference: string
    candidat: string
    appelTitre: string
    region?: string
    date: string
    statut: string
  }>
  messagesRecents: ContactMessage[]
  adhesionsRecentes: Membership[]
  activiteRecente: AdminActivityItem[]
}
