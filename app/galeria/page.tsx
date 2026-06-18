import { Suspense } from 'react'
import { getAllArtworks, COLLECTIONS } from '@/lib/catalog'
import GaleriaClient from './GaleriaClient'

export const metadata = {
  title: 'Galería · NMAD',
  description: 'Catálogo completo de obras de arte contemporáneo.',
}

export default function GaleriaPage() {
  const artworks = getAllArtworks()
  // Derive unique artists from the actual artworks so slugs always match
  const artists = Array.from(
    new Map(artworks.map((a) => [a.artistSlug, { slug: a.artistSlug, name: a.artist, bio: '' }])).values()
  ).sort((a, b) => a.name.localeCompare(b.name))

  return (
    <Suspense>
      <GaleriaClient artworks={artworks} artists={artists} collections={COLLECTIONS} />
    </Suspense>
  )
}
