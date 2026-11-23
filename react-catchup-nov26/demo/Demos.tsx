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
  return <>
    <div className="fragment-grid">
      <div className="grid-label">CSS GRID</div>
      <Fragment ref={group}>
        <label>{ja ? '名前' : 'Name'}<input placeholder="React" /></label>
        <label>{ja ? 'メール' : 'Email'}<input type="email" placeholder="hello@react.dev" /></label>
      </Fragment>
    </div>
    <button className="pill-button primary" onClick={() => group.current?.focus()}>{ja ? '最初の入力にフォーカス' : 'Focus first field'} <span aria-hidden="true">→</span></button>
    <p className="demo-explanation">grid → label + label <span className="no-wrapper">{ja ? '追加の div なし' : 'no extra div'}</span></p>
  </>
}
