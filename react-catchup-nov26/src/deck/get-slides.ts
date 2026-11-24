import { createServerFn } from '@tanstack/react-start'

export const getSlides = createServerFn({ method: 'GET' }).handler(async () => {
  const { slides } = await import('./slides')
  return slides
})
