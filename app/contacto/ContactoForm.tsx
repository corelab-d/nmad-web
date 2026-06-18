'use client'
import { useRef, useState, useTransition } from 'react'
import { enviarConsulta } from './actions'

export default function ContactoForm({ obra, artista }: { obra?: string; artista?: string }) {
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await enviarConsulta(fd)
      if (result.ok) {
        setStatus('ok')
        formRef.current?.reset()
      } else {
        setStatus('error')
        setErrorMsg(result.error ?? 'Error al enviar.')
      }
    })
  }

  const inputClass = 'w-full border border-[#e8e8e8] bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors placeholder:text-[#bbb]'

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {obra && (
        <>
          <input type="hidden" name="obra" value={obra} />
          <input type="hidden" name="artista" value={artista} />
          <div className="bg-[#f5f5f5] border border-[#e8e8e8] px-4 py-3 text-sm">
            <span className="text-[10px] tracking-widest uppercase text-[#888] block mb-0.5">Obra de interés</span>
            <span className="font-light">{obra}</span>
            {artista && <span className="text-[#888]"> — {artista}</span>}
          </div>
        </>
      )}

      <input name="nombre" type="text" placeholder="Nombre" required className={inputClass} />
      <input name="correo" type="email" placeholder="Correo electrónico" required className={inputClass} />
      <textarea name="mensaje" placeholder="Mensaje" required rows={5} className={`${inputClass} resize-none`} />

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3.5 bg-[#1a1a1a] text-[#ffffff] text-xs tracking-[0.2em] uppercase hover:bg-[#333] transition-colors disabled:opacity-50"
      >
        {isPending ? 'Enviando…' : 'Enviar mensaje'}
      </button>

      {status === 'ok' && (
        <p className="text-sm text-center text-[#555] pt-2">Mensaje enviado. Te contactamos pronto.</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-center text-red-600 pt-2">{errorMsg}</p>
      )}
    </form>
  )
}
