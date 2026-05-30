import { getSessionToken } from "./session";

export type HttpMethod = "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestConfig<TPayload> {
  url: string;
  method?: HttpMethod;
  payload?: TPayload;
  auth?: boolean;
}

export async function request<TResponse, TPayload = unknown>({
  url,
  method = "POST",
  payload,
  auth = true,
}: RequestConfig<TPayload>): Promise<TResponse> {
  const token = auth ? getSessionToken() : null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}
