import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import stylesheet from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Meanwhile, in React. / React Catch-up Nov 2026' },
      { name: 'theme-color', content: '#f2eee3' },
      { name: 'description', content: 'React 19.3, Next.js 16.4, TanStack Start, Redact, and React Compiler. A bilingual catch-up in twenty minutes.' },
    ],
    links: [{ rel: 'stylesheet', href: stylesheet }, { rel: 'icon', type: 'image/svg+xml', href: `${import.meta.env.BASE_URL}favicon.svg` }],
  }),
  component: () => <html lang="ja"><head><HeadContent /></head><body><Outlet /><Scripts /></body></html>,
})
