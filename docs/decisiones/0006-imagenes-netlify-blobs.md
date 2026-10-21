# 0006. Imágenes del admin en Netlify Blobs

- **Fecha:** 2026-10-21
- **Estado:** Aceptada

## Contexto

El cliente sube imágenes desde el admin. Netlify no conserva archivos escritos en `public/` y el presupuesto es USD 0.

## Decisión

Las imágenes subidas van a **Netlify Blobs** (`@netlify/blobs`) en un store `uploads` y se sirven desde una ruta propia (`/media/<clave>`). Las imágenes originales de la semilla viven en el repo (`public/demo/`). «Restaurar demo» borra todo el store `uploads`. En local y en el CI se usa el modo local de `@netlify/blobs`.

## Por qué

Viene con el sitio de Netlify, sin cuenta ni costo extra (PROYECTO.md → Decisiones). Tener las originales en el repo hace que restaurar nunca dependa de un archivo que alguien pudo borrar.
