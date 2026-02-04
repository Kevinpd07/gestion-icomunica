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

// **NUEVA FUNCIÓN: Para llamadas autenticadas**
async function callAuthenticatedAPI(
  endpoint: string,
  method: string = "GET",
  body?: any,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    throw new Error("No autenticado");
  }

  return callStrapiAPI(endpoint, method, body, {
    Authorization: `Bearer ${token}`,
  });
}

// Login
export async function loginAction(formData: FormData) {
  try {
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const result = await callStrapiAPI("/auth/login", "POST", credentials);
    console.log("Resultado del login:", result);

    const token = result.data.token;
    console.log("Token recibido:", token);

    const cookieStore = await cookies();
    cookieStore.set("session_token", token, {
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
    const user = await callAuthenticatedAPI("/auth/verify");
    return user.data.user;
  } catch {
    return null;
  }
}

// **NUEVA FUNCIÓN: Para obtener external-data con autenticación**
export async function getExternalData(limit: number = 1000, page: number = 1) {
  try {
    const data = await callAuthenticatedAPI(
      `/external-data?limit=${limit}&page=${page}`,
    );
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
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
export async function getUsers(
  limit: number = 10,
  page: number = 1,
  search?: string,
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    console.log("🔑 Token:", token ? "✓ Presente" : "✗ Ausente");

    if (!token) {
      throw new Error("No autenticado");
    }

    const apiBase = "http://192.168.0.169:1337/api";
    let apiUrl = `${apiBase}/external-data?limit=${limit}&page=${page}`;

    if (search) {
      apiUrl += `&search=${encodeURIComponent(search)}`;
    }

    console.log("🔍 Llamando a API:", apiUrl);
    console.log("🔑 Usando token:", token ? "✓ Token presente" : "✗ Sin token");

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    console.log("📡 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // 🔍 LOG COMPLETO DE LA RESPUESTA
    console.log("📦 RESPUESTA COMPLETA:", JSON.stringify(data, null, 2));
    console.log("📦 Tipo de data:", typeof data);
    console.log("📦 Es array data?:", Array.isArray(data));
    console.log("📦 data.data existe?:", data.data !== undefined);
    console.log("📦 Tipo de data.data:", typeof data.data);
    console.log("📦 Es array data.data?:", Array.isArray(data.data));

    return { success: true, data };
  } catch (error: any) {
    console.error("❌ Error completo en getUsers:", error);
    return { success: false, error: error.message };
  }
}
