# Brief — Demo AXX Dental

## Contexto

Construyo landing pages para clínicas dentales en Ciudad Satélite, Naucalpan.
Este es el **primer demo** de un sistema que voy a reutilizar en varios clientes.

El objetivo no es solo este sitio: es dejar una **base reutilizable** donde un
cliente nuevo se resuelva cambiando un solo archivo de datos.

Este demo se construye **sin contrato**. Se lo mando al prospecto por WhatsApp
antes de contactarlo. Su sitio actual no abre (error de conexión), así que el
listón es bajo, pero tiene 84 reseñas con 4.9 estrellas y la última hace 2
semanas: es una clínica viva y con buena reputación.

## Stack y restricciones

- **Astro 7** (requiere Node 22.12+). El compilador nuevo es estricto con HTML
  inválido: no dejar etiquetas sin cerrar.
- **Tailwind CSS**
- **Sin React, Vue, Svelte ni ningún framework de UI.** Cero directivas
  `client:*`.
- Interactividad solo con `<script>` de Astro (vanilla JS).
- **Sin librerías de animación, sin librerías de íconos.** SVG inline.
- Sin backend, sin base de datos. Sitio estático.
- Deploy en Vercel.

El argumento de venta de este producto es la velocidad. El presupuesto de
JavaScript es **menos de 5 KB**. Si algo requiere más, se resuelve de otra forma.

## Arquitectura

```
src/
├── data/
│   ├── tipos.ts          ← interface Clinica (el contrato)
│   └── clinica.ts        ← datos de ESTE cliente
├── layouts/
│   └── Base.astro        ← inyecta el tema como variables CSS
├── components/
│   ├── Nav.astro
│   ├── Hero.astro
│   ├── Metodo.astro
│   ├── Doctores.astro
│   ├── Especialidades.astro
│   ├── Resenas.astro
│   ├── Ubicacion.astro
│   └── BotonWhatsApp.astro
└── pages/
    └── index.astro
```

**Regla central:** los componentes no saben de qué clínica hablan. Reciben
`clinica` como prop y pintan. Todo lo que cambia entre un cliente y otro vive
en `clinica.ts`.

### Tema

Los tokens del tema se definen en `clinica.ts` y el layout los inyecta como
variables CSS con `define:vars`. Los nombres son **semánticos**, no de color:
`--color-acento`, `--color-fondo`, `--color-tinta`, `--color-superficie`.

En los componentes se usan clases tipo `bg-acento`, `text-tinta`. Nunca
`bg-teal-600` ni valores hex directos, porque entonces cambiar de cliente sería
buscar y reemplazar en todo el proyecto.

## Trabajo en dos fases

### Fase 1 — Estructura, sin estilos

Entregar:

1. `tipos.ts` con la interface `Clinica` completa
2. `clinica.ts` lleno con los datos de AXX (abajo)
3. `Base.astro` con la inyección del tema
4. Todos los componentes con **marcado semántico y accesible, sin Tailwind de
   presentación**. Solo la estructura HTML correcta.
5. `index.astro` componiendo todo
6. Deploy funcionando en Vercel

**Parar aquí.** Voy a leer el código completo antes de seguir.

### Fase 2 — Estilos, sección por sección

En este orden: Hero → Método → Doctores → Especialidades → Reseñas → Ubicación.

Una sección terminada a la vez. Después de cada una, correr Lighthouse y
reportar el score. No pasar a la siguiente hasta que yo confirme.

## Datos del cliente

**Nombre:** AXX Dental
**Tipo:** Clínica dental de especialidades
**Ubicación:** Ciudad Satélite, Naucalpan, Estado de México

### Doctores

**Dr. Alexander Patiño — Director clínico**
Primer contacto con el paciente, análisis, diagnóstico y endodoncia.

> "Me apasiona devolver la salud, función y estética a nuestros pacientes con
> atención personalizada. Disfruto explicar de forma clara y gráfica cada
> tratamiento, y que cada paciente se sienta seguro, informado y acompañado
> durante su proceso."

**Dra. Ximena — Coordinadora clínica**
Primer contacto con el paciente, análisis y diagnóstico.

> "Me apasiona guiar a nuestros pacientes hacia una odontología preventiva y
> conservadora, brindando herramientas y hábitos sostenibles para una salud
> bucal óptima a largo plazo."

### Especialidades (7)

Ortodoncia · Endodoncia · Periodoncia · Odontopediatría · Rehabilitación oral ·
Implantología · Cirugía maxilofacial

No poner solo el nombre. Cada una lleva una línea de qué resuelve, escrita en
lenguaje de paciente, no de dentista.

### Método de diagnóstico

Esta es la sección estrella y va **segunda**, antes de las especialidades.
Es lo único que ningún competidor de la zona tiene escrito.

Es una secuencia real de tres pasos, así que aquí sí está justificado numerarla.

**ANTES**
Todo comienza con una conversación: revisamos tu historial médico y escuchamos
tus síntomas antes de tocar un solo diente.

**DURANTE**
Aquí miramos a fondo: estudio 3D, radiografías y exploración clínica completa,
sin suposiciones.

**DESPUÉS**
Los resultados se explican, no se imponen. Armamos juntos un plan de tratamiento
claro, por escrito y a tu medida.

### Prueba social

4.9 de 5 estrellas, 84 reseñas en Google, la más reciente hace 2 semanas.

Los pacientes coinciden en tres cosas: son amables, explican muy bien cada
proceso (lo que calma a quien llega nervioso), y el trato es personal.

### Precios

**No tienen precios fijos.** No inventar ninguno. La sección de conversión no es
"precios", es la valoración inicial: la venta es la primera cita, no el
tratamiento.

## Copy

Para el hero, usar la voz de ellos. Dos opciones que salen de su propio método:

- "Antes de tocar un diente, escuchamos."
- "Los resultados se explican, no se imponen."

Prohibido: "expertos en salud bucal", "tu sonrisa es nuestra prioridad",
"calidad y profesionalismo" y cualquier variante. Ese es el lenguaje de todos
los competidores.

## Dirección de diseño

**Hero editorial: sin foto de fondo.** Tipografía grande, mucho aire, la
calificación de Google como dato ancla. No hay material fotográfico del espacio.

**Solo dos fotos reales en todo el sitio**, una de cada doctor. Nada de banco de
imágenes. Cero fotos de stock de dientes perfectos, pacientes sonriendo o
dentistas genéricos con los brazos cruzados. Un sitio con poca imagen y mucho
aire se ve más caro que uno lleno de stock.

**Tipografía:** un serif de display más un sans para cuerpo. Prohibido Poppins y
Montserrat: son el delator inmediato de plantilla. Opciones: Instrument Serif +
Inter, Fraunces + Inter, Newsreader + Geist.

**Espaciado:** escala cerrada (4, 8, 12, 16, 24, 32, 48, 64, 96, 128). Nada
intermedio. Secciones con 120–160px de aire vertical en escritorio. Ancho de
texto máximo ~65 caracteres. Si parece que sobra espacio, va bien.

**Color:** un solo acento, el resto neutros. Evitar el azul clínico de toda
plantilla dental. Evitar también el combo crema #F4F1EA + serif + terracota,
que es el look por defecto de páginas generadas y se reconoce de inmediato.

**Movimiento:** un solo momento orquestado como máximo. Nada de fade-and-slide
en cada sección ni hover en cada tarjeta.

**Móvil primero.** Es donde la gente busca dentista. Botón de WhatsApp fijo
abajo en móvil.

## Contacto

El CTA principal es WhatsApp, no un formulario por correo. Los consultorios
contestan WhatsApp; el correo lo revisan cada tres días.

Si hay formulario, **no manda email**: arma un mensaje de WhatsApp con los datos
y abre `wa.me`. Cero backend, cero costo, cero mantenimiento.

## Reglas duras

- **Ningún `if` con el nombre o slug de un cliente dentro de un componente.** Si
  algo debe variar, se convierte en una opción que cualquier cliente puede usar.
- Ningún componente específico de este cliente.
- Ningún dato hardcodeado en componentes. Todo sale de `clinica.ts`.
- Sin `localStorage`, sin cookies, sin analytics de terceros más allá de GA4 y
  Search Console.
- Sin dependencias nuevas sin preguntarme antes.

## Criterios de aceptación

- Cambiar `clinica.ts` cambia el sitio completo, sin tocar componentes
- Lighthouse: 95+ en Performance, Accessibility, Best Practices y SEO
- LCP por debajo de 1 segundo
- Bundle de JS menor a 5 KB
- Funciona correctamente a 390px de ancho
- Foco de teclado visible, `prefers-reduced-motion` respetado
- HTML válido (el compilador de Astro 7 ya no autocorrige)

## Datos que faltan y debo llenar yo

No inventarlos. Dejarlos como `TODO` en `clinica.ts`:

- Teléfono y número de WhatsApp
- Dirección exacta y coordenadas
- URL de la ficha de Google Maps
- Horarios de atención
- Cédulas profesionales de ambos doctores
- 3 reseñas textuales con nombre
- Formas de pago y si manejan meses sin intereses
- Paleta definitiva (la voy a sacar de su Instagram)
- Verificar la ortografía del apellido del Dr. Patiño

## Nota de alcance

Este demo corresponde al paquete de $6,900: cinco secciones más el hero.
Método, doctores, especialidades, reseñas y ubicación. **Ni una sección más**,
porque si el demo tiene nueve, o regalo trabajo o se lo quito al cliente después.
