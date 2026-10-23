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

  @fase-2
  Escenario: Los banners se muestran en su orden
    Dado que la demo tiene los banners visibles "Tu empresa, en buenas manos" y "Planes para empresas", en ese orden
    Cuando entro a la portada
    Entonces veo primero "Tu empresa, en buenas manos"
    Y al pasar al siguiente veo "Planes para empresas"

  @fase-2
  Escenario: Un banner oculto no aparece en la portada
    Dado que el banner "Capacítate con nosotros" está oculto
    Cuando entro a la portada
    Entonces no veo "Capacítate con nosotros"

  @fase-2
  Escenario: La portada sin banners visibles
    Dado que todos los banners están ocultos
    Cuando entro a la portada
    Entonces no veo el carrusel de banners
    Y veo los servicios de la demo

  @fase-2
  Escenario: Restaurar la demo devuelve los banners
    Dado que el banner "Tu empresa, en buenas manos" se renombró a "Prueba"
    Cuando restauro la demo
    Entonces en la portada veo otra vez "Tu empresa, en buenas manos" y no veo "Prueba"

  @fase-2
  Escenario: El cliente oculta un banner
    Dado que inicié sesión con el usuario demo
    Cuando apago «Visible» en el banner "Planes para empresas"
    Entonces en la portada ya no veo "Planes para empresas"

  @fase-2
  Escenario: El cliente cambia el orden de los banners
    Dado que inicié sesión con el usuario demo
    Cuando muevo el banner "Planes para empresas" a la posición 1 y guardo
    Entonces en la portada el primer banner es "Planes para empresas"

  @fase-2
  Escenario: Un banner necesita título
    Dado que inicié sesión con el usuario demo
    Cuando intento crear un banner sin título
    Entonces veo el mensaje "El título es obligatorio" y el banner no se crea

  @fase-2
  Escenario: Eliminar un banner pide confirmación
    Dado que inicié sesión con el usuario demo
    Cuando elimino el banner "Capacítate con nosotros" y pulso "Cancelar"
    Entonces el banner sigue en la lista
    Y si lo elimino y confirmo, ya no aparece en la lista

  @fase-2
  Escenario: Sin sesión no se administran banners
    Cuando entro a /admin/banners sin iniciar sesión
    Entonces veo el formulario de login

  @fase-2
  Escenario: La galería del proyecto
    Dado que el proyecto "Proyecto Grupo Andino" tiene 4 fotos
    Cuando entro a /projects/proyecto-grupo-andino
    Entonces veo las 4 fotos en su orden y la primera es la portada del proyecto

  @fase-2
  Escenario: Un proyecto en borrador no se publica
    Dado que el proyecto "Programa de capacitación anual" está en borrador
    Cuando entro a /projects
    Entonces no veo "Programa de capacitación anual"
    Y en /projects/programa-de-capacitacion-anual veo la página "No encontramos esta página"

  @fase-2
  Escenario: Un proyecto que no existe
    Cuando entro a /projects/no-existe
    Entonces veo la página "No encontramos esta página"

  @fase-2
  Escenario: Restaurar la demo devuelve los proyectos
    Dado que el proyecto "Proyecto Grupo Andino" se renombró a "Prueba"
    Cuando restauro la demo
    Entonces en /projects veo otra vez "Proyecto Grupo Andino" y no veo "Prueba"

  @fase-2
  Escenario: El cliente cambia la portada del proyecto
    Dado que inicié sesión con el usuario demo
    Cuando muevo la tercera foto de "Proyecto Grupo Andino" al primer lugar y guardo
    Entonces en /projects/proyecto-grupo-andino esa foto es la portada

  @fase-2
  Escenario: El cliente pasa un proyecto a borrador
    Dado que inicié sesión con el usuario demo
    Cuando cambio "Proyecto Grupo Andino" a Borrador y guardo
    Entonces en /projects ya no veo "Proyecto Grupo Andino"

  @fase-2
  Escenario: La galería respeta el tope de imágenes
    Dado que inicié sesión con el usuario demo
    Y que ya se subieron 30 imágenes desde la última restauración
    Cuando agrego una foto a la galería de "Proyecto Grupo Andino"
    Entonces veo el mensaje "La demo llegó al límite de imágenes; restáurala para seguir probando"

  @fase-2
  Escenario: Un proyecto necesita título
    Dado que inicié sesión con el usuario demo
    Cuando intento crear un proyecto sin título
    Entonces veo el mensaje "El título es obligatorio" y el proyecto no se crea

  @fase-2
  Escenario: Eliminar un proyecto pide confirmación
    Dado que inicié sesión con el usuario demo
    Cuando elimino el proyecto "Soporte a 40 sucursales" y confirmo
    Entonces ya no aparece en la lista ni en /projects
