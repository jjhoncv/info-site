import bcrypt from "bcryptjs";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { verifyCredentials } from "../core/credentials";

describe("verifyCredentials", () => {
  beforeEach(() => {
    process.env.DEMO_USER = "demo";
    process.env.DEMO_PASSWORD_HASH = bcrypt.hashSync("clave-correcta", 4);
  });
  afterEach(() => {
    delete process.env.DEMO_USER;
    delete process.env.DEMO_PASSWORD_HASH;
  });

  it("acepta el usuario y la clave correctos", async () => {
    expect(await verifyCredentials("demo", "clave-correcta")).toBe(true);
  });

  it("rechaza una clave incorrecta", async () => {
    expect(await verifyCredentials("demo", "otra")).toBe(false);
  });

  it("rechaza otro usuario", async () => {
    expect(await verifyCredentials("otro", "clave-correcta")).toBe(false);
  });

  it("rechaza todo si las variables no están configuradas", async () => {
    delete process.env.DEMO_USER;
    delete process.env.DEMO_PASSWORD_HASH;
    expect(await verifyCredentials("demo", "clave-correcta")).toBe(false);
    expect(await verifyCredentials("", "")).toBe(false);
  });
});
