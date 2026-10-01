# Fotos de stock

Banco común para las variantes `studio` y `warm`. Todas son de Unsplash con
licencia gratuita (uso comercial permitido, sin atribución obligatoria). Están
redimensionadas a 1800 px de lado mayor: Astro genera los WebP y el `srcset`
a partir de ellas, así que no hace falta más resolución.

**Las fotos reales del cliente siempre van primero.** El stock rellena lo que
falta: detalle clínico, tecnología, sonrisas. Nunca debe pasar por el
consultorio del cliente ni por su equipo.

| archivo | uso sugerido | Unsplash |
|---|---|---|
| `alineadores.jpg` | ortodoncia, estética | `photo-1564420228450-d9a5bc8d6565` |
| `bandeja-ventana.jpg` | detalle, cierre | `photo-1495573020741-8a2f372bbec3` |
| `consulta.jpg` | primera cita, método | `photo-1777331903190-341a3dd0441b` |
| `escaneo-3d.jpg` | diagnóstico | `photo-1600170311833-c2cf5280ce49` |
| `espejo-bn.jpg` | detalle (B/N) | `photo-1606811856475-5e6fcdc6e509` |
| `espejo-dental.jpg` | detalle | `photo-1698749778813-ad5f2814e50f` |
| `instrumental.jpg` | esterilización, detalle | `photo-1643660527217-b5e025ac642e` |
| `modelo-diente.jpg` | explicación, endodoncia | `photo-1777793389944-f7165259a05c` |
| `modelo-implante.jpg` | implantes, prótesis | `photo-1593022356769-11f762e25ed9` |
| `nino-consulta.jpg` | odontopediatría | `photo-1758205308106-5760d0227cc7` |
| `revision.jpg` | revisión, trato cercano | `photo-1663755489920-5e09f66d011a` |
| `risa.jpg` | resultado, warm | `photo-1573515159471-0eb7ec72912c` |
| `sala-luz.jpg` | hero, espera | `photo-1759262151080-e05ba1c6294f` |
| `sonrisa-bn.jpg` | resultado (B/N) | `photo-1562337404-3044c84ac061` |
| `sonrisa-cabello.jpg` | resultado, hero | `photo-1489278353717-f64c6ee8a4d2` |
| `sonrisa-detalle.jpg` | blanqueamiento, estética | `photo-1654373535457-383a0a4d00f9` |
| `sonrisa-natural.jpg` | limpieza, prevención | `photo-1663182234283-28941e7612da` |
| `sonrisa-rizos.jpg` | resultado, warm | `photo-1617812191081-2a24e3f30e45` |

URL de cada una: `https://images.unsplash.com/<id>?w=2000`.

Al clonar la plantilla para un cliente, borrá las que no use: las que nadie
importa no entran al build, pero sí pesan en el repo.
