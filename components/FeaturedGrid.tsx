'use client'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Artwork } from '@/lib/catalog'
import { useLocale } from 'next-intl'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickFour(artworks: Artwork[]): Artwork[] {
  const byArtist = new Map<string, Artwork[]>()
  for (const a of artworks) {
    if (!byArtist.has(a.artistSlug)) byArtist.set(a.artistSlug, [])
    byArtist.get(a.artistSlug)!.push(a)
  }
  const artistSlugs = shuffle([...byArtist.keys()])
  const picked: Artwork[] = []
  for (const slug of artistSlugs) {
    if (picked.length === 4) break
    const options = byArtist.get(slug)!
    picked.push(options[Math.floor(Math.random() * options.length)])
  }
  return picked
}

export default function FeaturedGrid({ artworks, locale: localeProp }: { artworks: Artwork[], locale?: string }) {
  const localeHook = useLocale()
  const locale = localeProp ?? localeHook
  const [items, setItems] = useState<Artwork[]>([])

  useEffect(() => {
    setItems(pickFour(artworks))
  }, [artworks])

  if (items.length < 4) return null

  const [big, wide, sm1, sm2] = items

  return (
    <section>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gridTemplateRows: '340px 220px',
          gap: '2px',
          background: '#111',
        }}
      >
        {/* Grande izquierda — ocupa 2 filas */}
        <Cell artwork={big} locale={locale} style={{ gridRow: '1 / 3' }} />
        {/* Franja ancha arriba derecha — ocupa 2 columnas */}
        <Cell artwork={wide} locale={locale} style={{ gridColumn: '2 / 4' }} />
        {/* 2 pequeñas abajo */}
        <Cell artwork={sm1} locale={locale} />
        <Cell artwork={sm2} locale={locale} />
      </div>
    </section>
  )
}

function Cell({ artwork, locale, style }: { artwork: Artwork, locale: string, style?: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false)
  const displayTitle = locale === 'en' ? (artwork.titleEn ?? artwork.title) : artwork.title

  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {(artwork.featuredImage || artwork.imageMain) && (
        <Image
          src={artwork.featuredImage || artwork.imageMain!}
          alt={artwork.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-700"
          style={{ transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
        />
      )}
      {/* Overlay — always visible, darkens on hover */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-5 transition-all duration-300"
        style={{ background: hovered ? 'rgba(0,0,0,0.50)' : 'rgba(0,0,0,0)' }}
      >
        <p className="text-[11px] text-white/70 tracking-widest uppercase mb-1">{displayTitle}</p>
        <p className="text-base font-light text-white mb-4 leading-snug">{artwork.artist}</p>
        <Link
          href={`/artistas/${artwork.artistSlug}`}
          className="inline-block text-[10px] tracking-[0.18em] uppercase text-white border border-white/50 px-4 py-2 hover:bg-white hover:text-[#1a1a1a] transition-colors w-fit"
        >
          {locale === 'en' ? 'View artist →' : 'Ver artista →'}
        </Link>
      </div>
    </div>
  )
}
