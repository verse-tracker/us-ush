export type UserRole = 'candidat' | 'recruteur' | 'cabinet' | 'entreprise' | 'admin'

export type Profile = {
  id: string
  user_id: string
  role: UserRole
  created_at: string
  updated_at: string
}

export type CandidatProfile = {
  id: string
  user_id: string
  pseudo: string
  fonction: string
  secteur: string
  niveau: string
  annees_experience: number
  management: boolean
  nb_managees?: number
  specialites: string[]
  logiciels: string[]
  localisation: string
  mobilite: string[]
  teletravail: string
  disponibilite: string
  date_disponibilite?: string
  types_contrat: string[]
  langues: string[]
  salaire_min?: number
  salaire_confidentiel: boolean
  cv_url?: string
  is_active: boolean
  is_executive: boolean
  domaines_bloques: string[]
  created_at: string
  updated_at: string
}

export type RecruteurProfile = {
  id: string
  user_id: string
  type_structure: 'entreprise' | 'cabinet' | 'interim' | 'independant'
  raison_sociale: string
  siret: string
  email_pro: string
  telephone?: string
  site_web?: string
  linkedin?: string
  secteur?: string
  taille?: string
  nb_recrutements_an?: string
  contact_nom: string
  contact_fonction: string
  facturation_email?: string
  facturation_telephone?: string
  formule: 'decouverte' | 'pro' | 'entreprise'
  siret_verifie: boolean
  compte_actif: boolean
  created_at: string
}

export type Message = {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  read: boolean
}

export type Conversation = {
  id: string
  candidat_id: string
  recruteur_id: string
  statut: 'en_attente' | 'acceptee' | 'refusee' | 'archivee'
  created_at: string
}

export type AppelOffres = {
  id: string
  entreprise_id: string
  titre: string
  fonction: string
  secteur: string
  localisation: string
  departement?: string
  niveau: string
  statut_employe: string
  type_contrat: string
  salaire_min?: number
  salaire_max?: number
  nb_mois_salaire?: number
  type_mission: string
  demarrage?: string
  taille_entreprise?: string
  departement_service?: string
  missions_cles?: string
  logiciels?: string[]
  langues?: string[]
  criteres_specialite?: string
  criteres_secteur?: string
  criteres_delai?: string
  criteres_garantie?: string
  criteres_max_cabinets: number
  cabinets_selectionnes: number
  statut: 'actif' | 'cloture' | 'pause'
  is_active: boolean
  created_at: string
}
