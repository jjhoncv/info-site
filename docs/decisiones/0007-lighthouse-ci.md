# 0007. Lighthouse CI para la nota de calidad

- **Fecha:** 2026-10-21
- **Estado:** Aceptada

## Contexto

Escenario de la Fase 4: la portada, /services y /projects deben sacar 90 o más en rendimiento, accesibilidad, buenas prácticas y SEO.

## Decisión

**`@lhci/cli`** en el CI, contra el build local, con `assert` de `minScore: 0.9` en las cuatro categorías para esas tres páginas. Los pasos del escenario leen el resultado.

## Por qué

Es la herramienta oficial de Lighthouse para CI, gratis y sin servidor propio (el reporte queda como artefacto del run). PageSpeed Insights mide el sitio publicado, pero tiene cuota y no puede frenar un PR.
