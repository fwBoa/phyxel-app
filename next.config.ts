import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      // Photos de test (Unsplash)
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Photos uploadées sur Supabase Storage
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default nextConfig;
