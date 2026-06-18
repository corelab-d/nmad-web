import Link from 'next/link'
import Image from 'next/image'
import { getAllArtists, getArtworksByArtist } from '@/lib/catalog'

export const metadata = { title: 'Artistas · NMAD' }

export default function ArtistasPage() {
  const artists = getAllArtists()

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#888] mb-2">NMAD</p>
        <h1 className="text-3xl font-light">Artistas</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#e8e8e8]">
        {artists.map((artist) => {
          const artworks = getArtworksByArtist(artist.slug)
          const cover = artworks.find((a) => a.imageSquare || a.imageMain)
          const img = cover?.imageSquare || cover?.imageMain

          return (
            <Link key={artist.slug} href={`/artistas/${artist.slug}`}
              className="group bg-[#ffffff] p-8 flex gap-6 hover:bg-[#f5f5f5] transition-colors">
              <div className="relative w-20 h-20 shrink-0 bg-[#f0f0f0] overflow-hidden">
                {img && (
                  <Image src={img} alt={artist.name} fill unoptimized
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    sizes="80px"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-light mb-1 group-hover:underline underline-offset-4">{artist.name}</h2>
                <p className="text-[10px] tracking-widest uppercase text-[#aaa] mb-2">{artworks.length} obras</p>
                {artist.bio && (
                  <p className="text-xs text-[#888] leading-relaxed line-clamp-2">{artist.bio}</p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
