# Módulo projects — especificación de negocio

Proyectos que la empresa muestra como referencia, cada uno con su galería de fotos.

## Reglas
- Solo los proyectos **publicados** aparecen en `/projects` y tienen página `/projects/[slug]`; un **borrador** da 404.
- La **primera foto** de la galería (la de menor `position`) es la portada: tarjeta y foto grande del detalle.
- Cada foto tiene su descripción (`image_alt`). La galería se recorre con las flechas ← → del teclado.
- «Restaurar demo» devuelve proyectos y fotos a la semilla (`Project.seed.ts` = migración 005).

## Escenarios (features/fase-2-portada-y-proyectos.feature)
- El visitante ve un proyecto · La galería del proyecto · Un proyecto en borrador no se publica
- Un proyecto que no existe · Restaurar la demo devuelve los proyectos

## Fuera de este módulo por ahora
Admin de proyectos (T13b): crear, editar, ordenar fotos, pasar a borrador, eliminar.
