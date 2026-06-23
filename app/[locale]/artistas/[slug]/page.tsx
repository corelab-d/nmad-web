import { notFound } from 'next/navigation'
import { getAllArtists, getArtistBySlug, getArtworksByArtist } from '@/lib/catalog'
import ArtworkCard from '@/components/ArtworkCard'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

export async function generateStaticParams() {
  return getAllArtists().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const artist = getArtistBySlug(slug)
  if (!artist) return {}
  return { title: `${artist.name} · NMAD` }
}

export default async function ArtistaPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const artist = getArtistBySlug(slug)
  if (!artist) notFound()

  const t = await getTranslations({ locale, namespace: 'artists' })
  const artworks = getArtworksByArtist(slug)

  const artistsLabel = locale === 'en' ? 'Artists' : 'Artistas'
  const artistLabel = locale === 'en' ? 'Artist' : 'Artista'
  const noWorksLabel = locale === 'en' ? 'No visible works by this artist.' : 'No hay obras visibles de este artista.'
  const worksLabel = artworks.length === 1 ? t('work') : t('works')
  const bio = locale === 'en' ? (artist as any).bioEn ?? artist.bio : artist.bio

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-[#aaa] mb-12">
          <Link href="/artistas" className="hover:text-[#1a1a1a] transition-colors">{artistsLabel}</Link>
          <span>/</span>
          <span className="text-[#1a1a1a]">{artist.name}</span>
        </div>

        <div className="max-w-2xl mb-16">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#888] mb-3">{artistLabel}</p>
          <h1 className="text-4xl font-light mb-8">{artist.name}</h1>
          {bio && <p className="text-[#555] leading-relaxed">{bio}</p>}
        </div>

        <div className="border-t border-[#e8e8e8] pt-12">
          <p className="text-[10px] tracking-widest uppercase text-[#aaa] mb-8">{artworks.length} {worksLabel}</p>
          {artworks.length === 0 ? (
            <p className="text-[#888]">{noWorksLabel}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
              {artworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
