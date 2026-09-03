# Plantilla dental — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir una plantilla de landing para clínicas dentales donde un cliente
nuevo se resuelve cambiando `src/data/clinica.ts`, con AXX Dental como demo funcional.

**Architecture:** `tipos.ts` define el contrato; `validar.ts` lo hace cumplir en build
time; `clinica.ts` trae los datos del cliente actual. Los ocho componentes reciben solo
lo que pintan y no conocen a ningún cliente. El tema viaja como variables CSS de nombre
semántico y Tailwind v4 mapea sus utilidades a esas variables.

**Tech Stack:** Astro 7.2.9 · Tailwind CSS v4 (`@tailwindcss/vite`) · pnpm · Node ≥22.12
(local 26.7.0) · `node:test` con TypeScript nativo, sin dependencia de testing · Vercel.

**Spec:** `docs/superpowers/specs/2026-09-02-plantilla-dental-design.md`

## Modelo de negocio (define el alcance)

Este repo es la **máquina de demos**: se cambia `clinica.ts`, se deploya y se manda al
prospecto por WhatsApp antes de contactarlo. Si el cliente compra, se clona como
*template repository* y **en el clon** se agregan animaciones, fotos y extras.

Por eso la Fase 2 de estilos debe quedar terminada y vendible aquí — es lo que ve el
prospecto — mientras que todo lo que sea mejora específica de cliente queda fuera.

## Global Constraints

Aplican a **todas** las tareas. Valores copiados del spec.

- Astro 7.2.9, Node ≥22.12, pnpm. Salida estática, deploy en Vercel.
- **Única dependencia nueva permitida: `@tailwindcss/vite`.** Cualquier otra requiere
  preguntar antes. Testing con `node:test`, que es del runtime, no una dependencia.
- Sin React/Vue/Svelte. **Cero directivas `client:*`.**
- Sin librerías de animación ni de iconos. SVG inline.
- **Presupuesto de JavaScript: 0 KB.** `dist/` no debe contener ningún `.js`.
- Sin `localStorage`, sin cookies, sin analytics de terceros, sin iframes.
- **Ningún `if` con el nombre o slug de un cliente dentro de un componente.**
- **Ningún dato hardcodeado en componentes.** Todo sale de `clinica.ts`.
- **Nomenclatura: el código en inglés, el contenido en español.** Archivos, tipos,
  campos, funciones, tokens CSS y clases de Tailwind en inglés; todo string que el
  visitante lea, en español. Los bloques de código de las tareas de abajo se
  escribieron con los nombres viejos en español — **manda la tabla de §2.1 del spec**,
  no el bloque. `borde` se traduce `line`, no `border`.
- Nombres de token semánticos: `bg-background`, `text-ink`, `bg-accent`. Nunca
  `bg-teal-600` ni hex directos en componentes.
- Escala de espaciado cerrada: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Nada intermedio.
- Ancho de texto máximo 65ch. Aire de sección: 96px móvil, 160px desktop.
- Copy prohibido: "expertos en salud bucal", "tu sonrisa es nuestra prioridad",
  "calidad y profesionalismo" y variantes. **Ningún precio, en ninguna parte.**
- Las nueve reglas anti-genérico de §6 del spec: sin sombras, dos radios (bloques `0`,
  acciones pill), sin iconos decorativos, nada de tres tarjetas iguales, sin hover en
  tarjetas, retícula asimétrica, microtipografía, sin gradientes, sin stock.
- HTML válido: Astro 7 ya no autocorrige etiquetas sin cerrar.
- `prefers-reduced-motion` respetado; foco de teclado visible.

---

# FASE 1 — Estructura sin estilos

Al terminar la Fase 1, **parar**. Reyner lee el código completo antes de la Fase 2.

---

### Task 1: Contrato de datos y validación

**Files:**
- Create: `src/data/tipos.ts`
- Create: `src/data/validar.ts`
- Create: `test/validar.test.ts`
- Modify: `package.json` (nombre y script `test`)

**Interfaces:**
- Produces: `Clinica`, `Tema`, `Marca`, `Contacto`, `Hero`, `Calificacion`, `Metodo`,
  `PasoMetodo`, `Doctor`, `Especialidad`, `Resena`, `Resenas`, `Horario`, `Ubicacion`,
  `Imagen` (tipos); `validarClinica(c: Clinica): Clinica`;
  `urlWhatsapp(c: Clinica): string`; `class ClinicaInvalida extends Error`.

- [ ] **Step 1: Escribir el test que falla**

Crear `test/validar.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { validarClinica, urlWhatsapp, ClinicaInvalida } from "../src/data/validar.ts";
import type { Clinica } from "../src/data/tipos.ts";

function base(): Clinica {
  return {
    marca: { nombre: "Clínica Ejemplo", tipo: "Clínica dental" },
    contacto: {
      whatsapp: "5215512345678",
      mensajeWhatsapp: "Hola, quiero agendar una valoración.",
      telefono: "+525512345678",
      telefonoVisible: "55 1234 5678",
    },
    tema: {
      fondo: "#FFF", superficie: "#EEE", tinta: "#000", tintaSuave: "#555",
      borde: "#DDD", acento: "#0A0", acentoTinta: "#FFF",
      inversoFondo: "#001", inversoTinta: "#EEF", inversoTintaSuave: "#88A",
      acentoClaro: "#AFA",
    },
    seo: { titulo: "t", descripcion: "d", url: "https://ejemplo.mx" },
    hero: { titular: ["Una línea"], bajada: "b", cta: "Agendar" },
    doctores: [{ nombre: "Dra. N", rol: "r", funcion: "f", cita: "c" }],
    especialidades: [{ nombre: "Ortodoncia", resuelve: "r" }],
  };
}

test("acepta una clínica completa", () => {
  assert.doesNotThrow(() => validarClinica(base()));
});

test("rechaza whatsapp vacío", () => {
  const c = base(); c.contacto.whatsapp = "";
  assert.throws(() => validarClinica(c), ClinicaInvalida);
});

test("rechaza whatsapp con + o espacios", () => {
  const c = base(); c.contacto.whatsapp = "+52 155 1234 5678";
  assert.throws(() => validarClinica(c), /whatsapp/);
});

test("rechaza teléfono vacío", () => {
  const c = base(); c.contacto.telefono = "";
  assert.throws(() => validarClinica(c), /telefono/);
});

test("rechaza cero doctores", () => {
  const c = base(); c.doctores = [];
  assert.throws(() => validarClinica(c), /doctores/);
});

test("rechaza cero especialidades", () => {
  const c = base(); c.especialidades = [];
  assert.throws(() => validarClinica(c), /especialidades/);
});

test("rechaza hero sin líneas de titular", () => {
  const c = base(); c.hero.titular = [];
  assert.throws(() => validarClinica(c), /titular/);
});

test("las secciones opcionales pueden faltar sin error", () => {
  const c = base();
  assert.equal(c.metodo, undefined);
  assert.equal(c.resenas, undefined);
  assert.equal(c.ubicacion, undefined);
  assert.equal(c.calificacion, undefined);
  assert.doesNotThrow(() => validarClinica(c));
});

test("el mensaje de error nombra el campo exacto", () => {
  const c = base(); c.contacto.whatsapp = "";
  assert.throws(() => validarClinica(c), /clinica\.contacto\.whatsapp/);
});

test("urlWhatsapp arma el wa.me con el mensaje codificado", () => {
  assert.equal(
    urlWhatsapp(base()),
    "https://wa.me/5215512345678?text=Hola%2C%20quiero%20agendar%20una%20valoraci%C3%B3n.",
  );
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

```bash
node --test "test/**/*.test.ts"
```

Esperado: FAIL — `Cannot find module '../src/data/validar.ts'`.

- [ ] **Step 3: Escribir `src/data/tipos.ts`**

Copiar íntegro el bloque de interfaces de §3 del spec. Reglas del contrato:
`marca`, `contacto`, `tema`, `seo`, `hero`, `doctores`, `especialidades` y `titulos`
son obligatorios; `calificacion`, `metodo`, `resenas` y `ubicacion` llevan `?`.

Añadir al contrato un campo que el spec no traía. `metodo`, `resenas` y `ubicacion`
cargan su propio `titulo`, pero `doctores` y `especialidades` son arrays pelados, así
que sus encabezados terminarían escritos a mano en `index.astro` — un dato del cliente
fuera de `clinica.ts`, que es justo lo que rompe la reutilización:

```ts
titulos: { doctores: string; especialidades: string };
```
`doctores` y `especialidades` son arrays de largo variable — ningún componente
puede asumir 2 doctores ni 7 especialidades.

- [ ] **Step 4: Escribir `src/data/validar.ts`**

```ts
import type { Clinica } from "./tipos.ts";

export class ClinicaInvalida extends Error {
  constructor(campo: string, motivo: string) {
    super(`clinica.${campo}: ${motivo}`);
    this.name = "ClinicaInvalida";
  }
}

const DIGITOS = /^\d{10,15}$/;

/** Corre en build time. Un throw aquí revienta el build a propósito:
 *  vale más un deploy fallido que un demo publicado sin vía de contacto. */
export function validarClinica(c: Clinica): Clinica {
  if (!c.marca?.nombre?.trim())
    throw new ClinicaInvalida("marca.nombre", "no puede estar vacío");
  if (!DIGITOS.test(c.contacto?.whatsapp ?? ""))
    throw new ClinicaInvalida(
      "contacto.whatsapp",
      "deben ser 10 a 15 dígitos con lada país, sin + ni espacios (ej. 5215512345678)",
    );
  if (!c.contacto?.mensajeWhatsapp?.trim())
    throw new ClinicaInvalida("contacto.mensajeWhatsapp", "no puede estar vacío");
  if (!DIGITOS.test((c.contacto?.telefono ?? "").replace(/^\+/, "")))
    throw new ClinicaInvalida(
      "contacto.telefono",
      "deben ser 10 a 15 dígitos, opcionalmente con + al inicio",
    );
  if (!c.contacto?.telefonoVisible?.trim())
    throw new ClinicaInvalida("contacto.telefonoVisible", "no puede estar vacío");
  if (!c.hero?.titular?.length)
    throw new ClinicaInvalida("hero.titular", "debe tener al menos una línea");
  if (!c.doctores?.length)
    throw new ClinicaInvalida("doctores", "debe haber al menos un doctor");
  if (!c.especialidades?.length)
    throw new ClinicaInvalida("especialidades", "debe haber al menos una especialidad");
  return c;
}

/** Única fuente del enlace de WhatsApp. Nav y BotonWhatsApp la usan; ninguno
 *  arma la URL por su cuenta. */
export function urlWhatsapp(c: Clinica): string {
  return `https://wa.me/${c.contacto.whatsapp}?text=${encodeURIComponent(c.contacto.mensajeWhatsapp)}`;
}
```

- [ ] **Step 5: Añadir el script de test y renombrar el paquete**

En `package.json`: cambiar `"name": "vet-template"` por `"name": "dentist-template"`
y añadir a `scripts`:

```json
"test": "node --test \"test/**/*.test.ts\""
```

- [ ] **Step 6: Correr el test y verificar que pasa**

```bash
pnpm test
```

Esperado: `pass 10`, `fail 0`.

- [ ] **Step 7: Commit**

```bash
git add src/data/tipos.ts src/data/validar.ts test/validar.test.ts package.json
git commit -m "feat: contrato de datos de clínica con validación en build time"
```

---

### Task 2: Datos de AXX Dental

**Files:**
- Create: `src/data/clinica.ts`
- Create: `test/clinica.test.ts`

**Interfaces:**
- Consumes: `Clinica`, `Tema` de `src/data/tipos.ts`; `validarClinica` de `src/data/validar.ts`.
- Produces: `export const clinica: Clinica` (export nombrado, no default).

**Nota bloqueante:** `contacto.whatsapp` y `contacto.telefono` van vacíos a propósito
hasta que Reyner los entregue. **El build va a fallar con un mensaje claro, y eso es el
comportamiento correcto.** No inventar números ni poner placeholders plausibles.

- [ ] **Step 1: Escribir el test que falla**

Crear `test/clinica.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { clinica } from "../src/data/clinica.ts";

test("AXX tiene las 7 especialidades de doc.txt", () => {
  assert.equal(clinica.especialidades.length, 7);
  assert.deepEqual(
    clinica.especialidades.map((e) => e.nombre),
    ["Ortodoncia", "Endodoncia", "Periodoncia", "Odontopediatría",
     "Estética Dental", "Cirugía Oral", "Implantología"],
  );
});

test("cada especialidad explica qué resuelve", () => {
  for (const e of clinica.especialidades) {
    assert.ok(e.resuelve.length > 20, `${e.nombre} sin descripción`);
  }
});

test("los dos doctores traen cita y nota personal", () => {
  assert.equal(clinica.doctores.length, 2);
  for (const d of clinica.doctores) {
    assert.ok(d.cita.length > 40, `${d.nombre} sin cita`);
    assert.ok(d.notaPersonal, `${d.nombre} sin nota personal`);
  }
});

test("el método tiene los tres pasos en orden", () => {
  assert.deepEqual(
    clinica.metodo?.pasos.map((p) => p.rotulo),
    ["ANTES", "DURANTE", "DESPUÉS"],
  );
});

test("la calificación de Google es 4.9 con 84 reseñas", () => {
  assert.equal(clinica.calificacion?.puntaje, 4.9);
  assert.equal(clinica.calificacion?.total, 84);
});

test("el titular del hero viene partido en líneas para el escalonado", () => {
  assert.ok(clinica.hero.titular.length >= 2);
  assert.match(clinica.hero.titular.join(" "), /Antes de tocar un diente, escuchamos\./);
});

test("no aparece copy prohibido en ninguna parte", () => {
  const todo = JSON.stringify(clinica).toLowerCase();
  for (const frase of [
    "expertos en salud bucal",
    "tu sonrisa es nuestra prioridad",
    "calidad y profesionalismo",
  ]) {
    assert.ok(!todo.includes(frase), `copy prohibido: ${frase}`);
  }
});

test("no se menciona ningún precio", () => {
  assert.ok(!/\$\s?\d/.test(JSON.stringify(clinica)), "hay algo que parece un precio");
});
```

- [ ] **Step 2: Correr y verificar que falla**

```bash
node --test test/clinica.test.ts
```

Esperado: FAIL — `Cannot find module '../src/data/clinica.ts'`.

- [ ] **Step 3: Escribir `src/data/clinica.ts`**

Contenido obligatorio, sin inventar nada fuera de esto:

- `marca`: nombre `"AXX Dental"`, tipo `"Clínica dental de especialidades"`,
  tagline `"Salud. Función. Estética."`, logo `/axxlogo.jpg` (960×960).
- `tema`: los once tokens con los valores exactos de la tabla de §4 del spec.
- `contacto`: `whatsapp: ""` y `telefono: ""` con el comentario
  `// PENDIENTE — el build falla a propósito hasta que llegue el dato real`.
  `mensajeWhatsapp: "Hola, vi su sitio y quiero agendar una valoración."`,
  `telefonoVisible: ""`.
- `hero.titular`: `["Antes de tocar", "un diente,", "escuchamos."]` — una entrada por
  línea, porque el escalonado del hero anima por línea.
  `hero.bajada`: `"Clínica dental de especialidades en Ciudad Satélite, Naucalpan."`
  `hero.cta`: `"Agendar valoración"`.
- `calificacion`: 4.9, 84, `"Google"`, `actualizadoHace: "hace 2 semanas"`.
- `metodo`: título `"Cómo diagnosticamos"`, tres pasos con los rótulos ANTES /
  DURANTE / DESPUÉS y los textos literales del brief (líneas 128-138).
- `doctores`: los dos, con nombre, rol, función, cita literal y `notaPersonal`
  tomada del fun fact **sin el rótulo "Fun fact"**. `Dr. Alexander Patiño` con ñ.
  Sin `foto` ni `cedula` todavía — son opcionales.
- `especialidades`: las 7 con el copy de §9 del spec, en ese orden exacto.
- `titulos`: `{ doctores: "Quién te va a atender", especialidades: "Especialidades" }`.
- `resenas`: título, y `consensos` con los tres patrones (amabilidad, explicación
  clara que calma al nervioso, trato personal). Sin `textuales` todavía.
- `ubicacion`: solo `titulo` y `zona: "Ciudad Satélite, Naucalpan"`. Sin dirección,
  horarios, urlMapa ni formas de pago — llegan después.
- `seo`: título, descripción y url.

Cerrar el archivo exportando ya validado:

```ts
import { validarClinica } from "./validar.ts";
export const clinica: Clinica = validarClinica(datos);
```

**Nota para el ejecutor:** con `whatsapp` vacío, `pnpm test` va a fallar en
`test/clinica.test.ts` al importar el módulo. Es lo esperado. Para avanzar sin el
dato real, exportar `datos` sin validar temporalmente **solo si Reyner lo autoriza**;
por defecto, pedirle el número.

- [ ] **Step 4: Correr y verificar que pasa**

```bash
pnpm test
```

Esperado: todos los tests de `validar.test.ts` pasan. Los de `clinica.test.ts` pasan
en cuanto el WhatsApp y el teléfono estén puestos.

- [ ] **Step 5: Commit**

```bash
git add src/data/clinica.ts test/clinica.test.ts
git commit -m "feat: datos de AXX Dental"
```

---

### Task 3: Base.astro — layout, tema y SEO

**Files:**
- Create: `src/layouts/Base.astro`
- Delete: `src/layouts/Layout.astro`, `src/components/Welcome.astro`,
  `src/assets/astro.svg`, `src/assets/background.svg`

**Interfaces:**
- Consumes: `Clinica` de `src/data/tipos.ts`.
- Produces: layout con `Props { clinica: Clinica }` y un `<slot />`.

- [ ] **Step 1: Escribir `src/layouts/Base.astro`**

Requisitos:

1. `<html lang="es">`, `<meta charset="utf-8">`, viewport, `<title>` y
   `<meta name="description">` desde `clinica.seo`.
2. Open Graph: `og:title`, `og:description`, `og:url`, `og:type=website`,
   `og:locale=es_MX`.
3. Inyectar el tema con `define:vars`, usando **claves en kebab-case con prefijo
   `tema-`**: `--tema-fondo`, `--tema-tinta-suave`, etc. El prefijo es obligatorio —
   en la Task 10 el `@theme` de Tailwind define `--color-fondo: var(--tema-fondo)`,
   y si ambos se llamaran igual la variable se referenciaría a sí misma.
4. JSON-LD `Dentist` construido desde `clinica`: `name`, `description`, `url`,
   `telephone`, y `aggregateRating` **solo si `clinica.calificacion` existe**,
   `address` solo si `clinica.ubicacion?.direccion` existe. Serializar con
   `set:html={JSON.stringify(jsonLd)}` dentro de
   `<script type="application/ld+json">` — es dato, no JS ejecutable, y no cuenta
   contra el presupuesto.
5. Favicon desde el logo del cliente, no el de Astro: `<link rel="icon" href={...}>`
   apuntando a `clinica.marca.logo.src` si existe. **Mandar un demo con el favicon de
   Astro delata que es una plantilla en la primera pestaña que abre el prospecto.**
6. Sin ninguna clase de Tailwind todavía.

- [ ] **Step 2: Borrar el scaffold de Astro**

```bash
rm src/layouts/Layout.astro src/components/Welcome.astro \
   src/assets/astro.svg src/assets/background.svg \
   public/favicon.svg public/favicon.ico
```

- [ ] **Step 3: Verificar que las variables del tema aterrizan en el HTML**

Este paso existe porque `define:vars` puede scopearse de formas distintas según dónde
se ponga. Después de que la Task 8 componga `index.astro`, correr:

```bash
pnpm build && grep -c -- "--tema-fondo" dist/index.html
```

Esperado: al menos 1. Si sale 0, el fallback es construir el string a mano y ponerlo
como atributo `style` en `<html>`:

```astro
const estiloTema = Object.entries(clinica.tema)
  .map(([k, v]) => `--tema-${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}:${v}`)
  .join(";");
```

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Base.astro && git rm -r --cached src/assets 2>/dev/null; git add -A
git commit -m "feat: layout base con inyección de tema y JSON-LD"
```

---

### Task 4: Nav y BotonWhatsApp

**Files:**
- Create: `src/components/Nav.astro`
- Create: `src/components/BotonWhatsApp.astro`

**Interfaces:**
- Consumes: `Marca`, `Contacto`, `Clinica` de `tipos.ts`; `urlWhatsapp` de `validar.ts`.
- Produces: `Nav` con `Props { clinica: Clinica }`; `BotonWhatsApp` con
  `Props { clinica: Clinica }`.

- [ ] **Step 1: Escribir `Nav.astro`**

`<header>` con `<nav aria-label="Principal">`. Dentro: el wordmark
`clinica.marca.nombre` como texto (nunca el JPEG), el `telefonoVisible` en un
`<a href="tel:...">` usando `contacto.telefono`, y un enlace a `urlWhatsapp(clinica)`
con `rel="noopener"` y `target="_blank"`. **Sin menú de navegación y sin hamburguesa.**
El SVG de WhatsApp va inline con `aria-hidden="true"` y el enlace lleva texto
accesible.

- [ ] **Step 2: Escribir `BotonWhatsApp.astro`**

Un solo `<a>` a `urlWhatsapp(clinica)` con `rel="noopener"`, `target="_blank"` y
texto visible. Sin `position: fixed` todavía — eso llega en la Fase 2.

- [ ] **Step 3: Verificar que el enlace se arma bien**

```bash
pnpm build && grep -o 'https://wa.me/[^"]*' dist/index.html | head -2
```

Esperado: la URL con el mensaje codificado. **Cero ocurrencias de `wa.me` construido
dentro de un componente** — comprobar con `grep -rn "wa.me" src/components/` , que
debe salir vacío porque la URL sale de `urlWhatsapp()`.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.astro src/components/BotonWhatsApp.astro
git commit -m "feat: nav y botón de WhatsApp"
```

---

### Task 5: Hero y Metodo

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/Metodo.astro`

**Interfaces:**
- Consumes: `Hero`, `Calificacion`, `Marca`, `Metodo` de `tipos.ts`.
- Produces: `Hero` con `Props { hero: Hero; marca: Marca; calificacion?: Calificacion; urlCta: string }`;
  `Metodo` con `Props { metodo: Metodo }`.

- [ ] **Step 1: Escribir `Hero.astro`**

`<section>` con:
- La calificación **solo si `calificacion` existe**: SVG de estrella inline
  (`aria-hidden`), puntaje y total, más `actualizadoHace` si viene. Texto accesible
  completo, del tipo `4.9 de 5 en 84 reseñas de Google`.
- `<h1>` con **un `<span>` por cada entrada de `hero.titular`**. El escalonado de la
  Fase 2 anima esos spans, así que la estructura tiene que existir desde ahora.
- La bajada en `<p>`.
- El CTA como `<a href={urlCta}>` con `hero.cta`.
- `marca.tagline` al pie **solo si existe**.

- [ ] **Step 2: Escribir `Metodo.astro`**

`<section>` con `<h2>` desde `metodo.titulo`, `metodo.entrada` en `<p>` si existe, y
los pasos en un **`<ol>`** — es una secuencia real, la numeración está justificada.
Cada `<li>` lleva el `rotulo` y el `texto`. El número visible se genera por CSS en la
Fase 2, no se hardcodea en el marcado.

- [ ] **Step 3: Verificar el marcado**

```bash
pnpm build
grep -c "<ol" dist/index.html          # esperado: 1
grep -o "<h1>.*</h1>" dist/index.html  # debe traer 3 spans
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro src/components/Metodo.astro
git commit -m "feat: hero y sección de método"
```

---

### Task 6: Doctores y Especialidades

**Files:**
- Create: `src/components/Doctores.astro`
- Create: `src/components/Especialidades.astro`

**Interfaces:**
- Consumes: `Doctor[]`, `Especialidad[]` de `tipos.ts`.
- Produces: `Doctores` con `Props { doctores: Doctor[]; titulo: string }`;
  `Especialidades` con `Props { especialidades: Especialidad[]; titulo: string }`.

- [ ] **Step 1: Escribir `Doctores.astro`**

`<section>` con `<h2>` y una `<ul>` de doctores. Por doctor: `<h3>` con el nombre,
el rol y la función, la cita en `<blockquote>`, `notaPersonal` en `<p>` **sin rótulo**
si existe, `cedula` si existe. La foto solo si `doctor.foto` existe, con `width`,
`height`, `alt`, `loading="lazy"` y `decoding="async"`. **Si no hay foto, no se pinta
nada** — ningún placeholder gris.

Debe funcionar con 1, 2 o 4 doctores sin cambios.

- [ ] **Step 2: Escribir `Especialidades.astro`**

`<section>` con `<h2>` y un **`<dl>`**: `<dt>` con el nombre, `<dd>` con `resuelve`.
Sin tarjetas, sin iconos, sin hover. Debe funcionar con 4 o con 9 entradas.

- [ ] **Step 3: Verificar que aguantan largos variables**

```bash
pnpm test && pnpm build
grep -c "<dt" dist/index.html   # esperado: 7
grep -c "blockquote" dist/index.html  # esperado: 4 (apertura y cierre de 2 doctores)
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Doctores.astro src/components/Especialidades.astro
git commit -m "feat: secciones de doctores y especialidades"
```

---

### Task 7: Resenas y Ubicacion

**Files:**
- Create: `src/components/Resenas.astro`
- Create: `src/components/Ubicacion.astro`

**Interfaces:**
- Consumes: `Resenas`, `Calificacion`, `Ubicacion` de `tipos.ts`.
- Produces: `Resenas` con `Props { resenas: Resenas; calificacion?: Calificacion }`;
  `Ubicacion` con `Props { ubicacion: Ubicacion; contacto: Contacto; marca: Marca }`.

- [ ] **Step 1: Escribir `Resenas.astro`**

`<section>` con `<h2>`. Si `calificacion` existe, el puntaje y el total como dato
destacado. Los `consensos` en una `<ul>`. Las `textuales` en `<blockquote>` con
`<cite>` para el autor, **solo si existen**. Sin carrusel.

- [ ] **Step 2: Escribir `Ubicacion.astro`**

`<section>` con `<h2>`. `zona` siempre. `direccion` (una línea por entrada) solo si
existe. `horarios` como `<dl>` solo si existen. `formasPago` como `<ul>` solo si
existen; `mesesSinIntereses` como texto solo si es `true`. El enlace "Cómo llegar" a
`urlMapa` solo si existe. **Ningún `<iframe>`.** Al pie, `marca.logo` en `<img>` con
`width`, `height` y `alt`, solo si existe.

- [ ] **Step 3: Verificar que las ausencias no dejan huecos**

```bash
pnpm build
grep -c "iframe" dist/index.html   # esperado: 0
grep -ci "horario" dist/index.html # esperado: 0 — todavía no hay horarios
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Resenas.astro src/components/Ubicacion.astro
git commit -m "feat: secciones de reseñas y ubicación"
```

---

### Task 8: index.astro y verificación del contrato

**Files:**
- Modify: `src/pages/index.astro` (reemplazar el scaffold)
- Create: `test/opcionales.test.ts`

**Interfaces:**
- Consumes: `Base.astro` y los ocho componentes; `clinica` de `src/data/clinica.ts`;
  `urlWhatsapp` de `src/data/validar.ts`.

- [ ] **Step 1: Escribir `index.astro`**

Orden fijo: Nav → Hero → Método → Doctores → Especialidades → Reseñas → Ubicación →
BotonWhatsApp. Las opcionales, condicionadas por presencia de datos:

```astro
<Base clinica={clinica}>
  <Nav clinica={clinica} />
  <main>
    <Hero hero={clinica.hero} marca={clinica.marca}
          calificacion={clinica.calificacion} urlCta={urlWhatsapp(clinica)} />
    {clinica.metodo && <Metodo metodo={clinica.metodo} />}
    <Doctores doctores={clinica.doctores} titulo={clinica.titulos.doctores} />
    <Especialidades especialidades={clinica.especialidades}
                    titulo={clinica.titulos.especialidades} />
    {clinica.resenas && <Resenas resenas={clinica.resenas} calificacion={clinica.calificacion} />}
    {clinica.ubicacion && <Ubicacion ubicacion={clinica.ubicacion}
                                     contacto={clinica.contacto} marca={clinica.marca} />}
  </main>
  <BotonWhatsApp clinica={clinica} />
</Base>
```

Ningún título va literal aquí: todos salen de `clinica.ts`, sea del `titulo` propio de
la sección o de `clinica.titulos`. Un string de cliente en `index.astro` significa que
el cliente siguiente ya no se resuelve cambiando un solo archivo.

- [ ] **Step 2: Escribir el test de secciones opcionales**

Crear `test/opcionales.test.ts`, que verifica que borrar una sección no rompe nada:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { validarClinica } from "../src/data/validar.ts";
import { clinica } from "../src/data/clinica.ts";

test("una clínica sin método sigue siendo válida", () => {
  const { metodo, ...resto } = clinica;
  assert.doesNotThrow(() => validarClinica(resto as typeof clinica));
});

test("una clínica sin reseñas, ubicación ni calificación sigue siendo válida", () => {
  const { resenas, ubicacion, calificacion, ...resto } = clinica;
  assert.doesNotThrow(() => validarClinica(resto as typeof clinica));
});

test("una clínica con un solo doctor sigue siendo válida", () => {
  assert.doesNotThrow(() =>
    validarClinica({ ...clinica, doctores: [clinica.doctores[0]] }));
});
```

- [ ] **Step 3: Verificar el presupuesto de 0 KB de JS**

```bash
pnpm test && pnpm build
echo "archivos .js en dist: $(find dist -name '*.js' | wc -l)"   # esperado: 0
grep -rn "client:" src/ || echo "sin directivas client:"          # esperado: sin
```

- [ ] **Step 4: Verificar que borrar una sección la hace desaparecer del HTML**

Comentar `metodo` en `clinica.ts`, correr `pnpm build`, confirmar que
`grep -c "<ol" dist/index.html` da 0 y que el build no falla. **Descomentar antes de
commitear.**

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro test/opcionales.test.ts
git commit -m "feat: composición de la página y verificación de secciones opcionales"
```

---

### Task 9: Deploy en Vercel

**Files:**
- Create: `vercel.json`
- Modify: `README.md`

- [ ] **Step 1: Configurar el proyecto**

`vercel.json` con `"framework": "astro"` y las cabeceras de seguridad que suben el
score de Best Practices: `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`,
`Strict-Transport-Security: max-age=63072000`, y cache larga para `/fonts/*`.

- [ ] **Step 2: Documentar cómo se clona para un cliente nuevo**

Reescribir `README.md`: qué es la plantilla, cómo se genera un cliente (cambiar
`clinica.ts` y nada más), qué campos son obligatorios, y la nota de que el clon del
cliente que compra es donde van animaciones y fotos.

- [ ] **Step 3: Deploy y verificación**

```bash
pnpm build && npx vercel deploy --prebuilt
```

Verificar en la URL: carga, el enlace de WhatsApp abre, y no hay errores de consola.

- [ ] **Step 4: Commit**

```bash
git add vercel.json README.md
git commit -m "chore: configuración de deploy en Vercel"
```

**⛔ PARAR AQUÍ.** Fin de la Fase 1. Reyner lee el código completo antes de seguir.

---

# FASE 2 — Estilos, una sección a la vez

**Regla de la fase:** una sección terminada a la vez. Después de cada una, correr
Lighthouse y reportar el score. **No pasar a la siguiente hasta que Reyner confirme.**

Comandos de verificación que se repiten en toda la fase:

```bash
# servidor de preview
pnpm build && pnpm preview --port 4321 &

# Lighthouse móvil (el que importa: la gente busca dentista en el celular)
npx -y lighthouse http://localhost:4321 --quiet --output=json --output-path=/tmp/lh.json \
  --chrome-flags="--headless=new" \
  && node -e "const r=require('/tmp/lh.json');for(const k of ['performance','accessibility','best-practices','seo'])console.log(k, Math.round(r.categories[k].score*100));console.log('LCP', r.audits['largest-contentful-paint'].displayValue)"

# reglas anti-genérico 1 y 8, automatizables
grep -c "box-shadow" dist/_astro/*.css       # esperado: 0
grep -c "linear-gradient" dist/_astro/*.css  # esperado: 0

# presupuesto de JS
find dist -name '*.js' | wc -l                # esperado: 0
```

---

### Task 10: Tailwind v4, tokens y fuentes self-hosteadas

**Files:**
- Modify: `astro.config.mjs`, `package.json`, `src/layouts/Base.astro`
- Create: `src/styles/global.css`
- Create: `public/fonts/instrument-serif-400.woff2`,
  `public/fonts/instrument-serif-400-italic.woff2`, `public/fonts/inter-var.woff2`

**Interfaces:**
- Produces: utilidades `bg-fondo`, `bg-superficie`, `text-tinta`, `text-tinta-suave`,
  `border-borde`, `bg-acento`, `text-acento`, `text-acento-tinta`,
  `bg-inverso-fondo`, `text-inverso-tinta`, `text-inverso-tinta-suave`,
  `text-acento-claro`; familias `font-display` y `font-cuerpo`; tamaños
  `text-display`, `text-titulo`, `text-cita`, `text-cuerpo`, `text-rotulo`.

**Decisión de nombres (evita una referencia circular):** `define:vars` emite
`--tema-*` y el `@theme` de Tailwind mapea `--color-* : var(--tema-*)`. Si ambos se
llamaran `--color-fondo`, la variable se referenciaría a sí misma y no resolvería.
Ajustar `Base.astro` de la Task 3 en consecuencia, y actualizar su paso de
verificación para buscar `--tema-fondo`.

- [ ] **Step 1: Instalar Tailwind — única dependencia nueva**

```bash
pnpm add @tailwindcss/vite
```

En `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 2: Descargar las fuentes**

```bash
mkdir -p public/fonts
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"
grab() { curl -sL --max-time 30 -o "public/fonts/$2" \
  "$(curl -s --max-time 30 -A "$UA" "$1" | grep -oE 'https://[^)]*\.woff2' | tail -1)"; }
grab "https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap" instrument-serif-400.woff2
grab "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&display=swap" instrument-serif-400-italic.woff2
grab "https://fonts.googleapis.com/css2?family=Inter:wght@400..600&display=swap" inter-var.woff2
ls -la public/fonts/
```

Esperado: los tres archivos, cada uno entre 15 KB y 60 KB. Instrument Serif regular
pesa ~21 KB (verificado). Si alguno sale menor a 5 KB, la descarga falló.

- [ ] **Step 3: Escribir `src/styles/global.css`**

```css
@import "tailwindcss";

@font-face {
  font-family: "Instrument Serif"; font-style: normal; font-weight: 400;
  font-display: swap; src: url("/fonts/instrument-serif-400.woff2") format("woff2");
}
@font-face {
  font-family: "Instrument Serif"; font-style: italic; font-weight: 400;
  font-display: swap; src: url("/fonts/instrument-serif-400-italic.woff2") format("woff2");
}
@font-face {
  font-family: "Inter"; font-style: normal; font-weight: 400 600;
  font-display: swap; src: url("/fonts/inter-var.woff2") format("woff2");
}

@theme {
  /* La escala cerrada del spec cae sola: con base 4px, los pasos 1,2,3,4,6,8,12,16,24,32
     dan exactamente 4,8,12,16,24,32,48,64,96,128. Nada intermedio es alcanzable
     sin salirse de la escala a propósito. */
  --spacing: 4px;

  /* Los valores reales llegan de clinica.ts vía define:vars. Aquí solo se declara
     el nombre semántico para que Tailwind genere las utilidades. */
  --color-fondo: var(--tema-fondo);
  --color-superficie: var(--tema-superficie);
  --color-tinta: var(--tema-tinta);
  --color-tinta-suave: var(--tema-tinta-suave);
  --color-borde: var(--tema-borde);
  --color-acento: var(--tema-acento);
  --color-acento-tinta: var(--tema-acento-tinta);
  --color-acento-claro: var(--tema-acento-claro);
  --color-inverso-fondo: var(--tema-inverso-fondo);
  --color-inverso-tinta: var(--tema-inverso-tinta);
  --color-inverso-tinta-suave: var(--tema-inverso-tinta-suave);

  --font-display: "Instrument Serif", Georgia, "Times New Roman", serif;
  --font-cuerpo: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;

  /* clamp() para que el display no salte entre breakpoints */
  --text-display: clamp(2.5rem, 1.2rem + 5.6vw, 4.75rem);
  --text-display--line-height: 0.95;
  --text-titulo: clamp(1.875rem, 1.2rem + 2.6vw, 2.75rem);
  --text-titulo--line-height: 1.05;
  --text-cita: clamp(1.375rem, 1.1rem + 1.1vw, 1.75rem);
  --text-cuerpo: 1.0625rem;
  --text-cuerpo--line-height: 1.6;
  --text-rotulo: 0.75rem;
}

html { background: var(--color-fondo); color: var(--color-tinta); }
body { font-family: var(--font-cuerpo); font-size: var(--text-cuerpo); }

/* Foco visible en todo lo interactivo — criterio de aceptación, no decoración */
:where(a, button, [tabindex]):focus-visible {
  outline: 2px solid var(--color-acento);
  outline-offset: 3px;
}

/* Regla 7: la comilla de apertura cuelga fuera de la caja */
blockquote { hanging-punctuation: first; }
@supports not (hanging-punctuation: first) {
  blockquote > p:first-child { text-indent: -0.4em; }
}
```

- [ ] **Step 4: Cargar el CSS y precargar la fuente del LCP**

En `Base.astro`: `import "../styles/global.css";` en el frontmatter, y en el `<head>`:

```html
<link rel="preload" href="/fonts/instrument-serif-400.woff2" as="font" type="font/woff2" crossorigin />
```

Solo esa. Precargar las tres compite por ancho de banda y empeora el LCP.

- [ ] **Step 5: Verificar que el tema resuelve de punta a punta**

```bash
pnpm build
grep -o -- "--tema-fondo:[^;]*" dist/index.html    # esperado: el hex de clinica.ts
grep -o -- "--color-fondo:[^;}]*" dist/_astro/*.css # esperado: var(--tema-fondo)
grep -rn "#[0-9A-Fa-f]\{6\}" src/components/        # esperado: vacío — ningún hex en componentes
```

El tercer grep es el que protege la regla dura: **si un componente trae un hex, el
cliente siguiente no se resuelve cambiando un solo archivo.**

- [ ] **Step 6: Commit**

```bash
git add astro.config.mjs package.json pnpm-lock.yaml src/styles/global.css \
        src/layouts/Base.astro public/fonts/
git commit -m "feat: Tailwind v4 con tokens semánticos y fuentes self-hosteadas"
```

---

### Task 11: Estilos del Hero

**Files:** Modify `src/components/Hero.astro`

- [ ] **Step 1: Componer el hero**

- Alineado a la izquierda, **no centrado** (regla 6). En `≥1024px` la columna de texto
  ocupa ~7 de 12; en móvil, ancho completo con `px-6`.
- Aire: `py-24` en móvil (96px), `py-40` en desktop (160px).
- La píldora de calificación: `rounded-full`, borde `border-borde`, estrella en
  `text-acento`, número con `tabular-nums` (regla 7).
- `<h1>` con `font-display text-display tracking-[-0.02em]`. Cada `<span>` en
  `block` para que las tres líneas caigan una por renglón.
- Bajada en `max-w-[65ch] text-tinta-suave`.
- CTA: `bg-acento text-acento-tinta rounded-full` — pill, porque es una acción
  (regla 2). Mínimo 44px de alto.
- Tagline al pie en `text-rotulo uppercase tracking-[0.12em] text-tinta-suave`.

- [ ] **Step 2: El único movimiento del sitio**

CSS puro, dentro de `<style>` en el componente. Aditivo, nunca por defecto:

```css
@media (prefers-reduced-motion: no-preference) {
  .linea { animation: subir .7s cubic-bezier(.2,.7,.3,1) backwards; }
  .linea:nth-child(1) { animation-delay: .05s }
  .linea:nth-child(2) { animation-delay: .15s }
  .linea:nth-child(3) { animation-delay: .25s }
  @keyframes subir { from { opacity: 0; transform: translateY(0.4em) } }
}
```

`backwards` evita el parpadeo del primer frame. Envolver en `no-preference` significa
que reducir movimiento es el estado base y la animación es lo que se suma — no al revés.

**No animar el `<h1>` completo:** es el elemento del LCP y retrasarlo lo empeora. Se
animan los spans con la opacidad arrancando en 0 solo bajo `no-preference`.

- [ ] **Step 3: Verificar**

Correr el bloque de verificación de la fase. Además:

```bash
grep -c "prefers-reduced-motion" dist/_astro/*.css   # esperado: ≥1
```

Revisar a 390, 768, 1024, 1280 y 1536 que no haya scroll horizontal.

- [ ] **Step 4: Reportar el Lighthouse a Reyner y esperar confirmación**

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.astro && git commit -m "style: hero editorial con escalonado del titular"
```

---

### Task 12: Estilos del Método — el bloque oscuro

**Files:** Modify `src/components/Metodo.astro`

- [ ] **Step 1: Componer la sección**

- `bg-inverso-fondo text-inverso-tinta`, **ancho completo de pantalla**: es el único
  cambio de fondo del sitio y es lo que da el ritmo sin gastar animación.
- Rótulos `ANTES / DURANTE / DESPUÉS` en `text-rotulo uppercase tracking-[0.12em]`.
- El número `01 02 03` generado por CSS desde el `<ol>`, en `text-acento-claro` —
  **el único lugar donde el menta del logo aparece**, y ahí sí tiene contraste alto:

```css
ol { counter-reset: paso; list-style: none; }
li { counter-increment: paso; }
li::before { content: counter(paso, decimal-leading-zero); color: var(--color-acento-claro); }
```

- Línea de tiempo: horizontal en `≥1024px` (borde superior de 1px en
  `--color-inverso-tinta-suave` con marcas por paso), vertical en móvil (borde
  izquierdo que une los `<li>`). Sin sombras, sin gradientes.
- Bloques con `rounded-none` (regla 2).

- [ ] **Step 2: Verificar contraste del bloque oscuro**

Comprobar `inverso-tinta` sobre `inverso-fondo` a ≥4.5:1 y `acento-claro` sobre
`inverso-fondo` a ≥4.5:1. Lighthouse Accessibility debe seguir en 100.

- [ ] **Step 3: Reportar el Lighthouse y esperar confirmación**

- [ ] **Step 4: Commit**

```bash
git add src/components/Metodo.astro && git commit -m "style: método como bloque oscuro con línea de tiempo"
```

---

### Task 13: Estilos de Doctores

**Files:** Modify `src/components/Doctores.astro`

- [ ] **Step 1: Componer la sección**

- Una columna en móvil, dos en `≥1024px`. La grilla debe verse bien con 1, 2, 3 o 4
  doctores: usar `grid-cols-1 lg:grid-cols-2` sin alturas fijas.
- **La cita es la protagonista visual**: `font-display italic text-cita`, mayor que el
  nombre. El nombre va en `font-cuerpo` con peso 600 y tamaño de cuerpo.
- Rol y función en `text-tinta-suave text-rotulo uppercase tracking-[0.12em]`.
- `notaPersonal` al pie en `text-tinta-suave`, sin rótulo y sin icono (regla 3).
- Separación por línea de 1px `border-borde`, **nunca por sombra** (regla 1).
- **Sin hover** en la tarjeta (regla 5).
- Foto: `aspect-[4/5] object-cover rounded-none`, con `width`/`height` explícitos.
  Sin foto, la tarjeta se compone solo con tipografía y no deja hueco.

- [ ] **Step 2: Verificar con y sin foto**

Correr el build con `doctores[0].foto` presente y ausente; en ambos casos la retícula
debe quedar pareja y sin espacios muertos.

- [ ] **Step 3: Reportar el Lighthouse y esperar confirmación**

- [ ] **Step 4: Commit**

```bash
git add src/components/Doctores.astro && git commit -m "style: doctores con la cita como protagonista"
```

---

### Task 14: Estilos de Especialidades

**Files:** Modify `src/components/Especialidades.astro`

- [ ] **Step 1: Componer la sección**

- **Lista editorial, no tarjetas** (regla 4). El `<dl>` en dos columnas desde
  `≥768px`, con `border-t border-borde` en cada entrada para que las divisorias
  corran continuas.
- `<dt>` en `font-display text-titulo`, escalado a la baja: el nombre de la
  especialidad no compite con el `<h2>` de la sección.
- `<dd>` en `text-cuerpo text-tinta-suave max-w-[65ch]`.
- Sin iconos, sin números, sin hover, sin fondo por entrada.
- La retícula debe verse igual de bien con 4 entradas que con 9.

- [ ] **Step 2: Verificar largos variables**

Probar con 4, 7 y 9 especialidades en `clinica.ts`. En los tres casos la última fila no
debe quedar coja ni romper la alineación de las divisorias. **Restaurar las 7 antes de
commitear.**

- [ ] **Step 3: Reportar el Lighthouse y esperar confirmación**

- [ ] **Step 4: Commit**

```bash
git add src/components/Especialidades.astro && git commit -m "style: especialidades como lista editorial"
```

---

### Task 15: Estilos de Reseñas

**Files:** Modify `src/components/Resenas.astro`

- [ ] **Step 1: Componer la sección**

- **Única sección sobre `bg-superficie`** — el tercer nivel de tono que evita que la
  mitad baja del sitio se aplane.
- El `4.9` en `font-display text-display tabular-nums`, con `84 reseñas en Google` y la
  recencia debajo en `text-tinta-suave`.
- En `≥1024px`: el dato a la izquierda, consensos y reseñas a la derecha (regla 6, la
  retícula no está centrada). Apilado en móvil.
- Consensos como afirmaciones cortas separadas por línea de 1px. Sin viñetas gráficas.
- `<blockquote>` en `font-display italic`, con la comilla colgada (ya cubierta por el
  `hanging-punctuation` de `global.css`). `<cite>` en `text-rotulo`, no en itálica.
- **Sin carrusel.** Las reseñas se apilan.

- [ ] **Step 2: Verificar la degradación**

Con `resenas.textuales` ausente (el estado de hoy), la sección debe verse completa y
deliberada, no truncada.

- [ ] **Step 3: Reportar el Lighthouse y esperar confirmación**

- [ ] **Step 4: Commit**

```bash
git add src/components/Resenas.astro && git commit -m "style: reseñas con la calificación como dato ancla"
```

---

### Task 16: Estilos de Ubicación

**Files:** Modify `src/components/Ubicacion.astro`

- [ ] **Step 1: Componer la sección**

- Cierre del sitio. Dos columnas en `≥1024px`: dirección y horarios a la izquierda,
  datos prácticos (formas de pago, MSI) a la derecha. Apilado en móvil.
- Horarios en `<dl>` con `tabular-nums` para que las horas alineen (regla 7).
- "Cómo llegar" como pill `bg-acento text-acento-tinta`, mínimo 44px de alto, ancho
  completo en móvil.
- El logo al pie: `max-w-[96px]`, `opacity` normal, sin recuadro.
- **Ningún iframe.**
- Reservar al final del documento la altura de la barra fija de WhatsApp
  (`pb-24 md:pb-0`) para que no tape contenido.

- [ ] **Step 2: Verificar el estado degradado**

Hoy solo hay `zona`. La sección debe leerse intencional con ese único dato, y crecer
sin romperse cuando lleguen dirección, horarios y formas de pago.

- [ ] **Step 3: Reportar el Lighthouse y esperar confirmación**

- [ ] **Step 4: Commit**

```bash
git add src/components/Ubicacion.astro && git commit -m "style: ubicación como cierre del sitio"
```

---

### Task 17: Nav, botón fijo y pase final

**Files:** Modify `src/components/Nav.astro`, `src/components/BotonWhatsApp.astro`

- [ ] **Step 1: Estilos del Nav**

Wordmark en `font-cuerpo` peso 600 con `tracking-[-0.01em]`. En móvil: wordmark + el
SVG de WhatsApp. En `≥768px`: wordmark + teléfono + botón pill. No sticky.

- [ ] **Step 2: Botón fijo de WhatsApp en móvil**

```css
.barra {
  position: fixed; inset-inline: 0; bottom: 0;
  padding-bottom: env(safe-area-inset-bottom);
}
@media (min-width: 768px) { .barra { display: none } }
```

Mínimo 44px de alto. El `pb-24 md:pb-0` de la Task 16 es lo que evita que tape el
final del contenido.

- [ ] **Step 3: Auditoría de las nueve reglas anti-genérico**

```bash
pnpm build
grep -c "box-shadow" dist/_astro/*.css        # regla 1 → 0
grep -c "linear-gradient" dist/_astro/*.css   # regla 8 → 0
grep -rn "#[0-9A-Fa-f]\{6\}" src/components/  # tokens → vacío
grep -rn "bg-\(teal\|blue\|slate\|gray\)-" src/ # Tailwind crudo → vacío
find dist -name '*.js' | wc -l                # presupuesto → 0
```

Las reglas 2, 3, 4, 5, 6, 7 y 9 se revisan a ojo contra §6 del spec, sección por
sección, y se reporta cuál se sostiene y cuál no.

- [ ] **Step 4: Verificación final completa**

- Lighthouse móvil y desktop: ≥95 en las cuatro categorías, LCP < 1s
- 390, 768, 1024, 1280, 1536: sin scroll horizontal
- Recorrido completo solo con teclado, con el foco visible en todo momento
- Con `prefers-reduced-motion: reduce` activo, el hero no anima
- Borrar `metodo`, `resenas`, `calificacion` y `ubicacion` de `clinica.ts`: el sitio
  compila, se ve terminado y no deja huecos. **Restaurar después.**
- HTML válido

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.astro src/components/BotonWhatsApp.astro
git commit -m "style: nav y barra fija de WhatsApp en móvil"
```

---

## Alcance cerrado

Cinco secciones más el hero: Método, Doctores, Especialidades, Reseñas y Ubicación.
**Ni una más.** El paquete es de $6,900 y un demo de nueve secciones o regala trabajo
o se lo quita al cliente después.

Animaciones adicionales, fotos y agregados **no van en este repo**: van en el clon del
cliente que compra.

## Datos que bloquean

- **`contacto.whatsapp`** y **`contacto.telefono`** — sin ellos el build falla por
  diseño. Necesarios para cerrar la Fase 1.

Los demás llegan cuando lleguen y su sección se degrada sola: dirección, URL de la
ficha de Maps, horarios, cédulas, tres reseñas con nombre, formas de pago y MSI, fotos
de los doctores, y el apellido de la Dra. Ximena.
