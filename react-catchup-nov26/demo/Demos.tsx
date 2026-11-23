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
  const [selected, setSelected] = useState<number | null>(null)
  return <>
    <table className="order-table" aria-label={ja ? '注文明細' : 'Order items'}>
      <thead><tr><th scope="col">{ja ? '注文' : 'Order'}</th><th scope="col">{ja ? '商品' : 'Item'}</th></tr></thead>
      <tbody>
        <OrderRows order={42} items={ja ? ['ノート', 'ペン'] : ['Notebook', 'Pen']} selected={selected} onSelect={setSelected} />
        <OrderRows order={43} items={ja ? ['マグカップ'] : ['Mug']} selected={selected} onSelect={setSelected} />
      </tbody>
    </table>
    <p className="order-selection" role="status">
      {selected === null
        ? (ja ? '明細を押して注文を選ぶ' : 'Select an item to choose its order')
        : (ja ? `注文 #${selected} を選択中` : `Order #${selected} selected`)}
    </p>
  </>
}

function OrderRows({ order, items, selected, onSelect }: {
  order: number
  items: string[]
  selected: number | null
  onSelect: (order: number) => void
}) {
  const rows = useRef<FragmentInstance>(null)
  useEffect(() => {
    const fragment = rows.current
    if (!fragment) return
    const selectOrder = () => onSelect(order)
    fragment.addEventListener('click', selectOrder)
    return () => fragment.removeEventListener('click', selectOrder)
  }, [order, onSelect])

  return <Fragment ref={rows}>
    {items.map(item => <tr key={item}>
      <td>#{order}</td>
      <td><button className="order-item" aria-pressed={selected === order}>{item}</button></td>
    </tr>)}
  </Fragment>
}
