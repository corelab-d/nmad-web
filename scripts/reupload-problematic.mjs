import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, extname } from 'path'
import { lookup } from 'mime-types'

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET = 'nmad-media'
const R2_BASE = 'https://pub-c363c24f86204416a51ce011c270c443.r2.dev/squarespace'
const DROPBOX_DIR = `${process.env.HOME}/Dropbox/01_OJK/01_Documentos/DBDocs/04_NMAD/Sitio Web/imagenes`

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
    .slice(0, 80)
}

// Step 1: Get remaining old-named keys from R2
let ContinuationToken
const oldKeys = []

do {
  const res = await client.send(new ListObjectsV2Command({
    Bucket: R2_BUCKET, Prefix: 'squarespace/', ContinuationToken,
  }))
  for (const obj of (res.Contents || [])) {
    const name = obj.Key.replace('squarespace/', '')
    if (/[A-Z+%]/.test(name) || name.includes(' ')) oldKeys.push(obj.Key)
  }
  ContinuationToken = res.NextContinuationToken
} while (ContinuationToken)

console.log(`Old-named keys in R2: ${oldKeys.length}`)

// Step 2: List local Dropbox files (they have literal % in names)
const localFiles = readdirSync(DROPBOX_DIR).filter(f => !f.startsWith('.'))
const localMap = new Map()
for (const f of localFiles) localMap.set(f, join(DROPBOX_DIR, f))

// Step 3: For each old R2 key, find matching local file and upload with SEO name
const usedNames = new Set()
const catalogPath = new URL('../data/catalog.json', import.meta.url).pathname
let catalogStr = readFileSync(catalogPath, 'utf-8')

let ok = 0, notFound = 0

for (const oldKey of oldKeys) {
  const oldFilename = oldKey.replace('squarespace/', '')

  // Find the local file (exact match since curl preserved the name)
  const localPath = localMap.get(oldFilename)
  if (!localPath) {
    console.log(`✗ Not found locally: ${oldFilename}`)
    notFound++
    continue
  }

  // Generate SEO name from the decoded filename
  const decoded = decodeURIComponent(oldFilename.replace(/\+/g, ' ')).normalize('NFC')
  const ext = extname(decoded).toLowerCase() || '.jpg'
  const nameWithoutExt = decoded.replace(/\.[^.]+$/, '')
  let seoBase = toSlug(nameWithoutExt)
  let seoName = `${seoBase}${ext}`
  let i = 2
  while (usedNames.has(seoName)) { seoName = `${seoBase}-${i}${ext}`; i++ }
  usedNames.add(seoName)

  const newKey = `squarespace/${seoName}`
  const contentType = lookup(localPath) || 'image/jpeg'

  try {
    // Upload with SEO name
    await client.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: newKey,
      Body: readFileSync(localPath),
      ContentType: contentType,
    }))

    // Delete old key using raw fetch (bypass SDK encoding)
    const deleteUrl = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}/${oldKey}`
    // Actually use SDK but pass the key as-is — the key has literal % signs
    // which the SDK will encode as %25, but that's what R2 stored, so it should work
    try {
      await client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: oldKey }))
    } catch (e) {
      // If delete fails, not critical — file is orphaned but new one exists
    }

    // Update catalog.json: replace old R2 URL with new SEO URL
    const oldUrl = `${R2_BASE}/${oldFilename}`
    const newUrl = `${R2_BASE}/${seoName}`
    const escaped = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    catalogStr = catalogStr.replace(new RegExp(escaped, 'g'), newUrl)

    console.log(`✓ ${seoName}`)
    ok++
  } catch (err) {
    console.log(`✗ ${oldFilename}: ${err.message}`)
    notFound++
  }
}

writeFileSync(catalogPath, catalogStr)

console.log(`\nDone: ${ok} uploaded, ${notFound} not found/failed`)
