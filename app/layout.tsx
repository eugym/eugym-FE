import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "./api/lib/queryClient";

// One family, two widths. Archivo's width axis gives display type stamped-plate
// presence without importing a second face — see DESIGN.md § Type.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
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
  return (
    <html lang="en">
      <body className={`${archivo.variable} font-sans antialiased`}>
        <Toaster position="top-right" />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
