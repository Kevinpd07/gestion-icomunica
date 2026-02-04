import { getAuthHeaders } from "./getAuthHeaders";

export async function callStrapiAPI(
  endpoint: string,
  method: string,
  body?: any,
  protectedRoute = false,
) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  const headers = protectedRoute
    ? await getAuthHeaders()
    : { "Content-Type": "application/json" };

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Error ${response.status}`);
  }

  return response.json();
}
