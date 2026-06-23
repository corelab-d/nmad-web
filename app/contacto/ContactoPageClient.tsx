'use client'
import { useSearchParams } from 'next/navigation'
import ContactoForm from './ContactoForm'

export default function ContactoPageClient() {
  const params = useSearchParams()
  const obra = params.get('obra') ?? undefined
  const artista = params.get('artista') ?? undefined

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#888] mb-2">NMAD</p>
        <h1 className="text-3xl font-light">Contacto</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Info */}
        <div>
          <p className="text-[#555] leading-relaxed mb-10">
            ¿Te interesa una obra, necesitas asesoría de curaduría, enmarcado o colocación?
            Escríbenos y te respondemos a la brevedad.
          </p>

          <div className="space-y-6 mb-12">
            <div>
              <p className="text-[10px] tracking-widest uppercase text-[#888] mb-1">Correo</p>
              <a href="mailto:info@nmad.art" className="text-sm hover:underline underline-offset-4 transition-all">
                info@nmad.art
              </a>
            </div>
            <div>
              <p className="text-[10px] tracking-widest uppercase text-[#888] mb-1">Instagram</p>
              <a href="https://www.instagram.com/nmad.art" target="_blank" rel="noopener noreferrer"
                className="text-sm hover:underline underline-offset-4 transition-all">
                @nmad.art
              </a>
            </div>
          </div>

          <div className="border-t border-[#e8e8e8] pt-8">
            <p className="text-[10px] tracking-widest uppercase text-[#888] mb-6">Servicios</p>
            <ul className="space-y-5">
              {[
                { title: 'Curaduría', desc: 'Seleccionamos las obras ideales para tu espacio y estilo de vida.' },
                { title: 'Decoración', desc: 'Integramos el arte en tu proyecto de interiorismo.' },
                { title: 'Enmarcado', desc: 'Soluciones de montaje y enmarcado a medida para cada obra.' },
                { title: 'Colocación', desc: 'Instalación profesional en tu hogar, oficina o espacio comercial.' },
                { title: 'Para negocios', desc: 'Arte para oficinas, hoteles, restaurantes y espacios comerciales.' },
              ].map((s) => (
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
