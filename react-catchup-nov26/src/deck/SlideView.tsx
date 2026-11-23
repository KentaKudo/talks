import { useState } from 'react'
import { SlideTitle } from './SlideTitle'
import type { Language, Slide } from './slides'

function Atom() {
  return <svg className="atom" viewBox="0 0 300 300" fill="none" aria-hidden="true">
    <circle cx="150" cy="150" r="131" fill="var(--aqua)" stroke="currentColor" strokeWidth="3" />
    {[0, 60, 120].map(angle => <ellipse key={angle} cx="150" cy="150" rx="103" ry="39" transform={`rotate(${angle} 150 150)`} stroke="currentColor" strokeWidth="5" />)}
    <circle cx="150" cy="150" r="14" fill="currentColor" />
  </svg>
}

function Code({ code, filename }: { code: string; filename?: string }) {
  return <div className="code-panel"><div className="code-header"><span className="code-lights" aria-hidden="true">● ● ●</span><span>{filename}</span><span>TSX</span></div>
    <pre tabIndex={0}><code>{code.split('\n').map((line, i) => <span className={`code-line ${line.trim().startsWith('//') ? 'code-comment' : ''}`} key={i}><span className="line-number" aria-hidden="true">{i + 1}</span><span>{line || ' '}</span></span>)}</code></pre>
  </div>
}

export function SlideView({ slide, lang }: { slide: Slide; lang: Language }) {
  const layout = slide.layout ?? 'content'
  return <article className={`slide layout-${layout} ${slide.code && !slide.demo ? 'has-code' : ''}`} data-slide={slide.id}>
    <div className="slide-topline"><span className="eyebrow">{slide.section}</span><span className="issue-label">{lang === 'ja' ? 'キャッチアップ便' : 'THE CATCH-UP ISSUE'}</span></div>
    <div className="slide-body">
      <div className="slide-heading"><SlideTitle title={slide.title[lang]} />{slide.subtitle && <p className="subtitle">{slide.subtitle[lang]}</p>}</div>
      {layout === 'cover' && <div className="cover-art"><span className="sticker sticker-pink top-sticker">REACT / 2026</span><Atom /><span className="sticker sticker-yellow bottom-sticker">{lang === 'ja' ? '追いつこう。' : 'LET’S CATCH UP.'}</span></div>}
      {layout === 'statement' && <div className="statement-mark" aria-hidden="true">{slide.id === 'compiler' ? '{ }' : '…'}</div>}
      {layout === 'chapter' && <div className="chapter-number"><span>{slide.number}</span><span className="chapter-caption">{slide.section.split('/ ')[1]}<br />{lang === 'ja' ? '最近のニュース' : 'RECENT NEWS'}</span></div>}
      {slide.demo && <DemoTabs slide={slide} lang={lang} />}
      {slide.code && !slide.demo && <Code code={slide.code} filename={slide.filename} />}
      {slide.codeComparison && <div className="compiler-comparison">
        <Code code={slide.codeComparison.off} filename={lang === 'ja' ? 'Compiler 無効' : 'Compiler off'} />
        <Code code={slide.codeComparison.on} filename={lang === 'ja' ? 'Compiler 有効' : 'Compiler on'} />
      </div>}
      {slide.items && <div className="slide-items">{slide.items.map((item, i) => <div className={`item item-${i}`} key={item.title.en}>
        <span className="item-number">{String(i + 1).padStart(2, '0')}</span><div><h2>{item.title[lang]}</h2><p>{item.text[lang]}</p></div>
      </div>)}</div>}
    </div>
    <div className="slide-bottom">{slide.takeaway ? <p className="takeaway"><span aria-hidden="true">↳</span> {slide.takeaway[lang]}</p> : <span />}
      {slide.source && <a className="source" href={slide.source.url} target="_blank" rel="noreferrer">{slide.source.label} ↗</a>}
    </div>
  </article>
}


function DemoTabs({ slide, lang }: { slide: Slide; lang: Language }) {
  const [selected, setSelected] = useState(0)
  const labels = lang === 'ja' ? ['デモ', 'コード'] : ['Demo', 'Code']

  return <div className="demo-panel">
    <div className="demo-heading">
      <div role="tablist" aria-label={lang === 'ja' ? 'デモの表示' : 'Demo view'} className="demo-tabs">
        {labels.map((label, index) => <button
          key={index}
          type="button"
          role="tab"
          id={`demo-tab-${index}`}
          aria-controls={`demo-pane-${index}`}
          aria-selected={selected === index}
          tabIndex={selected === index ? 0 : -1}
          onClick={() => setSelected(index)}
          onKeyDown={event => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
            event.preventDefault()
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index
            setSelected(next)
            event.currentTarget.parentElement?.querySelectorAll('button')[next]?.focus()
          }}
        >{label}</button>)}
      </div>
      <span className="runtime-label">NATIVE REACT 19.3</span>
    </div>
    <div className="demo-pane" role="tabpanel" id="demo-pane-0" aria-labelledby="demo-tab-0" hidden={selected !== 0}>
      <iframe title="Native React demo" src={`${import.meta.env.BASE_URL}demos/index.html?demo=${slide.demo}&lang=${lang}`} />
    </div>
    <div className="demo-pane demo-code" role="tabpanel" id="demo-pane-1" aria-labelledby="demo-tab-1" hidden={selected !== 1}>
      <Code code={slide.code!} filename={slide.filename} />
    </div>
  </div>
}
