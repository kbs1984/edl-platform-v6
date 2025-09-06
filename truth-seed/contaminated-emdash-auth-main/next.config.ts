import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "http://dashboard.localhost.localdomain",
    "http://auth.localhost.localdomain",
  ],
};

export default nextConfig;