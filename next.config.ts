import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    // Remove console.logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Handle hydration issues
  reactStrictMode: true,
};

export default nextConfig;
