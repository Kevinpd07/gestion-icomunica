// src/app/login/page.tsx - CORRECTO para LOGIN
import { LoginForm } from '@/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <LoginForm /> {/* ¡IMPORTANTE: Debe ser LoginForm, NO SignupForm! */}
    </div>
  );
}
