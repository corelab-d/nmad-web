import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

let ContinuationToken
const oldNames = []
const seoNames = []

do {
  const res = await client.send(new ListObjectsV2Command({
    Bucket: 'nmad-media',
    Prefix: 'squarespace/',
    ContinuationToken,
  }))
  for (const obj of (res.Contents || [])) {
    const name = obj.Key.replace('squarespace/', '')
    if (/[A-Z+%]/.test(name) || name.includes(' ')) {
      oldNames.push(obj.Key)
    } else {
      seoNames.push(obj.Key)
    }
  }
  ContinuationToken = res.NextContinuationToken
} while (ContinuationToken)

console.log(`SEO-named files: ${seoNames.length}`)
console.log(`Old-named files still in R2: ${oldNames.length}`)
if (oldNames.length > 0) {
  console.log('\nOld files:')
  oldNames.forEach(f => console.log(' ', f))
}
