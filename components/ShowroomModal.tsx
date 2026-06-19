'use client'
import { useState, useRef } from 'react'
import { enviarConsulta } from '@/app/contacto/actions'

export default function ShowroomModal({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const data = new FormData(e.currentTarget)
    const res = await enviarConsulta(data)
    if (res.ok) {
      setStatus('ok')
    } else {
      setStatus('error')
      setErrorMsg(res.error ?? 'Error al enviar')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-[#1a1a1a] w-full max-w-md p-8 shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#666] hover:text-white transition-colors text-lg leading-none">✕</button>

        {status === 'ok' ? (
          <div className="text-center py-8">
            <p className="text-xs tracking-[0.2em] uppercase text-[#888] mb-3">Mensaje enviado</p>
            <p className="text-lg font-light text-white mb-6">Nos pondremos en contacto contigo pronto.</p>
            <button onClick={onClose} className="text-[10px] tracking-widest uppercase text-[#888] hover:text-white transition-colors">
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm tracking-[0.2em] uppercase text-[#888] mb-3">Showroom · Álvaro Obregón · Roma Norte · CDMX</p>
            <h2 className="text-xl font-light text-white mb-2">Agenda una visita</h2>
            <p className="text-sm text-[#888] mb-6">Ven a conocer nuestra colección en persona. Escríbenos y coordinamos una cita.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="obra" value="" />
              <input type="hidden" name="artista" value="" />
              <input
                name="nombre" required placeholder="Nombre"
                className="w-full border-b border-[#444] py-2 text-sm text-white outline-none placeholder-[#555] focus:border-white transition-colors bg-transparent"
              />
              <input
                name="correo" type="email" required placeholder="Correo electrónico"
                className="w-full border-b border-[#444] py-2 text-sm text-white outline-none placeholder-[#555] focus:border-white transition-colors bg-transparent"
              />
              <input
                name="telefono" placeholder="Teléfono (opcional)"
                className="w-full border-b border-[#444] py-2 text-sm text-white outline-none placeholder-[#555] focus:border-white transition-colors bg-transparent"
              />
              <textarea
                name="mensaje" required placeholder="¿Cuándo te gustaría visitarnos?" rows={3}
                className="w-full border-b border-[#444] py-2 text-sm text-white outline-none placeholder-[#555] focus:border-white transition-colors resize-none bg-transparent"
              />
              {status === 'error' && <p className="text-xs text-red-400">{errorMsg}</p>}
              <button
                type="submit" disabled={status === 'sending'}
                className="w-full py-3 bg-white text-[#1a1a1a] text-[10px] tracking-[0.2em] uppercase hover:bg-[#e8e8e8] transition-colors disabled:opacity-50"
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
