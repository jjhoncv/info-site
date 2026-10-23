import AxeBuilder from "@axe-core/playwright";
import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { iniciarSesionDemo } from "./admin";

const { When, Then } = createBdd();

// Reglas WCAG 2.1 AA: contraste, `alt` en imágenes y `label` en campos (ADR 0003).
const ETIQUETAS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

const PAGINAS = ["/services", "/admin/services", "/admin"];

// Se guarda por ruta lo que axe encontró; el «Entonces» lo comprueba.
let problemas: Record<string, string[]> = {};

When(/^reviso \/services y \/admin\/services$/, async ({ page }) => {
  problemas = {};
  await iniciarSesionDemo(page);
  for (const ruta of PAGINAS) {
    await page.goto(ruta);
    await page.waitForLoadState("networkidle");
    const { violations } = await new AxeBuilder({ page }).withTags(ETIQUETAS).analyze();
    problemas[ruta] = violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(" | ")})`);
  }
});

Then("los textos se leen bien, las imágenes tienen descripción y cada campo tiene su etiqueta", async () => {
  for (const ruta of PAGINAS) {
    expect(problemas[ruta], `Problemas de accesibilidad en ${ruta}`).toEqual([]);
  }
});
