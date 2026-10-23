-- Semilla de la demo: los 3 banners de la maqueta (el tercero, oculto). Las fotos viven en public/demo (docs/creditos.md).
INSERT INTO banners (title, subtitle, image_url, image_alt, position, visible) VALUES
  ('Tu empresa, en buenas manos', 'Atención cercana y resultados que se notan',
   '/demo/portada.jpg', 'Dos personas conversan en una oficina luminosa', 1, 1),
  ('Planes para empresas', 'Precios fijos y atención prioritaria',
   '/demo/servicios/planes-para-empresas.jpg', 'Equipo reunido conversando alrededor de una mesa', 2, 1),
  ('Capacítate con nosotros', 'Talleres prácticos para que tu equipo aprenda haciendo',
   '/demo/servicios/capacitacion.jpg', 'Un instructor explica un tema a un grupo de personas', 3, 0);
