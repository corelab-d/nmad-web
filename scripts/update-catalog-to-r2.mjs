import { readFileSync, writeFileSync } from 'fs'

const R2_BASE = 'https://pub-c363c24f86204416a51ce011c270c443.r2.dev/squarespace'
const SQUARESPACE_BASE = 'https://images.squarespace-cdn.com/content/v1/649b25e987e97d38e868cd28/'

const catalogPath = new URL('../data/catalog.json', import.meta.url).pathname
const catalog = JSON.parse(readFileSync(catalogPath, 'utf-8'))

function convertUrl(url) {
  if (!url || !url.includes('squarespace-cdn.com')) return url
  const filename = url.split('/').pop().split('?')[0]
  return `${R2_BASE}/${filename}`
}

let changed = 0

for (const artwork of catalog.artworks) {
  if (artwork.imageMain && artwork.imageMain.includes('squarespace-cdn.com')) {
    artwork.imageMain = convertUrl(artwork.imageMain)
    changed++
  }
  if (artwork.imageSquare && artwork.imageSquare.includes('squarespace-cdn.com')) {
    artwork.imageSquare = convertUrl(artwork.imageSquare)
    changed++
  }
  if (artwork.imageDetails) {
    artwork.imageDetails = artwork.imageDetails.map(u => convertUrl(u))
  }
  if (artwork.allImages) {
    artwork.allImages = artwork.allImages.map(u => convertUrl(u))
  }
  if (artwork.featuredImage && artwork.featuredImage.includes('squarespace-cdn.com')) {
    artwork.featuredImage = convertUrl(artwork.featuredImage)
    changed++
  }
}

writeFileSync(catalogPath, JSON.stringify(catalog, null, 2))
console.log(`Done. ${changed} image fields updated to R2 URLs.`)
