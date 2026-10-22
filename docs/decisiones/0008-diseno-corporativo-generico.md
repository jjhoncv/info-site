# 0008. Sitio agnóstico: «Tu Empresa», fotos reales y azul con acento cálido

- **Fecha:** 2026-10-21
- **Estado:** Aceptada (la aprueba el dueño al fusionar el PR #22)

## Contexto

El boceto pasó por 3 propuestas (editorial, corporativo, minimal) y 4 maquetas por industria. El dueño pidió un sitio **agnóstico**: que cualquier cliente sienta que puede ser su negocio, que se vea seguro, confiable, intuitivo y profesional, y que no parezca hecho con IA. La primera versión (B · Corporativo con ilustraciones SVG) se leía como una plantilla genérica.

## Decisión

- **Marca como espacio para el cliente:** «Tu Empresa» con monograma; la franja superior dice que es una demo donde van su logo, colores y textos.
- **Servicios que calzan en cualquier negocio:** asesoría personalizada, atención en tu local, planes para empresas, capacitación, soporte y mantenimiento, garantía y postventa. Los escenarios usan estos datos («Asesoría personalizada», «Proyecto Grupo Andino»).
- **Fotos reales CC0** (StockSnap) en vez de ilustraciones; títulos en Source Serif 4 y texto en Public Sans; azul profundo con un único acento cálido para «Solicitar cotización».
- **Señales de confianza:** contacto arriba y en el pie, cifras de ejemplo, proceso en 3 pasos, WhatsApp.
- Las maquetas (`public/propuestas/`) se borraron: eran exploración, no alcance.

## Por qué

Un rubro fijo contradice «una demo, no un generador» (PROYECTO.md §3) y aleja a los clientes de otros rubros. Las fotos de personas y la tipografía con carácter son lo que más separa un sitio profesional del «look de IA» (ilustraciones planas, íconos en círculos, tarjetas iguales). Los tokens en `@theme` permiten vestirlo para cada cliente.

## Consecuencias

- Un tema configurable desde el admin (colores por cliente) sigue en el Parking lot.
- Hecho por el consultor (PR #22), a pedido del dueño, para no gastar crédito de Claude en la nube en la exploración de diseño.
