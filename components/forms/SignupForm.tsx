'use client'; // Componente de cliente[citation:6]

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signupAction } from '@/actions/auth';

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError('');

    const result = await signupAction(formData);

    if (result.success) {
      // Redirige al dashboard o página principal
      router.push('/dashboard');
      router.refresh(); // Refresca el estado del servidor
    } else {
      setError(result.error || 'Error en el registro');
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center">Crear Cuenta</h2>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            Nombre de usuario
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="w-full p-2 mt-1 border rounded-md"
            placeholder="juanperez"
          />
        </div>
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
            placeholder="tu@email.com"
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
          {isLoading ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>
      <p className="text-sm text-center text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
