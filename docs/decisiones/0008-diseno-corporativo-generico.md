# 0008. Diseño «B · Corporativo» y sitio genérico con tema por negocio

- **Fecha:** 2026-10-21
- **Estado:** Aceptada (pendiente de aprobación del dueño al fusionar el PR #22)

## Contexto

El PR del boceto presentó 3 propuestas de diseño (A editorial, B corporativo, C minimal) y 4 maquetas por industria (restaurante, colegio, barbería, ferretería). El dueño pidió algo flexible, custom y fácil de entender cuando se lo muestre a un cliente.

## Decisión

- **Diseño B · Corporativo.** Se mantiene la paleta azul ya construida, así el cambio es de forma (bandas oscuras, rejilla plana, botones sin borde) y no de rehacer todo.
- **Sin industria fija:** la demo sigue siendo la empresa de servicios de PROYECTO.md. Los colores y el nombre viven en tokens (`@theme`), de modo que vestir el sitio para otro negocio es cambiar tokens y textos. Las maquetas por industria quedan como material de venta, no como alcance.
- **Admin:** barra lateral oscura, tabla con filtros, formulario con errores bajo el campo y subida de imagen con barra de avance (`public/propuestas/b/admin-*.html`).

## Por qué

- B es la que mejor se explica a un cliente: la barra lateral del admin muestra de un vistazo qué se puede editar, y el resumen con cifras da de qué hablar.
- Las esquinas suaves y la ausencia de bordes en botones responden al pedido «más profesional».
- Elegir una industria contradice «una demo, no un generador» (PROYECTO.md §3); un tema por tokens da la flexibilidad sin ese costo.

## Consecuencias

- Las propuestas bajo `public/propuestas/` se borran antes de fusionar, o en un PR siguiente si se quieren conservar para mostrar.
- Un tema configurable desde el admin (colores por negocio) **no** está en el alcance: si se quiere, va al Parking lot.
