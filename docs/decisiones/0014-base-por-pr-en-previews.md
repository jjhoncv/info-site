# 0014. Cada preview usa su propia base

- **Fecha:** 2026-10-23
- **Estado:** Aceptada

## Contexto

Los previews usaban la base de staging, donde las tablas de un PR todavía no existen: la portada con banners del PR #61 daba 500. El Guardián v0.23 (ADR 0032 del Guardián) crea una base `info_site_pr_<N>` por PR, migrada con el SQL del PR, y la borra al cerrarlo.

## Decisión

- `next.config.ts` deja fijo en el build `MYSQL_DATABASE_PREVIEW`, que el Guardián pone solo en el build de un preview. Es solo un nombre, no un secreto.
- `src/lib/db.ts` usa `MYSQL_DATABASE_PREVIEW` si existe y si no `MYSQL_DATABASE`. Usuario y clave son los de siempre (`PREFIJO.app`), con permiso también sobre `info_site_pr_*`.
- El llamador `deploy.yml` escucha `pull_request: closed` para borrar la base.

## Por qué

Staging y los previews se publican igual en Netlify y comparten sus variables: la base del PR no puede venir de Netlify, tiene que viajar en el build.
