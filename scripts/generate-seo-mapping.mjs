import { readFileSync, writeFileSync } from 'fs'
import { extname } from 'path'

const catalog = JSON.parse(readFileSync(new URL('../data/catalog.json', import.meta.url).pathname, 'utf-8'))

const R2_BASE = 'https://pub-c363c24f86204416a51ce011c270c443.r2.dev/squarespace'

function toSlug(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

function filenameFromUrl(url) {
  return decodeURIComponent(url.split('/').pop().split('?')[0])
}

// Build mapping: old filename → new filename
const mapping = {}
const usedNames = new Set()

function uniqueName(base, ext) {
  let name = `${base}${ext}`
  if (!usedNames.has(name)) {
    usedNames.add(name)
    return name
  }
  let i = 2
  while (usedNames.has(`${base}-${i}${ext}`)) i++
  const n = `${base}-${i}${ext}`
  usedNames.add(n)
  return n
}

for (const artwork of catalog.artworks) {
  const artist = toSlug(artwork.artist)
  const title = toSlug(artwork.title)
  const base = `${artist}-${title}`

  // imageMain
  if (artwork.imageMain && artwork.imageMain.includes('r2.dev/squarespace/')) {
    const oldFilename = filenameFromUrl(artwork.imageMain)
    if (!mapping[oldFilename]) {
      const ext = extname(oldFilename).toLowerCase() || '.jpg'
      mapping[oldFilename] = uniqueName(base, ext)
    }
  }

  // imageSquare
  if (artwork.imageSquare && artwork.imageSquare.includes('r2.dev/squarespace/')) {
    const oldFilename = filenameFromUrl(artwork.imageSquare)
    if (!mapping[oldFilename]) {
      const ext = extname(oldFilename).toLowerCase() || '.jpg'
      mapping[oldFilename] = uniqueName(`${base}-sq`, ext)
    }
  }

  // imageDetails
  if (artwork.imageDetails) {
    artwork.imageDetails.forEach((url, i) => {
      if (!url.includes('r2.dev/squarespace/')) return
      const oldFilename = filenameFromUrl(url)
      if (!mapping[oldFilename]) {
        const ext = extname(oldFilename).toLowerCase() || '.jpg'
        mapping[oldFilename] = uniqueName(`${base}-detalle-${i + 1}`, ext)
      }
    })
  }
}

writeFileSync(
  new URL('../data/seo-filename-mapping.json', import.meta.url).pathname,
  JSON.stringify(mapping, null, 2)
)

console.log(`Mapping generated: ${Object.keys(mapping).length} files`)
console.log('Sample:')
Object.entries(mapping).slice(0, 5).forEach(([old, neo]) => {
  console.log(`  ${old}`)
  console.log(`  → ${neo}`)
  console.log()
})
