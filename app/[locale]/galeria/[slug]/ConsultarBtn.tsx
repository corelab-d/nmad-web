'use client'
import { useState } from 'react'
import ConsultaModal from '@/components/ConsultaModal'
import { useTranslations } from 'next-intl'

export default function ConsultarBtn({ obra, artista, locale }: { obra: string; artista: string; locale: string }) {
  const [open, setOpen] = useState(false)
  const t = useTranslations('artwork')

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3.5 bg-[#1a1a1a] text-[#ffffff] text-xs tracking-[0.2em] uppercase hover:bg-[#333] transition-colors mb-4"
      >
        {t('consult')}
      </button>

      {open && <ConsultaModal obra={obra} artista={artista} onClose={() => setOpen(false)} />}
    </>
  )
}
