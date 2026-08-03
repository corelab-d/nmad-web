import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { readFileSync, writeFileSync } from 'fs'

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
})

const R2_BASE = 'https://pub-c363c24f86204416a51ce011c270c443.r2.dev/squarespace'
const R2_BUCKET = 'nmad-media'

// Step 1: List all R2 files in squarespace/
let ContinuationToken
const r2Files = new Set()

do {
  const res = await client.send(new ListObjectsV2Command({ Bucket: R2_BUCKET, Prefix: 'squarespace/', ContinuationToken }))
  for (const obj of (res.Contents || [])) r2Files.add(obj.Key.replace('squarespace/', ''))
  ContinuationToken = res.NextContinuationToken
} while (ContinuationToken)

console.log(`R2 has ${r2Files.size} files in squarespace/`)

// Step 2: Find broken URLs in catalog
const catalogPath = new URL('../data/catalog.json', import.meta.url).pathname
const catalog = JSON.parse(readFileSync(catalogPath, 'utf-8'))

const broken = new Set()
for (const artwork of catalog.artworks) {
  const urls = [artwork.imageMain, artwork.imageSquare, ...(artwork.imageDetails||[]), ...(artwork.allImages||[])]
  for (const url of urls) {
    if (!url || !url.includes('r2.dev/squarespace/')) continue
    const filename = url.split('/').pop()
    if (!r2Files.has(filename)) broken.add(filename)
  }
}

console.log(`Broken catalog URLs: ${broken.size}`)
if (broken.size > 0) {
  // Step 3: For each broken filename, find closest match in R2 by prefix
  const fixes = new Map()
  for (const brokenName of broken) {
    // Try to find a file in R2 that starts with the same base
    const base = brokenName.replace(/\.[^.]+$/, '') // remove ext
    const ext = brokenName.match(/\.[^.]+$/)?.[0] || ''
    const candidates = [...r2Files].filter(f => f.startsWith(base))
    if (candidates.length === 1) {
      fixes.set(brokenName, candidates[0])
    } else if (candidates.length > 1) {
      // Pick the one ending in -1 or the shortest one
      const main = candidates.find(f => f.includes('-1.') || f.replace(base,'') === ext)
      fixes.set(brokenName, main || candidates[0])
      console.log(`  Multiple matches for ${brokenName}: ${candidates.join(', ')} → using ${fixes.get(brokenName)}`)
    } else {
      console.log(`  No match for ${brokenName}`)
    }
  }

  // Step 4: Apply fixes to catalog
  let catalogStr = readFileSync(catalogPath, 'utf-8')
  let fixed = 0
  for (const [broken, correct] of fixes.entries()) {
    const oldUrl = `${R2_BASE}/${broken}`
    const newUrl = `${R2_BASE}/${correct}`
    const escaped = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const before = catalogStr
    catalogStr = catalogStr.replace(new RegExp(escaped, 'g'), newUrl)
    if (catalogStr !== before) fixed++
  }
  writeFileSync(catalogPath, catalogStr)
  console.log(`Fixed ${fixed} URLs in catalog.json`)
}
