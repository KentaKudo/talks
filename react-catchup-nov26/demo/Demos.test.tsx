import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Demos } from './Demos'

afterEach(() => vi.restoreAllMocks())

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
  it('compares two Fragment rectangles with one wrapper rectangle', () => {
    const rect = new DOMRect(0, 0, 180, 40)
    vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue(
      Object.assign([rect], { item: (index: number) => index === 0 ? rect : null }),
    )
    render(<Demos kind="fragment" lang="en" />)
    const grid = screen.getByRole('group', { name: 'CSS Grid' })
    const measure = screen.getByRole('button', { name: 'Show bounds' })
    expect(screen.getAllByRole('article').every(card => card.parentElement === grid)).toBe(true)
    fireEvent.click(measure)
    expect(screen.getByRole('status')).toHaveTextContent('2 rectangles')
    fireEvent.click(screen.getByRole('button', { name: 'With div' }))
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(grid.children).toHaveLength(1)
    fireEvent.click(measure)
    expect(screen.getByRole('status')).toHaveTextContent('1 rectangle')
    fireEvent.click(screen.getByRole('button', { name: 'With Fragment' }))
    expect(grid.children).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: 'Reset demo' }))
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })
  it('localizes both demos', () => {
    const { unmount } = render(<Demos kind="transition" lang="ja" />)
    expect(screen.getByRole('button', { name: '次の街へ' })).toBeInTheDocument()
    unmount()
    render(<Demos kind="fragment" lang="ja" />)
    expect(screen.getByRole('button', { name: '範囲を表示' })).toBeInTheDocument()
  })
})
