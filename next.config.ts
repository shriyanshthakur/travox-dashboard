import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - Required for LAN access during dev
  allowedDevOrigins: ['192.168.31.23'],
  output: "export",
  basePath: "/travox-dashboard",
  images: { unoptimized: true },
};

export default nextConfig;
