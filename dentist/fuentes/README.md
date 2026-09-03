# Fuentes

Originales sin procesar. **Están fuera de `public/` a propósito: no se publican.**

Las fotos de los doctores son de una posada de fin de año y traen globos "2025",
guirnaldas y ropa de fiesta. Las versiones que sí van al sitio viven en
`public/doctores/` y se generan recortando a cabeza y hombros (4:5) y pasando a
blanco y negro, que es lo que apaga el contexto de fiesta.

Para regenerarlas:

```bash
magick fuentes/alexander-original.jpg -crop 448x560+231+185 +repage \
  -colorspace Gray -sigmoidal-contrast 4,45% -resize 480x600 -quality 84 -strip \
  public/doctores/alexander.jpg

magick fuentes/ximena-original.jpg -crop 360x450+330+465 +repage \
  -colorspace Gray -sigmoidal-contrast 4,45% -resize 480x600 -quality 84 -strip \
  public/doctores/ximena.jpg
```

Si el cliente compra, estas fotos son lo primero que hay que reemplazar por unas
profesionales en el clon.
