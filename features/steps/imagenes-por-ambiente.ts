import { randomUUID } from "node:crypto";
import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { executeQuery } from "../../src/lib/db";
import { deleteAllBlobs, readBlob, saveBlob } from "../../src/module/uploads/core/storage";
import { iniciarSesionDemo } from "./admin";

const { Given, When, Then, After } = createBdd();

// El servidor de los E2E es «staging» (UPLOADS_STORE=uploads, ver playwright.config.ts); este proceso
// simula producción cambiando el nombre del almacén. En local y CI cada nombre es una carpeta distinta.
const STAGING = "uploads";
const PRODUCCION = "uploads-prod";
const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]);
const pngArchivo = { name: "valida.png", mimeType: "image/png", buffer: Buffer.from(png) };

const enAlmacen = async <T>(nombre: string, accion: () => Promise<T>): Promise<T> => {
  const antes = process.env.UPLOADS_STORE;
  process.env.UPLOADS_STORE = nombre;
  try {
    return await accion();
  } finally {
    if (antes === undefined) delete process.env.UPLOADS_STORE;
    else process.env.UPLOADS_STORE = antes;
  }
};

let claveProduccion: string | undefined;
let urlStaging: string | undefined;
After(async () => {
  claveProduccion = urlStaging = undefined;
  await enAlmacen(PRODUCCION, deleteAllBlobs);
  await executeQuery("UPDATE upload_counter SET total = 0 WHERE id = 1");
});

Given("que en producción hay un servicio con una imagen subida", async () => {
  claveProduccion = `${randomUUID()}.png`;
  await enAlmacen(PRODUCCION, () => saveBlob(claveProduccion!, png, "image/png"));
});

When("restauro la demo en staging", async ({ page }) => {
  await iniciarSesionDemo(page);
  await page.goto("/admin");
  await page.getByRole("button", { name: "Restaurar demo" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Sí, restaurar" }).click();
  await expect(page.getByRole("status")).toHaveText("La demo volvió a su contenido original");
});

Then("en producción esa imagen se sigue viendo", async () => {
  expect(await enAlmacen(PRODUCCION, () => readBlob(claveProduccion!))).not.toBeNull();
});

Given("que subí una imagen en staging", async ({ page }) => {
  await iniciarSesionDemo(page);
  const r = await page.request.post("/api/admin/uploads", { multipart: { file: pngArchivo } });
  expect(r.status()).toBe(201);
  urlStaging = (await r.json()).data.url;
});

let respuesta: number | undefined;
When("abro esa imagen desde un preview", async ({ request }) => {
  // Un preview usa el mismo valor de UPLOADS_STORE que staging: pide la imagen con el almacén de staging.
  respuesta = (await request.get(urlStaging!)).status();
});

Then("la veo, porque el preview usa la base y las imágenes de staging", async () => {
  expect(respuesta).toBe(200);
  const clave = urlStaging!.replace("/media/", "");
  expect(await enAlmacen(STAGING, () => readBlob(clave))).not.toBeNull();
  expect(await enAlmacen(PRODUCCION, () => readBlob(clave))).toBeNull();
});

// Segundo servidor de los E2E (playwright.config.ts): simula Netlify sin la variable UPLOADS_STORE.
const SIN_ALMACEN = "http://localhost:3001";

Given("que falta la variable UPLOADS_STORE", async ({ page }) => {
  await iniciarSesionDemo(page);
});

When("subo una imagen válida", async ({ page }) => {
  await page.goto(`${SIN_ALMACEN}/admin/services/new`);
  await page.getByLabel(/Imagen del servicio/).setInputFiles(pngArchivo);
});

Then(
  "veo el mensaje {string} y no se guarda nada",
  async ({ page }, mensaje: string) => {
    await expect(page.getByText(mensaje)).toBeVisible();
    await expect(page.getByRole("img", { name: /Vista previa/ })).toHaveCount(0);
    const [{ total }] = await executeQuery<{ total: number }[]>("SELECT total FROM upload_counter WHERE id = 1");
    expect(Number(total)).toBe(0);
  },
);
