export type TeamCategory =
  | 'presidence'
  | 'administration'
  | 'pole_capital_humain'
  | 'pole_economie'
  | 'pole_culture'
  | 'pole_support'
  | 'commission_scientifique'
  | 'coordination_regionale'

export interface TeamMember {
  id: string
  nom: string
  fonction: string
  categorie: TeamCategory
  pole?: string
  region?: string
  image?: string
  ordre: number
}

export interface TeamCategoryMeta {
  key: TeamCategory
  titre: string
  sousTitre?: string
}
