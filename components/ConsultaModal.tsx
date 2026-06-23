'use client'
import { useEffect, useRef, useState, useTransition } from 'react'
import { enviarConsulta } from '@/lib/actions'

interface Props {
  obra: string
  artista: string
  onClose: () => void
}

export default function ConsultaModal({ obra, artista, onClose }: Props) {
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [isPending, startTransition] = useTransition()
  const backdropRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await enviarConsulta(fd)
      if (res.ok) {
        setStatus('ok')
      } else {
        setStatus('error')
        setErrorMsg(res.error ?? 'Error desconocido')
      }
    })
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => { if (e.target === backdropRef.current) onClose() }}
    >
      <div className="bg-white w-full max-w-md p-8 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#aaa] hover:text-[#1a1a1a] text-lg leading-none"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {status === 'ok' ? (
          <div className="text-center py-8">
            <p className="text-sm text-[#555] mb-1">Mensaje enviado.</p>
            <p className="text-xs text-[#aaa]">Nos pondremos en contacto contigo pronto.</p>
            <button
              onClick={onClose}
              className="mt-6 text-[10px] tracking-widest uppercase text-[#1a1a1a] underline underline-offset-4"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-1">Consulta sobre</p>
            <h2 className="text-xl font-light mb-1">{obra}</h2>
            <p className="text-[11px] text-[#aaa] mb-7">{artista}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="obra" value={obra} />
              <input type="hidden" name="artista" value={artista} />

              <div>
                <label className="block text-[10px] tracking-widest uppercase text-[#888] mb-1.5">Nombre</label>
                <input
                  name="nombre"
                  required
                  className="w-full border border-[#e8e8e8] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-widest uppercase text-[#888] mb-1.5">Correo</label>
                <input
                  name="correo"
                  type="email"
                  required
                  className="w-full border border-[#e8e8e8] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors"
                  placeholder="tu@correo.com"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-widest uppercase text-[#888] mb-1.5">Teléfono <span className="normal-case text-[#bbb]">(opcional)</span></label>
                <input
                  name="telefono"
                  type="tel"
                  className="w-full border border-[#e8e8e8] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors"
                  placeholder="+52 55 0000 0000"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-widest uppercase text-[#888] mb-1.5">Mensaje</label>
                <textarea
                  name="mensaje"
                  required
                  rows={4}
                  className="w-full border border-[#e8e8e8] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors resize-none"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-500">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 bg-[#1a1a1a] text-[#ffffff] text-[10px] tracking-[0.2em] uppercase hover:bg-[#333] transition-colors disabled:opacity-50"
              >
                {isPending ? 'Enviando…' : 'Enviar consulta'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
