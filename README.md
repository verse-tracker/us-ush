# USH-USH — CVthèque confidentielle

## Stack technique
- **Next.js 14** (App Router)
- **Supabase** (Auth + DB + Realtime)
- **Stripe** (Paiements)
- **Resend** (Emails)
- **Vercel** (Déploiement)
- **Tailwind CSS**

## Installation locale

```bash
npm install
cp .env.local.example .env.local
# Remplir les variables d'environnement
npm run dev
```

## Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Exécuter `supabase-schema.sql` dans l'éditeur SQL Supabase
3. Activer l'authentification par email dans Authentication > Settings
4. Copier les clés API dans `.env.local`

## Configuration Stripe

1. Créer un compte sur [stripe.com](https://stripe.com)
2. Copier les clés dans `.env.local`
3. Configurer le webhook : `stripe listen --forward-to localhost:3000/api/paiement/webhook`

## Déploiement Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

Ajouter les variables d'environnement dans Vercel Dashboard.

## Structure du projet

```
app/
  page.tsx                    # Landing page
  auth/
    connexion/                # Connexion
    inscription/              # Inscription candidat
    inscription-recruteur/    # Inscription recruteur
  candidat/
    page.tsx                  # Dashboard candidat
    profil/                   # Gestion du profil
    messages/                 # Messagerie (realtime)
    simulateur/               # Simulateur d'entretien IA
    suivi/                    # Suivi de candidatures
    references/               # Références professionnelles
  recruteur/
    page.tsx                  # Dashboard recruteur
    recherche/                # CVthèque + filtres
    messages/                 # Messagerie
  api/
    auth/callback/            # OAuth callback
    messages/                 # API Messages
    paiement/                 # Stripe checkout + webhook

lib/
  supabase/client.ts          # Client navigateur
  supabase/server.ts          # Client serveur
  supabase/middleware.ts      # Protection des routes

types/
  database.ts                 # Types TypeScript

supabase-schema.sql           # Schema base de données
```

## Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=https://ush-ush.fr
```
