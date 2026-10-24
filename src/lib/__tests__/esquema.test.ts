import { describe, expect, it } from "vitest";
import { z } from "zod";
import { soloCamposDelEsquema } from "../esquema";

const Esquema = z.object({ title: z.string(), slug: z.string(), metaTitle: z.string().optional() });

describe("soloCamposDelEsquema", () => {
  it("toma todos los campos que el esquema define, sin nombrarlos a mano", () => {
    const actual = { id: 1, title: "T", slug: "t", metaTitle: "M", createdAt: new Date() };
    expect(soloCamposDelEsquema(Esquema, actual)).toEqual({ title: "T", slug: "t", metaTitle: "M" });
  });

  it("deja fuera lo que no es del esquema (id, fechas, auditoría)", () => {
    const r = soloCamposDelEsquema(Esquema, { id: 9, title: "T", slug: "t", updatedBy: 3 });
    expect(r).not.toHaveProperty("id");
    expect(r).not.toHaveProperty("updatedBy");
  });
});
