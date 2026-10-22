import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

// Los escenarios BDD (features/*.feature) son las pruebas E2E del alcance (ADR 0018).
// Un escenario sin pasos implementados se salta: cuenta en rojo en el % de avance, sin bloquear el CI.
const testDir = defineBddConfig({
  features: "features/**/*.feature",
  steps: "features/steps/**/*.ts",
  missingSteps: "skip-scenario",
});

// BASE_URL apunta a un ambiente publicado (smoke test); sin ella, se levanta el build local.
const baseURL = process.env.BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [["github"], ["list"], ["json", { outputFile: "test-results/resultados.json" }]]
    : [["list"], ["json", { outputFile: "test-results/resultados.json" }]],
  // Imágenes base de las pruebas visuales (ADR 0002): se versionan fuera de .features-gen.
  snapshotPathTemplate: "features/visual/{arg}-{platform}{ext}",
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
  use: { baseURL, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm start",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
        // Usuario de prueba solo para el servidor local de los E2E (la clave es CLAVE_DEMO_E2E en features/steps/admin.ts).
        env: {
          DEMO_USER: "demo",
          DEMO_PASSWORD_HASH: "$2b$12$y5S3GD9yaKY8INg9frQm0O.eWXliRCR4mwreLpjKh6FINE/Pdr45C",
          SESSION_SECRET: process.env.SESSION_SECRET ?? "secreto-solo-para-pruebas-e2e-32-caracteres",
        },
      },
});
