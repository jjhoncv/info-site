import loginAttemptRepository from "./LoginAttempt.repository";

export const MAX_ATTEMPTS = 5;
export const WINDOW_MINUTES = 15;

// Mayúsculas y espacios no deben dar intentos nuevos.
const normalizar = (username: string) => username.trim().toLowerCase().slice(0, 100);
const desde = (now: Date) => new Date(now.getTime() - WINDOW_MINUTES * 60_000);

export class LoginAttemptModel {
  /** Bloqueado: 5 o más claves incorrectas en los últimos 15 minutos. */
  async isBlocked(username: string, now = new Date()): Promise<boolean> {
    return (await loginAttemptRepository.countFailures(normalizar(username), desde(now))) >= MAX_ATTEMPTS;
  }

  async recordFailure(username: string, now = new Date()): Promise<void> {
    await loginAttemptRepository.addFailure(normalizar(username), now);
    await loginAttemptRepository.deleteOlderThan(desde(now));
  }

  async clear(username: string): Promise<void> {
    await loginAttemptRepository.clearFailures(normalizar(username));
  }
}

const loginAttemptModel = new LoginAttemptModel();
export default loginAttemptModel;
