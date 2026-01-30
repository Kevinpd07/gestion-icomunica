"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Función helper para llamar a la API
async function callStrapiAPI(
  endpoint: string,
  method: string,
  body?: any,
  headers?: any,
) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Error ${response.status}`);
  }

  return response.json();
}

// Login
export async function loginAction(formData: FormData) {
  try {
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const result = await callStrapiAPI("/auth/login", "POST", credentials);

    const cookieStore = await cookies();
    cookieStore.set("session_token", result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Registro
export async function signupAction(formData: FormData) {
  try {
    const userData = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    return false; /*No usar*/

    const result = await callStrapiAPI("/auth/register", "POST", userData);

    const cookieStore = await cookies();
    cookieStore.set("session_token", result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Obtener usuario actual
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (!token) return null;

    const user = await callStrapiAPI("/auth/verify", "GET", undefined, {
      Authorization: `Bearer ${token}`,
    });

    return user.data.user;
  } catch {
    return null;
  }
}

// Cerrar sesión
export async function logoutAction() {
  "use server";

  try {
    const cookieStore = await cookies();
    cookieStore.delete("session_token");
    redirect("/login");
  } catch (error) {
    console.error("Error en logoutAction:", error);
    redirect("/login");
  }
}
