import type { Language } from './slides'

export type Direction = 'next' | 'previous' | 'first' | 'last'
export function readPosition(hash: string, ids: string[]) {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  return {
    index: Math.max(0, ids.indexOf(params.get('slide') ?? '')),
    lang: (params.get('lang') === 'en' ? 'en' : 'ja') as Language,
  }
}
export function positionHash(id: string, lang: Language) {
  return `#${new URLSearchParams({ slide: id, lang })}`
}
export function destination(index: number, direction: Direction, length: number) {
  if (direction === 'first') return 0
  if (direction === 'last') return length - 1
  return Math.max(0, Math.min(length - 1, index + (direction === 'next' ? 1 : -1)))
}
