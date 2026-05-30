import { QueryFunctionContext } from "@tanstack/react-query";
import { getSessionToken } from "./session";
import { apiUrl } from "./url";

export async function getRequest({ queryKey }: QueryFunctionContext) {
  const [, url, auth] = queryKey;
  const token = auth ? getSessionToken() : null;

  const res = await fetch(apiUrl(String(url)), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }

  return res.json();
}
