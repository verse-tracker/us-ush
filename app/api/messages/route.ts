import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const MessageSchema = z.object({
  conversation_id: z.string().uuid(),
  content: z.string().min(1).max(2000),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await request.json()
    const { conversation_id, content } = MessageSchema.parse(body)

    const { data, error } = await supabase
      .from('messages')
      .insert({ conversation_id, sender_id: user.id, content })
      .select()
      .single()

    if (error) throw error

    // Mise à jour updated_at de la conversation
    await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversation_id)

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const conversation_id = searchParams.get('conversation_id')
    if (!conversation_id) return NextResponse.json({ error: 'conversation_id requis' }, { status: 400 })

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: true })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
