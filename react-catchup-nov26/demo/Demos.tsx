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

const updates = [
  { id: 'search', en: 'Search by tag', ja: 'タグで検索' },
  { id: 'export', en: 'Export your notes', ja: 'メモを書き出す' },
  { id: 'theme', en: 'Choose a color theme', ja: '配色テーマを選ぶ' },
]
const visibleThreshold = 0.65

function FragmentDemo({ ja }: { ja: boolean }) {
  const feed = useRef<HTMLDivElement>(null)
  const cards = useRef<FragmentInstance>(null)
  const [seen, setSeen] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    const root = feed.current
    const fragment = cards.current
    if (!root || !fragment || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(entries => {
      setSeen(previous => {
        const next = new Set(previous)
        for (const entry of entries) {
          if (entry.intersectionRatio >= visibleThreshold) next.add(entry.target.id)
        }
        return next.size === previous.size ? previous : next
      })
    }, { root, threshold: visibleThreshold })

    fragment.observeUsing(observer)
    return () => {
      fragment.unobserveUsing(observer)
      observer.disconnect()
    }
  }, [])

  const complete = seen.size === updates.length
  return <>
    <div className="update-progress">
      <p role="status">{ja
        ? (complete ? '✓ すべて表示済み' : `${seen.size} / ${updates.length} 件を表示済み`)
        : (complete ? `✓ All ${updates.length} seen` : `${seen.size} / ${updates.length} seen`)}</p>
      <progress value={seen.size} max={updates.length} aria-label={ja ? '表示済みの変更点' : 'Updates seen'} />
    </div>
    <div ref={feed} className="update-feed" role="region" aria-label={ja ? '変更点一覧' : 'Release notes'} tabIndex={0}>
      <Fragment ref={cards}>
        {updates.map((update, index) => <article className="update-card" id={update.id} key={update.id}>
          <span className="update-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <strong>{update[ja ? 'ja' : 'en']}</strong>
          {seen.has(update.id) && <span className="update-seen">{ja ? '表示済み' : 'Seen'}</span>}
        </article>)}
      </Fragment>
    </div>
    <p className="demo-explanation">{ja ? '一覧の中を下へスクロール ↓' : 'Scroll down inside the list ↓'}</p>
  </>
}
