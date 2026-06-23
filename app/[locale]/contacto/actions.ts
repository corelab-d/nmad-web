'use server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function enviarConsulta(formData: FormData) {
  const nombre = formData.get('nombre') as string
  const correo = formData.get('correo') as string
  const telefono = formData.get('telefono') as string
  const mensaje = formData.get('mensaje') as string
  const obra = formData.get('obra') as string
  const artista = formData.get('artista') as string

  if (!nombre || !correo || !mensaje) {
    return { ok: false, error: 'Por favor completa todos los campos.' }
  }

  const asunto = obra
    ? `Consulta sobre "${obra}" de ${artista}`
    : `Consulta desde nmad.art — ${nombre}`

  const cuerpo = `
Nombre: ${nombre}
Correo: ${correo}
${telefono ? `Teléfono: ${telefono}\n` : ''}${obra ? `\nObra: ${obra}\nArtista: ${artista}\n` : ''}
Mensaje:
${mensaje}
  `.trim()

  try {
    await resend.emails.send({
      from: 'NMAD Web <noreply@nmad.art>',
      to: 'info@nmad.art',
      replyTo: correo,
      subject: asunto,
      text: cuerpo,
    })
    return { ok: true }
  } catch {
    return { ok: false, error: 'No se pudo enviar el mensaje. Intenta de nuevo.' }
  }
}
