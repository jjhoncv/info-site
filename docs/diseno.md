# Guía de diseño

**Sitio agnóstico y profesional** (ADR 0008): sirve para cualquier negocio de servicios. La marca es un espacio para el cliente («Tu Empresa», con monograma), las fotos son de personas y lugares de trabajo reales, y los textos y cifras se leen como los de un negocio real. Los valores viven en `app/globals.css` → `@theme` (ADR 0001): vestir el sitio para otro cliente es cambiar tokens, logo, fotos y textos. Nivel: **producto**, se ve terminado.

## Principios

- **Confianza primero:** contacto visible arriba (horario y teléfono) y abajo (pie completo), cifras concretas, proceso en 3 pasos.
- **Una sola acción principal:** «Solicitar cotización», siempre en el acento cálido. El resto de botones es secundario.
- **Nada que delate una plantilla de IA:** fotos reales en vez de ilustraciones, títulos con serif, mucho espacio en blanco, sin tarjetas con ícono en círculo, sin degradados.
- **Honesto:** la franja superior y el pie dicen que es un sitio de demostración con datos de ejemplo.

## Colores

| Token | Valor | Uso |
|---|---|---|
| `marca-900` | `#0e2a47` | Títulos, franja superior, pie, banda final |
| `marca-700` / `marca-600` | `#1f4a75` / `#2a5a8c` | Enlaces y hover |
| `marca-50` / `marca-100` | `#eef3f8` / `#d5e1ee` | Fondos suaves, botón secundario, texto sobre oscuro |
| `acento-600` / `acento-700` | `#c4652a` / `#a85420` | **Solo** la acción principal y detalles (números del proceso, viñetas) |
| `fondo-calido` | `#f6f4f0` | Portada y tarjeta de contacto del detalle |
| `tinta` / `tinta-suave` | `#16202c` / `#4f5b69` | Texto principal / secundario |
| `linea` | `#e3e7ec` | Separadores |

## Tipografía

- **Títulos:** Source Serif 4 (600/700), con `text-wrap: balance`. Transmite trayectoria y seriedad.
- **Texto:** Public Sans (400–700), muy legible en celular.
- Escala: `h1` 4xl→5xl · `h2` 3xl · `h3` lg · texto base/lg con `leading-relaxed` · etiquetas xs/sm en mayúsculas con `tracking-widest`.

## Espaciado y forma

Contenedor `max-w-6xl`, relleno lateral `px-4` / `px-6`, secciones `py-14`–`py-20`. Esquinas `rounded-tarjeta` (6 px). Sin bordes ni sombras en las tarjetas: la foto y el espacio en blanco separan. Rejilla de servicios: 1 / 2 / 3 columnas.

## Botones (`src/components/Button.tsx`)

Sin borde, esquina 6 px, `px-5 py-3`, semibold, foco visible con el acento.
- **Primario:** fondo `acento-600`, texto blanco (cotizar).
- **Secundario:** fondo `marca-50`, texto `marca-900` (WhatsApp, volver).
- **Claro:** blanco translúcido sobre fondos oscuros.

## Imágenes

Fotos CC0 de StockSnap en `public/demo/` (créditos en `docs/creditos.md`), servidas con `next/image`, siempre con texto alternativo. Proporción 3:2 en tarjetas y detalle, 4:3 en la portada. Cuando el admin suba imágenes (T8), se usan en los mismos marcos.

## Pruebas visuales

`toHaveScreenshot` en computadora (1280 px) y celular (390 px); las imágenes base están en `features/visual/` y se generan en el CI (ADR 0002). Si un PR cambia el diseño a propósito, se regeneran y se dice en el PR.
