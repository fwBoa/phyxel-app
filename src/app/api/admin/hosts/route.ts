// API admin — gestion des hosts (propriétaires d'espaces)
// POST /api/admin/hosts : crée un host à partir d'un email (utilisé inline par le form espace)
//
// À n'utiliser QUE depuis l'admin (vérifie le cookie admin_session).

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentAdmin } from '@/lib/admin/auth'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type CreateHostBody = {
  email:         string
  full_name?:    string
  company_name?: string
  phone?:        string
}

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: CreateHostBody
  try {
    body = (await request.json()) as CreateHostBody
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide.' }, { status: 400 })
  }

  const email = String(body.email ?? '').toLowerCase().trim()
  if (!email || !EMAIL_RE.test(email) || email.length > 255) {
    return NextResponse.json({ error: 'Email invalide.' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // 1. Si le host existe déjà, on le retourne (idempotent)
  const { data: existing, error: lookupErr } = await supabase
    .from('hosts')
    .select('id, email, full_name, company_name, phone, is_active')
    .eq('email', email)
    .maybeSingle()

  if (lookupErr) {
    return NextResponse.json({ error: lookupErr.message }, { status: 500 })
  }
  if (existing) {
    return NextResponse.json(
      { host: existing, alreadyExists: true },
      { status: 200 },
    )
  }

  // 2. Sinon, on le crée
  const insert = {
    email,
    full_name:    body.full_name    ? String(body.full_name).trim().slice(0, 255)    : null,
    company_name: body.company_name ? String(body.company_name).trim().slice(0, 255) : null,
    phone:        body.phone        ? String(body.phone).trim().slice(0, 50)         : null,
    is_active:    true,
  }

  const { data, error } = await supabase
    .from('hosts')
    .insert(insert)
    .select('id, email, full_name, company_name, phone, is_active')
    .single()

  if (error) {
    // 23505 = unique_violation (race condition avec un autre insert concurrent)
    if (error.code === '23505') {
      const { data: raceHost } = await supabase
        .from('hosts')
        .select('id, email, full_name, company_name, phone, is_active')
        .eq('email', email)
        .single()
      return NextResponse.json({ host: raceHost, alreadyExists: true }, { status: 200 })
    }
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ host: data, alreadyExists: false }, { status: 201 })
}
