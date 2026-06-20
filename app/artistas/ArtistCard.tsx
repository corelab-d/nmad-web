'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Artist } from '@/lib/catalog'

export default function ArtistCard({ artist, img, count }: { artist: Artist; img?: string; count: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/artistas/${artist.slug}`}
      className="bg-[#ffffff] p-8 flex gap-6 hover:bg-[#f5f5f5] transition-colors">
      <div
        className="relative w-20 h-20 shrink-0 bg-[#f0f0f0] overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {img && (
          <Image src={img} alt={artist.name} fill unoptimized
            className={`object-cover transition-transform duration-500 ${hovered ? 'scale-105' : 'scale-100'}`}
            sizes="80px"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-base font-light mb-1 group-hover:underline underline-offset-4">{artist.name}</h2>
        <p className="text-[10px] tracking-widest uppercase text-[#aaa] mb-2">{count} obras</p>
        {artist.bio && (
          <p className="text-xs text-[#888] leading-relaxed line-clamp-2">{artist.bio}</p>
        )}
      </div>
    </Link>
  )
}
