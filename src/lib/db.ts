import mysql from "mysql2/promise";

// Pool único (ADR 0004). TLS cuando MYSQL_SSL=1 (TiDB Cloud). Se crea al primer uso, no al importar.
let pool: mysql.Pool | undefined;

/** En un preview, la base propia del PR (Guardián, ADR 0014); en staging y producción, MYSQL_DATABASE. */
export function nombreDeLaBase(): string | undefined {
  return process.env.MYSQL_DATABASE_PREVIEW || process.env.MYSQL_DATABASE;
}

function getPool(): mysql.Pool {
  pool ??= mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: nombreDeLaBase(),
    ssl: process.env.MYSQL_SSL === "1" ? { minVersion: "TLSv1.2", rejectUnauthorized: true } : undefined,
    connectionLimit: 5,
  });
  return pool;
}

/** Ejecuta SQL con `?` (nunca concatenes valores). SELECT devuelve filas; INSERT/UPDATE/DELETE, el resultado. */
export async function executeQuery<T = mysql.RowDataPacket[]>(sql: string, params: unknown[] = []): Promise<T> {
  try {
    const [resultado] = await getPool().execute(sql, params as (string | number | null)[]);
    return resultado as T;
  } catch (error) {
    // El detalle (sqlMessage) va al log; quien llama recibe un error genérico.
    console.error("Error de base de datos:", error);
    throw new Error("Error de base de datos");
  }
}

export type Consulta = (sql: string, params?: unknown[]) => Promise<unknown>;

/** Ejecuta `trabajo` en una transacción: todo o nada. Si algo lanza, hace rollback y relanza un error genérico. */
export async function withTransaction(trabajo: (consulta: Consulta) => Promise<void>): Promise<void> {
  const conexion = await getPool().getConnection();
  try {
    await conexion.beginTransaction();
    await trabajo((sql, params = []) => conexion.execute(sql, params as (string | number | null)[]));
    await conexion.commit();
  } catch (error) {
    await conexion.rollback().catch(() => undefined);
    console.error("Error de base de datos (transacción revertida):", error);
    throw new Error("Error de base de datos");
  } finally {
    conexion.release();
  }
}
