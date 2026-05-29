import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn()', () => {
  it('retourne une chaîne vide sans arguments', () => {
    expect(cn()).toBe('')
  })

  it('concatène des classes simples', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('ignore les valeurs falsy', () => {
    expect(cn('foo', undefined, null, false, 'bar')).toBe('foo bar')
  })

  it('fusionne les classes Tailwind conflictuelles (twMerge)', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('gère les objets conditionnels clsx', () => {
    expect(cn({ 'font-bold': true, 'italic': false })).toBe('font-bold')
  })

  it('gère les tableaux imbriqués', () => {
    expect(cn(['text-sm', 'text-red-500'])).toBe('text-sm text-red-500')
  })
})
