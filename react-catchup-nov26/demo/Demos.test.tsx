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
  it('observes both grid cards and cleans up when the demo resets', () => {
    const observe = vi.fn()
    const unobserve = vi.fn()
    let notify!: ResizeObserverCallback
    vi.stubGlobal('ResizeObserver', class {
      observe = observe
      unobserve = unobserve
      constructor(callback: ResizeObserverCallback) { notify = callback }
    })

    render(<Demos kind="fragment" lang="en" />)
    const grid = screen.getByRole('group', { name: 'CSS Grid' })
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(2)
    for (const card of cards) {
      expect(card.parentElement).toBe(grid)
      expect(observe.mock.calls.some(([target]) => target === card)).toBe(true)
    }

    act(() => notify(cards.map((target, i) => ({
      target,
      contentRect: new DOMRect(0, 0, 180 + i * 100, 40),
      borderBoxSize: [],
      contentBoxSize: [],
      devicePixelContentBoxSize: [],
    })), { observe, unobserve, disconnect: vi.fn() }))
    expect(screen.getByText('180 px')).toBeVisible()
    expect(screen.getByText('280 px')).toBeVisible()

    const resize = screen.getByRole('button', { name: 'Widen the first column' })
    fireEvent.click(resize)
    expect(resize).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Reset demo' }))
    expect(screen.getByRole('button', { name: 'Widen the first column' })).toHaveAttribute('aria-pressed', 'false')
    for (const card of cards) expect(unobserve).toHaveBeenCalledWith(card)
  })
  it('localizes both demos', () => {
    const { unmount } = render(<Demos kind="transition" lang="ja" />)
    expect(screen.getByRole('button', { name: '次の街へ' })).toBeInTheDocument()
    unmount()
    render(<Demos kind="fragment" lang="ja" />)
    expect(screen.getByRole('button', { name: '左の列を広げる' })).toBeInTheDocument()
  })
})
