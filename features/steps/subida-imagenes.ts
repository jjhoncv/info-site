import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { executeQuery } from "../../src/lib/db";
import { iniciarSesionDemo } from "./admin";

const { Given, When, Then, After } = createBdd();

// El contador es de toda la demo: se vuelve a cero al terminar para no afectar a los demás escenarios.
const fijarSubidas = (total: number) => executeQuery("UPDATE upload_counter SET total = ? WHERE id = 1", [total]);
After(() => fijarSubidas(0));

const pngValido = { name: "valida.png", mimeType: "image/png", buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]) };

Given("que ya se subieron {int} imágenes desde la última restauración", async ({}, total: number) => {
  await fijarSubidas(total);
});

When("intento subir otra", async ({ page }) => {
  await iniciarSesionDemo(page);
  await page.goto("/admin/services/new");
  await page.getByLabel(/Imagen del servicio/).setInputFiles(pngValido);
});

const MB = 1024 * 1024;
const RECHAZOS = /No se aceptó (el archivo|la imagen)/;

// Un archivo que no es imagen (texto con nombre de PNG) y un JPG válido pero de más de 2 MB.
const noEsImagen = { name: "falsa.png", mimeType: "image/png", buffer: Buffer.from("esto no es una imagen") };
const muyPesada = {
  name: "grande.jpg",
  mimeType: "image/jpeg",
  buffer: Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(2 * MB + 1)]),
};

When("subo un archivo que no es JPG, PNG ni WebP, o que pesa más de 2 MB", async ({ page }) => {
  await page.goto("/admin/services/new");
  const campo = page.getByLabel(/Imagen del servicio/);
  for (const archivo of [noEsImagen, muyPesada]) {
    await campo.setInputFiles(archivo);
    await expect(page.getByText(RECHAZOS)).toBeVisible();
    await expect(page.getByRole("img", { name: /Vista previa/ })).toHaveCount(0);
    await page.reload();
  }
  // Un archivo rechazado no deja rastro: el último mensaje corresponde al peso.
  await campo.setInputFiles(muyPesada);
});

Then("veo un mensaje que explica por qué no se aceptó y la imagen no se guarda", async ({ page }) => {
  await expect(page.getByText("No se aceptó la imagen: pesa más de 2 MB, el máximo permitido.")).toBeVisible();
  await expect(page.getByRole("img", { name: /Vista previa/ })).toHaveCount(0);
});
