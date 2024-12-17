import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api", "/dashboard", "/_next"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api", "/dashboard", "/_next"],
      },
    ],
    sitemap: "https://noos.im/sitemap.xml",
  };
}
