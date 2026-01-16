// "use client";

// import React from "react";
// import {
//   QueryClient,
//   QueryClientProvider,
//   HydrationBoundary,
//   type DehydratedState,
// } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// export function Providers({
//   children,
//   dehydratedState,
// }: {
//   children: React.ReactNode;
//   dehydratedState?: DehydratedState | null;
// }) {
//   const [queryClient] = React.useState(
//     () =>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             retry: 1,
//             staleTime: 1000 * 60 * 2,
//             refetchOnWindowFocus: false,
//           },
//         },
//       })
//   );

//   return (
//     <QueryClientProvider client={queryClient}>
//       <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
//       <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//   );
// }

// ******* new *********
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
