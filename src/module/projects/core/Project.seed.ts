// Semilla de la demo: lo que «Restaurar demo» vuelve a cargar. Es la misma de
// db/migraciones/005-crear-proyectos.sql (Project.seed.test.ts vigila que no se separen).
// Las fotos viven en public/demo (docs/creditos.md). La primera de cada proyecto es su portada.
export type ProjectStatus = "published" | "draft";

export type ProjectImageSeed = { imageUrl: string; imageAlt: string };

export type ProjectSeed = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  status: ProjectStatus;
  images: ProjectImageSeed[];
};

const servicio = (archivo: string, imageAlt: string): ProjectImageSeed => ({ imageUrl: `/demo/servicios/${archivo}.jpg`, imageAlt });
const sitio = (archivo: string, imageAlt: string): ProjectImageSeed => ({ imageUrl: `/demo/${archivo}.jpg`, imageAlt });

export const PROJECTS_SEED: ProjectSeed[] = [
  {
    title: "Proyecto Grupo Andino",
    slug: "proyecto-grupo-andino",
    summary: "Atención en 12 locales de una cadena de tiendas, sin cerrar sus puertas al público.",
    description:
      "Grupo Andino necesitaba ordenar la atención de sus 12 locales sin interrumpir la venta. Armamos un calendario por tienda, trabajamos fuera del horario de mayor público y dejamos a cada encargado con una guía simple para el día a día. En seis semanas, todos los locales quedaron funcionando con el mismo estándar.",
    status: "published",
    images: [
      servicio("atencion-en-tu-local", "Revisión del plano de un local antes de empezar"),
      servicio("asesoria-personalizada", "Reunión con el encargado de tienda"),
      servicio("capacitacion", "Capacitación al equipo de ventas"),
      servicio("garantia-y-postventa", "Entrega final con el gerente de operaciones"),
    ],
  },
  {
    title: "Renovación de sede central",
    slug: "renovacion-de-sede-central",
    summary: "Nueva distribución de oficinas para 80 personas, entregada en el plazo acordado.",
    description:
      "La sede central creció y las oficinas ya no alcanzaban. Rediseñamos la distribución de los pisos, coordinamos el traslado por áreas y entregamos cada planta en la fecha prometida, para que nadie dejara de trabajar durante la obra.",
    status: "published",
    images: [
      sitio("local", "Fachada de la sede central luego de la renovación"),
      sitio("portada", "Reunión en una oficina luminosa recién renovada"),
      servicio("planes-para-empresas", "Equipo conversando en la nueva sala de reuniones"),
      servicio("asesoria-personalizada", "Asesores revisando la propuesta de distribución"),
      servicio("atencion-en-tu-local", "Técnicos revisando un plano durante la obra"),
      servicio("garantia-y-postventa", "Entrega de la sede al gerente general"),
    ],
  },
  {
    title: "Programa de capacitación anual",
    slug: "programa-de-capacitacion-anual",
    summary: "Talleres durante todo el año para que el equipo se mantenga al día.",
    description:
      "Diseñamos un calendario de talleres prácticos para un año completo, con evaluación al cierre de cada módulo y material para consultar después.",
    status: "draft",
    images: [
      servicio("capacitacion", "Instructor explicando un tema al grupo"),
      servicio("planes-para-empresas", "Participantes trabajando en equipo durante un taller"),
      servicio("asesoria-personalizada", "Revisión de resultados con el área de personal"),
    ],
  },
  {
    title: "Soporte a 40 sucursales",
    slug: "soporte-a-40-sucursales",
    summary: "Mantenimiento preventivo mensual y una sola línea de ayuda para todas las sedes.",
    description:
      "Una red de 40 sucursales tenía un proveedor distinto en cada ciudad. Unificamos el soporte en una sola línea de ayuda, programamos visitas preventivas cada mes y entregamos un reporte con lo revisado en cada sede.",
    status: "published",
    images: [
      servicio("soporte-y-mantenimiento", "Equipo de soporte trabajando con varias laptops"),
      servicio("atencion-en-tu-local", "Técnico en una sucursal durante la revisión mensual"),
      servicio("garantia-y-postventa", "Cierre de la visita con el encargado de la sucursal"),
      servicio("planes-para-empresas", "Reunión mensual de seguimiento con el cliente"),
      servicio("capacitacion", "Capacitación al personal de las sucursales"),
    ],
  },
];
