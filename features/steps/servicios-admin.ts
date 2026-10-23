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

When("subo un archivo que no es JPG, PNG ni WebP, o que pesa más de 2 MB", async ({ page }) => {
  await page.goto("/admin/services/new");
  // Dice ser PNG, pero su contenido es texto: el servidor lo rechaza por lo que contiene.
  const falso = { name: "nota.png", mimeType: "image/png", buffer: Buffer.from("esto no es una imagen") };
  await page.getByLabel("Imagen", { exact: true }).setInputFiles(falso);
});

Then("veo un mensaje que explica por qué no se aceptó y la imagen no se guarda", async ({ page }) => {
  await expect(page.getByRole("alert").filter({ hasText: /JPG, PNG o WebP/ })).toBeVisible();
  await expect(page.getByRole("img", { name: "Vista previa de la imagen" })).toHaveCount(0);
  await expect(page.getByLabel("Imagen", { exact: true })).toHaveAttribute("aria-invalid", "true");
});

Then("veo el mensaje {string}", async ({ page }, mensaje: string) => {
  await expect(page.getByText(mensaje, { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/admin\/services\/new$/);
});
