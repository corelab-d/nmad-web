import { put } from '@vercel/blob'
import fs from 'fs'
import path from 'path'

const IMAGES_DIR = '/Users/omarjkuri/DEV/nmad-imagenes'
const CATALOG_PATH = '/Users/omarjkuri/DEV/nmad-web/data/catalog.json'
const MAP_PATH = '/Users/omarjkuri/DEV/nmad-web/data/squarespace-to-blob.json'

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'))

// Load existing map if any
let urlMap = {}
if (fs.existsSync(MAP_PATH)) {
  urlMap = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'))
}

// Collect all unique squarespace URLs
const allUrls = new Set()
for (const a of catalog.artworks) {
  const imgs = [a.imageMain, a.imageSquare, ...(a.imageDetails||[]), ...(a.allImages||[])].filter(Boolean)
  for (const img of imgs) {
    if (img && img.includes('squarespace')) allUrls.add(img)
  }
}

console.log(`Total URLs: ${allUrls.size}`)
let uploaded = 0, skipped = 0, failed = 0

for (const url of allUrls) {
  if (urlMap[url]) { skipped++; continue }

  const fname = url.split('/').pop().split('?')[0]
  const localPath = path.join(IMAGES_DIR, fname)

  if (!fs.existsSync(localPath)) {
    console.log(`MISSING: ${fname}`)
    failed++
    continue
  }

  try {
    const file = fs.readFileSync(localPath)
    const ext = path.extname(fname).toLowerCase().replace('.', '')
    const mimeMap = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp' }
    const contentType = mimeMap[ext] || 'image/jpeg'

    const blobName = `squarespace-migration/${fname}`
    const result = await put(blobName, file, { access: 'public', contentType, token: process.env.BLOB_TOKEN })
    urlMap[url] = result.url
    uploaded++
    if (uploaded % 10 === 0) {
      fs.writeFileSync(MAP_PATH, JSON.stringify(urlMap, null, 2))
      console.log(`Subidas: ${uploaded}, saltadas: ${skipped}, errores: ${failed}`)
    }
  } catch (err) {
    console.log(`ERROR ${fname}: ${err.message}`)
    failed++
  }
}

fs.writeFileSync(MAP_PATH, JSON.stringify(urlMap, null, 2))
console.log(`\nFinalizado: ${uploaded} subidas, ${skipped} ya existían, ${failed} errores`)

// Update catalog.json
let catalogStr = JSON.stringify(catalog, null, 2)
let replacements = 0
for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
  if (catalogStr.includes(oldUrl)) {
    catalogStr = catalogStr.split(oldUrl).join(newUrl)
    replacements++
  }
}
fs.writeFileSync(CATALOG_PATH, catalogStr)
console.log(`catalog.json actualizado: ${replacements} URLs reemplazadas`)
