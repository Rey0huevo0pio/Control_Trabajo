import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  allowedDevOrigins: ['localhost'],
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
     ...config.resolve.alias,
      "react-router-dom": path.resolve(
        __dirname, 
        "src/compat/react-router-dom.tsx",
      ),
    };
    return config;
  },
};

export default nextConfig;
