# Info Site

[![CI](https://github.com/jjhoncv/info-site/actions/workflows/ci.yml/badge.svg)](https://github.com/jjhoncv/info-site/actions/workflows/ci.yml)
[![Deploy](https://github.com/jjhoncv/info-site/actions/workflows/deploy.yml/badge.svg)](https://github.com/jjhoncv/info-site/actions/workflows/deploy.yml)
[![Release](https://github.com/jjhoncv/info-site/actions/workflows/release.yml/badge.svg)](https://github.com/jjhoncv/info-site/actions/workflows/release.yml)
[![Fase](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/jjhoncv/info-site/estado/fase.json)](https://github.com/jjhoncv/info-site/milestones)
[![Avance](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/jjhoncv/info-site/estado/avance.json)](https://github.com/jjhoncv/info-site/actions/workflows/ci.yml)
[![Salud](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/jjhoncv/info-site/estado/salud.json)](https://github.com/jjhoncv/info-site/actions/workflows/estado.yml)

Una **demo comercial** pública: el sitio informativo de una empresa de servicios de ejemplo

- **Fase, avance y salud:** los badges de arriba se actualizan solos en cada merge y una vez al día (🟢 al día · 🟡 atraso corto o un PR te espera · 🔴 atraso largo o `main` en rojo · ⚫ 14 días sin actividad). Requieren repo público; si es privado, mira el Sheet del Guardián
- **Staging:** https://staging--info-site-jjhoncv.netlify.app
- **Producción:** https://info-site-jjhoncv.netlify.app
- **Alcance:** [`PROYECTO.md`](PROYECTO.md) · **Decisiones:** [`docs/decisiones/`](docs/decisiones/README.md) · **Tablero:** pestaña *Projects* del repo

Creado con **[Guardián](https://github.com/jjhoncv/guardian)** v0.19.1: alcance fijo, producción desde el día 1, tareas chicas que el dueño aprueba. Los workflows de `.github/workflows/` son llamadas cortas a los del Guardián; el pipeline vive allí.

## Empezar

1. Abre Claude Code en este repo y corre **`/guardian`** (estado y siguiente paso) y **`/guardian-planificar`**: convierte el alcance de `PROYECTO.md` en escenarios BDD (en rojo) y un plan de tareas, y abre un PR.
2. Revisa y fusiona ese PR: se crean los tickets (uno por tarea) y entran al tablero.
3. Cada ticket → rama → PR chico → preview → merge → staging. Releases con tu aprobación → producción.

## Cómo fluye un cambio

```
Issue (escenario BDD) → rama feat/N-slug → PR chico → CI + preview pr-N
  → squash merge (dueño) → staging
  → PR de release (release-please) → merge (dueño) → aprobación del Environment (dueño) → producción → smoke test
```

Rollback: **automático** si falla el smoke test después de un release (abre un issue `alerta`). A mano: en Netlify, *Deploys* → deploy anterior de producción → *Publish deploy*.

## Mantenimiento

| Secreto | Si vence | Renovar |
|---|---|---|
| `RELEASE_PLEASE_TOKEN` (90 días) | No se abre ni actualiza el PR de release | Nuevo PAT fine-grained (solo este repo; Contents y Pull requests en *Read and write*) → `gh secret set RELEASE_PLEASE_TOKEN -R jjhoncv/info-site` |
| `NETLIFY_AUTH_TOKEN` | Fallan preview, staging y producción | Nuevo token en Netlify → `gh secret set NETLIFY_AUTH_TOKEN -R jjhoncv/info-site` |

Mejoras del Guardián: Dependabot propone subir la versión en `.github/workflows/` (`jjhoncv/guardian/...@vX.Y.Z`).

## Desarrollo local

```sh
nvm use        # Node 24 (.nvmrc)
npm ci
npm run dev    # http://localhost:3000
npm run lint && npm run typecheck && npm test && npm run build
npm run e2e    # escenarios BDD en Chrome (el % de avance lo publica el CI)
```
