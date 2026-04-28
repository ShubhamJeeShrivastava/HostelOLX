import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/public/uploads/:path*',
        destination: 'http://127.0.0.1:5000/public/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
