-- Proyectos del sitio (módulo projects): el proyecto y su galería de fotos.
-- La primera foto (position más baja) es la portada. Solo los «published» se muestran en el sitio.
CREATE TABLE projects (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  summary VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  position INT NOT NULL DEFAULT 0,
  meta_title VARCHAR(70) NULL,
  meta_description VARCHAR(160) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT UNSIGNED NULL,
  updated_by INT UNSIGNED NULL
);

CREATE TABLE project_images (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  project_id INT UNSIGNED NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  image_alt VARCHAR(200) NOT NULL,
  position INT NOT NULL DEFAULT 0,
  INDEX idx_project_images_project (project_id, position)
);

-- Semilla de la demo: datos inventados. Las fotos viven en public/demo (docs/creditos.md).
INSERT INTO projects (title, slug, summary, description, status, position) VALUES
  ('Proyecto Grupo Andino', 'proyecto-grupo-andino',
   'Atención en 12 locales de una cadena de tiendas, sin cerrar sus puertas al público.',
   'Grupo Andino necesitaba ordenar la atención de sus 12 locales sin interrumpir la venta. Armamos un calendario por tienda, trabajamos fuera del horario de mayor público y dejamos a cada encargado con una guía simple para el día a día. En seis semanas, todos los locales quedaron funcionando con el mismo estándar.',
   'published', 1),
  ('Renovación de sede central', 'renovacion-de-sede-central',
   'Nueva distribución de oficinas para 80 personas, entregada en el plazo acordado.',
   'La sede central creció y las oficinas ya no alcanzaban. Rediseñamos la distribución de los pisos, coordinamos el traslado por áreas y entregamos cada planta en la fecha prometida, para que nadie dejara de trabajar durante la obra.',
   'published', 2),
  ('Programa de capacitación anual', 'programa-de-capacitacion-anual',
   'Talleres durante todo el año para que el equipo se mantenga al día.',
   'Diseñamos un calendario de talleres prácticos para un año completo, con evaluación al cierre de cada módulo y material para consultar después.',
   'draft', 3),
  ('Soporte a 40 sucursales', 'soporte-a-40-sucursales',
   'Mantenimiento preventivo mensual y una sola línea de ayuda para todas las sedes.',
   'Una red de 40 sucursales tenía un proveedor distinto en cada ciudad. Unificamos el soporte en una sola línea de ayuda, programamos visitas preventivas cada mes y entregamos un reporte con lo revisado en cada sede.',
   'published', 4);

INSERT INTO project_images (project_id, image_url, image_alt, position) VALUES
  (1, '/demo/servicios/atencion-en-tu-local.jpg', 'Revisión del plano de un local antes de empezar', 1),
  (1, '/demo/servicios/asesoria-personalizada.jpg', 'Reunión con el encargado de tienda', 2),
  (1, '/demo/servicios/capacitacion.jpg', 'Capacitación al equipo de ventas', 3),
  (1, '/demo/servicios/garantia-y-postventa.jpg', 'Entrega final con el gerente de operaciones', 4),
  (2, '/demo/local.jpg', 'Fachada de la sede central luego de la renovación', 1),
  (2, '/demo/portada.jpg', 'Reunión en una oficina luminosa recién renovada', 2),
  (2, '/demo/servicios/planes-para-empresas.jpg', 'Equipo conversando en la nueva sala de reuniones', 3),
  (2, '/demo/servicios/asesoria-personalizada.jpg', 'Asesores revisando la propuesta de distribución', 4),
  (2, '/demo/servicios/atencion-en-tu-local.jpg', 'Técnicos revisando un plano durante la obra', 5),
  (2, '/demo/servicios/garantia-y-postventa.jpg', 'Entrega de la sede al gerente general', 6),
  (3, '/demo/servicios/capacitacion.jpg', 'Instructor explicando un tema al grupo', 1),
  (3, '/demo/servicios/planes-para-empresas.jpg', 'Participantes trabajando en equipo durante un taller', 2),
  (3, '/demo/servicios/asesoria-personalizada.jpg', 'Revisión de resultados con el área de personal', 3),
  (4, '/demo/servicios/soporte-y-mantenimiento.jpg', 'Equipo de soporte trabajando con varias laptops', 1),
  (4, '/demo/servicios/atencion-en-tu-local.jpg', 'Técnico en una sucursal durante la revisión mensual', 2),
  (4, '/demo/servicios/garantia-y-postventa.jpg', 'Cierre de la visita con el encargado de la sucursal', 3),
  (4, '/demo/servicios/planes-para-empresas.jpg', 'Reunión mensual de seguimiento con el cliente', 4),
  (4, '/demo/servicios/capacitacion.jpg', 'Capacitación al personal de las sucursales', 5);
