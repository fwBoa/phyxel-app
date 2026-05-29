import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body     = await request.json()
  const { action, email, password, full_name, role } = body

  if (action === 'signIn') {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return NextResponse.json({ error: error.message }, { status: 401 })
    return NextResponse.json({ user: data.user })
  }

  if (action === 'signUp') {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name, role: role ?? 'brand' } },
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ user: data.user }, { status: 201 })
  }

  if (action === 'signOut') {
    await supabase.auth.signOut()
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })
}
