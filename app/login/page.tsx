import type { Metadata } from "next";
import { LoginForm } from "@/src/module/auth/components/LoginForm";

export const metadata: Metadata = { title: "Iniciar sesión", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-marca-900">Iniciar sesión</h1>
        <p className="text-tinta-suave">Entra al panel de administración con el usuario demo que te dieron.</p>
      </div>
      <LoginForm />
    </main>
  );
}
