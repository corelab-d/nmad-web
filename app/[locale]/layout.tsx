import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import '../globals.css'
import Nav from '@/components/Nav'
import Image from 'next/image'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'es' | 'en')) notFound()

  const messages = await getMessages()
  const t = await getTranslations({ locale, namespace: 'footer' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  const galleryLabel = locale === 'en' ? 'Gallery' : 'Galería'
  const artistsLabel = locale === 'en' ? 'Artists' : 'Artistas'
  const year = new Date().getFullYear()

  return (
    <html lang={locale} className={openSans.variable}>
      <body className="min-h-screen flex flex-col bg-[#ffffff] text-[#1a1a1a] font-[family-name:var(--font-open-sans)]">
        <NextIntlClientProvider messages={messages}>
          <Nav />
          <main className="flex-1 pt-16">{children}</main>
          <footer className="border-t border-[#e8e8e8] mt-20">
            <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-10">

              {/* Col 1 — Navega */}
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#1a1a1a] mb-5">{t('navigate')}</p>
                <div className="flex gap-10 text-xs text-[#888] tracking-wider">
                  <ul className="space-y-3">
                    <li><Link href="/galeria" className="hover:text-[#1a1a1a] transition-colors">{galleryLabel}</Link></li>
                    <li><Link href="/artistas" className="hover:text-[#1a1a1a] transition-colors">{artistsLabel}</Link></li>
                    <li className="pt-2 text-[10px] uppercase text-[#bbb] tracking-widest">{t('collections')}</li>
                    <li><Link href="/galeria?coleccion=vol-5" className="hover:text-[#1a1a1a] transition-colors">Vol. 5</Link></li>
                    <li><Link href="/galeria?coleccion=vol-4" className="hover:text-[#1a1a1a] transition-colors">Vol. 4</Link></li>
                    <li><Link href="/galeria?coleccion=vol-3" className="hover:text-[#1a1a1a] transition-colors">Vol. 3</Link></li>
                    <li><Link href="/galeria?coleccion=vol-2" className="hover:text-[#1a1a1a] transition-colors">Vol. 2</Link></li>
                  </ul>
                  <ul className="space-y-3 pt-[4.25rem]">
                    <li><Link href="/galeria?coleccion=vol-1" className="hover:text-[#1a1a1a] transition-colors">Vol. 1</Link></li>
                    <li><Link href="/galeria?coleccion=materia-sensible" className="hover:text-[#1a1a1a] transition-colors">Materia Sensible</Link></li>
                    <li><Link href="/galeria?coleccion=dale-wow" className="hover:text-[#1a1a1a] transition-colors">Dale WOW</Link></li>
                    <li><Link href="/galeria?coleccion=dolores-64" className="hover:text-[#1a1a1a] transition-colors">Dolores 64</Link></li>
                  </ul>
                </div>
              </div>

              {/* Col 2 — Nosotros */}
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#1a1a1a] mb-5">{t('about')}</p>
                <ul className="space-y-3 text-xs text-[#888] tracking-wider">
                  <li><Link href="/contacto" className="hover:text-[#1a1a1a] transition-colors">{t('aboutNmad')}</Link></li>
                  <li><Link href="/contacto" className="hover:text-[#1a1a1a] transition-colors">{t('visitShowroom')}</Link></li>
                  <li><Link href="/contacto" className="hover:text-[#1a1a1a] transition-colors">{t('contact')}</Link></li>
                </ul>
              </div>

              {/* Col 3 — Síguenos */}
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#1a1a1a] mb-5">{t('follow')}</p>
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
                <span>© {year} NMAD · New Modern Art District</span>
                <Link href="/legal" className="hover:text-[#888] transition-colors">{t('legal')}</Link>
              </div>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
