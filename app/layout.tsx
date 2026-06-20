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
        <footer className="border-t border-[#e8e8e8] py-10 px-6 mt-20">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-[#888] tracking-wider">
            <span>© {new Date().getFullYear()} NMAD · New Modern Art District</span>
            <div className="flex flex-col items-center md:items-end gap-4">
              <Image src="/logo-footer.png" alt="NMAD" width={400} height={160} unoptimized className="h-40 w-auto object-contain opacity-70" />
              <div className="flex gap-8">
                <a href="https://www.instagram.com/nmad.art" target="_blank" rel="noopener noreferrer" className="hover:text-[#1a1a1a] transition-colors uppercase">Instagram</a>
                <a href="/contacto" className="hover:text-[#1a1a1a] transition-colors uppercase">Contacto</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
