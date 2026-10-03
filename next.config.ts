import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Resolve everything from this folder, even if a parent folder has its own lockfile.
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
  agentRules: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
