import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "http://dashboard.localhost.localdomain:3001",
    "http://auth.localhost.localdomain:3000",
    "http://auth.emdash.one",
    "http://dashboard.edl.emdash.one",
  ],
  images: {
    domains: ['niyrthumgjmtkjgtlbnq.supabase.co'], 
  },
  devIndicators: {
    position: "top-right",
  },
};

export default nextConfig;