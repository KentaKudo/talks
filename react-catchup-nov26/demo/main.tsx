import { createRoot } from 'react-dom/client'
import { Demos } from './Demos'
import '../src/styles.css'

const params = new URLSearchParams(window.location.search)
const lang = params.get('lang') === 'en' ? 'en' : 'ja'
document.documentElement.lang = lang
document.body.classList.add('demo-document')
createRoot(document.getElementById('root')!).render(<Demos kind={params.get('demo') === 'fragment' ? 'fragment' : 'transition'} lang={lang} />)
