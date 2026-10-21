# 0001. Tailwind 4 para los estilos

- **Fecha:** 2026-10-21
- **Estado:** Aceptada

## Contexto

El alcance pide Tailwind y un diseño propio con guía aprobada por el dueño (Fase 1).

## Decisión

Tailwind 4, con los tokens de diseño (colores, tipografía, espaciado) en `@theme` dentro del CSS global y la guía en `docs/diseno.md`. Nada de estilos sueltos fuera de Tailwind (convenciones §4).

## Por qué

Es la versión actual y la que usan las convenciones del dueño (§7c). Los tokens en `@theme` dejan la guía en un solo lugar: cambiar un color es cambiar una línea.
