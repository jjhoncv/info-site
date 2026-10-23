import { beforeEach, expect, it, vi } from "vitest";

// Base falsa con transacciones: los cambios se aplican a una copia y solo se publican en el commit.
const bd = vi.hoisted(() => ({
  servicios: ["original"] as string[],
  banners: ["original"] as string[],
  contador: 1,
  fallaInsert: false,
}));
vi.mock("@/src/lib/db", () => ({
  executeQuery: vi.fn(),
  withTransaction: async (trabajo: (c: (sql: string) => Promise<void>) => Promise<void>) => {
    const copia = { servicios: [...bd.servicios], banners: [...bd.banners], contador: bd.contador };
    await trabajo(async (sql) => {
      if (sql.startsWith("DELETE FROM services")) copia.servicios = [];
      else if (sql.startsWith("INSERT INTO services")) {
        if (bd.fallaInsert) throw new Error("falla el INSERT");
        copia.servicios = ["semilla"];
      } else if (sql.startsWith("DELETE FROM banners")) copia.banners = [];
      else if (sql.startsWith("INSERT INTO banners")) copia.banners = ["semilla"];
      else if (sql.startsWith("UPDATE upload_counter")) copia.contador = 0;
    });
    Object.assign(bd, copia);
  },
}));
const storage = vi.hoisted(() => ({ deleteAllBlobs: vi.fn(), saveBlob: vi.fn(), readBlob: vi.fn() }));
vi.mock("@/src/module/uploads/core/storage", () => storage);

import { restoreDemo } from "../core/restoreDemo";

beforeEach(() => {
  vi.clearAllMocks();
  Object.assign(bd, { servicios: ["original"], banners: ["original"], contador: 1, fallaInsert: false });
});

it("si falla el INSERT, los servicios, los banners, el contador y las imágenes quedan como estaban", async () => {
  bd.fallaInsert = true;
  await expect(restoreDemo()).rejects.toThrow("falla el INSERT");
  expect(bd.servicios).toEqual(["original"]);
  expect(bd.banners).toEqual(["original"]);
  expect(bd.contador).toBe(1);
  expect(storage.deleteAllBlobs).not.toHaveBeenCalled();
});

it("si todo sale bien, restaura servicios, banners y contador y recién después borra las imágenes", async () => {
  storage.deleteAllBlobs.mockImplementation(async () => {
    expect(bd.servicios).toEqual(["semilla"]);
    expect(bd.banners).toEqual(["semilla"]);
    expect(bd.contador).toBe(0);
  });
  await restoreDemo();
  expect(storage.deleteAllBlobs).toHaveBeenCalledOnce();
});
