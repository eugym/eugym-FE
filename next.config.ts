import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The registration routes were snake_case while every other auth route, and
  // their own API proxies, were kebab-case. Renamed for consistency; these keep
  // any existing link or bookmark working.
  async redirects() {
    return [
      { source: "/auth/user_register", destination: "/auth/register", permanent: true },
      { source: "/auth/company_register", destination: "/auth/company-register", permanent: true },
    ];
  },

  images: {
    // Centre and product photography is stored off-site. next/image refuses any
    // remote host that isn't declared here, so an undeclared host renders as a
    // broken image rather than an obvious error.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
