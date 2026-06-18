import { cn } from '@/lib/utils'

describe('cn()', () => {
  it('returns empty string for no args', () => {
    expect(cn()).toBe('')
  })

  it('returns single class string unchanged', () => {
    expect(cn('px-2 py-1')).toBe('px-2 py-1')
  })

  it('merges multiple positional class strings', () => {
    expect(cn('text-sm', 'font-bold')).toBe('text-sm font-bold')
  })

  it('handles conditional object syntax — truthy included, falsy excluded', () => {
    expect(cn({ 'opacity-50': true, hidden: false })).toBe('opacity-50')
  })

  it('handles arrays with null/undefined values', () => {
    expect(cn(['px-2', null, undefined, 'py-1'])).toBe('px-2 py-1')
  })

  it('deduplicates conflicting Tailwind utilities — last wins (twMerge behaviour)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('resolves conflicting text sizes — last wins', () => {
    expect(cn('text-sm', 'text-lg')).toBe('text-lg')
  })

  it('resolves conflicting background colors — last wins', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
  })

  it('preserves non-conflicting utility combinations', () => {
    const result = cn('flex', 'items-center', 'justify-between')
    expect(result).toBe('flex items-center justify-between')
  })

  it('merges class string with conditional object', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active')
  })
})
