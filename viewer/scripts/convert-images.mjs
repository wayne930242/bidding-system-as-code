import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '../public')

// Convert OG image
const ogSvg = readFileSync(join(publicDir, 'og-image.svg'), 'utf-8')
const ogResvg = new Resvg(ogSvg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: true }
})
const ogPng = ogResvg.render().asPng()
writeFileSync(join(publicDir, 'og-image.png'), ogPng)
console.log('✓ Created og-image.png (1200x630)')

// Convert Apple Touch Icon
const iconSvg = readFileSync(join(publicDir, 'apple-touch-icon.svg'), 'utf-8')
const iconResvg = new Resvg(iconSvg, {
  fitTo: { mode: 'width', value: 180 },
  font: { loadSystemFonts: true }
})
const iconPng = iconResvg.render().asPng()
writeFileSync(join(publicDir, 'apple-touch-icon.png'), iconPng)
console.log('✓ Created apple-touch-icon.png (180x180)')

console.log('\nDone! Images saved to viewer/public/')
