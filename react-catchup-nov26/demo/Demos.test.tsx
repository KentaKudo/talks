import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Demos } from './Demos'

afterEach(() => vi.unstubAllGlobals())

describe('native React demonstrations', () => {
  it('changes a transition card and can reset it', async () => {
    render(<Demos kind="transition" lang="en" />)
    fireEvent.click(screen.getByRole('button', { name: 'Next stop' }))
    expect(await screen.findByText('KYOTO')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Next stop' }))
    expect(await screen.findByText('OSAKA')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Reset demo' }))
    expect(await screen.findByText('TOKYO')).toBeInTheDocument()
  })
  it('counts each visible card once and clears progress on reset', () => {
    const observe = vi.fn()
    const unobserve = vi.fn()
    const disconnect = vi.fn()
    let deliver!: (entries: Pick<IntersectionObserverEntry, 'target' | 'intersectionRatio'>[]) => void
    vi.stubGlobal('IntersectionObserver', class {
      observe = observe
      unobserve = unobserve
      disconnect = disconnect
      constructor(callback: typeof deliver) { deliver = callback }
    })
    render(<Demos kind="fragment" lang="en" />)
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(3)
    for (const card of cards) expect(observe).toHaveBeenCalledWith(card)
    act(() => deliver([{ target: cards[0], intersectionRatio: 0.25 }]))
    expect(screen.getByRole('status')).toHaveTextContent('0 / 3 seen')
    act(() => deliver([{ target: cards[0], intersectionRatio: 1 }, { target: cards[0], intersectionRatio: 1 }]))
    expect(screen.getByRole('status')).toHaveTextContent('1 / 3 seen')
    act(() => deliver(cards.slice(1).map(target => ({ target, intersectionRatio: 1 }))))
    expect(screen.getByRole('status')).toHaveTextContent('All 3 seen')
    fireEvent.click(screen.getByRole('button', { name: 'Reset demo' }))
    for (const card of cards) expect(unobserve).toHaveBeenCalledWith(card)
    expect(disconnect).toHaveBeenCalled()
    expect(screen.getByRole('status')).toHaveTextContent('0 / 3 seen')
  })
  it('localizes both demos', () => {
    const { unmount } = render(<Demos kind="transition" lang="ja" />)
    expect(screen.getByRole('button', { name: '次の街へ' })).toBeInTheDocument()
    unmount()
    render(<Demos kind="fragment" lang="ja" />)
    expect(screen.getByRole('region', { name: '変更点一覧' })).toBeInTheDocument()
  })
})
