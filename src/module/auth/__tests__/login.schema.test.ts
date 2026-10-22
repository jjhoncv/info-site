import { describe, expect, it } from "vitest";
import { loginSchema } from "../core/login.schema";

const mensaje = (datos: { username: string; password: string }) => {
  const r = loginSchema.safeParse(datos);
  return r.success ? "" : r.error.issues[0].message;
};

describe("loginSchema", () => {
  it("acepta usuario y clave", () => {
    expect(loginSchema.safeParse({ username: "demo", password: "x" }).success).toBe(true);
  });

  it("pide el usuario", () => {
    expect(mensaje({ username: "", password: "x" })).toBe("El usuario es obligatorio");
  });

  it("pide la clave", () => {
    expect(mensaje({ username: "demo", password: "" })).toBe("La clave es obligatoria");
  });

  it("limita el largo para no hashear textos enormes", () => {
    expect(loginSchema.safeParse({ username: "demo", password: "x".repeat(201) }).success).toBe(false);
  });
});
