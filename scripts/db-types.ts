// Genera los tipos de la base (ADR 0004): `npm run db:types` con la base local ya migrada.
// src/types/database: tal cual la BD (snake_case, null). src/types/domain: camelCase y sin null
// (una columna que admite NULL pasa a opcional), que es lo que ve el resto del código.
import { mkdirSync, writeFileSync } from "node:fs";
import { Client } from "@rmp135/sql-ts";

const connection = {
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

const base = {
  client: "mysql2",
  connection,
  tableNameCasing: "pascal",
  singularTableNames: true,
  globalOptionality: "required" as const,
};

const SALIDAS = [
  { carpeta: "src/types/database", config: { interfaceNameFormat: "${table}Row" }, dominio: false },
  { carpeta: "src/types/domain", config: { columnNameCasing: "camel", interfaceNameFormat: "${table}" }, dominio: true },
];

for (const { carpeta, config, dominio } of SALIDAS) {
  const ts = await Client.fromConfig({ ...base, ...config })
    .fetchDatabase()
    .mapSchemas((s) => ({ ...s, tables: s.tables.filter((t) => !/^guardian/i.test(t.name.replaceAll("_", ""))) }))
    .mapColumns((c) => {
      // JSON llega como arreglo de textos (mysql2 lo convierte solo).
      const propertyType = c.name === "includes" ? "string[]" : c.propertyType;
      return dominio && c.nullable ? { ...c, propertyType, nullable: false, optional: true } : { ...c, propertyType };
    })
    .toTypescript();
  mkdirSync(carpeta, { recursive: true });
  writeFileSync(`${carpeta}/index.ts`, ts);
  console.log(`✓ ${carpeta}`);
}
process.exit(0);
