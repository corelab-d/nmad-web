import { S3Client, CopyObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { readFileSync, writeFileSync } from 'fs'

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET = process.env.R2_BUCKET || 'nmad-media'
const R2_BASE = 'https://pub-c363c24f86204416a51ce011c270c443.r2.dev/squarespace'

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
})

const mappingPath = new URL('../data/seo-filename-mapping.json', import.meta.url).pathname
const catalogPath = new URL('../data/catalog.json', import.meta.url).pathname

const mapping = JSON.parse(readFileSync(mappingPath, 'utf-8'))
const catalog = JSON.parse(readFileSync(catalogPath, 'utf-8'))

// Step 1: Rename files in R2 (copy + delete)
console.log(`Renaming ${Object.keys(mapping).length} files in R2...`)
let ok = 0, fail = 0

for (const [oldName, newName] of Object.entries(mapping)) {
  const oldKey = `squarespace/${oldName}`
  const newKey = `squarespace/${newName}`

  // Check if old key still exists (skip if already renamed)
  try {
    await client.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: oldKey }))
  } catch {
    // Already renamed or doesn't exist — skip silently
    continue
  }

  try {
    await client.send(new CopyObjectCommand({
      Bucket: R2_BUCKET,
      CopySource: `${R2_BUCKET}/${oldKey.split('/').map(p => encodeURIComponent(p)).join('/')}`,
      Key: newKey,
    }))
    await client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: oldKey }))
    process.stdout.write(`✓ ${newName}\n`)
    ok++
  } catch (err) {
    process.stdout.write(`✗ ${oldName}: ${err.message}\n`)
    fail++
  }
}

console.log(`\nR2 rename: ${ok} ok, ${fail} failed`)

// Step 2: Update catalog.json URLs
function convertUrl(url) {
  if (!url || !url.includes('r2.dev/squarespace/')) return url
  const oldFilename = decodeURIComponent(url.split('/').pop().split('?')[0])
  const newFilename = mapping[oldFilename]
  if (!newFilename) return url
  return `${R2_BASE}/${newFilename}`
}

for (const artwork of catalog.artworks) {
  artwork.imageMain = convertUrl(artwork.imageMain)
  artwork.imageSquare = convertUrl(artwork.imageSquare)
  if (artwork.imageDetails) artwork.imageDetails = artwork.imageDetails.map(convertUrl)
  if (artwork.allImages) artwork.allImages = artwork.allImages.map(convertUrl)
  if (artwork.featuredImage) artwork.featuredImage = convertUrl(artwork.featuredImage)
}

writeFileSync(catalogPath, JSON.stringify(catalog, null, 2))
console.log('catalog.json updated with SEO-friendly URLs.')
