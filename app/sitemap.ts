import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-data";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://nie-danmark.dk";

const STATIC_ROUTES: {
  url: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
}[] = [
  { url: "/", priority: 1.0, changeFrequency: "weekly" },
  { url: "/priser", priority: 0.9, changeFrequency: "monthly" },
  { url: "/hvordan-det-virker", priority: 0.9, changeFrequency: "monthly" },
  { url: "/ansogning", priority: 0.95, changeFrequency: "monthly" },
  { url: "/om-os", priority: 0.7, changeFrequency: "monthly" },
  { url: "/kontakt", priority: 0.8, changeFrequency: "monthly" },
  { url: "/faq", priority: 0.8, changeFrequency: "weekly" },
  { url: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { url: "/privatlivspolitik", priority: 0.3, changeFrequency: "yearly" },
  { url: "/handelsbetingelser", priority: 0.3, changeFrequency: "yearly" },
  { url: "/cookiepolitik", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ url, priority, changeFrequency }) => ({
      url: `${BASE_URL}${url}`,
      lastModified: now,
      changeFrequency,
      priority,
    })
  );

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}
