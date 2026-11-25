import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const output = 'output/build-comparison'
mkdirSync(output, { recursive: true })
execFileSync('npm', ['run', 'demo:build'], { stdio: 'inherit' })

function build(name, runtime, compiler, mode) {
  const outDir = join(output, name)
  execFileSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--mode', mode], {
    stdio: 'inherit',
    env: { ...process.env, VITE_BASE_PATH: '/', SLIDES_RUNTIME: runtime, SLIDES_COMPILER: compiler, SLIDES_OUT_DIR: outDir },
  })
  const assets = join(outDir, 'client', 'assets')
  return readdirSync(assets).filter(file => file.endsWith('.js')).map(file => readFileSync(join(assets, file)))
}

function size(chunks) {
  return {
    raw: chunks.reduce((sum, chunk) => sum + chunk.length, 0),
    gzip: chunks.reduce((sum, chunk) => sum + gzipSync(chunk).length, 0),
  }
}

function titleExcerpt(chunks) {
  for (const chunk of chunks) {
    const match = chunk.toString().match(/^function SlideTitle\([^\n]*\) \{\n[\s\S]*?^\}/m)
    if (match) return match[0]
  }
  throw new Error('SlideTitle was not found in the unminified browser bundle')
}

const react = size(build('react', 'react', 'on', 'production'))
const redact = size(build('redact', 'redact', 'on', 'production'))
const off = titleExcerpt(build('compiler-off', 'react', 'off', 'inspect'))
const on = titleExcerpt(build('compiler-on', 'react', 'on', 'inspect'))

if (!on.includes('import_compiler_runtime.c') || off.includes('import_compiler_runtime.c')) {
  throw new Error('Expected the compiled SlideTitle alone to contain a memo cache')
}
const report = { react, redact, compiler: { off, on } }
writeFileSync('src/deck/build-comparison.json', JSON.stringify(report, null, 2) + '\n')
console.log(report)
