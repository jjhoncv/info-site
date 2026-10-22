# language: es
# Fase 2 (PROYECTO.md §8). Sin pasos implementados: quedan pendientes hasta su ticket (ADR 0018).
Característica: Portada y proyectos
  La portada muestra banners y el sitio muestra proyectos; ambos se editan desde el admin.

  @fase-2
  Escenario: La portada muestra los banners
    Dado que la demo tiene el banner "Tu empresa, en buenas manos"
    Cuando entro a la portada
    Entonces veo el banner "Tu empresa, en buenas manos"

  @fase-2
  Escenario: El cliente cambia un banner
    Dado que inicié sesión con el usuario demo
    Cuando cambio el título del banner a "Crecemos contigo" y guardo
    Entonces en la portada veo "Crecemos contigo"

  @fase-2
  Escenario: El visitante ve un proyecto
    Dado que la demo tiene el proyecto "Proyecto Grupo Andino"
    Cuando entro a /projects y lo abro
    Entonces veo el título "Proyecto Grupo Andino", su descripción y sus imágenes

  @fase-2
  Escenario: El cliente edita un proyecto
    Dado que inicié sesión con el usuario demo
    Cuando cambio el título de "Proyecto Grupo Andino" a "Proyecto Andino" y guardo
    Entonces en /projects veo "Proyecto Andino"
