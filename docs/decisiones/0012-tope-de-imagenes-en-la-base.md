# 0012. Tope de imágenes: contador atómico en la base

- **Fecha:** 2026-10-23
- **Estado:** Aceptada

## Contexto

La demo es pública y limita las imágenes subidas a 30 desde la última restauración. Netlify corre varias funciones a la vez, así que un contador en memoria no sirve (misma razón que en ADR 0005 para los intentos de login).

## Decisión

- Tabla `upload_counter` con una sola fila. El servidor reserva cupo con `UPDATE … SET total = total + 1 WHERE total < 30` y mira `affectedRows`: sin carreras entre subidas simultáneas.
- Se valida la imagen primero (un archivo inválido no gasta cupo); si el guardado falla, el cupo se devuelve.
- «Restaurar demo» (otro ticket) pondrá el contador en 0.

## Por qué

Un solo `UPDATE` condicional es atómico en MySQL y no necesita transacciones ni bloqueos.
