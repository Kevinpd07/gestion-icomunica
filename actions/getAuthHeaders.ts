import { cookies } from "next/headers";

export async function getAuthHeaders(extraHeaders?: Record<string, string>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  console.log("Token en getAuthHeaders:", token);

  if (!token) {
    throw new Error("No jwt session_token");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...extraHeaders,
  };
}
