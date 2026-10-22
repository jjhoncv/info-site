# 0009. Páginas públicas dinámicas y detalles del módulo de servicios

- **Fecha:** 2026-10-22
- **Estado:** Aceptada

## Contexto

Las páginas públicas pasan a leer de MySQL (T2). El admin (tickets siguientes) edita esos datos y el cliente espera verlos de inmediato en el sitio.

## Decisión

- Layout, `/services` y `/services/[slug]` usan `export const dynamic = "force-dynamic"`: se consulta la base en cada visita, sin caché de build ni revalidación.
- El pie lista los servicios; si la base falla, el pie se dibuja sin ellos (`console.error`) en vez de tumbar la página.
- `services.includes` es una columna JSON (lista de textos); el mapper acepta también el texto JSON por si el motor lo devuelve así.
- Las columnas son `title` (no `name`) y se agrega `image_alt` y `position`: el sitio y los escenarios hablan de «título», y la imagen necesita descripción para accesibilidad.
- La semilla de la demo es la migración `002-semilla-servicios.sql`: es el único camino que llega igual a CI, staging y producción. «Restaurar demo» (ticket posterior) la reutilizará.

## Por qué

Mostrar al instante lo que edita el cliente importa más que el costo de una consulta por visita en una demo. Una caché con invalidación se evalúa si la calidad (Lighthouse, Fase 4) lo pide.
