'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { COLLECTIONS } from '@/lib/catalog'

export default function Nav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [galeriaOpen, setGaleriaOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff]/95 backdrop-blur-sm border-b border-[#e8e8e8]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
          <Image
            src="/logo-dark.png"
            alt="NMAD"
            width={120}
            height={48}
            unoptimized
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">

          {/* Galería with dropdown */}
          <div className="relative group"
            onMouseEnter={() => setGaleriaOpen(true)}
            onMouseLeave={() => setGaleriaOpen(false)}
          >
            <Link
              href="/galeria"
              className={`text-xs tracking-[0.15em] uppercase transition-colors ${pathname?.startsWith('/galeria') ? 'text-[#1a1a1a]' : 'text-[#888] hover:text-[#1a1a1a]'}`}
            >
              Galería
            </Link>

            {galeriaOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                <div className="bg-[#ffffff] border border-[#e8e8e8] shadow-sm min-w-[160px]">
                  {COLLECTIONS.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/galeria?coleccion=${c.slug}`}
                      className="block px-5 py-2.5 text-xs tracking-widest uppercase text-[#888] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors"
                      onClick={() => setGaleriaOpen(false)}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/artistas"
            className={`text-xs tracking-[0.15em] uppercase transition-colors ${pathname?.startsWith('/artistas') ? 'text-[#1a1a1a]' : 'text-[#888] hover:text-[#1a1a1a]'}`}>
            Artistas
          </Link>
          <Link href="/contacto"
            className={`text-xs tracking-[0.15em] uppercase transition-colors ${pathname?.startsWith('/contacto') ? 'text-[#1a1a1a]' : 'text-[#888] hover:text-[#1a1a1a]'}`}>
            Contacto
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden text-[#1a1a1a]" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
          <div className="flex flex-col gap-1.5 w-5">
            <span className={`block h-px bg-current transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-px bg-current transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px bg-current transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden bg-[#ffffff] border-t border-[#e8e8e8]">
          <Link href="/galeria" onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-xs tracking-widest uppercase border-b border-[#e8e8e8] text-[#888] hover:text-[#1a1a1a]">
            Galería
          </Link>
          {COLLECTIONS.map((c) => (
            <Link key={c.slug} href={`/galeria?coleccion=${c.slug}`} onClick={() => setMenuOpen(false)}
              className="block px-10 py-3 text-xs tracking-widest uppercase border-b border-[#e8e8e8] text-[#aaa] hover:text-[#1a1a1a]">
              {c.label}
            </Link>
          ))}
          <Link href="/artistas" onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-xs tracking-widest uppercase border-b border-[#e8e8e8] text-[#888] hover:text-[#1a1a1a]">
            Artistas
          </Link>
          <Link href="/contacto" onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-xs tracking-widest uppercase text-[#888] hover:text-[#1a1a1a]">
            Contacto
          </Link>
        </nav>
      )}
    </header>
  )
}
