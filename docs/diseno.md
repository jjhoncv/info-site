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
| `acento-600` / `acento-700` | `#b4571f` / `#a85420` | **Solo** la acción principal y detalles (números del proceso, viñetas) |
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

## Admin (aprobado por el dueño el 2026-10-22)

**Referencia visual: `docs/maquetas/admin.html`** (ábrela en el navegador: es navegable, con datos de ejemplo). Todo el admin se construye igual a esa maqueta.

- **Es otra «aplicación», no una página del sitio:** el admin **no** usa el encabezado, el pie ni la franja de demostración del sitio. En Next, el sitio va en un grupo de rutas con su layout (p. ej. `app/(sitio)/layout.tsx` con Header/Footer) y el admin en otro (`app/admin/…` con su propio layout). El layout raíz solo pone fuentes y estilos.
- **Login (`/admin/login` o `/login`):** pantalla dividida: a la izquierda un panel `marca-900` con el isotipo, «Tu Empresa · Panel de administración» y una frase; a la derecha el formulario (Usuario, Clave, «Entrar») y el aviso de bloqueo tras 5 intentos. En celular, el panel queda arriba y más bajo.
- **Panel:** barra lateral fija `marca-900` (Resumen · Contenido: Banners, Servicios, Proyectos · Configuración: Datos de la empresa, Mi perfil · abajo: Ver el sitio, Salir); en celular se abre con un botón «Menú». Contenido sobre fondo `#f4f6f9`, tarjetas blancas sin borde, títulos en serif.
- **Listas:** buscador + filtro de estado, tabla con miniatura, título y dirección, estado (Publicado / Borrador), fecha y acciones (ver, editar, eliminar con confirmación).
- **Formularios:** secciones (Información básica · Imagen · Buscadores), error en rojo bajo el campo, contadores de caracteres, zona para arrastrar la imagen, panel lateral «Publicación» e «Información», barra «Guardar cambios» fija abajo.
- **Misma marca que el sitio:** el admin y el sitio son la misma empresa. Usan los **mismos tokens** de `app/globals.css` (`@theme`: colores, radios), las **mismas fuentes** (Source Serif 4 en títulos, Public Sans en texto) y el **mismo logo** (`LogoMark` / `Logo` de `src/components/Logo.tsx`). Nada de colores, fuentes ni estilos propios del admin fuera de los tokens.
- **Mismos componentes base, misma forma de usarlos:** los botones del admin son el mismo `Button` del sitio (primario = acento cálido para la acción principal, secundario = `marca-50`), con la misma API de variantes. Lo que solo existe en el admin (tabla, campos de formulario, zona de imagen, modal, aviso) va en `src/module/shared/components/` y se construye con esos mismos tokens. Si un componente sirve a los dos, se comparte; no se duplica.
- El acento cálido solo para la acción principal de cada pantalla (Entrar, Guardar cambios, Nuevo…).
