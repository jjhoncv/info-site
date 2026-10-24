import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { SIN_SMOKE } from "./ganchos";
import { executeQuery } from "../../src/lib/db";
import { iniciarSesionDemo } from "./admin";

const { Given, When, Then, After } = createBdd();

type Proyecto = { id: number; title: string; description: string; status: string };
type Foto = { image_alt: string };

const buscarProyecto = async (titulo: string) =>
  (await executeQuery<Proyecto[]>("SELECT id, title, description, status FROM projects WHERE title = ?", [titulo]))[0];

const fotosDe = async (proyectoId: number) =>
  executeQuery<Foto[]>("SELECT image_alt FROM project_images WHERE project_id = ? ORDER BY position, id", [proyectoId]);

// «Lo abro»: el proyecto que el Dado dejó a la vista.
let proyectoActual: string | undefined;

// Si el escenario falla antes de restaurar, no deja el cambio en la base para los demás.
After(SIN_SMOKE, async () => {
  proyectoActual = undefined;
  await executeQuery("UPDATE projects SET title = ? WHERE title = 'Prueba'", ["Proyecto Grupo Andino"]);
});

// La semilla (migración 005) deja los proyectos en la base de pruebas; el paso lo comprueba.
Given("que la demo tiene el proyecto {string}", async ({}, titulo: string) => {
  expect(await buscarProyecto(titulo), `falta el proyecto «${titulo}» en la base`).toBeDefined();
  proyectoActual = titulo;
});

Given("que el proyecto {string} tiene {int} fotos", async ({}, titulo: string, total: number) => {
  const proyecto = await buscarProyecto(titulo);
  expect(proyecto, `falta el proyecto «${titulo}» en la base`).toBeDefined();
  expect(await fotosDe(proyecto.id)).toHaveLength(total);
});

Given("que el proyecto {string} está en borrador", async ({}, titulo: string) => {
  const proyecto = await buscarProyecto(titulo);
  expect(proyecto, `falta el proyecto «${titulo}» en la base`).toBeDefined();
  expect(proyecto.status).toBe("draft");
});

Given("que el proyecto {string} se renombró a {string}", async ({}, actual: string, nuevo: string) => {
  // Todavía no hay admin de proyectos (T13b): el cambio se hace en la base.
  await executeQuery("UPDATE projects SET title = ? WHERE title = ?", [nuevo, actual]);
  expect(await buscarProyecto(nuevo)).toBeDefined();
});

When(/^entro a \/projects y lo abro$/, async ({ page }) => {
  await page.goto("/projects");
  await page.getByRole("link", { name: new RegExp(proyectoActual!) }).click();
  await expect(page).toHaveURL(/\/projects\/[^/]+$/);
});

When("restauro la demo", async ({ page }) => {
  await iniciarSesionDemo(page);
  await page.goto("/admin");
  await page.getByRole("button", { name: "Restaurar demo" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Sí, restaurar" }).click();
  await expect(page.getByRole("status")).toHaveText("La demo volvió a su contenido original");
});

Then("veo el título {string}, su descripción y sus imágenes", async ({ page }, titulo: string) => {
  const proyecto = await buscarProyecto(titulo);
  await expect(page.getByRole("heading", { level: 1, name: titulo })).toBeVisible();
  await expect(page.getByText(proyecto.description)).toBeVisible();
  const miniaturas = page.getByRole("list", { name: "Fotos del proyecto" }).getByRole("button");
  await expect(miniaturas).toHaveCount((await fotosDe(proyecto.id)).length);
  const grande = page.getByRole("figure").getByRole("img").first();
  await expect(grande).toBeVisible();
  await expect.poll(() => grande.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
});

Then("veo las {int} fotos en su orden y la primera es la portada del proyecto", async ({ page }, total: number) => {
  const [{ id }] = await executeQuery<{ id: number }[]>("SELECT id FROM projects WHERE slug = 'proyecto-grupo-andino'");
  const descripciones = (await fotosDe(id)).map((f) => f.image_alt);
  expect(descripciones).toHaveLength(total);
  const miniaturas = page.getByRole("list", { name: "Fotos del proyecto" }).getByRole("button");
  await expect(miniaturas).toHaveCount(total);
  const etiquetas = await miniaturas.evaluateAll((botones) => botones.map((b) => b.getAttribute("aria-label")));
  expect(etiquetas).toEqual(descripciones.map((d, i) => `Ver foto ${i + 1}: ${d}`));
  // La foto grande al entrar es la primera: la portada.
  await expect(page.getByRole("figure").getByRole("img", { name: descripciones[0], exact: true })).toBeVisible();
  await expect(page.getByText(`1 / ${total}`)).toBeVisible();
});

Then("no veo {string}", async ({ page }, texto: string) => {
  await expect(page.getByText(texto)).toHaveCount(0);
});

Then(/^en (\/\S+) veo la página "([^"]+)"$/, async ({ page }, ruta: string, titulo: string) => {
  await page.goto(ruta);
  await expect(page.getByRole("heading", { level: 1, name: titulo })).toBeVisible();
});

Then(/^en \/projects veo otra vez "([^"]+)" y no veo "([^"]+)"$/, async ({ page }, titulo: string, ausente: string) => {
  await page.goto("/projects");
  await expect(page.getByRole("heading", { name: titulo })).toBeVisible();
  await expect(page.getByRole("heading", { name: ausente })).toHaveCount(0);
});
