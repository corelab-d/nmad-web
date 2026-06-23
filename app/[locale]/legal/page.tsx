import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'legal' })
  return { title: `${t('title')} · NMAD` }
}

export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'legal' })

  const isEn = locale === 'en'

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-4">{t('label')}</p>
      <h1 className="text-3xl font-light mb-2">{t('title')}</h1>
      <p className="text-sm text-[#888] mb-12">{t('subtitle')}</p>

      <div className="space-y-10 text-sm text-[#444] leading-relaxed">

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">{isEn ? 'Introduction' : 'Introducción'}</h2>
          <p>{isEn
            ? 'These Terms establish a binding agreement between the user and NMAD ART, governing the use of its online platform. The company advises that additional terms may apply to specific services such as artwork rental or refunds.'
            : 'Los presentes Términos establecen un acuerdo vinculante entre el usuario y NMAD ART, regulando el uso de su plataforma en línea. La compañía advierte que términos adicionales pueden aplicarse a servicios específicos como arrendamiento de obras de arte o reembolsos.'
          }</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">{isEn ? 'Use of service' : 'Uso del servicio'}</h2>
          <p className="mb-3">{isEn
            ? 'The service contains diverse materials: design, information, photographs, artwork information, prices, databases, articles, and intellectual property elements including trademarks and logos.'
            : 'El servicio contiene materiales diversos: diseño, información, fotografías, información de obras de arte, precios, bases de datos, artículos y elementos de propiedad intelectual incluyendo marcas comerciales y logotipos.'
          }</p>
          <p>{isEn
            ? 'Users receive a non-exclusive personal license to download and view content solely for non-commercial use on personal devices. The company retains all rights and may suspend this license without notice.'
            : 'Los usuarios reciben una licencia personal no exclusiva para descargar y visualizar contenido únicamente para uso no comercial en dispositivos personales. La compañía retiene todos los derechos y puede suspender esta licencia sin previo aviso.'
          }</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">{isEn ? 'Account setup and payment' : 'Configuración de cuenta y pago'}</h2>
          <p className="mb-3">{isEn
            ? 'Users must provide accurate and current information when registering. They are responsible for maintaining account security and for all payments made under their account.'
            : 'Los usuarios deben proporcionar información precisa y actual al registrarse. Son responsables de mantener la seguridad de sus cuentas y de todos los pagos realizados bajo ellas.'
          }</p>
          <p>{isEn
            ? 'The service uses third-party payment processors. Users authorize charges to their chosen payment method and agree to pay all amounts owed within 30 days of notification.'
            : 'El servicio utiliza procesadores de pago terceros. Los usuarios autorizan cargos a su método de pago elegido y aceptan pagar todos los montos adeudados dentro de 30 días de la notificación.'
          }</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">{isEn ? 'Restrictions' : 'Restricciones'}</h2>
          <p>{isEn
            ? 'Political, illegal, or offensive use of the service is not permitted. Users must comply with all applicable laws and may not collect information, modify content, or interfere with security measures.'
            : 'No se permite uso político, ilegal u ofensivo del servicio. Los usuarios deben cumplir con todas las leyes aplicables y no pueden recopilar información, modificar contenido o interferir con medidas de seguridad.'
          }</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">{isEn ? 'Availability' : 'Disponibilidad'}</h2>
          <p>{isEn
            ? 'The company may suspend or cancel the service at any time without prior notice or liability at its sole discretion.'
            : 'La compañía puede suspender o cancelar el servicio en cualquier momento sin previo aviso ni responsabilidad a su discreción exclusiva.'
          }</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">{isEn ? 'User consent' : 'Consentimiento del usuario'}</h2>
          <p>{isEn
            ? 'Users are responsible for all content they upload. The company may pre-screen or remove content without obligation to do so. By accepting the terms, users grant fully paid, royalty-free, and perpetual rights over their content.'
            : 'Los usuarios son responsables de todo contenido que suban. La compañía puede preseleccionar o eliminar contenido sin obligación de hacerlo. Al aceptar los términos, los usuarios ceden derechos totalmente pagados, libres de regalías y perpetuos sobre su contenido.'
          }</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">{isEn ? 'Third-party services' : 'Servicios de terceros'}</h2>
          <p>{isEn
            ? 'The company is not responsible for content, products, or services from third parties linked to or integrated into its platform.'
            : 'La compañía no es responsable por contenido, productos o servicios de terceros vinculados o integrados en su plataforma.'
          }</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">{isEn ? 'Disclaimer' : 'Descargo de responsabilidad'}</h2>
          <p>{isEn
            ? 'The service is provided "as is," "as available," and "with all faults." The company makes no express or implied warranties about the content.'
            : 'El servicio se proporciona "tal cual", "según disponibilidad" y "con todos los defectos". La compañía no realiza garantías explícitas ni implícitas sobre el contenido.'
          }</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">{isEn ? 'Limitation of liability' : 'Limitaciones de responsabilidad'}</h2>
          <p>{isEn
            ? 'The company will not be liable for losses, indirect, special, or consequential damages resulting from use of the service, except in cases of consumer liability, personal injury, or gross negligence.'
            : 'La compañía no será responsable por pérdidas, daños indirectos, especiales o consecuentes resultantes del uso del servicio, excepto en casos de responsabilidad del consumidor, lesiones personales o negligencia grave.'
          }</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">{isEn ? 'Artwork responsibility' : 'Responsabilidad sobre obras'}</h2>
          <p>{isEn
            ? 'Users must care for artworks in their possession and are responsible for any loss or damage. They may not assign rented artworks to third parties.'
            : 'Los usuarios deben cuidar las obras de arte en su posesión y son responsables de cualquier pérdida o daño. No pueden asignar obras de arte arrendadas a terceros.'
          }</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">{isEn ? 'Indemnification' : 'Indemnización'}</h2>
          <p>{isEn
            ? 'Users agree to defend and indemnify the company against claims arising from their breach, misuse of the service, or violation of third-party rights.'
            : 'Los usuarios aceptan defender y resarcir a la compañía contra reclamaciones derivadas de su incumplimiento, mal uso del servicio o violación de derechos de terceros.'
          }</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">{isEn ? 'Arbitration and governing law' : 'Arbitraje y ley aplicable'}</h2>
          <p>{isEn
            ? 'Disputes are resolved through binding arbitration, not in courts. The company may file lawsuits for intellectual property infringement without prior arbitration.'
            : 'Las disputas se resuelven mediante arbitraje vinculante, no en tribunales. La compañía puede entablar demandas por infracción de propiedad intelectual sin arbitraje previo.'
          }</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">{isEn ? 'Jurisdiction' : 'Jurisdicción'}</h2>
          <p>{isEn
            ? 'The company operates from Mexico and does not guarantee the service is appropriate outside that country. Software is subject to Mexican export controls.'
            : 'La compañía opera desde México y no garantiza que el servicio sea apropiado fuera de ese país. El software está sujeto a controles de exportación mexicanos.'
          }</p>
        </section>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">{isEn ? 'Contact' : 'Contacto'}</h2>
          <p>{isEn ? 'For any legal inquiry: ' : 'Para cualquier consulta legal: '}<a href="mailto:info@nmad.art" className="underline underline-offset-4 hover:text-[#1a1a1a] transition-colors">info@nmad.art</a></p>
        </section>

      </div>
    </div>
  )
}
