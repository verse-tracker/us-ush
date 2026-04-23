import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

const PRODUITS = {
  ao_acces: { montant: 4900, description: 'Accès appel d\'offres USH-USH' },
  reference_candidat: { montant: 2900, description: 'Dossier de références professionnelles' },
  verification_b2b: { montant: 8900, description: 'Vérification références B2B' },
  simulateur: { montant: 990, description: 'Simulateur d\'entretien complet' },
  abonnement_pro: { montant: 14900, description: 'Abonnement Recruteur Pro — 1 mois' },
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { produit, metadata } = await request.json()
    const produitInfo = PRODUITS[produit as keyof typeof PRODUITS]
    if (!produitInfo) return NextResponse.json({ error: 'Produit inconnu' }, { status: 400 })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: produitInfo.description },
          unit_amount: produitInfo.montant,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/paiement/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/paiement/annule`,
      metadata: { user_id: user.id, produit, ...metadata },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Erreur paiement' }, { status: 500 })
  }
}
