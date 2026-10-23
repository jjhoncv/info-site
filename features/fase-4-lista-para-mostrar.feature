# language: es
# Fase 4 (PROYECTO.md §8). Sin pasos implementados: quedan pendientes hasta su ticket (ADR 0018).
Característica: Lista para mostrar
  La demo se restaura sola cada noche, cada página tiene su SEO y el sitio saca buena nota de calidad.

  @fase-4
  Escenario: La demo amanece limpia
    Dado que ayer un cliente borró el servicio "Asesoría personalizada"
    Cuando pasa la restauración de la noche
    Entonces en /services veo otra vez "Asesoría personalizada"

  @fase-4
  Escenario: Cada página tiene su título para buscadores
    Cuando entro a /services/asesoria-personalizada
    Entonces el título de la pestaña es el meta título del servicio

  @fase-4
  Escenario: El sitio carga rápido y con buena calidad
    Cuando reviso la portada, /services y /projects
    Entonces cada una saca 90 o más en rendimiento, accesibilidad, buenas prácticas y SEO

  @fase-4
  Escenario: La restauración de la noche borra las imágenes subidas
    Dado que ayer un cliente subió una imagen nueva
    Cuando pasa la restauración de la noche
    Entonces esa imagen ya no existe
    Y el Resumen del admin muestra "0 / 30" imágenes subidas

  @fase-4
  Escenario: El usuario demo sigue entrando después de la restauración
    Dado que pasó la restauración de la noche
    Cuando inicio sesión con el usuario demo y su clave de siempre
    Entonces entro al admin

  @fase-4
  Escenario: Sin meta título se usa el título de la página
    Dado que el servicio "Capacitación" no tiene meta título
    Cuando entro a /services/capacitacion
    Entonces el título de la pestaña es "Capacitación · Tu Empresa"

  @fase-4
  Escenario: El mapa del sitio tiene solo las páginas públicas
    Cuando entro a /sitemap.xml
    Entonces veo la portada, /services, cada servicio, /projects, cada proyecto publicado y /contact
    Y no veo /admin, /login ni los proyectos en borrador

  @fase-4
  Escenario: Los buscadores no indexan el admin
    Cuando entro a /robots.txt
    Entonces /admin y /login están bloqueados

  @fase-4
  Escenario: Al compartir un servicio se ve su vista previa
    Cuando reviso las etiquetas de /services/asesoria-personalizada
    Entonces tiene título, descripción e imagen para redes (Open Graph)

  @fase-4
  Escenario: No hay textos de relleno
    Cuando reviso la portada, /services, /projects y /contact
    Entonces no veo "Lorem ipsum", "TODO", "Texto de ejemplo" ni imágenes de marcador

  @fase-4
  Escenario: Las páginas nuevas se pueden leer y usar
    Cuando reviso la portada, /projects, /projects/proyecto-grupo-andino y /contact
    Entonces los textos se leen bien, las imágenes tienen descripción y cada control tiene su etiqueta

  @fase-4
  Escenario: Todo el sitio se ve como el diseño aprobado
    Cuando entro a la portada, /projects y /contact en la computadora y en el celular
    Entonces cada página se ve igual al diseño que aprobé
