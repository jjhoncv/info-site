import { executeQuery } from "@/src/lib/db";

type Escritura = { affectedRows: number; insertId: number };

// Solo SQL. Las horas van como milisegundos Unix (BIGINT) para no depender de la zona horaria.
class LoginAttemptRepository {
  async countFailures(username: string, since: Date): Promise<number> {
    const filas = await executeQuery<{ total: number }[]>(
      "SELECT COUNT(*) AS total FROM login_attempts WHERE username = ? AND attempted_at > ?",
      [username, since.getTime()],
    );
    return Number(filas[0]?.total ?? 0);
  }

  async addFailure(username: string, at: Date): Promise<void> {
    await executeQuery<Escritura>("INSERT INTO login_attempts (username, attempted_at) VALUES (?, ?)", [username, at.getTime()]);
  }

  async clearFailures(username: string): Promise<void> {
    await executeQuery<Escritura>("DELETE FROM login_attempts WHERE username = ?", [username]);
  }

  async deleteOlderThan(before: Date): Promise<void> {
    await executeQuery<Escritura>("DELETE FROM login_attempts WHERE attempted_at <= ?", [before.getTime()]);
  }
}

const loginAttemptRepository = new LoginAttemptRepository();
export default loginAttemptRepository;
