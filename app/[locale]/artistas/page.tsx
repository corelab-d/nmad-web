import { getAllArtists, getArtworksByArtist } from '@/lib/catalog'
import ArtistCard from './ArtistCard'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'artists' })
  return { title: `${t('title')} · NMAD` }
}

export default async function ArtistasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'artists' })
  const artists = getAllArtists()

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#888] mb-2">NMAD</p>
        <h1 className="text-3xl font-light">{t('title')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#e8e8e8]">
        {artists.map((artist) => {
          const artworks = getArtworksByArtist(artist.slug)
          const cover = artworks[0]
          const img = cover?.imageMain ?? cover?.imageSquare ?? undefined
          return (
            <ArtistCard key={artist.slug} artist={artist} img={img} count={artworks.length} locale={locale} />
          )
        })}
      </div>
    </div>
  )
}
