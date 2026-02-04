"use server";

import { cookies } from "next/headers";
import { callStrapiAPI } from "./callStrapiAPI";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const credentials = {
    identifier: formData.get("email"),
    password: formData.get("password"),
  };

  if (!credentials.identifier || !credentials.password) {
    return { success: false, error: "Credenciales inválidas" };
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return {
      success: false,
      error: errorData.message || "Error en el inicio de sesión",
    };
  }
  const data = await res.json();

  const cookieStore = await cookies();
  cookieStore.set("session_token", data.jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session_token");
  redirect("/login");
}

export async function getCurrentUser() {
  try {
    const data = await callStrapiAPI("/auth/verify", "GET", undefined, true);

    return data.user;
  } catch {
    return null;
  }
}
/*
export async function getExternalData() {
  return callStrapiAPI(
    "/api/external-data?limit=1000&page=1",
    "GET",
    undefined,
    true, // 👈 protegido
  );
}*/
