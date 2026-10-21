# Base de datos (MySQL)

| Ambiente | Base | Quién la crea |
|---|---|---|
| Tu Mac | MySQL 8 en Docker (`docker-compose.yml`) | `docker compose up -d mysql` |
| CI (cada PR) | MySQL 8 temporal, se borra al terminar | El Guardián |
| Staging (`main`) | MySQL gestionado, base de staging | El dueño, una vez |
| Producción | MySQL gestionado, **otra** base | El dueño, una vez |

## Conexión de staging y producción (una vez por ambiente)

1. Crea la base en el proveedor (por defecto **TiDB Cloud Starter**, gratis): una para staging y otra para producción.
2. **GitHub** → *Settings → Environments* → `staging` y luego `production` → *Add environment secret*:
   `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`. Los usa el Guardián para aplicar las migraciones.
3. **Netlify** → *Site configuration → Environment variables*: las mismas variables más `MYSQL_SSL=1`, **marcadas como secretas** y con un valor distinto por contexto (*Production* = producción; *Deploy previews* y *Branch deploys* = staging). Las usa la página.
4. Permisos mínimos: la página, con un usuario que solo lee y escribe datos; las migraciones, con uno que puede cambiar tablas.

## Archivos subidos (imágenes del admin)

No se guardan en `public/` (Netlify no conserva archivos subidos): van a **Netlify Blobs** (`@netlify/blobs`), que viene con el sitio, sin cuenta extra.
