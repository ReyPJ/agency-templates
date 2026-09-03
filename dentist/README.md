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
| `pnpm build` | verifica tipos, construye a `dist/` y revisa que el build no salga roto |
| `pnpm preview` | sirve el build — **medí Lighthouse aquí, nunca en `dev`** |
| `pnpm test` | suite de tests |
| `pnpm check` | solo verificación de tipos |

Medir rendimiento contra el servidor de desarrollo da números sin sentido: no
minifica, sirve sin optimizar y abre un websocket de recarga en caliente.

## Despliegue

El sitio es **estático**: `pnpm build` deja en `dist/` todo lo que el navegador
va a pedir, incluidos los WebP ya generados. No hay servidor, así que no debe
haber adaptador de Astro.

Un adaptador cambia el manejo de imágenes: en vez de optimizarlas durante el
build, deja el HTML apuntando a `/_image?href=...`, una ruta que solo responde
si hay un servidor detrás. Publicado como archivos estáticos, **todas las
imágenes dan 404** — el resto del sitio se ve bien, que es lo que vuelve difícil
de notar el problema.

Y no alcanza con no instalarlo: **`wrangler deploy` lo instala solo**. Cuando no
encuentra configuración de wrangler en el proyecto arranca su
auto-configuración, detecta que es Astro y, como en CI no hay terminal
interactiva, contesta «sí» por su cuenta a `astro add cloudflare`. Después
reconstruye, y esa segunda construcción —ya con adaptador— es la que se publica.
El repo se queda limpio y el sitio sale roto.

Por eso la plantilla trae `wrangler.jsonc`: declara el deploy como un Worker de
assets estáticos sobre `dist/`, de modo que no queda nada que adivinar y se
publica exactamente lo que verificó el build. **Cambiá el `name` por el del
cliente** — es la única línea del archivo que varía.

En Cloudflare: comando de build `pnpm build`, directorio de salida `dist`.

`scripts/verify-dist.mjs` corre al final de `pnpm build` y hace fallar el build
si el HTML quedó apuntando a `/_image` o a cualquier archivo que no exista en
`dist/`. Vale más un deploy fallido que un sitio publicado sin imágenes.

`public/_headers` marca `/_astro/*` como inmutable: esos nombres llevan un hash
del contenido, así que pueden cachearse para siempre.

El procedimiento completo —diagnóstico y corrección de un sitio ya roto— está en
[`docs/imagenes-404-cloudflare.md`](docs/imagenes-404-cloudflare.md).

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
