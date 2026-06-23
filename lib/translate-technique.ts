const TECHNIQUE_MAP: [RegExp, string][] = [
  // Óleo
  [/[oó]leo[\s,].*pigmento.*m[aá]rmol.*vidrio/i, 'Oil and marble dust on glass'],
  [/[oó]leo[\s,].*polvo.*m[aá]rmol.*vidrio/i, 'Oil and marble dust on glass'],
  [/[oó]leo[\s,].*polvo.*m[aá]rmol.*mesa/i, 'Oil and marble dust on table'],
  [/[oó]leo[\s,].*polvo.*m[aá]rmol.*acr[íi]lico/i, 'Oil, marble dust and acrylic on canvas'],
  [/[oó]leo[\s,].*arena.*pigmentos/i, 'Oil, sand and pigments on canvas'],
  [/[oó]leo[\s,].*pigmentos.*tezontle/i, 'Oil, pigments and tezontle on canvas'],
  [/[oó]leo[\s,].*encáustica|encáustico/i, 'Oil and encaustic on canvas'],
  [/encausto/i, 'Encaustic'],
  [/[oó]leo[\s,].*l[aá]piz.*cera/i, 'Oil and wax pencil on canvas'],
  [/[oó]leo[\s,].*tinta.*tela/i, 'Oil and ink on canvas'],
  [/[oó]leo[\s,].*tinta/i, 'Oil and ink on canvas'],
  [/[oó]leo[\s,].*pigment[oa]s?.*tela/i, 'Oil and pigment on canvas'],
  [/[oó]leo[\s,].*pigment[oa]s?/i, 'Oil and pigment on canvas'],
  [/pigmento.*[oó]leo/i, 'Pure pigment and oil on canvas'],
  [/[oó]leo.*barra.*papel/i, 'Oil stick on paper'],
  [/[oó]leo.*papel.*algod[oó]n/i, 'Oil on cotton paper'],
  [/[oó]leo.*papel/i, 'Oil on paper'],
  [/[oó]leo.*lino\b/i, 'Oil on linen'],
  [/[oó]leo.*lin[oó]leo/i, 'Oil on linoleum'],
  [/[oó]leo.*madera/i, 'Oil on wood'],
  [/[oó]leo.*cart[oó]n/i, 'Oil on cardboard'],
  [/[oó]leo.*lona/i, 'Oil on canvas'],
  [/[oó]leo.*tela/i, 'Oil on canvas'],
  [/[oó]leo.*color.*acr[íi]lico/i, 'Oil and acrylic on canvas'],

  // Acrílico
  [/acr[íi]lico.*tela.*tela.*desgajada/i, 'Acrylic and fabric on canvas'],
  [/acr[íi]lico.*tinta.*carb[oó]n.*loneta/i, 'Acrylic, oil ink and charcoal on canvas'],
  [/acr[íi]lico.*carb[oó]n.*esmalte.*loneta/i, 'Acrylic, charcoal and enamel on canvas'],
  [/acr[íi]lico.*papel.*mach[eé]/i, 'Acrylic and papier-mâché on wood'],
  [/acr[íi]lico.*madera/i, 'Acrylic on wood'],
  [/acr[íi]lico.*tela/i, 'Acrylic on canvas'],
  [/acr[íi]lico.*lienzo/i, 'Acrylic on canvas'],
  [/acuarela.*lienzo/i, 'Watercolor on canvas'],
  [/acuarela.*papel/i, 'Watercolor on paper'],

  // Mixta
  [/mixta.*terciopelo/i, 'Mixed media on velvet'],
  [/mixta.*sal\b/i, 'Mixed media on canvas (salt)'],
  [/mixta.*fibra.*vidrio/i, 'Mixed media on fiberglass'],
  [/mixta.*lin[oó]leo.*madera/i, 'Mixed media on linoleum mounted on wood'],
  [/mixta.*lin[oó]leo/i, 'Mixed media on linoleum'],
  [/mixta.*linóleo/i, 'Mixed media on linoleum'],
  [/mixta.*madera/i, 'Mixed media on wood'],
  [/mixta.*papel.*cloro.*tinta/i, 'Mixed media on paper with bleach and ink'],
  [/mixta.*papel/i, 'Mixed media on paper'],
  [/mixta.*cart[oó]n/i, 'Mixed media on cardboard'],
  [/mixta.*superficie.*recuperada/i, 'Mixed media on reclaimed surface'],
  [/mixta.*bastidor.*serigraf[íi]a/i, 'Mixed media on canvas with silkscreen'],
  [/mixta.*tela/i, 'Mixed media on canvas'],
  [/mixta.*cloro.*papel/i, 'Mixed media with bleach on paper'],
  [/mixta/i, 'Mixed media'],

  // Grabado
  [/aguafuerte.*aguatinta/i, 'Etching and aquatint'],
  [/aguafuerte/i, 'Etching'],
  [/grabado/i, 'Engraving on paper'],

  // Tinta / carbón
  [/tinta.*papel/i, 'Ink on paper'],
  [/resistol.*pigmento.*[oó]leo.*acr[íi]lico/i, 'Resistol, pigment, oil and acrylic on canvas'],
  [/carb[oó]n.*pastel.*papel/i, 'Charcoal and pastel on paper'],
  [/carb[oó]ncillo.*papel/i, 'Charcoal on paper'],
  [/carb[oó]n.*papel/i, 'Charcoal on paper'],
  [/pastel.*papel/i, 'Pastel on paper'],

  // Textil / hilo
  [/bordado.*m[aá]quina.*coser/i, 'Freestyle machine embroidery on blanket'],
  [/t[eé]cnica.*trapunto/i, 'Shadow trapunto technique, handmade'],
  [/hilo.*tela/i, 'Thread on canvas'],
  [/textil/i, 'Textile'],
  [/tela.*sobre.*tela/i, 'Fabric on canvas'],

  // Escultura / materiales
  [/bronce/i, 'Bronze'],
  [/m[aá]rmol.*acero/i, 'Marble and steel'],
  [/m[aá]rmol.*esta[nñ]o/i, 'Marble and tin'],
  [/cer[aá]mica/i, 'High-fire ceramics'],
  [/madera.*policromada/i, 'Polychromed wood'],
  [/acero.*esmaltado/i, 'Enameled steel'],
  [/plastilina.*ep[oó]xica/i, 'Epoxy clay'],
]

export function translateTechnique(technique: string): string {
  const t = technique.replace(/^[-–\s]+/, '').trim()
  for (const [pattern, translation] of TECHNIQUE_MAP) {
    if (pattern.test(t)) return translation
  }
  return t
}

export function translateFraming(framing: string): string {
  if (!framing) return ''
  const f = framing.toLowerCase()
  if (f.includes('sin marco')) return 'Unframed'
  if (f.includes('acero')) return 'Steel frame'
  if (f.includes('madera')) return 'Wood frame'
  return framing
}
