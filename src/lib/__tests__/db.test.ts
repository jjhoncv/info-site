import { afterEach, describe, expect, it, vi } from "vitest";
import { nombreDeLaBase } from "../db";

afterEach(() => vi.unstubAllEnvs());

describe("nombreDeLaBase", () => {
  it("en un preview usa la base propia del PR (la pone el build del Guardián)", () => {
    vi.stubEnv("MYSQL_DATABASE", "info_site");
    vi.stubEnv("MYSQL_DATABASE_PREVIEW", "info_site_pr_61");
    expect(nombreDeLaBase()).toBe("info_site_pr_61");
  });

  it("en staging y producción (sin base de preview) usa MYSQL_DATABASE", () => {
    vi.stubEnv("MYSQL_DATABASE", "info_site");
    vi.stubEnv("MYSQL_DATABASE_PREVIEW", "");
    expect(nombreDeLaBase()).toBe("info_site");
  });
});
