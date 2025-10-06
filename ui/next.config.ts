import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  env: {
    // デプロイ後に実際のVercel URLを設定します
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  },
  ...(isProd
    ? {
        basePath: "/weatherApp",
        assetPrefix: "/weatherApp",
      }
    : {}),
};

export default nextConfig;
