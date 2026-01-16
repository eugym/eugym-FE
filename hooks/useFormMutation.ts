"use client";

import { HttpMethod, request } from "@/app/api/lib/request";
import { useMutation } from "@tanstack/react-query";

interface FormMutationOptions<TPayload, TResponse> {
  url: string;
  method?: HttpMethod;
  auth?: boolean;
  onSuccess?: (data: TResponse) => void;
  onError?: (error: Error) => void;
}

export function useFormMutation<TPayload, TResponse>({
  url,
  method = "POST",
  auth = true,
  onSuccess,
  onError,
}: FormMutationOptions<TPayload, TResponse>) {
  return useMutation<TResponse, Error, TPayload>({
    mutationFn: (payload) =>
      request<TResponse, TPayload>({
        url,
        method,
        payload,
        auth,
      }),
    onSuccess,
    onError,
  });
}
