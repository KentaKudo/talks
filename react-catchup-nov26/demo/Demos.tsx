import { Fragment, ViewTransition, startTransition, useRef, useState, type FragmentInstance } from 'react'
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
  const wrapper = useRef<HTMLDivElement>(null)
  const [wrapped, setWrapped] = useState(false)
  const [count, setCount] = useState<number | null>(null)
  const cards = <>
    <article className="fragment-card">A</article>
    <article className="fragment-card">B</article>
  </>

  function measure() {
    const target = wrapped ? wrapper.current : group.current
    setCount(target?.getClientRects().length ?? null)
  }

  function chooseWrapper(value: boolean) {
    setWrapped(value)
    setCount(null)
  }

  return <>
    <div className="fragment-controls" role="group" aria-label={ja ? '比べるレイアウト' : 'Layout to compare'}>
      <button className="pill-button" aria-pressed={!wrapped} onClick={() => chooseWrapper(false)}>
        {ja ? 'Fragment でまとめる' : 'With Fragment'}
      </button>
      <button className="pill-button" aria-pressed={wrapped} onClick={() => chooseWrapper(true)}>
        {ja ? 'div で囲む' : 'With div'}
      </button>
    </div>
    <div className="fragment-grid" role="group" aria-label="CSS Grid" data-measured={Boolean(count)}>
      {wrapped
        ? <div ref={wrapper} className="fragment-wrapper">{cards}</div>
        : <Fragment ref={group}>{cards}</Fragment>}
    </div>
    <button className="pill-button primary" onClick={measure}>{ja ? '範囲を表示' : 'Show bounds'}</button>
    <p className="demo-explanation fragment-result" role="status">
      {count !== null && (ja ? `取得した領域: ${count} 個` : `${count} ${count === 1 ? 'rectangle' : 'rectangles'}`)}
    </p>
  </>
}
