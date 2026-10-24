# Convenciones de construcción (del dueño)

> Cómo programa el dueño, tomado de `ajk-ecommerce` (`docs/module-template.md` y el módulo `tags`).
> Claude lo lee **antes de cada ticket** y lo sigue al pie de la letra: el dueño debe poder abrir
> cualquier módulo y modificarlo él mismo sin encontrar nada extraño.
> Si algo no está aquí, se copia del **módulo de referencia** (el primero que se construye); si
> tampoco está ahí, se pregunta en el PR. Las marcas **[mejora]** son cambios sobre ajk: el dueño
> las aprueba o las quita.

## 1. Un módulo = una carpeta

```
src/module/<modulo>/
├── core/                       # datos: Model-Repository-Mapper
│   ├── <Entidad>.repository.ts # SOLO SQL
│   ├── <Entidad>.mapper.ts     # snake_case (BD) → camelCase (dominio)
│   ├── <Entidad>.model.ts      # lógica: orquesta repository + mapper
│   ├── <Entidad>.schema.ts     # [mejora] esquema zod único (UI + API)
│   └── index.ts                # exportaciones
├── components/
│   ├── admin/                  # <Entidad>ListView.tsx, <entidad>Fields.ts
│   └── web/                    # componentes del sitio público (<Entidad>Card.tsx…)
├── services/                   # lo que consume el sitio público (types.ts, hydrators.ts)
├── __tests__/                  # [mejora] unitarias de model, mapper y schema (Vitest)
└── testing-spec.md             # especificación de negocio del módulo (la define el dueño)
```

Páginas y APIs (App Router):

```
src/app/admin/<modulo>/page.tsx         # lista (DynamicTable)
src/app/admin/<modulo>/new/page.tsx     # crear (FormCreate + <entidad>Fields)
src/app/admin/<modulo>/[id]/page.tsx    # editar (mergeFieldsWithData)
src/app/admin/<modulo>/error.tsx
src/app/api/admin/<modulo>/route.ts     # GET lista, POST, PATCH, DELETE
src/app/api/admin/<modulo>/[id]/route.ts
src/app/<ruta-publica>/[slug]/page.tsx  # detalle con SEO (generateMetadata)
```

## 2. Datos: Model-Repository-Mapper

- **Repository:** clase con métodos `get<Entidad>s`, `get<Entidad>ById`, `get<Entidad>BySlug`,
  `create<Entidad>`, `update<Entidad>`, `delete<Entidad>`; usa `executeQuery` con `?` (nunca
  concatenar valores). Devuelve `null` si no hay filas. Exporta una instancia por defecto.
- **Mapper:** `<Entidad>Mapper(raw)` y `<Entidad>sMapper(raws)`; `null` de BD → `undefined`.
- **Model:** mismos métodos que el repository, devolviendo tipos de dominio. Exporta una instancia.
- **Editar (PATCH) sin perder campos:** `Schema.parse({ ...soloCamposDelEsquema(Schema, actual), ...cambios })` (`src/lib/esquema.ts`), nunca la lista de campos a mano; y una prueba que recorre `Object.keys(Schema.shape)` y verifica que todos se conservan al editar.
- **Tipos generados** de la BD (`src/types/database` y `src/types/domain`); se regeneran después
  de cada cambio de tabla. No se escriben a mano.

## 3. Base de datos (MySQL en Docker)

- Tablas en `snake_case` plural; columnas `snake_case`; FK `id_<entidad>`.
- Columnas estándar: `id`, `name`, `slug` (único), `description`, `image_url`, `meta_title`,
  `meta_description`, `created_at`, `updated_at`, `created_by`, `updated_by`.
- Local: MySQL en `docker-compose.yml`; credenciales solo en `.env.local` (nunca en docs ni código).
- **[mejora] Migraciones versionadas** (`db/migraciones/NNN-<que>.sql`), en vez de ejecutar SQL a
  mano en Docker: el mismo cambio tiene que llegar igual a local, preview, staging y producción.
- Cada sección del admin se registra en `sections` y se asigna a roles (`roles_sections`), dentro
  de la misma migración.

## 4. Formularios del admin (configurables, Tailwind)

- Un archivo `<entidad>Fields.ts` declara los campos (`Field[]`): `key`, `label`, `type`
  (`text`, `textarea`, `select`, `checkbox-group`, `file`…), `required` con su mensaje,
  `placeholder` y, para imágenes, `FileOptions` (peso máximo, dimensiones mín./máx., tipos).
- Secciones del formulario separadas por comentarios: Información básica · Imágenes · SEO.
- `FormCreate` arma el formulario y su validación (zod vía `createDynamicSchema`) con
  react-hook-form. Las páginas `new` y `[id]` solo pasan `api`, `fields` y `redirect`.
- Listas con `DynamicTable` (búsqueda, paginación, orden, arrastrar para reordenar) y acciones
  `EditAction` / `RemoveAction`; borrar pide confirmación con `Alert` mostrando dependencias.
- Layout común: `LayoutPageAdmin` + `PageUI` (título, subtítulo, breadcrumb) + `PageButton`.
- Vista limpia: solo clases de Tailwind y los componentes compartidos; nada de estilos sueltos.

## 5. APIs del admin

- Envueltas en `apiHandler`; respuestas con `createResponse({ success, message|error, data }, status)`.
- Auditoría: `created_by` / `updated_by` con el id de la sesión; `created_at` / `updated_at`.
- **[mejora] Autorización en el servidor:** toda ruta `/api/admin/*` verifica sesión **y** que el
  rol tenga la sección (`withAdmin(seccion, handler)`) → 401/403. En ajk el middleware excluye
  `/api/*` y muchas rutas no lo verifican.
- **[mejora] Validación con el mismo esquema zod de la UI** (`<Entidad>.schema.ts`), no con `if`
  a mano: lo que la UI rechaza, la API también.
- **[mejora] Lista permitida de campos:** se guarda solo lo que el esquema define; nunca
  `INSERT … SET ?` con el body completo (si no, el cliente puede escribir `created_by` u otra columna).
- **[mejora] Errores sin detalles internos:** al cliente, un mensaje genérico; el `sqlMessage` al log.

## 6. Sitio público

- Páginas de detalle por `slug` con `generateMetadata` (meta_title / meta_description).
- `not-found.tsx` y `error.tsx` propios; servicios en `services/` con hydrators para la UI.

## 7. Pruebas por cada funcionalidad (TDD)

- **Unitarias (Vitest)**, antes del código: mapper (snake→camel, nulls), model (con el
  repository simulado), esquema zod (casos válidos e inválidos, mismos mensajes que la UI).
- **API:** crear / editar / borrar, validación (400), sin sesión (401), sin sección (403).
- **E2E (Playwright + BDD)** por escenario del módulo: listado, crear, editar, borrar con
  confirmación, validaciones del formulario y la página pública (incluido el 404). Base de
  datos de pruebas con datos inventados y limpieza al terminar.
- `testing-spec.md` del módulo: casos de uso y criterios de aceptación, que se vuelven escenarios.

## 7b. Complejidad y legibilidad [mejora]

El dueño tiene que poder leer y modificar cualquier archivo sin esfuerzo.

- **Una responsabilidad por archivo.** Si un componente hace más de una cosa (estado, envío, dibujo,
  formato), se separa: la lógica en un **hook** (`useX.ts`), las transformaciones en **funciones puras**
  (`toX.ts`) y el dibujo en componentes chicos.
- **Límites orientativos:** componente ≤ 150 líneas, función ≤ 40, sin `any`. Si se pasa, se divide
  o se explica en el PR por qué no.
- **Registro en vez de `switch` largo:** p. ej. tipo de campo → componente (`FieldRenderer`).
- **Cada pieza con su prueba:** funciones puras y esquemas con Vitest sin montar nada; hooks y
  componentes con Testing Library; envíos con la API simulada (MSW).
- **La interfaz pública no cambia al separar:** las páginas siguen usando `<FormCreate api form />`.
- Se migra separado desde el inicio: `FormCreate`, `ServerFiles` y `BrowserFiles` de ajk se
  reconstruyen así, no se copian tal cual.

```
FormCreate/
├── FormCreate.tsx       # une las piezas
├── useFormCreate.ts     # useForm + enviar + aviso + redirigir
├── toFormData.ts        # función pura
├── schema/createDynamicSchema.ts · fieldSchemas.ts
├── fields/FieldRenderer.tsx · TextField · TextareaField · SelectField · CheckboxGroupField · FileField
├── audit/AuditPanel.tsx · formatDate.ts
├── files/useFileDialog.ts
├── types.ts
└── __tests__/
```

## 7c. Versiones

Al migrar código de ajk-ecommerce o info-site-next, adaptarlo a Next 16 (`params`, `cookies()` y
`headers()` con `await`; `proxy.ts` en vez de `middleware.ts`), React 19 (sin `findDOMNode`;
`@hello-pangea/dnd`), Tailwind 4 (`@theme` en CSS) y Zod 4. Nunca copiar sin revisar.

## 8. Lo que NO se trae de ajk

- El sistema multi-agente (Project Owner, Module Lead, DBA…): en el Guardián, un ticket = un PR
  de Claude, revisado por el consultor y aprobado por el dueño.
- El runner E2E propio (`tsx` + capturas): se reemplaza por Playwright, que ya usa el Guardián.
- Integraciones del e-commerce (Meilisearch, Redis, carrito, pagos): no aplican a un sitio informativo.

## 9. Módulo de referencia

El primer ticket construye **un módulo completo** siguiendo este documento (p. ej. `services`:
tabla, core, esquema, API, admin, página pública y todas sus pruebas). Los siguientes módulos
copian ese módulo, no inventan.
