# 0002. Pruebas visuales con Playwright

- **Fecha:** 2026-10-21
- **Estado:** Aceptada

## Contexto

Escenario «El sitio se ve como el diseño aprobado»: el diseño que aprueba el dueño no debe romperse después.

## Decisión

`expect(page).toHaveScreenshot()` de Playwright, en computadora y en celular (proyectos de Playwright con `devices`). Las imágenes base se generan en el CI (Linux), no en un Mac, y se suben al repo con el PR del boceto. Fusionar ese PR = aprobar las imágenes base. Si un PR cambia el diseño a propósito, regenera las imágenes y lo dice en el PR.

## Por qué

Viene con Playwright, que ya usa el Guardián: sin servicio externo ni costo. Se descartaron Percy y Chromatic (de pago o con límites, y con una cuenta más). Las fuentes se dibujan distinto en macOS y Linux; por eso las imágenes base salen del mismo sistema que las compara.
