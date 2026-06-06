import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

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

// Fallback blog slugs used when the database is unavailable at build time
const FALLBACK_BLOG_SLUGS = [
  "hvad-er-et-nie-nummer",
  "hvordan-faar-man-nie-nummer-spanien",
  "kob-bolig-spanien-dansk-guide",
  "flytning-til-spanien-hvad-skal-man-vide",
  "skat-i-spanien-for-danskere",
  "aabne-bankkonto-spanien-som-udlaending",
  "empadronamiento-spansk-bopael-registrering",
  "residencia-opholdstilladelse-spanien",
  "feriebolig-spanien-juridiske-krav",
  "arbejde-spanien-som-dansker",
  "pension-spanien-dansk-pensionist",
  "nie-nummer-til-boligkob-spansk-ejendom",
  "golden-visa-spanien-alternativer",
  "spansk-sundhedssystem-danskere",
  "nie-nummer-pris-og-tid",
  "nie-ansogning-dokumenter-krav",
  "spansk-NIE-nummer-til-bil-kob",
  "top-10-fejl-nie-ansogning",
  "nie-nummer-online-ansogning",
  "spanien-eller-portugal-flytning",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ url, priority, changeFrequency }) => ({
      url: `${BASE_URL}${url}`,
      lastModified: now,
      changeFrequency,
      priority,
    })
  );

  // Try to fetch live blog posts from the database
  let blogEntries: MetadataRoute.Sitemap;
  try {
    const posts = await db.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    });

    blogEntries = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt ?? post.publishedAt ?? now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // Fall back to the static list when the database is unavailable
    blogEntries = FALLBACK_BLOG_SLUGS.map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  }

  return [...staticEntries, ...blogEntries];
}
