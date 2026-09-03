# Plantilla dental — diseño

Fecha: 2026-09-02
Primer cliente: AXX Dental (Ciudad Satélite, Naucalpan)

## 1. Objetivo

Construir una plantilla de landing para clínicas dentales donde **un cliente nuevo
se resuelve cambiando un solo archivo de datos**. AXX Dental es el primer cliente y
vive en este repo como demo funcional: es la prueba de que el contrato aguanta un
caso real.

Este repo (`dentist-template`) se publica en GitHub como *template repository*. Cada
cliente se genera desde ahí. La plantilla base queda **sin animaciones** más allá de
la del hero; el clon de cada cliente es donde se gasta presupuesto de movimiento.

Consecuencia asumida: el clon deja de recibir mejoras de la plantilla. Un arreglo en
la base no se propaga a los clientes ya generados. Aceptable a esta escala.

## 2. Decisiones tomadas

| Tema | Decisión |
|---|---|
| Especialidades | Las 7 de `doc.txt` (con Estética Dental y Cirugía Oral), no las del brief |
| Copy de especialidades | Reescritas en voz de paciente, conservando el hecho clínico (§9) |
| Fun facts | Sí, incluidos, sin el rótulo "Fun fact" |
| Titular del hero | "Antes de tocar un diente, escuchamos." |
| Tipografía | Instrument Serif (display + italic) + Inter (cuerpo/UI) |
| Paleta | Derivada del logo, con el turquesa domado |
| Ritmo de color | Base clara + un solo bloque oscuro (Método) |
| Movimiento | Un único momento: el titular del hero al cargar, CSS puro |
| Logo | Wordmark tipográfico en el nav; el JPEG solo como favicon y al cierre de Ubicación |
| Contrato de datos | Secciones opcionales en el tipo; se pintan solo si hay datos |
| Datos faltantes | WhatsApp y teléfono obligatorios (falla el build); el resto opcional y degrada |
| Mapa | Sin iframe de Google Maps |
| Fuentes | Self-hosteadas a mano, sin dependencia |

Correcciones ortográficas aplicadas sobre `doc.txt`: `Priodoncia`→Periodoncia,
`Estetica`→Estética, `DESPÚES`→DESPUÉS.

## 2.1 Nomenclatura

**El código va en inglés. El contenido va en español.**

Archivos, tipos, campos, funciones, tokens CSS y clases de Tailwind: inglés.
Todo string que el visitante llegue a leer: español. Un `Doctors.astro` que recibe
`doctors: Doctor[]` y pinta `"Quién te va a atender"` es lo correcto.

`borde` se traduce como `line`, no como `border`, porque `border-border` como clase
de Tailwind es ilegible.

| archivo | | identificador | |
|---|---|---|---|
| `types.ts` | ← tipos.ts | `Clinic` | ← Clinica |
| `validate.ts` | ← validar.ts | `Theme` | ← Tema |
| `clinic.ts` | ← clinica.ts | `Brand` | ← Marca |
| `Method.astro` | ← Metodo.astro | `Contact` | ← Contacto |
| `Doctors.astro` | ← Doctores.astro | `Rating` | ← Calificacion |
| `Specialties.astro` | ← Especialidades.astro | `Method` / `MethodStep` | ← Metodo / PasoMetodo |
| `Reviews.astro` | ← Resenas.astro | `Specialty` | ← Especialidad |
| `Location.astro` | ← Ubicacion.astro | `Review` / `Reviews` | ← Resena / Resenas |
| `WhatsAppButton.astro` | ← BotonWhatsApp.astro | `Hours` / `Location` / `Image` | ← Horario / Ubicacion / Imagen |
| | | `validateClinic` / `whatsappUrl` / `InvalidClinic` | ← validarClinica / urlWhatsapp / ClinicaInvalida |

Tokens: `--theme-*` es lo que inyecta el layout, `--color-*` lo que declara Tailwind.
Clases resultantes: `bg-background`, `bg-surface`, `text-ink`, `text-ink-soft`,
`border-line`, `bg-accent`, `text-accent-ink`, `bg-inverted-background`,
`text-inverted-ink`, `text-inverted-ink-soft`, `text-accent-light`.

## 3. Arquitectura de datos

`src/data/tipos.ts` es el contrato. Ningún componente conoce a AXX.

```ts
export interface Theme {
  background: string;
  surface: string;
  ink: string;
  inkSoft: string;
  line: string;
  accent: string;
  accentInk: string;
  invertedBackground: string;
  invertedInk: string;
  invertedInkSoft: string;
  /** Only legible against invertedBackground. */
  accentLight: string;
}

export interface Image {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Brand {
  name: string;
  kind: string;
  tagline?: string;
  /** Favicon and the closing mark of the location section, never the nav. */
  logo?: Image;
}

export interface Contact {
  /** Digits only, country code included, no "+" and no spaces. */
  whatsapp: string;
  whatsappMessage: string;
  /** E.164. */
  phone: string;
  phoneDisplay: string;
}

export interface Hero {
  /** One entry per line — the staggered reveal animates line by line. */
  headline: string[];
  subhead: string;
  cta: string;
}

export interface Rating {
  score: number;
  count: number;
  source: string;
  updatedAgo?: string;
  profileUrl?: string;
}

export interface MethodStep {
  label: string;
  text: string;
}

export interface Method {
  title: string;
  intro?: string;
  steps: MethodStep[];
}

export interface Doctor {
  name: string;
  role: string;
  duties: string;
  quote: string;
  personalNote?: string;
  license?: string;
  photo?: Image;
}

export interface Specialty {
  name: string;
  solves: string;
}

export interface Review {
  text: string;
  author: string;
  date?: string;
}

export interface Reviews {
  title: string;
  /** Patterns that repeat across the clinic's public reviews. */
  themes: string[];
  quotes?: Review[];
}

export interface Hours {
  days: string;
  time: string;
}

export interface Location {
  title: string;
  area: string;
  /** One entry per line. */
  address?: string[];
  mapUrl?: string;
  hours?: Hours[];
  paymentMethods?: string[];
  installments?: boolean;
}

export interface Clinic {
  brand: Brand;
  contact: Contact;
  theme: Theme;
  seo: { title: string; description: string; url: string };

  hero: Hero;
  doctors: Doctor[];
  specialties: Specialty[];

  // method, reviews and location each carry their own title; doctors and
  // specialties are bare arrays, so their headings live here. Without this
  // they would end up hardcoded in index.astro — client copy outside
  // clinic.ts, which is exactly what breaks reuse.
  titles: { doctors: string; specialties: string };

  rating?: Rating;
  method?: Method;
  reviews?: Reviews;
  location?: Location;
}
```

`index.astro` renderiza cada sección opcional solo si hay datos:

```astro
{clinica.metodo && <Metodo metodo={clinica.metodo} />}
```

Nunca un `if` con el nombre o slug de un cliente. Si algo debe variar entre clientes,
se convierte en un campo que cualquiera puede usar.

## 4. Tema

`Base.astro` inyecta `clinica.tema` con `define:vars` como variables CSS de nombre
semántico. Tailwind mapea clases (`bg-fondo`, `text-tinta`, `bg-acento`) a esas
variables. Ningún componente escribe un hex ni una clase de color de Tailwind.

Valores para AXX, derivados del logo:

| token | valor | origen |
|---|---|---|
| `background` | `#FCFCFB` | neutro casi blanco |
| `surface` | `#F1F4F3` | tinte verde-gris casi imperceptible; fondo de Reseñas |
| `ink` | `#14181A` | el negro del logo (`#161A1C`) |
| `inkSoft` | `#5A6461` | |
| `line` | `#E3E7E6` | |
| `accent` | `#1F6B66` | turquesa del logo domado — 5.8:1 sobre `background`, AA |
| `accentInk` | `#FCFCFB` | |
| `invertedBackground` | `#0E2926` | el turquesa llevado al fondo, no un negro genérico |
| `invertedInk` | `#EDF3F1` | |
| `invertedInkSoft` | `#8FA5A0` | |
| `accentLight` | `#A0F8E2` | el menta del logo — **solo** sobre `invertedBackground` |

El menta `#A0F8E2` es ilegible sobre fondo claro y se usa exclusivamente dentro del
bloque oscuro, donde tiene contraste alto y se lee como el detalle más caro del sitio.

Todo par texto/fondo debe verificarse a 4.5:1 (texto normal) o 3:1 (texto ≥24px).

## 5. Tipografía y espaciado

**Familias.** Instrument Serif 400 + italic para display y citas. Inter variable
400–600 para cuerpo e interfaz. Self-hosteadas: `.woff2` en `public/fonts/`,
`@font-face` con `font-display: swap`, `preload` solo del Instrument Serif regular
(es el LCP). Subset latin. Sin `@fontsource`, sin el CDN de Google.

**Escala tipográfica.** Salto deliberadamente grande, sin escalones intermedios —
es lo que separa lo editorial de lo genérico.

| rol | móvil | desktop | familia |
|---|---|---|---|
| display (hero) | 40px | 76px | Instrument Serif · lh .95 · tracking -.02em |
| título de sección | 30px | 44px | Instrument Serif · lh 1.05 |
| cita de doctor | 22px | 28px | Instrument Serif italic |
| cuerpo | 17px | 17px | Inter · lh 1.6 · máx 65ch |
| rótulo / eyebrow | 12px | 12px | Inter 600 · uppercase · tracking .12em |
| dato numérico | — | — | Inter · `font-variant-numeric: tabular-nums` |

**Espaciado.** Escala cerrada: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Nada
intermedio. Aire vertical de sección: 96px en móvil, 160px en desktop.

## 6. Reglas anti-genérico

Verificables en revisión. Cada una nombra un delator concreto de plantilla.

1. **Sin sombras.** Ninguna `box-shadow` en todo el sitio. La separación se hace con
   línea de 1px y con espacio. Las sombras suaves en cards son el delator número uno.
2. **Dos radios, no uno.** Bloques y contenedores a `0`. Solo los elementos de acción
   (botón WhatsApp, píldora de calificación) van pill. Nada de `rounded-lg` uniforme.
3. **Sin iconos decorativos.** Solo dos SVG inline, ambos funcionales: la estrella de
   la calificación y el glifo de WhatsApp. Ningún icono junto a un título de sección.
4. **Nada de tres cards iguales lado a lado.** Especialidades es una lista editorial
   con divisorias, no una grilla de tarjetas.
5. **Sin hover en tarjetas.** Estados de hover solo en cosas clicables reales.
6. **Retícula asimétrica.** El contenido no está centrado por defecto. El hero se
   alinea a la izquierda con la columna de texto ocupando ~7 de 12; los títulos de
   sección y su contenido viven en columnas distintas en desktop.
7. **Microtipografía.** `tabular-nums` en el 4.9 y el 84; comilla de apertura de las
   citas colgada fuera de la caja de texto (`hanging-punctuation` con fallback por
   margen negativo); guiones y comillas tipográficas correctas en todo el copy.
8. **Sin gradientes.** Ningún `linear-gradient` de relleno decorativo.
9. **Sin foto de stock.** Las únicas dos imágenes del sitio son las de los doctores.

## 7. Responsive

Móvil primero. Base de diseño 390px. Breakpoints: `640` `768` `1024` `1280`.
Verificación obligatoria en 390, 768, 1024, 1280 y 1536.

| sección | móvil (390) | desktop (≥1024) |
|---|---|---|
| Nav | wordmark + glifo WhatsApp | wordmark + teléfono + botón |
| Hero | display 40px, 3 líneas, CTA ancho completo | display 76px, columna 7/12 alineada izquierda |
| Método | apilado, línea de tiempo vertical uniendo los pasos | 3 columnas, línea de tiempo horizontal |
| Doctores | 1 columna, foto sobre texto | 2 columnas |
| Especialidades | lista de 1 columna con divisorias | 2 columnas, divisorias continuas |
| Reseñas | dato grande arriba, consensos apilados | dato a la izquierda, consensos y reseñas a la derecha |
| Ubicación | apilado; "Cómo llegar" ancho completo | 2 columnas: dirección/horarios y datos prácticos |
| WhatsApp | **botón fijo abajo**, con `padding-bottom: env(safe-area-inset-bottom)` | no aparece; vive en el nav |

Reglas duras: ningún desbordamiento horizontal a 390px; todo objetivo táctil ≥44px;
la barra fija de WhatsApp reserva su altura al final del documento para no tapar
contenido; el display escala con `clamp()` para no romper entre breakpoints.

## 8. Especificación por sección

**Favicon.** El logo real del cliente, nunca el de Astro: es lo primero que ve el
prospecto en la pestaña y el delator más barato de que esto es una plantilla.

**Nav.** Wordmark `AXX Dental` compuesto en Inter 600 con tracking apretado. Sin menú
de navegación y sin hamburguesa: son cinco secciones y el scroll basta; un menú móvil
cuesta JS que no está presupuestado. No sticky.

**Hero.** Sin foto. Orden: píldora de calificación (★ 4.9 · 84 reseñas en Google) →
titular en tres líneas → bajada → CTA → `Salud. Función. Estética.` como firma al pie,
tomado del tagline del logo. Es el mismo eje que la cita del Dr. Alexander
("devolver la salud, función y estética"), así que refuerza la voz real de la marca.

Único movimiento del sitio: las tres líneas del titular entran escalonadas al cargar.
CSS puro (`@keyframes` + `animation-delay`), sin JS. Envuelto en
`@media (prefers-reduced-motion: no-preference)`, de modo que reducir movimiento es
el estado por defecto y la animación es lo aditivo.

**Método.** El bloque oscuro, y la segunda sección de la página. `01 ANTES ·
02 DURANTE · 03 DESPUÉS`, rótulos en Inter uppercase con tracking amplio y el número
en `acentoClaro`. Una línea de tiempo une los pasos: horizontal en desktop, vertical
en móvil. Marcado como `<ol>` — es una secuencia real, así que la numeración está
justificada semánticamente.

**Doctores.** Por doctor: foto, nombre, rol, función, cita en Instrument Serif italic
como protagonista visual, nota personal al pie sin rótulo, cédula si existe. Las fotos
llevan `width`/`height` explícitos, `loading="lazy"` y `decoding="async"`. Si un doctor
no trae foto, la tarjeta se compone solo con tipografía; nunca un placeholder gris.

**Especialidades.** Las 7 como `<dl>`: nombre en Instrument Serif, línea de qué
resuelve en Inter, divisoria de 1px entre entradas. Sin tarjetas, sin hover, sin
iconos. Dos columnas en desktop.

**Reseñas.** Única sección sobre `superficie`, lo que da un tercer nivel de tono entre
la base clara y el bloque oscuro del Método y evita que la mitad baja se aplane.
`4.9` en display grande con `tabular-nums`, `84 reseñas en Google` y la
recencia debajo. Los tres consensos (amabilidad, explicación clara, trato personal)
como afirmaciones cortas. Las tres reseñas textuales cuando existan, en `<blockquote>`
con `<cite>`. Sin carrusel — eso es JS.

**Ubicación.** Última sección, y hace de cierre del sitio: dirección, zona, horarios
en `<dl>`, formas de pago, y un enlace "Cómo llegar" a la ficha de Google Maps. Al pie,
el logo real de la clínica en tamaño pequeño — es el único lugar donde aparece.
No hay componente de footer; la arquitectura son ocho componentes y ninguno lo es.

**Sin iframe de mapa**: mete cookies de terceros que el brief prohíbe, pesa cientos de
KB y hunde el LCP.

**BotonWhatsApp.** `<a href="https://wa.me/{whatsapp}?text={mensaje}">` con el mensaje
pre-armado desde `clinica.ts`. Fijo abajo en móvil, ausente en desktop. `rel="noopener"`.

**Base.astro.** `<html lang="es">`, meta viewport, `define:vars` con el tema, preload
de la fuente del LCP, Open Graph, y JSON-LD `Dentist` construido desde `clinica`
(nombre, dirección, teléfono, horarios y `aggregateRating` solo si hay calificación).

## 9. Copy — especialidades reescritas

Traducidas de `doc.txt` a voz de paciente, conservando el hecho clínico. **Pendientes
de aprobación.**

| especialidad | resuelve |
|---|---|
| Ortodoncia | Endereza tus dientes y corrige tu mordida con brackets, alineadores o aparatos. |
| Endodoncia | Salva un diente infectado por dentro, en vez de sacarlo. |
| Periodoncia | Trata tus encías cuando sangran, se inflaman o se están retirando. |
| Odontopediatría | Atiende a bebés, niños y adolescentes, y les enseña a cuidarse desde chicos. |
| Estética Dental | Cambia el color y la forma de tus dientes: blanqueamiento, carillas y diseño de sonrisa. |
| Cirugía Oral | Resuelve lo que necesita quirófano: muelas del juicio, frenillos, quistes e injertos. |
| Implantología | Repone un diente que perdiste con un implante fijo que no se quita. |

Vocabulario prohibido en todo el sitio: "expertos en salud bucal", "tu sonrisa es
nuestra prioridad", "calidad y profesionalismo" y sus variantes.

No se menciona ningún precio. La conversión es la valoración inicial, no el tratamiento.

## 10. Stack y presupuesto

- Astro 7.2.9, Node ≥22.12 (local: 26.7.0), pnpm
- Tailwind CSS v4 vía `@tailwindcss/vite` — **única dependencia nueva**
- Sin React/Vue/Svelte. Sin directivas `client:*`
- Sin librerías de animación ni de iconos. SVG inline
- Sin `localStorage`, sin cookies, sin analytics de terceros
- Deploy en Vercel, salida estática
- Renombrar `package.json` de `vet-template` a `dentist-template`

**Presupuesto de JavaScript: 0 KB.** No 5 KB. La animación es CSS, no hay carrusel,
no hay menú móvil, no hay iframe. Es un argumento de venta más fuerte que "rápido".

## 11. Criterios de aceptación

- Cambiar `clinica.ts` cambia el sitio completo, sin tocar componentes
- Borrar `metodo`, `resenas`, `calificacion` o `ubicacion` de `clinica.ts` hace
  desaparecer esa sección, sin errores y sin huecos de layout
- El build falla si falta `whatsapp` o `telefono`
- Lighthouse ≥95 en Performance, Accessibility, Best Practices y SEO
- LCP < 1s
- 0 KB de JS en el bundle
- Sin desbordamiento horizontal a 390px
- Foco de teclado visible en todo elemento interactivo
- `prefers-reduced-motion` respetado
- HTML válido: Astro 7 ya no autocorrige etiquetas sin cerrar
- Las nueve reglas de §6 se sostienen

## 12. Datos pendientes

Bloqueante para compilar:

- **Número de WhatsApp** (dígitos con lada país)
- **Teléfono**

No bloqueantes; su sección o campo se omite hasta que lleguen:

- Dirección exacta y URL de la ficha de Google Maps
- Horarios de atención
- Cédulas profesionales de ambos doctores
- Tres reseñas textuales con nombre
- Formas de pago y si manejan meses sin intereses
- Fotos de ambos doctores
- **Apellido de la Dra. Ximena** (no estaba en la lista del brief)
- Confirmar la ortografía: ¿Patiño o Patinno?

## 13. Fases

**Fase 1 — estructura sin estilos.** `tipos.ts`, `clinica.ts`, `Base.astro`, los ocho
componentes con marcado semántico y accesible sin Tailwind de presentación,
`index.astro`, y deploy funcionando en Vercel. **Parar aquí** para revisión completa
del código.

**Fase 2 — estilos, una sección a la vez.** Orden: Hero → Método → Doctores →
Especialidades → Reseñas → Ubicación. Después de cada sección, correr Lighthouse y
reportar el score. No avanzar sin confirmación.

**Alcance cerrado.** Cinco secciones más el hero. Ni una más.
