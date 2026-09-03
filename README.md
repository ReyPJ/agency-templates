# agency-templates

Plantillas de landing page por rubro. Cada carpeta es un proyecto de Astro
completo e independiente: se descarga sola, se le cambia un archivo de datos y
queda un sitio de cliente.

| plantilla | rubro | estado |
|---|---|---|
| [`dentist/`](dentist/) | Clínicas dentales | En uso |

## Crear un sitio de cliente

```bash
pnpm create astro@latest nombre-del-cliente --template ReyPJ/agency-templates/dentist
```

Descarga solo esa carpeta, sin historial ni el resto del repo. Después se edita
un único archivo —`src/data/clinic.ts`— y el sitio entero cambia con él.

## Cómo está pensado

Los componentes no saben de qué cliente hablan: reciben datos y pintan. Todo lo
que varía entre un cliente y otro vive en `src/data/clinic.ts`, y el contrato
que ese archivo debe cumplir está en `src/data/types.ts`.

Cada plantilla trae sus propios tests, su verificación de tipos y su
documentación de diseño en `docs/`.
