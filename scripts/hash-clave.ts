// Genera el hash bcrypt para DEMO_PASSWORD_HASH: npm run hash-clave -- 'la-clave'
import bcrypt from "bcryptjs";

const clave = process.argv[2];
if (!clave) {
  console.error("Uso: npm run hash-clave -- '<clave>'");
  process.exit(1);
}
console.log(bcrypt.hashSync(clave, 12));
