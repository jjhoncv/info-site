# 0011. Subida de imágenes: validación por contenido y almacenamiento local en pruebas

- **Fecha:** 2026-10-23
- **Estado:** Aceptada

## Contexto

La ADR 0006 manda las imágenes subidas a Netlify Blobs. Fuera de Netlify (local y CI) `@netlify/blobs` no tiene sitio ni token donde guardar, y los E2E tienen que subir archivos.

## Decisión

- El servidor valida la imagen por sus **primeros bytes** (JPG, PNG, WebP) y por su peso (2 MB como máximo); el nombre y el tipo que declara el navegador no cuentan.
- Las claves las genera el servidor (`<uuid>.<ext>`) y `/media/<clave>` solo sirve ese formato, con `nosniff`.
- En Netlify se usa Blobs (store `uploads`); fuera de Netlify, una carpeta temporal del sistema. Se elige por las variables de entorno de Netlify.

## Por qué

Mirar el contenido evita que un archivo con extensión falsa llegue al sitio. La carpeta temporal mantiene los E2E sin cuentas ni servidor extra; no es un camino de producción.
