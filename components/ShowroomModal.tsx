'use client'
import { useState, useEffect, useRef } from 'react'
import { enviarConsulta } from '@/app/contacto/actions'

export default function ShowroomModal() {
  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem('showroom-closed')) return
    const t = setTimeout(() => setVisible(true), 800)
    return () => clearTimeout(t)
  }, [])

  function close() {
    sessionStorage.setItem('showroom-closed', '1')
    setVisible(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const data = new FormData(e.currentTarget)
    data.set('obra', '')
    data.set('artista', '')
    const res = await enviarConsulta(data)
    if (res.ok) {
      setStatus('ok')
    } else {
      setStatus('error')
      setErrorMsg(res.error ?? 'Error al enviar')
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={close} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md p-8 shadow-xl">
        <button onClick={close} className="absolute top-4 right-4 text-[#888] hover:text-[#1a1a1a] transition-colors text-lg leading-none">✕</button>

        {status === 'ok' ? (
          <div className="text-center py-8">
            <p className="text-xs tracking-[0.2em] uppercase text-[#888] mb-3">Mensaje enviado</p>
            <p className="text-lg font-light mb-6">Nos pondremos en contacto contigo pronto.</p>
            <button onClick={close} className="text-[10px] tracking-widest uppercase text-[#888] hover:text-[#1a1a1a] transition-colors">
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-2">Showroom · Álvaro Obregón, Roma</p>
            <h2 className="text-xl font-light mb-2">Agenda una visita</h2>
            <p className="text-sm text-[#888] mb-6">Ven a conocer nuestra colección en persona. Escríbenos y coordinamos una cita.</p>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="obra" value="" />
              <input type="hidden" name="artista" value="" />

              <div>
                <input
                  name="nombre"
                  required
                  placeholder="Nombre"
                  className="w-full border-b border-[#e8e8e8] py-2 text-sm outline-none placeholder-[#bbb] focus:border-[#1a1a1a] transition-colors bg-transparent"
                />
              </div>
              <div>
                <input
                  name="correo"
                  type="email"
                  required
                  placeholder="Correo electrónico"
                  className="w-full border-b border-[#e8e8e8] py-2 text-sm outline-none placeholder-[#bbb] focus:border-[#1a1a1a] transition-colors bg-transparent"
                />
              </div>
              <div>
                <input
                  name="telefono"
                  placeholder="Teléfono (opcional)"
                  className="w-full border-b border-[#e8e8e8] py-2 text-sm outline-none placeholder-[#bbb] focus:border-[#1a1a1a] transition-colors bg-transparent"
                />
              </div>
              <div>
                <textarea
                  name="mensaje"
                  required
                  placeholder="¿Cuándo te gustaría visitarnos?"
                  rows={3}
                  className="w-full border-b border-[#e8e8e8] py-2 text-sm outline-none placeholder-[#bbb] focus:border-[#1a1a1a] transition-colors resize-none bg-transparent"
                />
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-500">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-3 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#333] transition-colors disabled:opacity-50"
              >
                {status === 'sending' ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
