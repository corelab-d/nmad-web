import { notFound } from 'next/navigation'
import { getAllArtworks, getArtworkBySlug, getArtworksByArtist, getArtistBySlug, formatPrice } from '@/lib/catalog'
import { Link } from '@/i18n/navigation'
import ObraGallery from './ObraGallery'
import ArtworkCard from '@/components/ArtworkCard'
import ConsultarBtn from './ConsultarBtn'
import { getTranslations } from 'next-intl/server'
import { translateTechnique, translateFraming } from '@/lib/translate-technique'

export async function generateStaticParams() {
  return getAllArtworks().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = await params
  const artwork = getArtworkBySlug(slug)
  if (!artwork) return {}
  return {
    title: `${artwork.title} · ${artwork.artist} · NMAD`,
    description: `${artwork.technique} · ${artwork.dimensions}`,
  }
}

export default async function ObraPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const artwork = getArtworkBySlug(slug)
  if (!artwork) notFound()

  const t = await getTranslations({ locale, namespace: 'artwork' })
  const artist = getArtistBySlug(artwork.artistSlug)
  const titleDisplay = locale === 'en' ? (artwork.titleEn ?? artwork.title) : artwork.title

  const isSquareThumb = (img: string) => {
    const fname = img.split('/').pop()?.toLowerCase() ?? ''
    return fname.includes('_sq') || fname.includes('3+sq') || fname.includes('3 sq') || fname.endsWith('sq.png') || fname.endsWith('sq.jpg')
  }

  const images = [
    artwork.imageMain,
    ...artwork.imageDetails,
    ...(artwork.imageSquare ? [artwork.imageSquare] : []),
  ].filter((img): img is string => !!img && !isSquareThumb(img))

  const sameArtist = getArtworksByArtist(artwork.artistSlug).filter((a) => a.slug !== artwork.slug)
  const others = getAllArtworks().filter(
    (a) => a.slug !== artwork.slug && a.artistSlug !== artwork.artistSlug
  )
  const recommended = [...sameArtist, ...others].slice(0, 5)

  const galleryLabel = locale === 'en' ? 'Gallery' : 'Galería'
  const artistLabel = locale === 'en' ? 'Artist' : 'Artista'
  const alsoLabel = locale === 'en' ? 'You may also like' : 'También te puede interesar'
  const moreWorksLabel = locale === 'en' ? 'View more works →' : 'Ver más obras →'
  const priceLabel = locale === 'en' ? 'Price on request' : 'Precio a consultar'

  const techniqueDisplay = locale === 'en' && artwork.technique
    ? translateTechnique(artwork.technique)
    : (artwork.technique || '—')
  const framingDisplay = locale === 'en' && artwork.framing
    ? translateFraming(artwork.framing)
    : (artwork.framing || '—')

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-[#aaa] mb-10">
          <Link href="/galeria" className="hover:text-[#1a1a1a] transition-colors">{galleryLabel}</Link>
          <span>/</span>
          <Link href={`/artistas/${artwork.artistSlug}`} className="hover:text-[#1a1a1a] transition-colors">{artwork.artist}</Link>
          <span>/</span>
          <span className="text-[#1a1a1a]">{artwork.title}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start">

          {/* Image gallery */}
          <div className="w-full md:w-[65%] shrink-0">
            <ObraGallery images={images} title={artwork.title} />
          </div>

          {/* Info panel */}
          <div className="w-full md:sticky md:top-24 md:self-start">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-3">{artwork.artist}</p>
            <h1 className="text-3xl md:text-4xl font-light leading-tight mb-10">{titleDisplay}</h1>

            <div className="border-t border-[#e8e8e8] divide-y divide-[#e8e8e8] mb-8">
              <div className="flex justify-between py-3">
                <span className="text-[10px] tracking-widest uppercase text-[#888]">{artistLabel}</span>
                <span className="text-sm text-right max-w-[55%] leading-snug">{artwork.artist}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-[10px] tracking-widest uppercase text-[#888]">{t('technique')}</span>
                <span className="text-sm text-right max-w-[55%] leading-snug">{techniqueDisplay}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-[10px] tracking-widest uppercase text-[#888]">{t('dimensions')}</span>
                <span className="text-sm">{artwork.dimensions || '—'}</span>
              </div>
              {artwork.year && (
                <div className="flex justify-between py-3">
                  <span className="text-[10px] tracking-widest uppercase text-[#888]">{t('year')}</span>
                  <span className="text-sm">{artwork.year}</span>
                </div>
              )}
              {artwork.edition && (
                <div className="flex justify-between py-3">
                  <span className="text-[10px] tracking-widest uppercase text-[#888]">{locale === 'en' ? 'Work' : 'Obra'}</span>
                  <span className="text-sm">{artwork.edition}</span>
                </div>
              )}
              {artwork.framing && artwork.framing !== 'Sin Marco' && (
                <div className="flex justify-between py-3">
                  <span className="text-[10px] tracking-widest uppercase text-[#888]">{t('framing')}</span>
                  <span className="text-sm">{framingDisplay}</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="mb-8">
              {artwork.price > 0 ? (
                <p className="text-2xl font-light">{formatPrice(artwork.price)}</p>
              ) : (
                <p className="text-[#888] text-sm">{priceLabel}</p>
              )}
              {artwork.available && (
                <p className="text-[10px] tracking-widest uppercase text-[#1a1a1a] mt-2 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1a1a1a]" />
                  {t('available')}
                </p>
              )}
            </div>

            <ConsultarBtn obra={artwork.title} artista={artwork.artist} locale={locale} />

            {/* Artist bio */}
            {artist && (
              <div className="border-t border-[#e8e8e8] pt-8 mt-8">
                <p className="text-[10px] tracking-widest uppercase text-[#888] mb-4">{artistLabel}</p>
                <Link href={`/artistas/${artist.slug}`} className="group">
                  <h3 className="text-lg font-light mb-3 group-hover:underline underline-offset-4">{artist.name}</h3>
                </Link>
                {(locale === 'en' ? (artist as any).bioEn : artist.bio) && (
                  <p className="text-sm text-[#555] leading-relaxed line-clamp-4">
                    {locale === 'en' ? (artist as any).bioEn : artist.bio}
                  </p>
                )}
                <Link href={`/artistas/${artist.slug}`}
                  className="inline-block mt-4 text-[10px] tracking-widest uppercase text-[#888] hover:text-[#1a1a1a] transition-colors">
                  {moreWorksLabel}
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
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-8">{alsoLabel}</p>
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
