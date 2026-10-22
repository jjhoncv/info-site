const CAMPO = "w-full rounded-tarjeta border border-linea bg-marca-50 px-4 py-3 text-base text-tinta";

// Mi perfil (docs/maquetas/admin.html, vista #perfil). El usuario demo es compartido: no hay
// formulario ni ruta de API para cambiar la clave.
export function ProfileView({ username }: Readonly<{ username: string }>) {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-5 px-4 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-marca-900">Mi perfil</h1>
        <p className="text-tinta-suave">Tus datos de acceso al panel.</p>
      </header>
      <section className="flex flex-col gap-3 rounded-tarjeta bg-white p-5">
        <h2 className="text-xl font-bold text-marca-900">Datos</h2>
        <label htmlFor="perfil-usuario" className="text-sm font-semibold text-marca-900">
          Usuario
        </label>
        <input id="perfil-usuario" value={username} readOnly className={CAMPO} />
      </section>
      <section className="flex flex-col gap-3 rounded-tarjeta bg-white p-5">
        <h2 className="text-xl font-bold text-marca-900">Acceso</h2>
        <p className="rounded-tarjeta bg-marca-50 px-3.5 py-3 text-sm text-marca-800">
          Este es un usuario de <b>demostración</b> compartido: su clave no se puede cambiar. En tu sitio tendrás tu
          propio usuario y podrás cambiarla aquí.
        </p>
      </section>
    </main>
  );
}
