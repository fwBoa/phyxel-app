import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
