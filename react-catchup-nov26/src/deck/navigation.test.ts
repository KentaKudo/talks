import { describe, expect, it } from 'vitest'
import { readPosition, positionHash, destination } from './navigation'

const ids = ['intro', 'react', 'next']
describe('shareable presentation position', () => {
  it('defaults safely for missing or unknown slides and languages', () => {
    expect(readPosition('', ids)).toEqual({ index: 0, lang: 'ja' })
    expect(readPosition('#slide=missing&lang=fr', ids)).toEqual({ index: 0, lang: 'ja' })
  })
  it('restores a specific slide and language', () => {
    expect(readPosition('#slide=react&lang=en', ids)).toEqual({ index: 1, lang: 'en' })
    expect(readPosition(positionHash('next', 'ja'), ids)).toEqual({ index: 2, lang: 'ja' })
  })
  it('clamps navigation at both ends and supports first/last', () => {
    expect(destination(0, 'previous', 3)).toBe(0)
    expect(destination(2, 'next', 3)).toBe(2)
    expect(destination(1, 'next', 3)).toBe(2)
    expect(destination(1, 'previous', 3)).toBe(0)
    expect(destination(2, 'first', 3)).toBe(0)
    expect(destination(0, 'last', 3)).toBe(2)
  })
})
