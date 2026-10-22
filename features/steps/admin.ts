import { expect, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { executeQuery } from "../../src/lib/db";

const { Given, When, Then, After } = createBdd();

// Usuario y clave que playwright.config.ts le da al servidor local de los E2E.
const USUARIO_DEMO = "demo";
const CLAVE_DEMO_E2E = "clave-de-prueba-e2e";

// Los fallos quedan en la base: se borran para que otros escenarios puedan iniciar sesión.
const limpiarIntentos = () => executeQuery("DELETE FROM login_attempts WHERE username = ?", [USUARIO_DEMO]);
After(limpiarIntentos);

// El aviso del formulario (Next trae otro role="alert" para anunciar rutas).
const aviso = (page: Page) => page.locator("form").getByRole("alert");

const intentarLogin =async (page: Page, clave: string) => {
  await page.getByLabel("Usuario").fill(USUARIO_DEMO);
  await page.getByLabel("Clave").fill(clave);
  // Espera la respuesta de la acción del servidor, para no leer el aviso del intento anterior.
  await Promise.all([
    page.waitForResponse((r) => r.request().method() === "POST"),
    page.getByRole("button", { name: /Entrar|Entrando/ }).click(),
  ]);
};

When("entro a {word} sin iniciar sesión", async ({ page }, ruta: string) => {
  await page.context().clearCookies();
  await page.goto(ruta);
});

When("escribo mal la clave {int} veces seguidas", async ({ page }, veces: number) => {
  await limpiarIntentos();
  await page.context().clearCookies();
  await page.goto("/login");
  for (let i = 0; i < veces; i++) {
    await intentarLogin(page, `clave-incorrecta-${i}`);
    await expect(aviso(page)).toBeVisible();
  }
});

Then("veo el mensaje {string} y no puedo entrar aunque ponga la clave correcta", async ({ page }, mensaje: string) => {
  await expect(aviso(page)).toHaveText(mensaje);
  await intentarLogin(page, CLAVE_DEMO_E2E);
  await expect(aviso(page)).toHaveText(mensaje);
  await expect(page).toHaveURL(/\/login$/);
});

Then("veo el formulario de login", async ({ page }) => {
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { level: 1, name: "Iniciar sesión" })).toBeVisible();
  await expect(page.getByLabel("Usuario")).toBeVisible();
  await expect(page.getByLabel("Clave")).toBeVisible();
});

Given("que inicié sesión con el usuario demo", async ({ page }) => {
  await limpiarIntentos();
  await page.context().clearCookies();
  await page.goto("/login");
  await intentarLogin(page, CLAVE_DEMO_E2E);
  await expect(page).not.toHaveURL(/\/login$/);
});

When("entro a mi perfil", async ({ page }) => {
  await page.goto("/admin/profile");
});

Then("no veo la opción de cambiar la clave", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1, name: "Mi perfil" })).toBeVisible();
  await expect(page.getByText(/su clave no se puede cambiar/)).toBeVisible();
  await expect(page.getByLabel(/clave/i)).toHaveCount(0);
  await expect(page.getByRole("button", { name: /clave|guardar|cambiar/i })).toHaveCount(0);
});
