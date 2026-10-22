import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { When, Then } = createBdd();

When("entro a {word} sin iniciar sesión", async ({ page }, ruta: string) => {
  await page.context().clearCookies();
  await page.goto(ruta);
});

Then("veo el formulario de login", async ({ page }) => {
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { level: 1, name: "Iniciar sesión" })).toBeVisible();
  await expect(page.getByLabel("Usuario")).toBeVisible();
  await expect(page.getByLabel("Clave")).toBeVisible();
});
