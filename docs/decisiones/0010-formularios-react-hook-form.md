# 0010. Formularios con react-hook-form y el esquema zod del módulo

- **Fecha:** 2026-10-23
- **Estado:** Aceptada

## Contexto

Las convenciones (§4, §5, §7b) piden formularios configurables con react-hook-form y un solo esquema zod que valide igual en la UI y en la API. Hay que elegir cómo unirlos.

## Decisión

- **`react-hook-form`** (7.90.0, versión exacta) para el estado y el envío del formulario.
- El puente con zod es un **resolver propio** de unas 15 líneas (`FormCreate/zodResolver.ts`), no `@hookform/resolvers`.
- Los campos se declaran en `<entidad>Fields.ts`; el esquema (`Service.schema.ts`) es el mismo que usa la API.

## Por qué

`@hookform/resolvers` 6 no instala en este árbol (conflicto de peer dependencies opcionales con `effect`) y añadiría un paquete para hacer algo que aquí es `safeParse` y copiar los mensajes. El resolver propio queda a la vista del dueño y tiene su prueba.
