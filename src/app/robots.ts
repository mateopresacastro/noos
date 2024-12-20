import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api", "/dashboard", "/_next", "/chunks"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api", "/dashboard", "/_next", "/chunks"],
      },
    ],
    sitemap: "https://noos.im/sitemap.xml",
  };
}
