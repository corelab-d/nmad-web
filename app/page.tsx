import Link from 'next/link'
import Image from 'next/image'
import { getAllArtworks, getAllArtists, COLLECTIONS } from '@/lib/catalog'
import ArtworkCard from '@/components/ArtworkCard'
export const dynamic = 'force-dynamic'

export default function Home() {
  const shuffle = <T,>(arr: T[]) => arr.sort(() => Math.random() - 0.5)
  const all = getAllArtworks()
  const groupA = all.filter(a => a.imageDetails.length >= 2)
  const groupB = all.filter(a => a.imageDetails.length === 1)
  const groupC = all.filter(a => a.imageDetails.length === 0)
  const artworks = [...shuffle(groupA), ...shuffle(groupB), ...shuffle(groupC)]
  const artists = getAllArtists()

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-[#e8e8e8] py-20 px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <p className="text-base md:text-lg font-light leading-relaxed text-[#1a1a1a]">
            New Modern Art District - NMAD - es una galería nómada y digital de arte contemporáneo, que exhibe una colección limitada de arte plástico seleccionada por nuestro consejo de curaduría para llevar a artistas emergentes a espacios privados de exhibición: tus espacios.
          </p>
        </div>
      </section>

      {/* Collections nav strip */}
      <section className="border-b border-[#e8e8e8] py-5 px-6 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex gap-6 justify-center flex-wrap">
          {COLLECTIONS.map((c) => (
            <Link key={c.slug} href={`/galeria?coleccion=${c.slug}`}
              className="text-[10px] tracking-[0.2em] uppercase text-[#888] hover:text-[#1a1a1a] transition-colors whitespace-nowrap">
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Full catalog — all artworks, editorial order */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {artworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </section>

      {/* Artists strip */}
      <section className="border-t border-[#e8e8e8] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="text-sm tracking-[0.2em] uppercase">Artistas</h2>
            <Link href="/artistas" className="text-[10px] tracking-widest uppercase text-[#888] hover:text-[#1a1a1a] transition-colors">
              Ver todos →
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {artists.map((a) => (
              <Link key={a.slug} href={`/artistas/${a.slug}`}
                className="text-xs tracking-wide border border-[#e8e8e8] px-4 py-2 hover:border-[#1a1a1a] hover:text-[#1a1a1a] text-[#555] transition-colors">
                {a.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services strip */}
      <section className="border-t border-[#e8e8e8] py-16 px-6 bg-[#f5f5f5]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#888] mb-3">Más que arte</p>
              <h2 className="text-2xl font-light leading-snug">Te ayudamos a encontrarlo,<br />enmarcarlo y colocarlo.</h2>
            </div>
            <Link href="/contacto" className="self-start md:self-auto inline-block px-8 py-3 border border-[#1a1a1a] text-xs tracking-[0.2em] uppercase hover:bg-[#1a1a1a] hover:text-[#ffffff] transition-colors shrink-0">
              Contáctanos
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#e8e8e8]">
            {[
              { title: 'Curaduría', desc: 'Seleccionamos las obras ideales para tu espacio y estilo de vida.' },
              { title: 'Decoración', desc: 'Integramos el arte en tu proyecto de interiorismo.' },
              { title: 'Enmarcado', desc: 'Soluciones de montaje y enmarcado a medida para cada obra.' },
              { title: 'Colocación', desc: 'Instalación profesional en tu hogar, oficina o espacio comercial.' },
            ].map((s) => (
              <div key={s.title} className="bg-[#f5f5f5] p-6">
                <p className="text-xs tracking-[0.15em] uppercase text-[#1a1a1a] mb-3">{s.title}</p>
                <p className="text-xs text-[#888] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
