import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { readFileSync, readdirSync } from 'fs'
import { join, extname } from 'path'
import { lookup } from 'mime-types'

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
})

const R2_BASE = 'https://pub-c363c24f86204416a51ce011c270c443.r2.dev/squarespace'
const R2_BUCKET = 'nmad-media'
const DROPBOX = `${process.env.HOME}/Dropbox/01_OJK/01_Documentos/DBDocs/04_NMAD/Sitio Web/imagenes`

// Step 1: List what's in R2
let ContinuationToken
const r2Files = new Set()
do {
  const res = await client.send(new ListObjectsV2Command({ Bucket: R2_BUCKET, Prefix: 'squarespace/', ContinuationToken }))
  for (const obj of (res.Contents || [])) r2Files.add(obj.Key.replace('squarespace/', ''))
  ContinuationToken = res.NextContinuationToken
} while (ContinuationToken)

// Step 2: Find broken URLs in catalog
const catalogPath = new URL('../data/catalog.json', import.meta.url).pathname
const catalog = JSON.parse(readFileSync(catalogPath, 'utf-8'))

const brokenNames = new Set()
for (const artwork of catalog.artworks) {
  for (const url of [artwork.imageMain, artwork.imageSquare, ...(artwork.imageDetails||[])]) {
    if (!url?.includes('r2.dev/squarespace/')) continue
    const name = url.split('/').pop()
    if (!r2Files.has(name)) brokenNames.add(name)
  }
}
console.log(`Broken URLs: ${brokenNames.size}`)

// Step 3: Build Dropbox index — key: slug of decoded filename → local path
function toSlug(str) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const dropboxFiles = readdirSync(DROPBOX).filter(f => !f.startsWith('.'))
const dropboxIndex = new Map()
for (const f of dropboxFiles) {
  const decoded = decodeURIComponent(f.replace(/\+/g, ' ')).normalize('NFC')
  const slug = toSlug(decoded.replace(/\.[^.]+$/, ''))
  dropboxIndex.set(slug, join(DROPBOX, f))
}

// Step 4: Load seo-filename-mapping (old_decoded → seo_name) for reverse lookup
const mapping = JSON.parse(readFileSync(new URL('../data/seo-filename-mapping.json', import.meta.url).pathname, 'utf-8'))
const reverseMapping = new Map() // seo_name → old_decoded_filename
for (const [old, neo] of Object.entries(mapping)) reverseMapping.set(neo, old)

// Step 5: For each broken SEO name, find the Dropbox file and upload
let ok = 0, notFound = 0

for (const brokenName of brokenNames) {
  // Try reverse mapping to get original filename
  const originalDecoded = reverseMapping.get(brokenName)
  let localPath = null

  if (originalDecoded) {
    const slug = toSlug(originalDecoded.replace(/\+/g, ' ').replace(/\.[^.]+$/, ''))
    localPath = dropboxIndex.get(slug)
  }

  // Fallback: try fuzzy match by slug of the broken SEO name itself
  if (!localPath) {
    const brokenSlug = brokenName.replace(/\.[^.]+$/, '')
    // Try to find by matching parts of the slug
    for (const [slug, path] of dropboxIndex) {
      if (slug.includes(brokenSlug) || brokenSlug.includes(slug)) {
        localPath = path
        break
      }
    }
  }

  if (!localPath) {
    console.log(`✗ No Dropbox file found for: ${brokenName}`)
    notFound++
    continue
  }

  try {
    await client.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: `squarespace/${brokenName}`,
      Body: readFileSync(localPath),
      ContentType: lookup(localPath) || 'image/jpeg',
    }))
    console.log(`✓ ${brokenName}`)
    ok++
  } catch (err) {
    console.log(`✗ Upload failed ${brokenName}: ${err.message}`)
    notFound++
  }
}

console.log(`\nDone: ${ok} uploaded, ${notFound} not found`)
