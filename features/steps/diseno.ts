import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { When, Then } = createBdd();

const COMPUTADORA = { width: 1280, height: 800 };
const CELULAR = { width: 390, height: 844 };
const PAGINAS_PUBLICAS = ["/", "/services", "/services/asesoria-personalizada", "/services/no-existe"];

When(/^entro a (\/\S*)$/, async ({ page }, ruta: string) => {
  await page.goto(ruta);
});

When(/^entro a \/services en la computadora y en el celular$/, async ({ page }) => {
  // Se comparan las dos capturas en el mismo paso; las imágenes base viven en features/steps/diseno.ts-snapshots (ADR 0002).
  for (const [nombre, tamano] of [["computadora", COMPUTADORA], ["celular", CELULAR]] as const) {
    await page.setViewportSize(tamano);
    await page.goto("/services");
    await expect(page).toHaveScreenshot(`services-${nombre}.png`, { fullPage: true });
  }
});

Then("la página se ve igual al diseño que aprobé", async () => {
  // La comparación ya se hizo al entrar; este paso deja el escenario legible en Gherkin.
});

When("entro a cualquier página pública desde un celular", async ({ page }) => {
  await page.setViewportSize(CELULAR);
  for (const ruta of PAGINAS_PUBLICAS) {
    await page.goto(ruta);
    const sobrante = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(sobrante, `${ruta} se desborda a los lados`).toBeLessThanOrEqual(0);
  }
});

Then("no tengo que desplazarme hacia los lados para leerla", async () => {
  // Cada página se midió al entrar.
});

Then("veo la página {string}", async ({ page }, titulo: string) => {
  await expect(page.getByRole("heading", { level: 1, name: titulo })).toBeVisible();
});
