import { notFound } from 'next/navigation'
import { getAllArtworks, getArtworkBySlug, getArtworksByArtist, getArtistBySlug, formatPrice } from '@/lib/catalog'
import Link from 'next/link'
import ObraGallery from './ObraGallery'
import ArtworkCard from '@/components/ArtworkCard'
import ConsultarBtn from './ConsultarBtn'

export async function generateStaticParams() {
  return getAllArtworks().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const artwork = getArtworkBySlug(slug)
  if (!artwork) return {}
  return {
    title: `${artwork.title} · ${artwork.artist} · NMAD`,
    description: `${artwork.technique} · ${artwork.dimensions}`,
  }
}

export default async function ObraPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const artwork = getArtworkBySlug(slug)
  if (!artwork) notFound()

  const artist = getArtistBySlug(artwork.artistSlug)

  const isSquareThumb = (img: string) => {
    const fname = img.split('/').pop()?.toLowerCase() ?? ''
    return fname.includes('_sq') || fname.includes('3+sq') || fname.includes('3 sq') || fname.endsWith('sq.png') || fname.endsWith('sq.jpg')
  }

  const images = [
    artwork.imageMain,
    ...artwork.imageDetails,
    ...(artwork.imageSquare ? [artwork.imageSquare] : []),
  ].filter((img): img is string => !!img && !isSquareThumb(img))

  // Recommended works: same artist first, then fill from all artworks
  const sameArtist = getArtworksByArtist(artwork.artistSlug).filter((a) => a.slug !== artwork.slug)
  const others = getAllArtworks().filter(
    (a) => a.slug !== artwork.slug && a.artistSlug !== artwork.artistSlug
  )
  const recommended = [...sameArtist, ...others].slice(0, 5)

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-[#aaa] mb-10">
          <Link href="/galeria" className="hover:text-[#1a1a1a] transition-colors">Galería</Link>
          <span>/</span>
          <Link href={`/artistas/${artwork.artistSlug}`} className="hover:text-[#1a1a1a] transition-colors">{artwork.artist}</Link>
          <span>/</span>
          <span className="text-[#1a1a1a]">{artwork.title}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start">

          {/* Image gallery — 65% on desktop, full width on mobile */}
          <div className="w-full md:w-[65%] shrink-0">
            <ObraGallery images={images} title={artwork.title} />
          </div>

          {/* Info panel — sticky on desktop */}
          <div className="w-full md:sticky md:top-24 md:self-start">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-3">{artwork.artist}</p>
            <h1 className="text-3xl md:text-4xl font-light leading-tight mb-10">{artwork.title}</h1>

            {/* Specs — Artista, Técnica y Medidas siempre visibles */}
            <div className="border-t border-[#e8e8e8] divide-y divide-[#e8e8e8] mb-8">
              <div className="flex justify-between py-3">
                <span className="text-[10px] tracking-widest uppercase text-[#888]">Artista</span>
                <span className="text-sm text-right max-w-[55%] leading-snug">{artwork.artist}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-[10px] tracking-widest uppercase text-[#888]">Técnica</span>
                <span className="text-sm text-right max-w-[55%] leading-snug">{artwork.technique || '—'}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-[10px] tracking-widest uppercase text-[#888]">Medidas</span>
                <span className="text-sm">{artwork.dimensions || '—'}</span>
              </div>
              {artwork.year && (
                <div className="flex justify-between py-3">
                  <span className="text-[10px] tracking-widest uppercase text-[#888]">Año</span>
                  <span className="text-sm">{artwork.year}</span>
                </div>
              )}
              {artwork.edition && (
                <div className="flex justify-between py-3">
                  <span className="text-[10px] tracking-widest uppercase text-[#888]">Obra</span>
                  <span className="text-sm">{artwork.edition}</span>
                </div>
              )}
              {artwork.framing && artwork.framing !== 'Sin Marco' && (
                <div className="flex justify-between py-3">
                  <span className="text-[10px] tracking-widest uppercase text-[#888]">Montaje</span>
                  <span className="text-sm">{artwork.framing}</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="mb-8">
              {artwork.price > 0 ? (
                <p className="text-2xl font-light">{formatPrice(artwork.price)}</p>
              ) : (
                <p className="text-[#888] text-sm">Precio a consultar</p>
              )}
              {artwork.available && (
                <p className="text-[10px] tracking-widest uppercase text-[#1a1a1a] mt-2 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1a1a1a]" />
                  Disponible
                </p>
              )}
            </div>

            {/* Contact CTA */}
            <ConsultarBtn obra={artwork.title} artista={artwork.artist} />

            {/* Artist */}
            {artist && (
              <div className="border-t border-[#e8e8e8] pt-8 mt-8">
                <p className="text-[10px] tracking-widest uppercase text-[#888] mb-4">Artista</p>
                <Link href={`/artistas/${artist.slug}`} className="group">
                  <h3 className="text-lg font-light mb-3 group-hover:underline underline-offset-4">{artist.name}</h3>
                </Link>
                {artist.bio && (
                  <p className="text-sm text-[#555] leading-relaxed line-clamp-4">{artist.bio}</p>
                )}
                <Link href={`/artistas/${artist.slug}`}
                  className="inline-block mt-4 text-[10px] tracking-widest uppercase text-[#888] hover:text-[#1a1a1a] transition-colors">
                  Ver más obras →
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Obras recomendadas */}
      {recommended.length > 0 && (
        <div className="border-t border-[#e8e8e8] mt-16">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-8">También te puede interesar</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-10">
              {recommended.map((a) => (
                <ArtworkCard key={a.id} artwork={a} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
