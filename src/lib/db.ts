import mysql from "mysql2/promise";

// Pool único (ADR 0004). TLS cuando MYSQL_SSL=1 (TiDB Cloud). Se crea al primer uso, no al importar.
let pool: mysql.Pool | undefined;

function getPool(): mysql.Pool {
  pool ??= mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
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
