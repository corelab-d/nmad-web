import { Suspense } from 'react'
import ContactoPageClient from './ContactoPageClient'

export const metadata = { title: 'Contacto · NMAD' }

export default function ContactoPage() {
  return (
    <Suspense>
      <ContactoPageClient />
    </Suspense>
  )
}
