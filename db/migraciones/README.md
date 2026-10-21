# Migraciones

Cada cambio de tablas es un archivo `NNN-que-hace.sql` (`001-crear-usuarios.sql`, `002-crear-servicios.sql`…).
El Guardián los aplica en orden, una vez cada uno: en el CI (base temporal), en staging al fusionar y en
producción al aprobar el release (ADR 0029).

- **Nunca edites una migración ya aplicada:** crea una nueva. El Guardián la frena si cambió.
- **Solo agregar:** tablas o columnas nuevas. Borrar o renombrar va en dos pasos (primero el código deja de usarla, luego se borra), porque el rollback no deshace la base y los previews usan la base de staging.
- En local: `docker compose up -d mysql` y aplica las migraciones con la herramienta del Guardián (`node <guardian>/tools/db/migrar.ts db/migraciones`) o el script del proyecto.
