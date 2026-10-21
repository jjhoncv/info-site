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
