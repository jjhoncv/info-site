# 0005. Login con iron-session y bcryptjs

- **Fecha:** 2026-10-21
- **Estado:** Aceptada

## Contexto

El admin necesita login con usuario y clave para **un** usuario demo compartido (usuarios y roles están en el Parking lot), con límite de intentos y sin cambio de clave.

## Decisión

**iron-session** (sesión en cookie cifrada y firmada, `httpOnly`, `secure`, `sameSite=lax`) y **bcryptjs** para comparar la clave con un hash. El usuario y el hash van en variables de Netlify marcadas como secretas (`DEMO_USER`, `DEMO_PASSWORD_HASH`, `SESSION_SECRET`), distintas por contexto. `proxy.ts` protege `/admin` y `withAdmin` protege `/api/admin/*` en el servidor.

## Por qué

- **Auth.js, descartado** (decisión del dueño): la v5 nunca salió estable y el proyecto está en mantenimiento.
- **Better Auth, descartado por ahora:** está bien mantenido, pero trae tablas, adaptadores y funciones (registro, OAuth, recuperación de clave) que esta demo no usa. Es la opción si algún día entran los usuarios por cliente del Parking lot.
- **iron-session + bcryptjs:** es lo más simple para un usuario. No reimplementa criptografía: el cifrado lo hace iron-session y el hash, bcrypt. bcryptjs es JavaScript puro, así que no necesita compilar binarios en las funciones de Netlify.
