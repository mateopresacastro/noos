import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "localhost.localstack.cloud",
        port: "4566",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "noos-public-assets-v2.s3.eu-central-1.amazonaws.com",
        port: "",
        pathname: "/**",
      }
    ],
  },
};

export default nextConfig;
