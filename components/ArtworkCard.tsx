'use client'
import Image from 'next/image'
import { useState } from 'react'
import { Artwork } from '@/lib/catalog'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const locale = useLocale()
  const [hovered, setHovered] = useState(false)
  const displayTitle = locale === 'en' ? (artwork.titleEn ?? artwork.title) : artwork.title

  const primaryImg = artwork.imageMain
  const secondaryImg = artwork.imageDetails[0] ?? null
  const displayImg = hovered && secondaryImg ? secondaryImg : primaryImg

  return (
    <Link
      href={`/galeria/${artwork.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden bg-[#f0f0f0] aspect-square">
        {primaryImg && (
          <>
            {/* Primary */}
            <Image
              src={primaryImg}
              alt={artwork.title}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-opacity duration-500 ${hovered && secondaryImg ? 'opacity-0' : 'opacity-100'}`}
            />
            {/* Secondary (in situ) */}
            {secondaryImg && (
              <Image
                src={secondaryImg}
                alt={`${artwork.title} — instalación`}
                fill
                unoptimized
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`}
              />
            )}
          </>
        )}

      </div>

      <div className="pt-3">
        <p className="text-[10px] text-[#888] tracking-[0.15em] uppercase mb-0.5">{artwork.artist}</p>
        <h3 className="text-sm font-light leading-snug">{displayTitle}</h3>
        {artwork.dimensions && (
          <p className="text-[11px] text-[#aaa] mt-0.5">{artwork.dimensions}</p>
        )}
      </div>
    </Link>
  )
}
