import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Image from 'next/image'

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NMAD · New Modern Art District',
  description: 'Galería nómada y digital de arte contemporáneo. Colecciones curadas de más de 20 artistas.',
  openGraph: {
    title: 'NMAD · New Modern Art District',
    description: 'Galería nómada y digital de arte contemporáneo.',
    url: 'https://nmad.art',
    siteName: 'NMAD',
    locale: 'es_MX',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={openSans.variable}>
      <body className="min-h-screen flex flex-col bg-[#ffffff] text-[#1a1a1a] font-[family-name:var(--font-open-sans)]">
        <Nav />
        <main className="flex-1 pt-16">{children}</main>
        <footer className="border-t border-[#e8e8e8] mt-20">
          {/* Tagline */}
          <div className="border-b border-[#e8e8e8] py-10 px-6 text-center">
            <p className="text-sm font-light text-[#888] tracking-wide">Arte contemporáneo para espacios privados</p>
          </div>

          {/* Main footer columns */}
          <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-10">

            {/* Col 1 — Navega */}
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#1a1a1a] mb-5">Navega</p>
              <ul className="space-y-3 text-xs text-[#888] tracking-wider">
                <li><a href="/galeria" className="hover:text-[#1a1a1a] transition-colors">Galería</a></li>
                <li><a href="/artistas" className="hover:text-[#1a1a1a] transition-colors">Artistas</a></li>
                <li className="pt-2 text-[10px] uppercase text-[#bbb] tracking-widest">Colecciones</li>
                <li><a href="/galeria?coleccion=vol-5" className="hover:text-[#1a1a1a] transition-colors">Vol. 5</a></li>
                <li><a href="/galeria?coleccion=vol-4" className="hover:text-[#1a1a1a] transition-colors">Vol. 4</a></li>
                <li><a href="/galeria?coleccion=vol-3" className="hover:text-[#1a1a1a] transition-colors">Vol. 3</a></li>
                <li><a href="/galeria?coleccion=vol-2" className="hover:text-[#1a1a1a] transition-colors">Vol. 2</a></li>
                <li><a href="/galeria?coleccion=vol-1" className="hover:text-[#1a1a1a] transition-colors">Vol. 1</a></li>
                <li><a href="/galeria?coleccion=materia-sensible" className="hover:text-[#1a1a1a] transition-colors">Materia Sensible</a></li>
                <li><a href="/galeria?coleccion=dale-wow" className="hover:text-[#1a1a1a] transition-colors">Dale WOW</a></li>
                <li><a href="/galeria?coleccion=dolores-64" className="hover:text-[#1a1a1a] transition-colors">Dolores 64</a></li>
              </ul>
            </div>

            {/* Col 2 — Nosotros */}
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#1a1a1a] mb-5">Nosotros</p>
              <ul className="space-y-3 text-xs text-[#888] tracking-wider">
                <li><a href="/contacto" className="hover:text-[#1a1a1a] transition-colors">Sobre NMAD</a></li>
                <li><a href="/contacto" className="hover:text-[#1a1a1a] transition-colors">Visita el Showroom</a></li>
                <li><a href="/contacto" className="hover:text-[#1a1a1a] transition-colors">Contacto</a></li>
              </ul>
            </div>

            {/* Col 3 — Síguenos */}
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#1a1a1a] mb-5">Síguenos</p>
              <ul className="space-y-3 text-xs text-[#888] tracking-wider">
                <li>
                  <a href="https://www.instagram.com/nmad.art" target="_blank" rel="noopener noreferrer" className="hover:text-[#1a1a1a] transition-colors">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>

            {/* Logo */}
            <div className="flex items-end justify-start md:justify-end">
              <Image src="/logo-footer.png" alt="NMAD" width={400} height={160} unoptimized className="h-40 w-auto object-contain opacity-70" />
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[#e8e8e8] px-6 py-5">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-3 text-[10px] text-[#bbb] tracking-wider">
              <span>© {new Date().getFullYear()} NMAD · New Modern Art District</span>
              <div className="flex gap-6">
                <a href="/contacto" className="hover:text-[#888] transition-colors">Términos y condiciones</a>
                <a href="/contacto" className="hover:text-[#888] transition-colors">Aviso de privacidad</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
