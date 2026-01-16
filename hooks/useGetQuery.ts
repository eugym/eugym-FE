"use client";

import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/app/api/lib/getRequest";

interface UseGetQueryOptions<TResponse> {
  queryKey: string[];
  url: string;
  enabled?: boolean;
  auth?: boolean;
}

export function useGetQuery(url: string) {
  return useQuery({
    queryKey: ["users", url, true],

    queryFn: getRequest,
  });
}
