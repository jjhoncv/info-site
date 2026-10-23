# language: es
# Fase 1 (PROYECTO.md §8). Sin pasos implementados: quedan pendientes hasta su ticket (ADR 0018).
# @smoke: corre también contra producción después de cada release.
Característica: Servicios y demo segura
  El sitio tiene su diseño propio, muestra los servicios y el cliente los edita desde un admin
  de demo que es seguro dejar abierto en internet.

  @fase-1
  Escenario: El visitante ve los servicios
    Dado que la demo tiene el servicio "Asesoría personalizada"
    Cuando entro a /services
    Entonces veo la tarjeta "Asesoría personalizada" con su imagen

  @fase-1
  Escenario: El visitante ve el detalle de un servicio
    Dado que la demo tiene el servicio "Asesoría personalizada"
    Cuando entro a /services/asesoria-personalizada
    Entonces veo el título "Asesoría personalizada" y su descripción

  @fase-1 @smoke
  Escenario: Un servicio que no existe
    Cuando entro a /services/no-existe
    Entonces veo la página "No encontramos esta página"

  @fase-1
  Escenario: El sitio se ve como el diseño aprobado
    Cuando entro a /services en la computadora y en el celular
    Entonces la página se ve igual al diseño que aprobé

  @fase-1 @smoke
  Escenario: En el celular no hay nada fuera de pantalla
    Cuando entro a cualquier página pública desde un celular
    Entonces no tengo que desplazarme hacia los lados para leerla

  @fase-1
  Escenario: Las páginas se pueden leer y usar
    Cuando reviso /services y /admin/services
    Entonces los textos se leen bien, las imágenes tienen descripción y cada campo tiene su etiqueta

  @fase-1 @smoke
  Escenario: Sin sesión no se entra al admin
    Cuando entro a /admin/services sin iniciar sesión
    Entonces veo el formulario de login

  @fase-1
  Escenario: El cliente edita un servicio y lo ve en el sitio
    Dado que inicié sesión con el usuario demo
    Cuando cambio el título de "Asesoría personalizada" a "Asesoría para empresas" y guardo
    Entonces en /services veo la tarjeta "Asesoría para empresas"

  @fase-1
  Escenario: El formulario avisa lo que falta
    Dado que inicié sesión con el usuario demo
    Cuando intento crear un servicio sin título
    Entonces veo el mensaje "El título es obligatorio"

  @fase-1
  Escenario: Solo se suben imágenes válidas
    Dado que inicié sesión con el usuario demo
    Cuando subo un archivo que no es JPG, PNG ni WebP, o que pesa más de 2 MB
    Entonces veo un mensaje que explica por qué no se aceptó y la imagen no se guarda

  @fase-1
  Escenario: La demo tiene un tope de imágenes subidas
    Dado que ya se subieron 30 imágenes desde la última restauración
    Cuando intento subir otra
    Entonces veo el mensaje "La demo llegó al límite de imágenes; restáurala para seguir probando"

  @fase-1
  Escenario: Demasiados intentos de login
    Cuando escribo mal la clave 5 veces seguidas
    Entonces veo el mensaje "Demasiados intentos; espera 15 minutos" y no puedo entrar aunque ponga la clave correcta

  @fase-1
  Escenario: El usuario demo no cambia su clave
    Dado que inicié sesión con el usuario demo
    Cuando entro a mi perfil
    Entonces no veo la opción de cambiar la clave

  @fase-1
  Escenario: Restaurar la demo
    Dado que el servicio "Asesoría personalizada" se renombró a "Prueba" y se subió una imagen nueva
    Cuando pulso "Restaurar demo" y confirmo
    Entonces en /services veo otra vez "Asesoría personalizada" con su imagen original, no veo "Prueba"
    Y la imagen subida ya no existe
