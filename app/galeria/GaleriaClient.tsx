'use client'
import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Artwork, Artist } from '@/lib/catalog'
import ArtworkCard from '@/components/ArtworkCard'

interface Props {
  artworks: Artwork[]
  artists: Artist[]
  collections: { slug: string; label: string }[]
}

export default function GaleriaClient({ artworks, artists, collections }: Props) {
  const searchParams = useSearchParams()
  const [filterArtist, setFilterArtist] = useState<string>('all')
  const [filterCollection, setFilterCollection] = useState<string>('all')
  const [artistsOpen, setArtistsOpen] = useState(false)

  useEffect(() => {
    const col = searchParams.get('coleccion')
    if (col) setFilterCollection(col)
  }, [searchParams])

  const filtered = useMemo(() => {
    return artworks.filter((a) => {
      if (filterArtist !== 'all' && a.artistSlug !== filterArtist) return false
      if (filterCollection !== 'all' && !a.collections.includes(filterCollection)) return false
      return true
    })
  }, [artworks, filterArtist, filterCollection])

  const pill = (active: boolean) =>
    `text-[10px] tracking-[0.15em] uppercase px-4 py-2 border transition-colors cursor-pointer whitespace-nowrap ${
      active
        ? 'border-[#1a1a1a] bg-[#1a1a1a] text-[#ffffff]'
        : 'border-[#e8e8e8] text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
    }`

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-light tracking-wide">Galería</h1>
        <p className="text-[#888] text-xs mt-1">{filtered.length} obras</p>
      </div>

      <div className="space-y-4 mb-10 pb-8 border-b border-[#e8e8e8]">
        {/* Collections — always visible */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterCollection('all')} className={pill(filterCollection === 'all')}>
            Todas
          </button>
          {collections.map((c) => (
            <button key={c.slug} onClick={() => setFilterCollection(c.slug)} className={pill(filterCollection === c.slug)}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Artists toggle */}
        <div>
          <button
            onClick={() => setArtistsOpen((v) => !v)}
            className={`text-[10px] tracking-[0.15em] uppercase px-4 py-2 border transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              filterArtist !== 'all'
                ? 'border-[#1a1a1a] bg-[#1a1a1a] text-[#ffffff]'
                : 'border-[#e8e8e8] text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
            }`}
          >
            {filterArtist !== 'all'
              ? artists.find((a) => a.slug === filterArtist)?.name ?? 'Artista'
              : 'Todos los artistas'}
            <span className="opacity-50">{artistsOpen ? '−' : '+'}</span>
          </button>

          {artistsOpen && (
            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={() => { setFilterArtist('all'); setArtistsOpen(false) }} className={pill(filterArtist === 'all')}>
                Todos
              </button>
              {artists.map((a) => (
                <button key={a.slug} onClick={() => { setFilterArtist(a.slug); setArtistsOpen(false) }} className={pill(filterArtist === a.slug)}>
                  {a.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-[#888] text-center py-20">No hay obras con estos filtros.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {filtered.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      )}
    </div>
  )
}
