# Plantilla dental

Landing page para clínicas dentales. Un cliente nuevo se resuelve editando un
solo archivo: `src/data/clinic.ts`.

Actualmente trae los datos de **AXX Dental** (Ciudad Satélite, Naucalpan), que
es el demo con el que se construyó.

```bash
pnpm create astro@latest nombre-del-cliente --template ReyPJ/agency-templates/dentist
cd nombre-del-cliente
pnpm install
pnpm dev
```

## Cómo se adapta a un cliente nuevo

Todo vive en `src/data/clinic.ts`. Los componentes reciben datos y pintan; no
hay ni una condición sobre el nombre de un cliente en ninguna parte, así que no
hay nada que buscar y reemplazar.

`src/data/types.ts` es el contrato. Lo que está marcado con `?` es opcional:
**si el dato no existe, su sección no se pinta** — no queda hueco ni placeholder.

| campo | |
|---|---|
| `brand`, `contact`, `theme`, `seo` | obligatorio |
| `hero`, `doctors`, `specialties`, `closing` | obligatorio |
| `rating`, `method`, `reviews`, `location` | opcional |

`src/data/validate.ts` corre en build time y **rompe el build** si falta el
WhatsApp o el teléfono. Es deliberado: vale más un deploy fallido que un sitio
publicado sin forma de contactar a la clínica.

### El tema

Los colores salen de `clinic.theme` y el layout los inyecta como variables CSS.
Los componentes solo nombran tokens (`bg-accent`, `text-ink`), nunca un valor,
así que cambiar la paleta de un cliente son once líneas.

| token | |
|---|---|
| `background`, `surface` | fondos |
| `ink`, `inkSoft` | texto |
| `line` | reglas |
| `accent`, `accentInk` | color de marca y su texto |
| `invertedBackground`, `invertedInk`, `invertedInkSoft` | el bloque oscuro |
| `accentLight` | solo legible sobre el bloque oscuro |

Verificá el contraste al cambiarlos: todos los pares deben pasar 4.5:1.

### Imágenes

Van en `src/assets/`, **no en `public/`**. Solo desde ahí Astro genera WebP y
`srcset`, y lee las dimensiones reales para que no haya que escribirlas a mano.
`clinic.ts` las importa y las pasa como el asset, no como una ruta.

## Comandos

| | |
|---|---|
| `pnpm dev` | servidor de desarrollo |
| `pnpm build` | verifica tipos y construye a `dist/` |
| `pnpm preview` | sirve el build — **medí Lighthouse aquí, nunca en `dev`** |
| `pnpm test` | suite de tests |
| `pnpm check` | solo verificación de tipos |

Medir rendimiento contra el servidor de desarrollo da números sin sentido: no
minifica, sirve sin optimizar y abre un websocket de recarga en caliente.

## Cómo está construido

Sin frameworks de UI, sin directivas `client:*` y **sin JavaScript en el
bundle**. La única animación —el titular del hero— es CSS, y está envuelta en
`prefers-reduced-motion: no-preference`, de modo que reducir movimiento es el
estado base.

Los tests corren con `node:test`, sin framework. `test/image-loader.js` enseña
a Node qué es un `.jpg`, porque esos imports solo los resuelve el bundler.

El diseño y las decisiones están documentados en [`docs/`](docs/).

## Rendimiento

Lighthouse sobre el build de producción: **99 / 100 / 100 / 100**, CLS 0,
0 KB de JavaScript.
