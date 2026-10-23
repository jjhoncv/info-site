import { expect, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { SIN_SMOKE } from "./ganchos";
import { executeQuery } from "../../src/lib/db";
import { BANNERS_SEED } from "../../src/module/banners/core/Banner.seed";
import { iniciarSesionDemo } from "./admin";
import { restaurarDemo } from "./restaurar-demo";

const { Given, When, Then, After } = createBdd();

type Fila = { title: string; visible: number };

const buscarBanner = async (titulo: string) =>
  (await executeQuery<Fila[]>("SELECT title, visible FROM banners WHERE title = ?", [titulo]))[0];

// Los escenarios cambian banners en la base; al terminar, cada escenario los deja como en la semilla.
After(SIN_SMOKE, async () => {
  for (const [i, b] of BANNERS_SEED.entries()) {
    await executeQuery("UPDATE banners SET title = ?, visible = ? WHERE id = ?", [b.title, b.visible ? 1 : 0, i + 1]);
  }
});

// El carrusel de la portada y el título de cada banner (el primero es el h1; los demás, h2).
const carrusel = (page: Page) => page.getByRole("region", { name: "Banners" });
const titulo = (page: Page, texto: string) => carrusel(page).getByRole("heading", { name: texto });

// La semilla (migración 006) deja los banners en la base de pruebas; los pasos lo comprueban.
Given("que la demo tiene el banner {string}", async ({}, texto: string) => {
  expect(await buscarBanner(texto), `falta el banner «${texto}» en la base`).toBeDefined();
});

Given(
  "que la demo tiene los banners visibles {string} y {string}, en ese orden",
  async ({}, primero: string, segundo: string) => {
    const visibles = await executeQuery<Fila[]>("SELECT title FROM banners WHERE visible = 1 ORDER BY position, id");
    expect(visibles.map((b) => b.title)).toEqual([primero, segundo]);
  },
);

Given("que el banner {string} está oculto", async ({}, texto: string) => {
  expect((await buscarBanner(texto))?.visible, `el banner «${texto}» debería estar oculto`).toBe(0);
});

Given("que todos los banners están ocultos", async () => {
  await executeQuery("UPDATE banners SET visible = 0");
});

Given("que el banner {string} se renombró a {string}", async ({}, actual: string, nuevo: string) => {
  await executeQuery("UPDATE banners SET title = ? WHERE title = ?", [nuevo, actual]);
});

When("entro a la portada", async ({ page }) => {
  await page.goto("/");
});

When("restauro la demo", async ({ page }) => {
  await iniciarSesionDemo(page);
  await restaurarDemo(page);
});

Then("veo el banner {string}", async ({ page }, texto: string) => {
  await expect(titulo(page, texto)).toBeVisible();
});

Then("veo primero {string}", async ({ page }, texto: string) => {
  await expect(titulo(page, texto)).toBeVisible();
  await expect(carrusel(page).getByRole("heading", { level: 1 })).toHaveText(texto);
});

Then("al pasar al siguiente veo {string}", async ({ page }, texto: string) => {
  await carrusel(page).getByRole("button", { name: "Banner siguiente" }).click();
  await expect(titulo(page, texto)).toBeVisible();
});

Then("no veo {string}", async ({ page }, texto: string) => {
  await expect(page.getByText(texto, { exact: true })).toHaveCount(0);
});

Then("no veo el carrusel de banners", async ({ page }) => {
  await expect(carrusel(page)).toHaveCount(0);
});

Then("veo los servicios de la demo", async ({ page }) => {
  const servicios = await executeQuery<{ title: string }[]>("SELECT title FROM services ORDER BY position, id");
  expect(servicios.length).toBeGreaterThan(0);
  for (const { title } of servicios) {
    await expect(page.getByRole("article").getByRole("heading", { name: title })).toBeVisible();
  }
});

Then("en la portada veo otra vez {string} y no veo {string}", async ({ page }, esperado: string, ausente: string) => {
  await page.goto("/");
  await expect(titulo(page, esperado)).toBeVisible();
  await expect(page.getByText(ausente, { exact: true })).toHaveCount(0);
});
