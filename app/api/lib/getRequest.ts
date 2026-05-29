import { QueryFunctionContext } from "@tanstack/react-query";
import { getSessionToken } from "./session";

// interface GetRequestConfig {
//   url: string;
//   auth?: boolean;
// }

export async function getRequest({ queryKey }: QueryFunctionContext) {
  const [, url, auth] = queryKey;
  const token = auth ? getSessionToken() : null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return data;
}
