// Semilla de la demo: lo que «Restaurar demo» vuelve a cargar. Es la misma de
// db/migraciones/006-semilla-banners.sql (Banner.seed.test.ts vigila que no se separen).
// Las fotos viven en public/demo (docs/creditos.md).
export type BannerSeed = {
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  visible: boolean;
};

export const BANNERS_SEED: BannerSeed[] = [
  {
    title: "Tu empresa, en buenas manos",
    subtitle: "Atención cercana y resultados que se notan",
    imageUrl: "/demo/portada.jpg",
    imageAlt: "Dos personas conversan en una oficina luminosa",
    visible: true,
  },
  {
    title: "Planes para empresas",
    subtitle: "Precios fijos y atención prioritaria",
    imageUrl: "/demo/servicios/planes-para-empresas.jpg",
    imageAlt: "Equipo reunido conversando alrededor de una mesa",
    visible: true,
  },
  {
    title: "Capacítate con nosotros",
    subtitle: "Talleres prácticos para que tu equipo aprenda haciendo",
    imageUrl: "/demo/servicios/capacitacion.jpg",
    imageAlt: "Un instructor explica un tema a un grupo de personas",
    visible: false,
  },
];
