import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook signature invalide' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { user_id, produit, ao_id } = session.metadata || {}
    const supabase = await createClient()

    if (produit === 'ao_acces' && ao_id) {
      const { data: recruteur } = await supabase.from('recruteurs').select('id').eq('user_id', user_id).single()
      if (recruteur) {
        await supabase.from('ao_acces').upsert({
          ao_id, recruteur_id: recruteur.id,
          stripe_payment_id: session.payment_intent as string,
        })
      }
    }

    // Créer notification
    await supabase.from('notifications').insert({
      user_id,
      type: 'paiement',
      titre: 'Paiement confirmé',
      contenu: `Votre accès ${produit} a été activé.`,
    })
  }

  return NextResponse.json({ received: true })
}
