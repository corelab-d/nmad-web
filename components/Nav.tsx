'use client'
import Image from 'next/image'
import { usePathname, useRouter, Link } from '@/i18n/navigation'
import { useState, useEffect } from 'react'
import { COLLECTIONS } from '@/lib/catalog'
import ShowroomModal from './ShowroomModal'
import { useLocale, useTranslations } from 'next-intl'

export default function Nav() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [galeriaOpen, setGaleriaOpen] = useState(false)
  const [showroomOpen, setShowroomOpen] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > lastY && y > 80)
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const switchLocale = () => {
    const next = locale === 'es' ? 'en' : 'es'
    router.replace(pathname, { locale: next })
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-[#ffffff]/95 backdrop-blur-sm border-b border-[#e8e8e8] transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
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
                {t('gallery')}
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
              {t('artists')}
            </Link>
            <Link href="/contacto"
              className={`text-xs tracking-[0.15em] uppercase transition-colors ${pathname?.startsWith('/contacto') ? 'text-[#1a1a1a]' : 'text-[#888] hover:text-[#1a1a1a]'}`}>
              {t('contact')}
            </Link>

            <button
              onClick={() => setShowroomOpen(true)}
              className="text-xs tracking-[0.15em] uppercase px-4 py-2 border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors"
            >
              {t('showroom')}
            </button>

            {/* Language switcher */}
            <button
              onClick={switchLocale}
              className="text-[10px] tracking-[0.2em] uppercase text-[#aaa] hover:text-[#1a1a1a] transition-colors"
            >
              {t('lang')}
            </button>
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
              {t('gallery')}
            </Link>
            {COLLECTIONS.map((c) => (
              <Link key={c.slug} href={`/galeria?coleccion=${c.slug}`} onClick={() => setMenuOpen(false)}
                className="block px-10 py-3 text-xs tracking-widest uppercase border-b border-[#e8e8e8] text-[#aaa] hover:text-[#1a1a1a]">
                {c.label}
              </Link>
            ))}
            <Link href="/artistas" onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 text-xs tracking-widest uppercase border-b border-[#e8e8e8] text-[#888] hover:text-[#1a1a1a]">
              {t('artists')}
            </Link>
            <Link href="/contacto" onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 text-xs tracking-widest uppercase border-b border-[#e8e8e8] text-[#888] hover:text-[#1a1a1a]">
              {t('contact')}
            </Link>
            <button
              onClick={() => { setMenuOpen(false); setShowroomOpen(true) }}
              className="block w-full text-left px-6 py-4 text-xs tracking-widest uppercase border-b border-[#e8e8e8] text-[#1a1a1a] font-medium hover:bg-[#f5f5f5]">
              {t('showroom')}
            </button>
            <button
              onClick={() => { setMenuOpen(false); switchLocale() }}
              className="block w-full text-left px-6 py-4 text-xs tracking-widest uppercase text-[#888] hover:text-[#1a1a1a]">
              {t('lang')}
            </button>
          </nav>
        )}
      </header>

      {showroomOpen && <ShowroomModal onClose={() => setShowroomOpen(false)} />}
    </>
  )
}
