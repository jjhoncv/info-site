# 0004. mysql2 y tipos generados desde la base

- **Fecha:** 2026-10-21
- **Estado:** Aceptada

## Contexto

Las convenciones piden repositories con SQL y `?`, y tipos de la base generados, no escritos a mano (§2). Hay que elegir con qué.

## Decisión

- Conexión con **`mysql2/promise`** (pool) detrás de un `executeQuery(sql, params)` en `src/lib/db`, con TLS cuando `MYSQL_SSL=1` (TiDB).
- Sin ORM ni query builder: los repositories escriben SQL, como en ajk-ecommerce.
- Tipos de `src/types/database` generados con **`@rmp135/sql-ts`** leyendo la base local después de aplicar las migraciones (`npm run db:types`). Los tipos de `src/types/domain` (camelCase) los arma el mismo script. Versión exacta fijada en T2.

## Por qué

`mysql2` es el driver de MySQL más usado, funciona con TiDB y lo usa el código del dueño. Un ORM (Prisma, Drizzle) cambiaría el patrón Model-Repository-Mapper que el dueño quiere poder leer. sql-ts genera interfaces simples a partir de la base, sin atar el código a una librería de consultas (Kysely y otros generadores lo hacen).
