'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'

const BASE = 'https://pub-c363c24f86204416a51ce011c270c443.r2.dev/squarespace'

const SLIDES = [
  { img: `${BASE}/hero-alex-lazard-barca-ii.jpg`,                   slug: 'barca-ii-alex-lazard',                      title: 'Barca II',                    artist: 'Alex Lazard' },
  { img: `${BASE}/hero-alex-lazard-todo-lo-que-sube.jpg`,           slug: 'todo-lo-que-sube-alex-lazard',              title: 'Todo lo que sube',            artist: 'Alex Lazard' },
  { img: `${BASE}/hero-felipe-olivares-insomne.webp`,               slug: 'insomne-felipe-olivares-de-los-rios',       title: 'Insomne',                     artist: 'Felipe Olivares de los Ríos' },
  { img: `${BASE}/hero-fernando-esteban-paisaje-hacia-adentro.webp`,slug: 'paisaje-hacia-adentro-fernando-esteban',    title: 'Paisaje hacia adentro',       artist: 'Fernando Esteban' },
  { img: `${BASE}/hero-ramon-penaloza-joshijo.webp`,                slug: 'joshijo-ramon-penaloza',                    title: 'Joshijo',                     artist: 'Ramón Peñaloza' },
  { img: `${BASE}/hero-toro-amillategui-mano.webp`,                 slug: 'mano-toro-amillategui',                     title: 'Mano',                        artist: 'Toro Amillategui' },
  { img: `${BASE}/hero-toro-amillategui-tigre.webp`,                slug: 'tigre-toro-amillategui',                    title: 'Tigre',                       artist: 'Toro Amillategui' },
  { img: `${BASE}/hero-wow-la-venus-del-nilo.webp`,                 slug: 'la-venus-del-nilo-wow',                     title: 'La venus del Nilo',           artist: 'WOW' },
  { img: `${BASE}/hero-wow-viii.webp`,                              slug: 'viii-wow',                                  title: 'VIII',                        artist: 'WOW' },
]

export default function HeroSlider({ locale }: { locale: string }) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((idx: number) => {
    if (animating) return
    setAnimating(true)
    setCurrent(idx)
    setTimeout(() => setAnimating(false), 700)
  }, [animating])

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo])
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo])

  useEffect(() => {
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next])

  const slide = SLIDES[current]
  const viewLabel = locale === 'en' ? 'View work →' : 'Ver obra →'

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'min(85vh, 700px)' }}>
      {/* Slides */}
      {SLIDES.map((s, i) => (
        <div
          key={s.slug}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <Image
            src={s.img}
            alt={s.title}
            fill
            unoptimized
            priority={i === 0}
            className="object-cover object-center"
          />
        </div>
      ))}

      {/* Gradient overlay bottom */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />

      {/* Info bottom-left */}
      <div className="absolute bottom-0 left-0 z-20 p-8 md:p-12">
        <p className="text-[11px] text-white/60 tracking-widest uppercase mb-1">{slide.title}</p>
        <p className="text-2xl md:text-3xl font-light text-white mb-5 leading-snug">{slide.artist}</p>
        <Link
          href={`/galeria/${slide.slug}`}
          className="inline-block text-[10px] tracking-[0.18em] uppercase text-white border border-white/50 px-5 py-2.5 hover:bg-white hover:text-[#1a1a1a] transition-colors"
        >
          {viewLabel}
        </Link>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        aria-label="Anterior"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        aria-label="Siguiente"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"/></svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 right-8 md:right-12 z-20 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="transition-all duration-300"
            style={{
              width: i === current ? '20px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: i === current ? 'white' : 'rgba(255,255,255,0.4)',
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
