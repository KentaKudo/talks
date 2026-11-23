import { createFileRoute } from '@tanstack/react-router'
import { Deck } from '../deck/Deck'
import { getSlides } from '../deck/get-slides'

export const Route = createFileRoute('/')({
  loader: () => getSlides(),
  // The whole deck is hydrated at once. Slide and language changes use URL hashes.
  staleTime: Infinity,
  component: SlidesPage,
})

function SlidesPage() {
  return <Deck slides={Route.useLoaderData()} />
}
