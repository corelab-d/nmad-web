import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'
import { lookup } from 'mime-types'

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET = process.env.R2_BUCKET || 'nmad-media'

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error('Missing R2 env vars. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY')
  process.exit(1)
}

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

function walk(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.')) continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      files.push(...walk(full))
    } else {
      files.push(full)
    }
  }
  return files
}

const generatedDir = new URL('../public/generated', import.meta.url).pathname
const files = walk(generatedDir)

console.log(`Uploading ${files.length} files to R2 bucket "${R2_BUCKET}"...`)

let ok = 0, fail = 0
for (const file of files) {
  const key = relative(generatedDir, file)
  const contentType = lookup(file) || 'application/octet-stream'
  try {
    await client.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: readFileSync(file),
      ContentType: contentType,
    }))
    console.log(`✓ ${key}`)
    ok++
  } catch (err) {
    console.error(`✗ ${key}: ${err.message}`)
    fail++
  }
}

console.log(`\nDone: ${ok} uploaded, ${fail} failed`)
