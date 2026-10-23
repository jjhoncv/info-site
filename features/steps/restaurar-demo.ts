import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { SIN_SMOKE } from "./ganchos";
import { executeQuery } from "../../src/lib/db";
import { iniciarSesionDemo } from "./admin";

const { Given, When, Then, After } = createBdd();

const ORIGINAL = "Asesoría personalizada";
const png = { name: "nueva.png", mimeType: "image/png", buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]) };

// Si el escenario falla antes de restaurar, no deja el cambio en la base para los demás.
let imagenSubida: string | undefined;
After(SIN_SMOKE, async () => {
  imagenSubida = undefined;
  await executeQuery("UPDATE services SET title = ? WHERE title = 'Prueba'", [ORIGINAL]);
  await executeQuery("UPDATE upload_counter SET total = 0 WHERE id = 1");
});

Given(
  "que el servicio {string} se renombró a {string} y se subió una imagen nueva",
  async ({ page }, actual: string, nuevo: string) => {
    const [servicio] = await executeQuery<{ id: number }[]>("SELECT id FROM services WHERE title = ?", [actual]);
    expect(servicio, `falta el servicio «${actual}» en la base`).toBeDefined();
    await iniciarSesionDemo(page);
    await page.goto(`/admin/services/${servicio.id}`);
    await page.getByRole("textbox", { name: /^Título \*/ }).fill(nuevo);
    await page.getByLabel(/Imagen del servicio/).setInputFiles(png);
    const vista = page.getByRole("img", { name: /Vista previa/ });
    // La vista previa muestra primero la imagen original; espera a que sea la subida.
    await expect(vista).toHaveAttribute("src", /^\/media\//);
    imagenSubida = (await vista.getAttribute("src")) ?? undefined;
    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await expect(page).toHaveURL(/\/admin\/services$/);
  },
);

When("pulso {string} y confirmo", async ({ page }, boton: string) => {
  await page.goto("/admin");
  await page.getByRole("button", { name: boton }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Sí, restaurar" }).click();
  await expect(page.getByRole("status")).toHaveText("La demo volvió a su contenido original");
});

Then(
  "en \\/services veo otra vez {string} con su imagen original, no veo {string}",
  async ({ page }, titulo: string, ausente: string) => {
    await page.goto("/services");
    const tarjeta = page.getByRole("article").filter({ has: page.getByRole("heading", { name: titulo }) });
    await expect(tarjeta).toBeVisible();
    await expect(tarjeta.getByRole("img")).toHaveAttribute("src", /asesoria-personalizada\.jpg/);
    await expect(page.getByRole("heading", { name: ausente })).toHaveCount(0);
  },
);

Then("la imagen subida ya no existe", async ({ page }) => {
  expect(imagenSubida).toBeDefined();
  expect((await page.request.get(imagenSubida!)).status()).toBe(404);
  const [{ total }] = await executeQuery<{ total: number }[]>("SELECT total FROM upload_counter WHERE id = 1");
  expect(Number(total)).toBe(0);
});
