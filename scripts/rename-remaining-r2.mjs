import { S3Client, ListObjectsV2Command, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { readFileSync, writeFileSync } from 'fs'
import { extname } from 'path'

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET = 'nmad-media'
const R2_BASE = 'https://pub-c363c24f86204416a51ce011c270c443.r2.dev/squarespace'

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
})

function toSlug(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

// Load catalog to build mapping from normalized filename → SEO name
const catalogPath = new URL('../data/catalog.json', import.meta.url).pathname
const catalog = JSON.parse(readFileSync(catalogPath, 'utf-8'))

// Build a map: normalized-old-filename → seo-filename (from catalog current URLs)
// catalog URLs are now already SEO names for the 456 renamed ones
// For the remaining 111 we need to find them by matching the artwork

// Step 1: List old-named files in R2
let ContinuationToken
const oldKeys = [] // actual R2 keys with old names

do {
  const res = await client.send(new ListObjectsV2Command({
    Bucket: R2_BUCKET,
    Prefix: 'squarespace/',
    ContinuationToken,
  }))
  for (const obj of (res.Contents || [])) {
    const name = obj.Key.replace('squarespace/', '')
    if (/[A-Z+%]/.test(name) || name.includes(' ')) {
      oldKeys.push(obj.Key)
    }
  }
  ContinuationToken = res.NextContinuationToken
} while (ContinuationToken)

console.log(`Found ${oldKeys.length} old-named files to rename`)

// Step 2: Build mapping old R2 key → SEO name using catalog
// For each old key, normalize it to NFC and match against catalog imageMain/imageDetails
const usedNames = new Set()

// Collect all current SEO names already in use
for (const artwork of catalog.artworks) {
  const urls = [artwork.imageMain, artwork.imageSquare, ...(artwork.imageDetails||[]), ...(artwork.allImages||[])]
  for (const u of urls) {
    if (u && u.includes('r2.dev/squarespace/')) {
      usedNames.add(u.split('/').pop())
    }
  }
}

function uniqueSeoName(base, ext) {
  let name = `${base}${ext}`
  if (!usedNames.has(name)) { usedNames.add(name); return name }
  let i = 2
  while (usedNames.has(`${base}-${i}${ext}`)) i++
  const n = `${base}-${i}${ext}`
  usedNames.add(n)
  return n
}

// Match each old key to an artwork by checking if the old filename (normalized) appears
// in the artwork's original squarespace URL pattern
// We'll do this by cross-referencing the catalog's current URLs against what we know
// about the old filenames

// Build a lookup: NFC-decoded filename → artwork + image type
const filenameToSeo = {}

for (const artwork of catalog.artworks) {
  const artist = toSlug(artwork.artist)
  const title = toSlug(artwork.title)
  const base = `${artist}-${title}`

  // Check allImages which should have the history of what URLs were there
  // We need to match via the seo-filename-mapping which has old→new for the 456 done
  // For the 111 remaining, we'll derive SEO name from artist+title+type
}

// Simpler approach: for each old key in R2, decode it (NFC),
// match it against original squarespace URLs in squarespace-urls.txt or
// just generate a SEO name from the decoded filename parts

const mapping = {} // oldKey → newSeoFilename

for (const oldKey of oldKeys) {
  // Decode the key: oldKey may have %CC%83 etc.
  const decoded = decodeURIComponent(oldKey.replace('squarespace/', '')).normalize('NFC')
  const ext = extname(decoded).toLowerCase() || '.jpg'

  // Try to find which artwork this belongs to by checking the catalog
  // Look for artwork where any allImages URL (before SEO rename) would match
  // Since we don't have the original URLs anymore, we derive from the decoded filename

  // Generate a reasonable SEO slug from the decoded filename
  const nameWithoutExt = decoded.replace(/\.[^.]+$/, '')
  const seoBase = toSlug(nameWithoutExt).slice(0, 80)
  const seoName = uniqueSeoName(seoBase, ext)

  mapping[oldKey] = seoName
}

console.log('Sample mappings:')
Object.entries(mapping).slice(0, 5).forEach(([old, neo]) => {
  console.log(`  ${old.replace('squarespace/','')}`)
  console.log(`  → ${neo}`)
})

// Step 3: Rename in R2 and update catalog
let ok = 0, fail = 0
const urlMapping = {} // old URL → new URL

for (const [oldKey, newName] of Object.entries(mapping)) {
  const newKey = `squarespace/${newName}`
  const oldUrl = `${R2_BASE}/${decodeURIComponent(oldKey.replace('squarespace/', '')).normalize('NFC')}`
  const oldUrlRaw = `${R2_BASE}/${oldKey.replace('squarespace/', '')}`
  const newUrl = `${R2_BASE}/${newName}`

  try {
    // CopySource uses the raw key as-is (the SDK will encode it)
    await client.send(new CopyObjectCommand({
      Bucket: R2_BUCKET,
      CopySource: `${R2_BUCKET}/${oldKey}`,
      Key: newKey,
    }))
    await client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: oldKey }))
    urlMapping[oldUrl] = newUrl
    urlMapping[oldUrlRaw] = newUrl
    process.stdout.write(`✓ ${newName}\n`)
    ok++
  } catch (err) {
    process.stdout.write(`✗ ${oldKey}: ${err.message}\n`)
    fail++
  }
}

console.log(`\nR2 rename: ${ok} ok, ${fail} failed`)

// Step 4: Update catalog.json
let catalogStr = readFileSync(catalogPath, 'utf-8')
let replacements = 0

for (const [oldUrl, newUrl] of Object.entries(urlMapping)) {
  const escaped = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(escaped, 'g')
  const before = catalogStr
  catalogStr = catalogStr.replace(regex, newUrl)
  if (catalogStr !== before) replacements++
}

writeFileSync(catalogPath, catalogStr)
console.log(`catalog.json: ${replacements} URLs updated`)
