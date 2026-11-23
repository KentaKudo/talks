import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Demos } from './Demos'

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
  it('selects an order from either of its rows and keeps the other order separate', () => {
    render(<Demos kind="fragment" lang="en" />)
    const select = screen.getByRole('button', { name: 'Notebook' })
    const second = screen.getByRole('button', { name: 'Pen' })
    const unrelated = screen.getByRole('button', { name: 'Mug' })

    fireEvent.click(unrelated)
    expect(screen.getByRole('status')).toHaveTextContent('Order #43 selected')
    fireEvent.click(select)
    expect(screen.getByRole('status')).toHaveTextContent('Order #42 selected')
    expect(select).toHaveAttribute('aria-pressed', 'true')
    expect(second).toHaveAttribute('aria-pressed', 'true')
    expect(unrelated).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(screen.getByRole('button', { name: 'Reset demo' }))
    fireEvent.click(screen.getByRole('button', { name: 'Pen' }))
    expect(screen.getByRole('status')).toHaveTextContent('Order #42 selected')
  })
  it('localizes both demos', () => {
    const { unmount } = render(<Demos kind="transition" lang="ja" />)
    expect(screen.getByRole('button', { name: '次の街へ' })).toBeInTheDocument()
    unmount()
    render(<Demos kind="fragment" lang="ja" />)
    expect(screen.getByRole('button', { name: 'ノート' })).toBeInTheDocument()
  })
})
