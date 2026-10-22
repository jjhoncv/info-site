import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { executeQuery } from "../../src/lib/db";

const { Given, Then } = createBdd();

type Fila = { title: string; description: string };

const buscarServicio = async (titulo: string) =>
  (await executeQuery<Fila[]>("SELECT title, description FROM services WHERE title = ?", [titulo]))[0];

// La semilla (migración 002) deja el servicio en la base de pruebas; el paso lo comprueba.
Given("que la demo tiene el servicio {string}", async ({}, titulo: string) => {
  expect(await buscarServicio(titulo), `falta el servicio «${titulo}» en la base`).toBeDefined();
});

Then("veo la tarjeta {string} con su imagen", async ({ page }, titulo: string) => {
  const tarjeta = page.getByRole("article").filter({ has: page.getByRole("heading", { name: titulo }) });
  await expect(tarjeta).toBeVisible();
  const foto = tarjeta.getByRole("img");
  await expect(foto).toBeVisible();
  await expect.poll(() => foto.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
});

Then("veo el título {string} y su descripción", async ({ page }, titulo: string) => {
  await expect(page.getByRole("heading", { level: 1, name: titulo })).toBeVisible();
  const servicio = await buscarServicio(titulo);
  await expect(page.getByText(servicio.description)).toBeVisible();
});
