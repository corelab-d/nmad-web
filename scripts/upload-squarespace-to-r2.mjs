import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'
import { lookup } from 'mime-types'

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET = process.env.R2_BUCKET || 'nmad-media'

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error('Missing R2 env vars.')
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

const IMAGES_DIR = process.env.IMAGES_DIR || `${process.env.HOME}/DEV/nmad-imagenes`

const files = readdirSync(IMAGES_DIR).filter(f => {
  const ext = extname(f).toLowerCase()
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext) && !f.startsWith('.')
})

console.log(`Found ${files.length} images in ${IMAGES_DIR}`)
console.log(`Uploading to R2 bucket "${R2_BUCKET}" under folder "squarespace/"...`)

let ok = 0, skipped = 0, fail = 0

for (const file of files) {
  const key = `squarespace/${file}`
  const filePath = join(IMAGES_DIR, file)
  const contentType = lookup(filePath) || 'image/jpeg'

  // Check if already uploaded
  try {
    await client.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }))
    process.stdout.write(`= ${file}\n`)
    skipped++
    continue
  } catch {}

  try {
    await client.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: readFileSync(filePath),
      ContentType: contentType,
    }))
    process.stdout.write(`✓ ${file}\n`)
    ok++
  } catch (err) {
    process.stdout.write(`✗ ${file}: ${err.message}\n`)
    fail++
  }
}

console.log(`\nDone: ${ok} uploaded, ${skipped} already existed, ${fail} failed`)
