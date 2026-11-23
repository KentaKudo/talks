import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { slides } from '../src/deck/slides.ts'

// Drive only this isolated Chrome session. Never attach to an existing browser.
const session = `react-slides-check-${process.pid}`
const url = process.env.SLIDES_URL || 'http://127.0.0.1:4173/'
mkdirSync('output/playwright', { recursive: true })
function cli(...args) {
  let output
  try {
    output = execFileSync('npx', ['--no-install', 'playwright-cli', `-s=${session}`, ...args], { encoding: 'utf8', timeout: 60000 })
  } catch (error) {
    throw new Error(error.stdout || error.message)
  }
  if (output.includes('### Error')) throw new Error(output)
  return output
}
try {
  console.log(cli('open', url, '--browser', 'chrome'))
  // Snapshot first so the inspection and interactions below are grounded in the live DOM.
  console.log(cli('snapshot'))
  const code = async (page) => {
    const errors = []
    const failedResponses = []
    const external = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('response', response => { if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`) })
    await page.route('**/*', route => {
      if (new URL(route.request().url()).origin !== new URL(page.url()).origin) {
        external.push(route.request().url())
        return route.abort()
      }
      return route.continue()
    })
    const assert = (condition, message) => { if (!condition) throw new Error(message) }
    await page.setViewportSize({ width: 1440, height: 1000 })
    const base = page.url().split('#')[0]
    await page.reload()
    await page.getByRole('button', { name: 'English', exact: true }).click()
    await page.keyboard.press('ArrowRight')
    assert((await page.locator('h1').innerText()).includes('AI moved fast'), 'Keyboard navigation after clicking a toolbar control')
    await page.getByRole('button', { name: '日本語', exact: true }).click()
    assert(page.url().includes('slide=why&lang=ja'), 'Language switch must preserve the slide')
    await page.keyboard.press('o')
    const dialog = page.getByRole('dialog')
    await dialog.waitFor()
    await dialog.getByRole('button').last().focus()
    await page.keyboard.press('Tab')
    assert(await dialog.getByRole('button', { name: /閉じる/ }).evaluate(el => el === document.activeElement), 'Overview must trap focus')
    await page.keyboard.press('Escape')
    assert(await page.getByRole('button', { name: 'Slide overview' }).evaluate(el => el === document.activeElement), 'Overview must restore focus')

    const clipping = []
    for (const size of [{ width: 1280, height: 720 }, { width: 1920, height: 1080 }]) {
      await page.setViewportSize(size)
      assert(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight && document.documentElement.scrollWidth <= window.innerWidth), `Presentation must fit ${size.width}×${size.height} without scrolling`)
    }
    await page.setViewportSize({ width: 1280, height: 720 })
    for (const lang of ['ja', 'en']) {
      for (const id of SLIDE_IDS) {
        await page.goto(`${base}#slide=${id}&lang=${lang}`)
        await page.locator(`[data-slide="${id}"]`).waitFor()
        await page.evaluate(() => document.fonts.ready)
        const issues = await page.locator('article').evaluate(el => {
          const bounds = el.getBoundingClientRect()
          const body = el.querySelector('.slide-body').getBoundingClientRect()
          return [...el.querySelectorAll('h1, h2, p, pre, .source, .code-panel, .demo-panel')].filter(node => {
            if (!node.getClientRects().length) return false
            const rect = node.getBoundingClientRect()
            const maxBottom = node.closest('.slide-body') ? body.bottom : bounds.bottom
            return rect.bottom > maxBottom + 2 || rect.right > bounds.right + 1 || rect.left < bounds.left - 1 || (node.tagName === 'PRE' && node.scrollWidth > node.clientWidth + 2)
          }).map(node => node.className || node.tagName)
        })
        if (issues.length) clipping.push({ id, lang, issues })
        if (lang === 'ja' && ['hello', 'transition-triggers', 'transition-demo', 'start-stack'].includes(id)) {
          if (id === 'transition-demo') await page.frameLocator('iframe').getByRole('button', { name: '次の街へ', exact: true }).waitFor()
          await page.screenshot({ path: `output/playwright/${id}.png` })
        }
      }
    }
    assert(!clipping.length, `Slide clipping: ${JSON.stringify(clipping)}`)

    await page.goto(`${base}#slide=transition-demo&lang=en`)
    await page.reload()
    const transitionFrame = page.frameLocator('iframe')
    const next = transitionFrame.getByRole('button', { name: 'Next stop', exact: true })
    await next.waitFor()
    await next.evaluate(() => document.fonts.ready)
    assert(await transitionFrame.locator('.native-demo').evaluate(el => [...el.querySelectorAll('.destination-card, button, p')].every(node => {
      const box = node.getBoundingClientRect()
      return box.top >= 0 && box.bottom <= window.innerHeight
    })), 'Native transition demo must fit its iframe at 720p')
    await next.evaluate(() => {
      window.__transitionCalls = 0
      const start = document.startViewTransition?.bind(document)
      if (start) document.startViewTransition = (...args) => { window.__transitionCalls++; return start(...args) }
    })
    await next.click()
    await transitionFrame.getByText('KYOTO', { exact: true }).waitFor()
    assert(await next.evaluate(() => !document.startViewTransition || window.__transitionCalls > 0), 'Native ViewTransition must call the browser API')
    await page.getByRole('tab', { name: 'Code', exact: true }).click()
    const codePanel = page.getByRole('tabpanel', { name: 'Code', exact: true })
    await codePanel.getByText(/setStop\(value/).waitFor()
    assert(await codePanel.evaluate(el => el.scrollHeight <= el.clientHeight + 2), 'Demo code should fit at 720p')
    await page.getByRole('tab', { name: 'Demo', exact: true }).click()
    await transitionFrame.getByText('KYOTO', { exact: true }).waitFor()
    await transitionFrame.getByRole('button', { name: 'Reset demo' }).click()
    await transitionFrame.getByText('TOKYO', { exact: true }).waitFor()
    await page.goto(`${base}#slide=fragment-demo&lang=en`)
    const fragmentFrame = page.frameLocator('iframe')
    const table = fragmentFrame.getByRole('table', { name: 'Order items' })
    const notebook = table.getByRole('button', { name: 'Notebook', exact: true })
    const pen = table.getByRole('button', { name: 'Pen', exact: true })
    const mug = table.getByRole('button', { name: 'Mug', exact: true })
    await notebook.click()
    await fragmentFrame.getByText('Order #42 selected', { exact: true }).waitFor()
    assert(await pen.getAttribute('aria-pressed') === 'true' && await mug.getAttribute('aria-pressed') === 'false', 'Only rows in order #42 should be selected')
    await mug.click()
    await fragmentFrame.getByText('Order #43 selected', { exact: true }).waitFor()
    assert(await notebook.getAttribute('aria-pressed') === 'false', 'Selecting the other order clears the earlier selection')
    await pen.click()
    await fragmentFrame.getByText('Order #42 selected', { exact: true }).waitFor()
    assert(await table.locator('tbody > tr').count() === 3, 'Order rows must stay directly in tbody')
    assert(await fragmentFrame.getByRole('button', { name: 'Reset demo' }).evaluate(el => el.getBoundingClientRect().bottom <= window.innerHeight), 'Native Fragment controls must fit their iframe')

    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`${base}#slide=hello&lang=ja`)
    await page.screenshot({ path: 'output/playwright/mobile.png', fullPage: true })
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'Mobile layout must not scroll sideways')
    assert(!external.length, `Unexpected network dependencies: ${external.join(', ')}`)
    assert(!errors.length, `Browser errors: ${errors.join(', ')}`)
    assert(!failedResponses.length, `Failed asset requests: ${failedResponses.join(', ')}`)
    return 'PASS: all slides in both languages; keyboard, language, overview focus, reload, native demos, mobile layout, and local-only assets.'
  }
  const runnable = code.toString().replace('SLIDE_IDS', JSON.stringify(slides.map(slide => slide.id)))
  const result = cli('run-code', runnable)
  console.log(result.split('### Ran Playwright code')[0])
} finally {
  console.log(cli('close'))
}
