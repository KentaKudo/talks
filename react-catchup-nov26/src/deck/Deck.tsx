import { useEffect, useRef, useState } from 'react'
import { slides, type Language } from './slides'
import { destination, positionHash, readPosition, type Direction } from './navigation'
import { SlideView } from './SlideView'

const ids = slides.map(slide => slide.id)
const keys: Record<string, Direction> = {
  ArrowRight: 'next', PageDown: 'next', ' ': 'next',
  ArrowLeft: 'previous', PageUp: 'previous', Home: 'first', End: 'last',
}

export function Deck() {
  // Start with identical server/client markup; restore browser hash after hydration.
  const [position, setPosition] = useState({ index: 0, lang: 'ja' as Language })
  const [overview, setOverview] = useState(false)
  const [notice, setNotice] = useState('')
  const overviewButton = useRef<HTMLButtonElement>(null)
  const dialog = useRef<HTMLDivElement>(null)
  const wasOverview = useRef(false)
  const { index, lang } = position
  const slide = slides[index]

  useEffect(() => {
    const restore = () => setPosition(readPosition(window.location.hash, ids))
    restore()
    window.addEventListener('hashchange', restore)
    return () => window.removeEventListener('hashchange', restore)
  }, [])

  useEffect(() => { document.documentElement.lang = lang }, [lang])
  useEffect(() => {
    if (overview) dialog.current?.querySelector<HTMLButtonElement>('[aria-current="true"]')?.focus()
    else if (wasOverview.current) overviewButton.current?.focus()
    wasOverview.current = overview
  }, [overview])

  function update(nextIndex: number, nextLang = lang) {
    setPosition({ index: nextIndex, lang: nextLang })
    // A hash per slide works on GitHub Pages without server-side fallback routes.
    window.location.hash = positionHash(slides[nextIndex].id, nextLang)
  }
  function go(direction: Direction) { update(destination(index, direction, slides.length)) }
  function closeOverview() {
    setOverview(false)
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen()
      else throw new Error('unsupported')
      setNotice('')
    } catch {
      setNotice(lang === 'ja' ? 'フルスクリーンを開けません。ブラウザの全画面表示をお使いください。' : 'Fullscreen unavailable. Use your browser’s fullscreen command.')
    }
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (overview) {
        if (event.key === 'Escape' || event.key === 'o') { event.preventDefault(); closeOverview() }
        if (event.key === 'Tab') {
          const buttons = dialog.current!.querySelectorAll<HTMLButtonElement>('button')
          const first = buttons[0], last = buttons[buttons.length - 1]
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
        }
        return
      }
      const target = event.target
      if (target instanceof Element && target.closest('input, textarea, select, [contenteditable], iframe')) return
      if (event.key === ' ' && target instanceof Element && target.closest('button, a')) return
      if (keys[event.key]) { event.preventDefault(); go(keys[event.key]) }
      if (event.key === 'o') { event.preventDefault(); setOverview(true) }
      if (event.key === 'f') { event.preventDefault(); void fullscreen() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return <>
    <div className="presentation" inert={overview}>
      <header className="toolbar">
        <a className="wordmark" href="#slide=hello&lang=ja" aria-label="React catch-up home">r<span className="wordmark-dot">.</span> catch-up <span className="edition">/ NOV 2026</span></a>
        <div className="toolbar-actions">
          <div className="language-switch" aria-label="Slide language">
            <button aria-pressed={lang === 'ja'} onClick={() => update(index, 'ja')}>日本語</button>
            <button aria-pressed={lang === 'en'} onClick={() => update(index, 'en')}>English</button>
          </div>
          <button className="icon-button" ref={overviewButton} aria-label="Slide overview" title={lang === 'ja' ? '一覧 (O)' : 'Overview (O)'} onClick={() => setOverview(true)}><GridIcon /></button>
          <button className="icon-button" aria-label="Fullscreen" title={lang === 'ja' ? '全画面 (F)' : 'Fullscreen (F)'} onClick={() => void fullscreen()}><FullscreenIcon /></button>
        </div>
      </header>
      <main className="stage" aria-label={lang === 'ja' ? 'スライド' : 'Slide'}>
        <SlideView key={slide.id} slide={slide} lang={lang} />
      </main>
      <footer className="deck-footer">
        <div className="footer-meta"><span className="live-dot" /><span>REACT CATCH-UP</span><span className="keyboard-hint">← → <span>{lang === 'ja' ? '移動' : 'navigate'}</span> / O <span>{lang === 'ja' ? '一覧' : 'overview'}</span> / F <span>{lang === 'ja' ? '全画面' : 'fullscreen'}</span></span></div>
        <nav aria-label="Slide navigation">
          <button className="icon-button" aria-label="Previous slide" disabled={index === 0} onClick={() => go('previous')}>←</button>
          <span className="slide-count" aria-live="polite">{String(index + 1).padStart(2, '0')} / {slides.length}</span>
          <button className="icon-button next-button" aria-label="Next slide" disabled={index === slides.length - 1} onClick={() => go('next')}>→</button>
        </nav>
      </footer>
      <div className="progress-track" aria-hidden="true"><div style={{ width: `${(index + 1) / slides.length * 100}%` }} /></div>
      {notice && <p className="notice" role="status">{notice}</p>}
    </div>
    {overview && <div className="overview-backdrop">
      <div className="overview" ref={dialog} role="dialog" aria-modal="true" aria-labelledby="overview-title">
        <div className="overview-header"><h2 id="overview-title">{lang === 'ja' ? '今日のルート' : 'Today’s route'}</h2><button className="pill-button" onClick={closeOverview}>{lang === 'ja' ? '閉じる' : 'Close'} <span>Esc</span></button></div>
        <div className="overview-grid">{slides.map((item, i) => <button key={item.id} aria-current={i === index ? 'true' : undefined} className={`overview-slide tone-${i % 3}`} onClick={() => { update(i); closeOverview() }}>
          <span className="overview-number">{String(i + 1).padStart(2, '0')}</span>{' '}<span>{item.title[lang]}</span>{' '}<small>{item.section}</small>
        </button>)}</div>
      </div>
    </div>}
  </>
}

function GridIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="3" width="6" height="6" rx="1" /><rect x="3" y="15" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" /></svg> }
function FullscreenIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" /></svg> }
