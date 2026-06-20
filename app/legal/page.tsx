export const metadata = {
  title: 'Términos y Condiciones · NMAD',
  description: 'Términos y condiciones de uso y aviso de privacidad de NMAD · New Modern Art District.',
}

export default function LegalPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-4">Legal</p>
      <h1 className="text-3xl font-light mb-2">Términos y Condiciones</h1>
      <p className="text-sm text-[#888] mb-12">Aviso de privacidad · NMAD · New Modern Art District</p>

      <div className="space-y-10 text-sm text-[#444] leading-relaxed">

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">Introducción</h2>
          <p>Los presentes Términos establecen un acuerdo vinculante entre el usuario y NMAD ART, regulando el uso de su plataforma en línea. La compañía advierte que términos adicionales pueden aplicarse a servicios específicos como arrendamiento de obras de arte o reembolsos.</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">Uso del servicio</h2>
          <p className="mb-3">El servicio contiene materiales diversos: diseño, información, fotografías, información de obras de arte, precios, bases de datos, artículos y elementos de propiedad intelectual incluyendo marcas comerciales y logotipos.</p>
          <p>Los usuarios reciben una licencia personal no exclusiva para descargar y visualizar contenido únicamente para uso no comercial en dispositivos personales. La compañía retiene todos los derechos y puede suspender esta licencia sin previo aviso.</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">Configuración de cuenta y pago</h2>
          <p className="mb-3">Los usuarios deben proporcionar información precisa y actual al registrarse. Son responsables de mantener la seguridad de sus cuentas y de todos los pagos realizados bajo ellas.</p>
          <p>El servicio utiliza procesadores de pago terceros. Los usuarios autorizan cargos a su método de pago elegido y aceptan pagar todos los montos adeudados dentro de 30 días de la notificación.</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">Restricciones</h2>
          <p>No se permite uso político, ilegal u ofensivo del servicio. Los usuarios deben cumplir con todas las leyes aplicables y no pueden recopilar información, modificar contenido o interferir con medidas de seguridad.</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">Disponibilidad</h2>
          <p>La compañía puede suspender o cancelar el servicio en cualquier momento sin previo aviso ni responsabilidad a su discreción exclusiva.</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">Consentimiento del usuario</h2>
          <p>Los usuarios son responsables de todo contenido que suban. La compañía puede preseleccionar o eliminar contenido sin obligación de hacerlo. Al aceptar los términos, los usuarios ceden derechos totalmente pagados, libres de regalías y perpetuos sobre su contenido.</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">Servicios de terceros</h2>
          <p>La compañía no es responsable por contenido, productos o servicios de terceros vinculados o integrados en su plataforma.</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">Descargo de responsabilidad</h2>
          <p>El servicio se proporciona "tal cual", "según disponibilidad" y "con todos los defectos". La compañía no realiza garantías explícitas ni implícitas sobre el contenido.</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">Limitaciones de responsabilidad</h2>
          <p>La compañía no será responsable por pérdidas, daños indirectos, especiales o consecuentes resultantes del uso del servicio, excepto en casos de responsabilidad del consumidor, lesiones personales o negligencia grave.</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">Responsabilidad sobre obras</h2>
          <p>Los usuarios deben cuidar las obras de arte en su posesión y son responsables de cualquier pérdida o daño. No pueden asignar obras de arte arrendadas a terceros.</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">Indemnización</h2>
          <p>Los usuarios aceptan defender y resarcir a la compañía contra reclamaciones derivadas de su incumplimiento, mal uso del servicio o violación de derechos de terceros.</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">Arbitraje y ley aplicable</h2>
          <p>Las disputas se resuelven mediante arbitraje vinculante, no en tribunales. La compañía puede entablar demandas por infracción de propiedad intelectual sin arbitraje previo.</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">Jurisdicción</h2>
          <p>La compañía opera desde México y no garantiza que el servicio sea apropiado fuera de ese país. El software está sujeto a controles de exportación mexicanos.</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">Contacto</h2>
          <p>Para cualquier consulta legal: <a href="mailto:info@nmad.art" className="underline underline-offset-4 hover:text-[#1a1a1a] transition-colors">info@nmad.art</a></p>
          <p className="mt-2 text-[#888]">Tiro al Pichón 44, Lomas de Bezares 11910, Ciudad de México.</p>
        </section>

      </div>
    </div>
  )
}
