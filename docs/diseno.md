# Guía de diseño

Diseño propio, inspirado en el estilo sobrio de FinExpert (azul corporativo, mucho aire, tarjetas con sombra suave); no reutiliza nada suyo. Los valores viven en `app/globals.css` → `@theme` (ADR 0001): cambiar un color es cambiar una línea. Nivel: **producto**, se ve terminado.

## Colores

| Token | Valor | Uso |
|---|---|---|
| `marca-600` / `marca-700` | `#1f4fd8` / `#1a3fb0` | Botón primario, enlaces, fondo de ilustraciones |
| `marca-900` | `#0c1f4d` | Títulos, pie |
| `marca-50` / `marca-100` | `#eef4ff` / `#dbe7ff` | Fondos suaves, bandas de título |
| `acento-500` / `acento-700` | `#14b88a` / `#0b7a5c` | Detalles y etiquetas (el 700 para texto: contraste ≥ 4.5) |
| `tinta` / `tinta-suave` | `#14213d` / `#4a5775` | Texto principal / secundario |
| `linea` | `#dfe5f1` | Bordes |

## Tipografía

Pila del sistema (`--font-sans`): sin descargas, carga inmediata. Jerarquía: `h1` 4xl→5xl extrabold · `h2` xl bold · texto lg/base en `tinta-suave` · etiquetas sm en mayúsculas con `acento-700`.

## Espaciado y forma

Contenedor `max-w-6xl`, relleno lateral `px-4` (celular) / `px-6`; secciones con `py-12`–`py-14`. Tarjetas: `rounded-tarjeta` (1rem) + `shadow-tarjeta`. Rejilla de servicios: 1 columna en celular, 2 desde `sm`, 3 desde `lg`.

## Botones

Componente `ButtonLink` (`src/components/Button.tsx`): píldora, `px-6 py-3`, semibold.
- **Primario:** fondo `marca-600`, texto blanco; hover `marca-700`.
- **Secundario:** borde `marca-600`, texto `marca-700`; hover `marca-50`.
- Foco visible en ambos (outline `marca-600`).

## Imágenes

Ilustraciones SVG propias (`ServiceIllustration`), con `role="img"` y descripción. Cuando el admin suba imágenes reales (T-siguientes), se usan en el mismo marco 16:10.

## Pruebas visuales

`toHaveScreenshot` en computadora (1280 px) y celular (390 px); las imágenes base están en `features/visual/` y se generan en el CI (ADR 0002). Si un PR cambia el diseño a propósito, regenera las imágenes y dilo en el PR.
