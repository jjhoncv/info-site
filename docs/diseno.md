# Guía de diseño

Propuesta elegida: **B · Corporativo** (ADR 0008). Sobria, plana y fácil de recorrer con un cliente: cabecera y bandas de título azul noche, rejilla de líneas finas, botones de esquina suave y sin bordes. Los valores viven en `app/globals.css` → `@theme` (ADR 0001): cambiar un color es cambiar una línea, y por eso el mismo sistema se puede vestir para otro negocio. Nivel: **producto**, se ve terminado.

## Colores

| Token | Valor | Uso |
|---|---|---|
| `marca-900` | `#0e1b2c` | Cabecera, bandas de título, títulos |
| `marca-600` / `marca-700` | `#2b6cb0` / `#245a96` | Botón primario, enlaces, foco |
| `marca-100` | `#b9c5d6` | Texto secundario sobre fondo oscuro |
| `marca-50` | `#eef2f6` | Fondos suaves, pie, botón secundario |
| `acento-500` | `#6fa8e6` | Detalle del logo y etiquetas sobre fondo oscuro |
| `acento-700` | `#245a96` | Etiquetas sobre fondo claro (contraste ≥ 4.5) |
| `tinta` / `tinta-suave` | `#1a2433` / `#5a6678` | Texto principal / secundario |
| `linea` | `#e1e6ed` | Bordes de 1 px |

## Tipografía

Pila del sistema (`--font-sans`): sin descargas, carga inmediata. Jerarquía: `h1` 4xl→5xl bold, espaciado cerrado · `h2` xl bold · texto lg/base en `tinta-suave` · etiquetas sm en mayúsculas.

## Espaciado y forma

Contenedor `max-w-6xl`, relleno lateral `px-4` (celular) / `px-6`; secciones con `py-12`. Tarjetas: `rounded-tarjeta` (0.25rem) + `shadow-tarjeta` (un borde de 1 px, sin sombra difusa). Rejilla de servicios: 1 columna en celular, 2 desde `sm`, 3 desde `lg`. Cada página abre con una banda `marca-900` (título + frase).

## Botones

Componente `ButtonLink` (`src/components/Button.tsx`): esquina `rounded` (4 px), `px-6 py-3`, semibold, **sin borde**.
- **Primario:** fondo `marca-600`, texto blanco; hover `marca-700`.
- **Secundario:** fondo `marca-50`, texto `tinta`; hover `linea`.
- Foco visible en ambos (outline `marca-600`).

## Imágenes

Ilustraciones SVG propias (`ServiceIllustration`) en la paleta azul, con `role="img"` y descripción. Cuando el admin suba imágenes reales (T-siguientes), se usan en el mismo marco 16:10.

## Admin (referencia para T-siguientes)

Barra lateral oscura (`marca-900`) con el logo y el menú; contenido sobre `marca-50`; tablas con filtros arriba y paginación abajo; formularios en una tarjeta con error en rojo bajo el campo; subida de imagen con zona punteada y barra de avance. Ver `public/propuestas/b/admin-*.html`.

## Pruebas visuales

`toHaveScreenshot` en computadora (1280 px) y celular (390 px); las imágenes base están en `features/visual/` y se generan en el CI (ADR 0002). Si un PR cambia el diseño a propósito, regenera las imágenes y dilo en el PR.
