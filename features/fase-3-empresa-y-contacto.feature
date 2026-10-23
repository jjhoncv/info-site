# language: es
# Fase 3 (PROYECTO.md §8). Sin pasos implementados: quedan pendientes hasta su ticket (ADR 0018).
Característica: Empresa y contacto
  Los datos de la empresa se editan en el admin y se ven en el encabezado, el pie y /contact.

  @fase-3
  Escenario: El cliente cambia el logo
    Dado que inicié sesión con el usuario demo
    Cuando subo un logo nuevo en "Empresa" y guardo
    Entonces el encabezado del sitio muestra el logo nuevo

  @fase-3
  Escenario: Los datos de contacto se ven en el sitio
    Dado que el teléfono de la empresa es "+51 999 888 777"
    Cuando entro a /contact
    Entonces veo "+51 999 888 777" y un botón de WhatsApp

  @fase-3
  Escenario: El teléfono nuevo se ve en todo el sitio
    Dado que inicié sesión con el usuario demo
    Cuando cambio el teléfono a "+51 911 222 333" en "Datos de la empresa" y guardo
    Entonces el encabezado y el pie del sitio muestran "+51 911 222 333"

  @fase-3
  Escenario: Un teléfono que no es válido
    Dado que inicié sesión con el usuario demo
    Cuando escribo el teléfono "abc" en "Datos de la empresa" y guardo
    Entonces veo el mensaje "Escribe un teléfono válido, con código de país." y no se guarda nada

  @fase-3
  Escenario: Un logo que no es una imagen válida
    Dado que inicié sesión con el usuario demo
    Cuando subo como logo un archivo SVG
    Entonces veo un mensaje que explica por qué no se aceptó y el logo no cambia

  @fase-3
  Escenario: El cliente quita su logo
    Dado que inicié sesión con el usuario demo
    Y que subí un logo nuevo
    Cuando pulso "Quitar" en el logo y guardo
    Entonces el encabezado del sitio muestra otra vez el logo de la demo

  @fase-3
  Escenario: Restaurar la demo devuelve los datos de la empresa
    Dado que el nombre comercial se cambió a "Prueba SAC"
    Cuando restauro la demo
    Entonces el encabezado del sitio muestra otra vez "Tu Empresa"

  @fase-3
  Escenario: El botón de WhatsApp abre la conversación
    Dado que el WhatsApp de la empresa es "51999888777"
    Cuando entro a /contact
    Entonces el botón "Escríbenos por WhatsApp" lleva a "https://wa.me/51999888777"

  @fase-3
  Escenario: El teléfono y el correo se pueden tocar
    Cuando entro a /contact
    Entonces el teléfono es un enlace para llamar y el correo un enlace para escribir un correo

  @fase-3
  Escenario: Sin WhatsApp no hay botón
    Dado que la empresa no tiene WhatsApp
    Cuando entro a /contact
    Entonces no veo el botón "Escríbenos por WhatsApp"
    Y sí veo el teléfono y el correo

  @fase-3
  Escenario: La página de contacto se ve como el diseño aprobado
    Cuando entro a /contact en la computadora y en el celular
    Entonces la página se ve igual al diseño que aprobé
