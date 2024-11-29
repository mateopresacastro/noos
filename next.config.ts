import { withAxiom } from "next-axiom";
import type { NextConfig } from "next";

const nextConfig: NextConfig = withAxiom({
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
        hostname: "d14g83wf83qv4z.cloudfront.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
});

export default nextConfig;
