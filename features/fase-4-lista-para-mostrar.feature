# language: es
# Fase 4 (PROYECTO.md §8). Sin pasos implementados: quedan pendientes hasta su ticket (ADR 0018).
Característica: Lista para mostrar
  La demo se restaura sola cada noche, cada página tiene su SEO y el sitio saca buena nota de calidad.

  @fase-4
  Escenario: La demo amanece limpia
    Dado que ayer un cliente borró el servicio "Asesoría contable"
    Cuando pasa la restauración de la noche
    Entonces en /services veo otra vez "Asesoría contable"

  @fase-4
  Escenario: Cada página tiene su título para buscadores
    Cuando entro a /services/asesoria-contable
    Entonces el título de la pestaña es el meta título del servicio

  @fase-4
  Escenario: El sitio carga rápido y con buena calidad
    Cuando reviso la portada, /services y /projects
    Entonces cada una saca 90 o más en rendimiento, accesibilidad, buenas prácticas y SEO
