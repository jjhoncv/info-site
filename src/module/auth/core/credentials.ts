import bcrypt from "bcryptjs";

// Un solo usuario demo (ADR 0005): usuario y hash bcrypt vienen de las variables de Netlify.
export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const demoUser = process.env.DEMO_USER;
  const hash = process.env.DEMO_PASSWORD_HASH;
  if (!demoUser || !hash) return false;
  // Se compara la clave siempre, aunque el usuario no coincida, para que el tiempo no delate cuál falló.
  const claveOk = await bcrypt.compare(password, hash);
  return claveOk && username === demoUser;
}
