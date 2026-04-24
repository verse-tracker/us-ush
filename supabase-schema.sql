-- ============================================
-- USH-USH — Schema Supabase
-- ============================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (table principale utilisateurs)
-- ============================================
CREATE TABLE profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('candidat', 'recruteur', 'cabinet', 'entreprise', 'admin')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CANDIDATS
-- ============================================
CREATE TABLE candidats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  pseudo TEXT UNIQUE NOT NULL,
  fonction TEXT NOT NULL,
  secteur TEXT NOT NULL,
  niveau TEXT NOT NULL,
  annees_experience INT DEFAULT 0,
  management BOOLEAN DEFAULT false,
  nb_managees INT,
  specialites TEXT[] DEFAULT '{}',
  logiciels TEXT[] DEFAULT '{}',
  localisation TEXT,
  mobilite TEXT[] DEFAULT '{}',
  teletravail TEXT DEFAULT 'Hybride',
  disponibilite TEXT DEFAULT 'Immédiat',
  date_disponibilite DATE,
  types_contrat TEXT[] DEFAULT '{CDI}',
  langues TEXT[] DEFAULT '{Français}',
  salaire_min INT,
  salaire_confidentiel BOOLEAN DEFAULT true,
  cv_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_executive BOOLEAN DEFAULT false,
  domaines_bloques TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RECRUTEURS
-- ============================================
CREATE TABLE recruteurs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  type_structure TEXT CHECK (type_structure IN ('entreprise', 'cabinet', 'interim', 'independant')) NOT NULL,
  raison_sociale TEXT NOT NULL,
  siret TEXT UNIQUE NOT NULL,
  email_pro TEXT NOT NULL,
  telephone TEXT,
  site_web TEXT,
  linkedin TEXT,
  secteur TEXT,
  taille TEXT,
  nb_recrutements_an TEXT,
  contact_nom TEXT NOT NULL,
  contact_fonction TEXT NOT NULL,
  facturation_email TEXT,
  facturation_telephone TEXT,
  formule TEXT DEFAULT 'decouverte' CHECK (formule IN ('decouverte', 'pro', 'entreprise')),
  siret_verifie BOOLEAN DEFAULT false,
  compte_actif BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONVERSATIONS & MESSAGES
-- ============================================
CREATE TABLE conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  candidat_id UUID REFERENCES candidats(id) ON DELETE CASCADE NOT NULL,
  recruteur_id UUID REFERENCES recruteurs(id) ON DELETE CASCADE NOT NULL,
  statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'acceptee', 'refusee', 'archivee')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(candidat_id, recruteur_id)
);

CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- APPELS D'OFFRES
-- ============================================
CREATE TABLE appels_offres (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recruteur_id UUID REFERENCES recruteurs(id) ON DELETE CASCADE NOT NULL,
  titre TEXT NOT NULL,
  fonction TEXT NOT NULL,
  secteur TEXT NOT NULL,
  localisation TEXT NOT NULL,
  departement TEXT,
  niveau TEXT NOT NULL,
  statut_employe TEXT DEFAULT 'Cadre',
  type_contrat TEXT DEFAULT 'CDI',
  salaire_min INT,
  salaire_max INT,
  nb_mois_salaire INT DEFAULT 12,
  type_mission TEXT DEFAULT 'Remplacement confidentiel',
  demarrage TEXT,
  taille_entreprise TEXT,
  departement_service TEXT,
  missions_cles TEXT,
  logiciels TEXT[] DEFAULT '{}',
  langues TEXT[] DEFAULT '{Français}',
  criteres_specialite TEXT,
  criteres_secteur TEXT,
  criteres_delai TEXT DEFAULT 'Sous 3 semaines',
  criteres_garantie TEXT DEFAULT '6 mois',
  criteres_max_cabinets INT DEFAULT 5,
  cabinets_selectionnes INT DEFAULT 0,
  statut TEXT DEFAULT 'actif' CHECK (statut IN ('actif', 'cloture', 'pause')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACCÈS AO (cabinets qui ont payé)
-- ============================================
CREATE TABLE ao_acces (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ao_id UUID REFERENCES appels_offres(id) ON DELETE CASCADE NOT NULL,
  recruteur_id UUID REFERENCES recruteurs(id) ON DELETE CASCADE NOT NULL,
  stripe_payment_id TEXT,
  montant INT DEFAULT 4900,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ao_id, recruteur_id)
);

-- ============================================
-- PROPOSITIONS AO
-- ============================================
CREATE TABLE ao_propositions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ao_id UUID REFERENCES appels_offres(id) ON DELETE CASCADE NOT NULL,
  recruteur_id UUID REFERENCES recruteurs(id) ON DELETE CASCADE NOT NULL,
  honoraires_pct DECIMAL(5,2),
  delai_presentation TEXT,
  garantie TEXT,
  approche TEXT,
  references_similaires TEXT,
  statut TEXT DEFAULT 'soumise' CHECK (statut IN ('soumise', 'vue', 'selectionnee', 'refusee')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ao_id, recruteur_id)
);

-- ============================================
-- RÉFÉRENCES PROFESSIONNELLES
-- ============================================
CREATE TABLE references_pro (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  candidat_id UUID REFERENCES candidats(id) ON DELETE CASCADE NOT NULL,
  nom TEXT NOT NULL,
  poste TEXT NOT NULL,
  entreprise TEXT NOT NULL,
  email TEXT NOT NULL,
  relation TEXT,
  statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'complete', 'refusee')),
  rapport_url TEXT,
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  titre TEXT NOT NULL,
  contenu TEXT,
  lien TEXT,
  lue BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidats ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruteurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appels_offres ENABLE ROW LEVEL SECURITY;
ALTER TABLE ao_acces ENABLE ROW LEVEL SECURITY;
ALTER TABLE ao_propositions ENABLE ROW LEVEL SECURITY;
ALTER TABLE references_pro ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: chaque user voit son profil
CREATE POLICY "profiles_own" ON profiles FOR ALL USING (auth.uid() = user_id);

-- Candidats: visibles par recruteurs (sauf domaines bloqués), modifiables par owner
CREATE POLICY "candidats_own" ON candidats FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "candidats_read_recruteurs" ON candidats FOR SELECT 
  USING (
    is_active = true AND
    NOT (
      EXISTS (
        SELECT 1 FROM recruteurs r 
        WHERE r.user_id = auth.uid() 
        AND r.email_pro LIKE '%@%'
        AND split_part(r.email_pro, '@', 2) = ANY(domaines_bloques)
      )
    )
  );

-- Recruteurs: owner only
CREATE POLICY "recruteurs_own" ON recruteurs FOR ALL USING (auth.uid() = user_id);

-- Conversations: candidat + recruteur concernés
CREATE POLICY "conversations_parties" ON conversations FOR ALL
  USING (
    EXISTS (SELECT 1 FROM candidats c WHERE c.id = candidat_id AND c.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM recruteurs r WHERE r.id = recruteur_id AND r.user_id = auth.uid())
  );

-- Messages: participants de la conversation
CREATE POLICY "messages_parties" ON messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM conversations cv
      LEFT JOIN candidats c ON c.id = cv.candidat_id
      LEFT JOIN recruteurs r ON r.id = cv.recruteur_id
      WHERE cv.id = conversation_id
      AND (c.user_id = auth.uid() OR r.user_id = auth.uid())
    )
  );

-- AO: publics en lecture, owner en écriture
CREATE POLICY "ao_read_all" ON appels_offres FOR SELECT USING (true);
CREATE POLICY "ao_own_write" ON appels_offres FOR ALL USING (
  EXISTS (SELECT 1 FROM recruteurs r WHERE r.id = recruteur_id AND r.user_id = auth.uid())
);

-- Notifications: owner only
CREATE POLICY "notifs_own" ON notifications FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER candidats_updated_at BEFORE UPDATE ON candidats FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER recruteurs_updated_at BEFORE UPDATE ON recruteurs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER ao_updated_at BEFORE UPDATE ON appels_offres FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- FONCTION: créer profil automatiquement
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'role', 'candidat'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
