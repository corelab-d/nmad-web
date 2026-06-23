'use client'
import { useSearchParams } from 'next/navigation'
import ContactoForm from './ContactoForm'
import { useTranslations } from 'next-intl'

export default function ContactoPageClient() {
  const t = useTranslations('contact')
  const params = useSearchParams()
  const obra = params.get('obra') ?? undefined
  const artista = params.get('artista') ?? undefined

  const servicesList = [
    { title: t('servicesList.0.title'), desc: t('servicesList.0.desc') },
    { title: t('servicesList.1.title'), desc: t('servicesList.1.desc') },
    { title: t('servicesList.2.title'), desc: t('servicesList.2.desc') },
    { title: t('servicesList.3.title'), desc: t('servicesList.3.desc') },
    { title: t('servicesList.4.title'), desc: t('servicesList.4.desc') },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#888] mb-2">{t('label')}</p>
        <h1 className="text-3xl font-light">{t('title')}</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Info */}
        <div>
          <p className="text-[#555] leading-relaxed mb-10">{t('intro')}</p>

          <div className="space-y-6 mb-12">
            <div>
              <p className="text-[10px] tracking-widest uppercase text-[#888] mb-1">{t('email')}</p>
              <a href="mailto:info@nmad.art" className="text-sm hover:underline underline-offset-4 transition-all">
                info@nmad.art
              </a>
            </div>
            <div>
              <p className="text-[10px] tracking-widest uppercase text-[#888] mb-1">{t('instagram')}</p>
              <a href="https://www.instagram.com/nmad.art" target="_blank" rel="noopener noreferrer"
                className="text-sm hover:underline underline-offset-4 transition-all">
                @nmad.art
              </a>
            </div>
          </div>

          <div className="border-t border-[#e8e8e8] pt-8">
            <p className="text-[10px] tracking-widest uppercase text-[#888] mb-6">{t('services')}</p>
            <ul className="space-y-5">
              {servicesList.map((s) => (
                <li key={s.title}>
                  <p className="text-xs tracking-[0.1em] uppercase text-[#1a1a1a] mb-1">{s.title}</p>
                  <p className="text-xs text-[#888] leading-relaxed">{s.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Form */}
        <div>
          <ContactoForm obra={obra} artista={artista} />
        </div>
      </div>
    </div>
  )
}
