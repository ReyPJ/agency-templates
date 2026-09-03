# Imágenes 404 en Cloudflare (`/_image?href=...`)

Guía para corregir un sitio Astro ya desplegado cuyas imágenes no cargan.

## Síntoma

El sitio se ve bien pero ninguna imagen carga. En Network, cada `<img>` pide:

```
GET /_image?href=%2F_astro%2Ffoto.DGoNqu-p.jpg&w=480&h=600&f=webp  →  404
```

El HTML publicado apunta a `/_image` en vez de a un `.webp`. En `dist/_astro/`
del sitio publicado están los `.jpg` originales y ningún `.webp`.

## Causa

Son dos cosas encadenadas, y la segunda es la que sorprende.

### Qué hace el adaptador

`/_image` es el endpoint de imágenes **en runtime** de Astro: solo responde si
hay un servidor detrás. Un sitio estático no tiene ninguno, así que todas esas
URLs son 404.

El HTML sale así cuando el build corre a través de un adaptador. En concreto,
`@astrojs/cloudflare` trae por defecto `imageService: 'cloudflare-binding'`, que
**no transforma durante el build**: se salta el paso `generating optimized
images`, copia los originales a `_astro/` y deja el HTML apuntando al endpoint,
esperando que un Worker con el binding de Cloudflare Images lo atienda. Si el
proyecto se publica como assets estáticos, nadie lo atiende.

Sin adaptador, el mismo código produce `src="/_astro/foto.DGoNqu-p_Z1lVhc0.webp"`
y los archivos existen.

### De dónde sale el adaptador

Acá está la trampa: **puede no estar en el repo**. Si el proyecto no tiene
configuración de wrangler, `wrangler deploy` arranca su modo de
auto-configuración, y en CI —sin terminal interactiva— contesta sus propias
preguntas. Del log de un deploy real:

```
Executing user build command: pnpm build
  ✓ generating optimized images   (7 webp)
  verify-dist: 1 page(s) checked, every referenced asset is present.
Success: Build command completed

Executing user deploy command: pnpm dlx wrangler deploy
  Detected Project Settings:  Framework: Astro
  ? Do you want to modify these settings?
  🤖 Using fallback value in non-interactive context: no
  🛠️  Configuring project for Astro with "astro add cloudflare"
  ? Proceed with setup?
  🤖 Using fallback value in non-interactive context: yes
  [build] Running: pnpm run build
  [build] 18:44:05 [build] adapter: @astrojs/cloudflare
```

El build que verificaste no es el que se publica: wrangler instala el adaptador
y **reconstruye**. Por eso el repo puede estar impecable —sin adaptador en
`package.json` ni en `astro.config.mjs`— y el sitio salir roto igual.

## Diagnóstico

```bash
# 1. ¿El sitio publicado está afectado?
curl -s https://EL-SITIO/ | grep -o '/_image[^"]*' | head
#    Si imprime algo, está afectado.

# 2. ¿El repo tiene el adaptador?
grep -rn "adapter\|cloudflare" astro.config.mjs
grep -n "@astrojs/cloudflare" package.json
#    Si no aparece nada, no descartes la causa: seguí con el punto 3.

# 3. ¿Lo agrega el deploy?
#    En el log del deploy de Cloudflare, buscar "astro add cloudflare".
#    Si aparece, el adaptador lo inyecta wrangler, no el repo.

# 4. Confirmación local
pnpm build && grep -c '/_image' dist/index.html dist/client/index.html 2>/dev/null
#    Un build sano no tiene ninguna coincidencia, imprime el paso
#    "generating optimized images" y deja .webp en dist/_astro/.
```

## Corrección

**Si el sitio es estático** (landings de plantilla: sin API routes, sin
formularios server-side, sin `prerender = false`) — quitar el adaptador si está
en el repo:

```bash
pnpm remove @astrojs/cloudflare
```

Y dejar `astro.config.mjs` sin `adapter`:

```js
export default defineConfig({
  vite: { plugins: [tailwindcss()] },
});
```

Eso no basta. Hay que darle a wrangler una configuración explícita para que no
vuelva a añadirlo en el deploy — `wrangler.jsonc` en la raíz del proyecto:

```jsonc
{
  "name": "nombre-del-worker-del-cliente",
  "compatibility_date": "2026-09-03",
  "assets": { "directory": "./dist" }
}
```

Sin `main`: es un Worker que solo sirve assets estáticos. Con este archivo
presente, `wrangler deploy` publica `dist/` tal cual y no ejecuta ningún
`astro add`.

En Cloudflare: comando de build `pnpm build`, directorio de salida `dist`.

**Si el adaptador hace falta de verdad** (hay SSR) — forzar que las imágenes se
generen durante el build:

```js
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  adapter: cloudflare({ imageService: 'compile' }),
  vite: { plugins: [tailwindcss()] },
});
```

`'compile'` transforma en build y sirve archivos estáticos; el default
`'cloudflare-binding'` transforma en runtime y requiere el binding de Cloudflare
Images configurado en el Worker.

## Que no vuelva a pasar

`scripts/verify-dist.mjs` (copiarlo de la plantilla) recorre el HTML del build y
falla si encuentra `/_image` o cualquier referencia a un archivo que no está en
`dist/`. Se engancha al final del build:

```json
"build": "astro check && astro build && node scripts/verify-dist.mjs"
```

Es lo que convierte este problema en visible: como wrangler reconstruye con el
mismo comando, el guard corre también en su reconstrucción y **el deploy falla**
en vez de publicar un sitio sin imágenes. El sitio se ve bien salvo las
imágenes; vale más un deploy fallido.

## Verificación

1. `pnpm build` termina en `verify-dist: N page(s) checked, every referenced asset is present.`
2. `ls dist/_astro/*.webp` lista archivos.
3. En el log del deploy, que no aparezca `astro add cloudflare` ni
   `adapter: @astrojs/cloudflare`.
4. Tras desplegar: `curl -s https://EL-SITIO/ | grep -c '/_image'` imprime `0`.
5. Que un `.webp` responda 200:
   `curl -s -o /dev/null -w '%{http_code}\n' https://EL-SITIO/_astro/UNO.webp`
