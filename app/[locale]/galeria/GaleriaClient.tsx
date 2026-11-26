'use client'
import { useState, useMemo } from 'react'
import { Artwork, Artist } from '@/lib/catalog'
import ArtworkCard from '@/components/ArtworkCard'
import { useTranslations } from 'next-intl'

interface Props {
  artworks: Artwork[]
  artists: Artist[]
  locale: string
}

export default function GaleriaClient({ artworks, artists, locale }: Props) {
  const t = useTranslations('gallery')
const [filterArtist, setFilterArtist] = useState<string>('all')

  const filtered = useMemo(() => {
    return artworks.filter((a) => {
      if (filterArtist !== 'all' && a.artistSlug !== filterArtist) return false
      return true
    })
  }, [artworks, filterArtist])

  const pill = (active: boolean) =>
    `text-[10px] tracking-[0.15em] uppercase px-4 py-2 border transition-colors cursor-pointer whitespace-nowrap ${
      active
        ? 'border-[#1a1a1a] bg-[#1a1a1a] text-[#ffffff]'
        : 'border-[#e8e8e8] text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
    }`

  const allLabel = locale === 'en' ? 'All' : 'Todas'
  const noResultsLabel = locale === 'en' ? 'No works match these filters.' : 'No hay obras con estos filtros.'
  const worksLabel = locale === 'en' ? 'works' : 'obras'

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-light tracking-wide">{t('title')}</h1>
        <p className="text-[#888] text-xs mt-1">{filtered.length} {worksLabel}</p>
      </div>

      <div className="mb-10 pb-8 border-b border-[#e8e8e8]">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterArtist('all')} className={pill(filterArtist === 'all')}>
            {allLabel}
          </button>
          {artists.map((a) => (
            <button key={a.slug} onClick={() => setFilterArtist(a.slug)} className={pill(filterArtist === a.slug)}>
              {a.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-[#888] text-center py-20">{noResultsLabel}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
          {filtered.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      )}
    </div>
  )
}
