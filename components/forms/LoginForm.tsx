"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/actions/auth";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError("");

    const result = await loginAction(formData);

    if (result.success) {
      router.push("/");
      router.refresh();
    } else {
      setError(result.error || "Error en el inicio de sesión");
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full p-2 mt-1 border rounded-md"
            placeholder="tu@email.cu"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full p-2 mt-1 border rounded-md"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>
      <p className="text-sm text-center text-gray-600">
        ¿No tienes cuenta?{" "}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
