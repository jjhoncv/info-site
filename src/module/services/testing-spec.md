# Servicios — especificación de negocio

Escenarios del módulo (ver `features/fase-1-servicios-y-demo-segura.feature`):

- **Lista pública (`/services`):** cada servicio de la base se ve como tarjeta con su imagen, en el orden de `position`.
- **Detalle público (`/services/<slug>`):** título, resumen, imagen, descripción y qué incluye; `generateMetadata` usa `meta_title` / `meta_description` (si faltan, título y resumen).
- **Servicio inexistente:** 404 propio «No encontramos esta página».
- **Validación (esquema único, UI y API):** título, slug (minúsculas y guiones), resumen y descripción obligatorios; largos máximos con mensaje.
- **Pendiente (tickets siguientes):** admin, API con sesión, subida de imágenes, «Restaurar demo».
