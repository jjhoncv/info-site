# Info Site

## 1. Problema
El dueño de una pequeña empresa de servicios quiere una web, pero no se imagina cómo se vería
la suya ni si podría actualizarla él mismo. Jhonnatan quiere venderle ese sitio y hoy no tiene
nada que mostrarle.

## 2. Qué es
Una **demo comercial** pública: el sitio informativo de una empresa de servicios de ejemplo
(portada, servicios, proyectos y contacto) con su propio **panel de administración**. El cliente
la recorre por internet, entra al admin con un usuario que le da Jhonnatan, cambia textos,
imágenes y el logo, y ve el resultado en el sitio.

## 3. Qué NO es
- No es un sitio para varios clientes a la vez ni un generador de sitios: es **una** demo.
- No es un CMS genérico: solo administra las secciones de este sitio.
- No tiene registro de usuarios, blog, tienda ni varios idiomas.
- No es una copia de FinExpert: el diseño es propio, inspirado en su estilo.

## 4. Valor
Jhonnatan puede mostrarle a un cliente, en minutos y desde el celular, cómo se vería su sitio y
qué tan fácil sería mantenerlo, y le pide una cotización.

## 5. Cómo sé que funcionó
Se la muestro a **5 clientes posibles** en las **4 semanas** siguientes a publicarla y
**al menos 1** me pide una cotización.

## 6. Límites
- **Semanas:** 6
- **Tipo:** producto
- **Presupuesto:** USD 0 al mes (planes gratis). Sin dominio propio: `info-site-jjhoncv.netlify.app`.
- **Cuentas que se van a pedir:** GitHub y Netlify (ya existen), **TiDB Cloud Starter** (base
  compatible con MySQL para staging y producción, gratis) y el bot de Telegram del Guardián.
- **Stack:** Next.js + TypeScript + Tailwind, MySQL, Auth con usuario y clave, react-hook-form + Zod,
  Vitest y Playwright. Versiones y herramientas las decide `/guardian-planificar` con ADRs.
- **Cómo se programa:** `docs/convenciones.md` (un módulo = una carpeta; Model-Repository-Mapper;
  formularios configurables; pruebas por cada funcionalidad). El primer módulo es la referencia.
- **Bloqueo:** el repo se crea cuando el Guardián cierre su **Fase 6 — Proyectos con base de datos**.

## 7. Fases
1. **Servicios y demo segura** (módulo de referencia): guía de diseño aprobada por el dueño y
   diseño propio del sitio (encabezado, pie, estilo); servicios en lista y en detalle; login del
   admin; servicios editables con imagen; demo pública segura (subida de imágenes limitada, límite
   de intentos de login, el usuario demo no cambia su clave) y botón «Restaurar demo», que deja
   todo el contenido como al principio y borra las imágenes subidas.
2. **Portada y proyectos:** portada con banners, proyectos en lista y en detalle, ambos editables
   desde el admin (copian el módulo de servicios).
3. **Empresa y contacto:** datos de la empresa en el admin (nombre, logo, teléfono, correo,
   dirección, WhatsApp), visibles en encabezado y pie; página de contacto con esos datos.
4. **Lista para mostrar:** contenido de ejemplo profesional en todas las secciones, la demo se
   restaura sola cada noche, SEO básico por página, buena nota de calidad y revisión en el celular.

## 8. Criterios de aceptación

### Fase 1
Escenario: El visitante ve los servicios
  Dado que la demo tiene el servicio "Asesoría personalizada"
  Cuando entro a /services
  Entonces veo la tarjeta "Asesoría personalizada" con su imagen

Escenario: El visitante ve el detalle de un servicio
  Dado que la demo tiene el servicio "Asesoría personalizada"
  Cuando entro a /services/asesoria-personalizada
  Entonces veo el título "Asesoría personalizada" y su descripción

Escenario: Un servicio que no existe
  Cuando entro a /services/no-existe
  Entonces veo la página "No encontramos esta página"

Escenario: El sitio se ve como el diseño aprobado
  Cuando entro a /services en la computadora y en el celular
  Entonces la página se ve igual al diseño que aprobé

Escenario: En el celular no hay nada fuera de pantalla
  Cuando entro a cualquier página pública desde un celular
  Entonces no tengo que desplazarme hacia los lados para leerla

Escenario: Las páginas se pueden leer y usar
  Cuando reviso /services y /admin/services
  Entonces los textos se leen bien, las imágenes tienen descripción y cada campo tiene su etiqueta

Escenario: Sin sesión no se entra al admin
  Cuando entro a /admin/services sin iniciar sesión
  Entonces veo el formulario de login

Escenario: El cliente edita un servicio y lo ve en el sitio
  Dado que inicié sesión con el usuario demo
  Cuando cambio el título de "Asesoría personalizada" a "AsesorÃ­a para empresas" y guardo
  Entonces en /services veo la tarjeta "AsesorÃ­a para empresas"

Escenario: El formulario avisa lo que falta
  Dado que inicié sesión con el usuario demo
  Cuando intento crear un servicio sin título
  Entonces veo el mensaje "El título es obligatorio"

Escenario: Solo se suben imágenes válidas
  Dado que inicié sesión con el usuario demo
  Cuando subo un archivo que no es JPG, PNG ni WebP, o que pesa más de 2 MB
  Entonces veo un mensaje que explica por qué no se aceptó y la imagen no se guarda

Escenario: La demo tiene un tope de imágenes subidas
  Dado que ya se subieron 30 imágenes desde la última restauración
  Cuando intento subir otra
  Entonces veo el mensaje "La demo llegó al límite de imágenes; restáurala para seguir probando"

Escenario: Demasiados intentos de login
  Cuando escribo mal la clave 5 veces seguidas
  Entonces veo el mensaje "Demasiados intentos; espera 15 minutos" y no puedo entrar aunque ponga la clave correcta

Escenario: El usuario demo no cambia su clave
  Dado que inicié sesión con el usuario demo
  Cuando entro a mi perfil
  Entonces no veo la opción de cambiar la clave

Escenario: Restaurar la demo
  Dado que el servicio "Asesoría personalizada" se renombró a "Prueba" y se subió una imagen nueva
  Cuando pulso "Restaurar demo" y confirmo
  Entonces en /services veo otra vez "Asesoría personalizada" con su imagen original, no veo "Prueba"
  y la imagen subida ya no existe

### Fase 2
Escenario: La portada muestra los banners
  Dado que la demo tiene el banner "Tu empresa, en buenas manos"
  Cuando entro a la portada
  Entonces veo el banner "Tu empresa, en buenas manos"

Escenario: El cliente cambia un banner
  Dado que inicié sesión con el usuario demo
  Cuando cambio el título del banner a "Crecemos contigo" y guardo
  Entonces en la portada veo "Crecemos contigo"

Escenario: El visitante ve un proyecto
  Dado que la demo tiene el proyecto "Proyecto Grupo Andino"
  Cuando entro a /projects y lo abro
  Entonces veo el título "Proyecto Grupo Andino", su descripción y sus imágenes

Escenario: El cliente edita un proyecto
  Dado que inicié sesión con el usuario demo
  Cuando cambio el título de "Proyecto Grupo Andino" a "Proyecto Andino" y guardo
  Entonces en /projects veo "Proyecto Andino"

### Fase 3
Escenario: El cliente cambia el logo
  Dado que inicié sesión con el usuario demo
  Cuando subo un logo nuevo en "Empresa" y guardo
  Entonces el encabezado del sitio muestra el logo nuevo

Escenario: Los datos de contacto se ven en el sitio
  Dado que el teléfono de la empresa es "+51 999 888 777"
  Cuando entro a /contact
  Entonces veo "+51 999 888 777" y un botón de WhatsApp

### Fase 4
Escenario: La demo amanece limpia
  Dado que ayer un cliente borró el servicio "Asesoría personalizada"
  Cuando pasa la restauración de la noche
  Entonces en /services veo otra vez "Asesoría personalizada"

Escenario: Cada página tiene su título para buscadores
  Cuando entro a /services/asesoria-personalizada
  Entonces el título de la pestaña es el meta título del servicio

Escenario: El sitio carga rápido y con buena calidad
  Cuando reviso la portada, /services y /projects
  Entonces cada una saca 90 o más en rendimiento, accesibilidad, buenas prácticas y SEO

## 9. Parking lot
| Fecha | Idea | Motivo |
|---|---|---|
| 2026-10-20 | Colores del sitio configurables desde el admin | Agranda el primer corte; el logo alcanza para que se vea "suyo". |
| 2026-10-20 | Usuarios y roles administrables (un usuario por cliente) | La primera versión usa un usuario demo; Jhonnatan cambia su clave. |
| 2026-10-20 | Editor de texto enriquecido para las descripciones | Un campo de texto simple alcanza para la demo. |
| 2026-10-20 | Formulario de contacto que envía correo | Necesita servicio de correo; la demo muestra datos y WhatsApp. |
| 2026-10-20 | Dominio propio | La dirección de Netlify alcanza para la demo. |
| 2026-10-20 | Varios temas o diseños para elegir | Crecimiento futuro; primero validar que la demo vende. |
| 2026-10-20 | Usar Info Site como base de los sitios de clientes (una instalación por cliente) | Es el paso siguiente si la demo funciona. |
| 2026-10-20 | Blog / noticias | No es necesario para mostrar el sitio. |

## 10. Decisiones tomadas
| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-10-20 | Repo nuevo con `nuevo-proyecto.sh`; `info-site-next` queda como referencia y se migra por tickets | Empezar limpio con el Guardián; el código viejo tiene partes a medias. |
| 2026-10-20 | Diseño propio inspirado en FinExpert, sin reusar su código, CSS, imágenes ni textos | La licencia de FinExpert cubre un sitio final, no una demo que sirve de base a varios. |
| 2026-10-20 | Guía de diseño aprobada por el dueño en la Fase 1; las pruebas protegen ese diseño | Que se vea profesional lo decide el dueño; las pruebas evitan que se rompa después. |
| 2026-10-20 | Admin con la UI de `info-site-next`, en `/admin` | Al dueño le gusta y es código suyo. |
| 2026-10-20 | No se usa `@ajk-ui` (librería del dueño); los componentes viven en el repo | Decisión del dueño. (La portada de info-site-next se rompió por un cambio a medias, no por la librería.) |
| 2026-10-20 | Organización por módulos (`src/module/<modulo>/`) según `docs/convenciones.md`; el primer módulo es la referencia | El dueño debe poder abrir cualquier módulo y modificarlo él mismo. |
| 2026-10-20 | Versiones, herramientas de prueba de la UI y tipos generados los decide `/guardian-planificar` con ADRs | El alcance dice qué; el plan decide con qué. |
| 2026-10-20 | MySQL: Docker en local y CI; TiDB Cloud Starter en staging y producción; migraciones versionadas | Mismo motor en todos los ambientes y gratis. |
| 2026-10-20 | Imágenes del admin en Netlify Blobs | Netlify no guarda archivos subidos en `public/`. |
| 2026-10-20 | Demo pública segura desde la Fase 1: subida limitada (tipo, peso, cantidad), «Restaurar demo» borra las imágenes subidas, límite de intentos de login, usuario demo sin cambio de clave | El admin queda abierto en internet para cualquier cliente. |
| 2026-10-20 | Un usuario demo compartido | Lo justo para mostrar; usuarios por cliente van al Parking lot. |
| 2026-10-20 | Sin dominio propio | Presupuesto 0. |
| 2026-10-21 | Las pruebas usan datos inventados: la semilla de la demo y fixtures, en un MySQL temporal del CI; no hay correos | Nunca datos reales en las pruebas; la demo no envía correo. |
| 2026-10-21 | Escenario «El cliente edita un proyecto» (Fase 2) | La Fase 2 dice «editables desde el admin» y no tenía escenario para proyectos. |
| 2026-10-21 | El contenido de ejemplo profesional va en la tarea de calidad (Fase 4); la revisión en el celular la cubre «En el celular no hay nada fuera de pantalla» | Sin escenario propio no hay tarea; Lighthouse mide sobre el contenido real. |
| 2026-10-21 | Login con iron-session + bcryptjs; Auth.js descartado (ADR 0005) | Un solo usuario demo; Auth.js v5 nunca salió estable y está en mantenimiento. |
| 2026-10-21 | Herramientas: Tailwind 4, pruebas visuales de Playwright, axe, mysql2 + sql-ts, Netlify Blobs, Lighthouse CI (ADR 0001–0007) | El alcance dejó a `/guardian-planificar` decidir con qué. |
| 2026-10-21 | Usuarios de TiDB: `PREFIJO.root` solo para las migraciones (GitHub Environments); `PREFIJO.app` (SELECT/INSERT/UPDATE/DELETE) para la página (Netlify) | Permisos mínimos: la página no puede cambiar tablas. |
| 2026-10-21 | Sitio **agnóstico**: «Tu Empresa», servicios que calzan en cualquier negocio, fotos reales CC0 y azul con acento cálido (ADR 0008). Los datos de ejemplo de los escenarios pasan a «Asesoría personalizada» y «Proyecto Grupo Andino» | El dueño quiere que cualquier cliente vea su negocio en la demo |
