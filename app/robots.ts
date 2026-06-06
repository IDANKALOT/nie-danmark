import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://nie-danmark.dk";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // General crawlers: allow all public pages, block private areas
        userAgent: "*",
        allow: ["/", "/blog/", "/faq", "/priser", "/om-os", "/kontakt", "/hvordan-det-virker"],
        disallow: [
          "/admin/",
          "/dashboard/",
          "/api/",
          "/login",
          "/register",
          "/_next/",
        ],
      },
      {
        // Block AI training bots
        userAgent: ["GPTBot", "ChatGPT-User", "CCBot", "anthropic-ai", "Claude-Web"],
        disallow: ["/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
