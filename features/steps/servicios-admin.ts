import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { executeQuery } from "../../src/lib/db";

const { When, Then, After } = createBdd();

// Lo que el escenario cambió, para devolverlo al terminar y no afectar a los demás.
let renombrado: { id: number; titulo: string } | undefined;
After(async () => {
  if (!renombrado) return;
  await executeQuery("UPDATE services SET title = ? WHERE id = ?", [renombrado.titulo, renombrado.id]);
  renombrado = undefined;
});

const GUARDAR = { name: "Guardar cambios" };

When("cambio el título de {string} a {string} y guardo", async ({ page }, actual: string, nuevo: string) => {
  const [servicio] = await executeQuery<{ id: number }[]>("SELECT id FROM services WHERE title = ?", [actual]);
  expect(servicio, `falta el servicio «${actual}» en la base`).toBeDefined();
  renombrado = { id: servicio.id, titulo: actual };
  await page.goto(`/admin/services/${servicio.id}`);
  await page.getByRole("textbox", { name: /^Título \*/ }).fill(nuevo);
  await page.getByRole("button", GUARDAR).click();
  await expect(page).toHaveURL(/\/admin\/services$/);
});

Then("en \\/services veo la tarjeta {string}", async ({ page }, titulo: string) => {
  await page.goto("/services");
  const tarjeta = page.getByRole("article").filter({ has: page.getByRole("heading", { name: titulo }) });
  await expect(tarjeta).toBeVisible();
});

When("intento crear un servicio sin título", async ({ page }) => {
  await page.goto("/admin/services/new");
  await page.getByRole("button", GUARDAR).click();
});

Then("veo el mensaje {string}", async ({ page }, mensaje: string) => {
  await expect(page.getByText(mensaje, { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/admin\/services\/new$/);
});
