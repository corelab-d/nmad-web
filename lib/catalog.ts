import catalogData from '@/data/catalog.json'
import artistsData from '@/data/artists.json'
import displayOrder from '@/data/display-order.json'

export interface Artwork {
  id: string
  title: string
  slug: string
  artist: string
  artistSlug: string
  price: number
  available: boolean
  visible: boolean
  technique: string
  dimensions: string
  year: string
  edition: string
  framing: string
  collections: string[]
  imageMain: string | null
  imageSquare: string | null
  imageDetails: string[]
  allImages: string[]
  titleEn?: string
}

export interface Artist {
  slug: string
  name: string
  bio: string
  artworks?: string[]
}

const catalog = catalogData as { artworks: Artwork[]; artists: Artist[] }

const orderIndex = new Map<string, number>(
  (displayOrder as string[]).map((slug, i) => [slug, i])
)

export function getAllArtworks(): Artwork[] {
  return catalog.artworks
    .filter((a) => a.visible && a.imageMain)
    .sort((a, b) => {
      const ia = orderIndex.has(a.slug) ? orderIndex.get(a.slug)! : 9999
      const ib = orderIndex.has(b.slug) ? orderIndex.get(b.slug)! : 9999
      return ia - ib
    })
}

export function getArtworkBySlug(slug: string): Artwork | undefined {
  return catalog.artworks.find((a) => a.slug === slug)
}

export function getArtworksByArtist(artistSlug: string): Artwork[] {
  return catalog.artworks.filter(
    (a) => a.artistSlug === artistSlug && a.visible && a.imageMain
  )
}

export function getArtworksByCollection(collection: string): Artwork[] {
  return catalog.artworks.filter(
    (a) => a.collections.includes(collection) && a.visible && a.imageMain
  )
}

export function getAllArtists(): Artist[] {
  return artistsData as Artist[]
}

export function getArtistBySlug(slug: string): Artist | undefined {
  return (artistsData as Artist[]).find((a) => a.slug === slug)
}

export function getAvailableArtworks(): Artwork[] {
  return catalog.artworks.filter((a) => a.available && a.visible && a.imageMain)
}

export function formatPrice(price: number): string {
  if (!price || price === 0) return 'Consultar precio'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(price)
}

export const COLLECTIONS = [
  { slug: 'vol-5', label: 'Vol. 5' },
  { slug: 'vol-4', label: 'Vol. 4' },
  { slug: 'vol-3', label: 'Vol. 3' },
  { slug: 'vol-2', label: 'Vol. 2' },
  { slug: 'vol-1', label: 'Vol. 1' },
  { slug: 'materia-sensible', label: 'Materia Sensible' },
  { slug: 'dale-wow', label: 'Dale WOW' },
  { slug: 'dolores-64', label: 'Dolores 64' },
]
