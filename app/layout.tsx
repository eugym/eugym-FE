import "@/app/api/lib/initToken";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
// import { Providers } from "./api/providers";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { QueryProvider } from "./api/lib/queryClient";
import { AuthProvider } from "./providers/authProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "EUGYM",
  description:
    "Nigeria's premier fitness network connecting you to premium gyms, expert trainers, and wellness experiences nationwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const qc = new QueryClient();
  // const dehydratedState = dehydrate(qc);

  if (typeof window !== "undefined") {
  }
  return (
    <>
      <Toaster />

      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* {children} */}
          {/* <Providers>{children}</Providers> */}
          {/* <Providers dehydratedState={dehydratedState}>{children}</Providers> */}
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
        </body>
      </html>
    </>
  );
}
