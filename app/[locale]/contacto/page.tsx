import { Suspense } from 'react'
import ContactoPageClient from './ContactoPageClient'

export default function ContactoPage() {
  return (
    <Suspense>
      <ContactoPageClient />
    </Suspense>
  )
}
