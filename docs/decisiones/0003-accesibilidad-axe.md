# 0003. Accesibilidad con axe en las pruebas E2E

- **Fecha:** 2026-10-21
- **Estado:** Aceptada

## Contexto

Escenario «Las páginas se pueden leer y usar»: contraste, imágenes con descripción y campos con etiqueta.

## Decisión

`@axe-core/playwright` dentro de los pasos del escenario, con las reglas WCAG 2.1 AA, sobre /services y /admin/services (y las páginas que se agreguen después).

## Por qué

Revisa justo lo que pide el escenario (contraste, `alt`, `label`) y corre en el mismo Playwright. Lighthouse (ADR 0007) mide la accesibilidad en la Fase 4, pero no sirve para hacer fallar una prueba por una regla concreta.
