# 0013. Fuentes en el repo con next/font/local

- **Fecha:** 2026-10-23
- **Estado:** Aceptada

## Contexto

`next/font/google` baja las fuentes de Google en cada build. Si Google no responde, el build falla (CI del PR #61: `Can't resolve '@vercel/turbopack-next/internal/font/google/font'`). Además, Claude en la nube no tiene salida a Google Fonts y nunca podía correr el build ni el E2E antes de abrir su PR.

## Decisión

Public Sans y Source Serif 4, en su versión variable y subconjunto latin (cubre el español), viven en `app/fonts/` y se cargan con `next/font/local`. Mismos archivos que entregaba Google, así que el sitio se ve igual. Créditos en `docs/creditos.md`.

## Por qué

El build queda sin dependencias de red para las fuentes. La licencia OFL permite incluirlas en el repo.
