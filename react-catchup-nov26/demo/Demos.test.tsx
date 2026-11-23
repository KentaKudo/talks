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
  it('focuses children via a Fragment ref without a wrapper', () => {
    render(<Demos kind="fragment" lang="en" />)
    fireEvent.click(screen.getByRole('button', { name: 'Focus first field' }))
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus()
    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: 'React' } })
    fireEvent.click(screen.getByRole('button', { name: 'Reset demo' }))
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('')
  })
  it('localizes both demos', () => {
    const { unmount } = render(<Demos kind="transition" lang="ja" />)
    expect(screen.getByRole('button', { name: '次の街へ' })).toBeInTheDocument()
    unmount()
    render(<Demos kind="fragment" lang="ja" />)
    fireEvent.click(screen.getByRole('button', { name: '最初の入力にフォーカス' }))
    expect(screen.getByRole('textbox', { name: '名前' })).toHaveFocus()
  })
})
