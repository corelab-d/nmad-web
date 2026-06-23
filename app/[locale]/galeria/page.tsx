import { getAllArtworks, getAllArtists, COLLECTIONS } from '@/lib/catalog'
import GaleriaClient from './GaleriaClient'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'gallery' })
  return { title: `${t('title')} · NMAD` }
}

export default async function GaleriaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const artworks = getAllArtworks()
  const artists = getAllArtists()
  return (
    <GaleriaClient
      artworks={artworks}
      artists={artists}
      collections={COLLECTIONS}
      locale={locale}
    />
  )
}
