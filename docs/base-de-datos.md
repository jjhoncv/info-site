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

## Tipos de la base

Después de cada migración: `npm run db:types` (con la base local migrada y las variables `MYSQL_*`) regenera `src/types/database` (snake_case) y `src/types/domain` (camelCase). No se editan a mano.

## Archivos subidos (imágenes del admin)

No se guardan en `public/` (Netlify no conserva archivos subidos): van a **Netlify Blobs** (`@netlify/blobs`), que viene con el sitio, sin cuenta extra.

### Un almacén por ambiente (`UPLOADS_STORE`)

El nombre del almacén sale **solo** de la variable `UPLOADS_STORE` (no es secreta), con un valor por contexto en Netlify (*Site configuration → Environment variables*), igual que las `MYSQL_*`: así cada base tiene sus imágenes y «Restaurar demo» en staging o en un preview no toca las de producción.

| Contexto de Netlify | `UPLOADS_STORE` |
|---|---|
| Production | `uploads-prod` |
| Deploy previews y Branch deploys (staging) | `uploads` |

- Sin la variable, en Netlify no se lee ni se escribe ningún almacén: subir una imagen falla con «No se pudo guardar la imagen. Intenta de nuevo.» y queda registrado.
- Fuera de Netlify (local y CI) se usa una carpeta temporal con el nombre del almacén (`uploads` si no hay variable).
- Mover o copiar imágenes entre ambientes queda fuera de alcance.

## Previews: una base por PR (ADR 0014)

Cada preview usa su propia base `info_site_pr_<N>` en el cluster de staging: el Guardián la crea, le aplica las migraciones del PR (con la semilla) en cada deploy y la borra al cerrar el PR. Para eso, una sola vez:

1. En TiDB Cloud, cluster de **staging** → *SQL Editor*:
   ```sql
   CREATE USER 'PREFIJO.preview'@'%' IDENTIFIED BY '<clave-larga>';
   GRANT ALL PRIVILEGES ON `info\_site\_pr\_%`.* TO 'PREFIJO.preview'@'%';
   GRANT SELECT, INSERT, UPDATE, DELETE ON `info\_site\_pr\_%`.* TO 'PREFIJO.app'@'%';
   ```
2. En GitHub → *Settings → Environments → **preview*** → secretos `MYSQL_HOST` y `MYSQL_PORT` (los de staging), `MYSQL_USER` = `PREFIJO.preview` y `MYSQL_PASSWORD` = esa clave.

Sin esos secretos, el preview usa la base de staging (sus tablas nuevas no existen ahí).

