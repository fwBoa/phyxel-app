import { NextRequest } from 'next/server'

/** Crée une NextRequest GET avec query params optionnels */
export function makeGET(url = 'http://localhost/api/test', params?: Record<string, string>) {
  const u = new URL(url)
  if (params) Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v))
  return new NextRequest(u.toString(), { method: 'GET' })
}

/** Crée une NextRequest POST avec body JSON */
export function makePOST(body: unknown, url = 'http://localhost/api/test') {
  return new NextRequest(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/** Crée une NextRequest PUT avec body JSON */
export function makePUT(body: unknown, url = 'http://localhost/api/test') {
  return new NextRequest(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/** Crée une NextRequest DELETE */
export function makeDELETE(url = 'http://localhost/api/test') {
  return new NextRequest(url, { method: 'DELETE' })
}

/** Params dynamiques Next.js (ex : { id: 'abc' }) */
export function makeParams<T extends Record<string, string>>(params: T) {
  return { params: Promise.resolve(params) }
}
