'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

export default function ObraGallery({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [zoomed, setZoomed] = useState(false)

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length])

  // Keyboard navigation
  useEffect(() => {
    if (!zoomed) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomed(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [zoomed, prev, next])

  // Prevent body scroll when zoomed
  useEffect(() => {
    document.body.style.overflow = zoomed ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [zoomed])

  if (images.length === 0) return null

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Main image */}
        <div
          className="relative bg-white overflow-hidden w-full group cursor-zoom-in"
          style={{ minHeight: '70vh' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setZoomed(true)}
        >
          <Image
            key={images[current]}
            src={images[current]}
            alt={`${title} — imagen ${current + 1}`}
            fill
            unoptimized
            priority={current === 0}
            className="object-contain transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, 65vw"
          />

          {/* Arrows — only visible on hover, overlaid on image edges */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className={`absolute left-0 top-0 h-full w-14 flex items-center justify-start pl-3 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}
                aria-label="Anterior"
              >
                <span className="w-9 h-9 bg-white/90 border border-[#e8e8e8] flex items-center justify-center text-sm">←</span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className={`absolute right-0 top-0 h-full w-14 flex items-center justify-end pr-3 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}
                aria-label="Siguiente"
              >
                <span className="w-9 h-9 bg-white/90 border border-[#e8e8e8] flex items-center justify-center text-sm">→</span>
              </button>
            </>
          )}

          {/* Counter + zoom hint */}
          <div className={`absolute bottom-3 right-3 flex items-center gap-3 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            {images.length > 1 && (
              <span className="text-[10px] tracking-widest text-[#888] bg-white/90 px-2 py-1">
                {current + 1} / {images.length}
              </span>
            )}
            <span className="text-[10px] tracking-widest text-[#888] bg-white/90 px-2 py-1">
              + zoom
            </span>
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`relative shrink-0 w-[72px] h-[72px] overflow-hidden transition-opacity border ${
                  i === current ? 'opacity-100 border-[#1a1a1a]' : 'opacity-40 border-transparent hover:opacity-70'
                }`}
              >
                <Image src={img} alt={`${title} ${i + 1}`} fill unoptimized className="object-cover" sizes="72px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom lightbox */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center cursor-zoom-out"
          onClick={() => setZoomed(false)}
        >
          {/* Close */}
          <button
            className="absolute top-5 right-5 text-white/70 hover:text-white text-2xl w-10 h-10 flex items-center justify-center"
            onClick={() => setZoomed(false)}
            aria-label="Cerrar"
          >
            ✕
          </button>

          {/* Counter */}
          {images.length > 1 && (
            <span className="absolute top-5 left-1/2 -translate-x-1/2 text-[10px] tracking-widest text-white/50">
              {current + 1} / {images.length}
            </span>
          )}

          {/* Image */}
          <div
            className="relative w-full h-full max-w-6xl max-h-[90vh] mx-auto px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={`zoom-${images[current]}`}
              src={images[current]}
              alt={`${title} — imagen ${current + 1}`}
              fill
              unoptimized
              priority
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {/* Prev/Next in zoom */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Anterior"
              >
                ←
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Siguiente"
              >
                →
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}
