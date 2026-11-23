import { Fragment, ViewTransition, startTransition, useEffect, useRef, useState, type FragmentInstance } from 'react'
import type {} from 'react-dom'

export function Demos({ kind, lang }: { kind: 'transition' | 'fragment'; lang: 'ja' | 'en' }) {
  const [revision, setRevision] = useState(0)
  return <div className="native-demo"><div className="demo-content" key={revision}>
    {kind === 'transition' ? <TransitionDemo ja={lang === 'ja'} /> : <FragmentDemo ja={lang === 'ja'} />}
  </div><button className="reset-button" onClick={() => setRevision(value => value + 1)} aria-label={lang === 'ja' ? 'デモをリセット' : 'Reset demo'}>{lang === 'ja' ? 'リセット ↺' : 'Reset ↺'}</button></div>
}

function TransitionDemo({ ja }: { ja: boolean }) {
  const [stop, setStop] = useState(0)
  const cities = ['TOKYO', 'KYOTO', 'OSAKA']
  const japaneseCities = ['東京', '京都', '大阪']
  return <>
    <ViewTransition>
      <div className={`destination-card destination-${stop}`}>
        <span className="ticket-label">REACT RAIL / {String(stop + 1).padStart(2, '0')}</span>
        <strong>{cities[stop]}</strong><span className="city-japanese">{japaneseCities[stop]}</span>
        <div className="rail-track" aria-hidden="true"><span /><span /><span /></div>
      </div>
    </ViewTransition>
    <button className="pill-button primary" onClick={() => startTransition(() => setStop(value => (value + 1) % cities.length))}>{ja ? '次の街へ' : 'Next stop'} <span aria-hidden="true">→</span></button>
    <p className="demo-explanation">startTransition → setState → ViewTransition</p>
    {typeof document !== 'undefined' && !('startViewTransition' in document) && <p className="demo-fallback">{ja ? 'このブラウザではアニメーションなしで切り替わります。' : 'This browser switches cards without animation.'}</p>}
  </>
}

function FragmentDemo({ ja }: { ja: boolean }) {
  const group = useRef<FragmentInstance>(null)
  const [wide, setWide] = useState(false)
  const [widths, setWidths] = useState<Record<string, number>>({})

  useEffect(() => {
    const fragment = group.current
    if (!fragment || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(entries => {
      setWidths(previous => {
        const next = { ...previous }
        for (const { target, contentRect } of entries) {
          next[target.id] = Math.round(contentRect.width)
        }
        return next
      })
    })
    fragment.observeUsing(observer)
    return () => fragment.unobserveUsing(observer)
  }, [])

  return <>
    <div className={`fragment-grid${wide ? ' fragment-grid-wide' : ''}`} role="group" aria-label="CSS Grid">
      <Fragment ref={group}>
        <GridCard id="summary-card" title={ja ? '概要' : 'Summary'} width={widths['summary-card']} />
        <GridCard id="activity-card" title={ja ? '履歴' : 'Activity'} width={widths['activity-card']} />
      </Fragment>
    </div>
    <button className="pill-button primary" aria-pressed={wide} onClick={() => setWide(value => !value)}>
      {ja ? '左の列を広げる' : 'Widen the first column'}
    </button>
    <p className="demo-explanation">1 ResizeObserver → 2 {ja ? '枚のカード' : 'cards'} <span className="no-wrapper">{ja ? '追加の div なし' : 'no extra div'}</span></p>
  </>
}

function GridCard({ id, title, width }: { id: string; title: string; width?: number }) {
  return <article id={id} className="fragment-card">
    <strong>{title}</strong>
    <span>{width === undefined ? '—' : `${width} px`}</span>
  </article>
}
