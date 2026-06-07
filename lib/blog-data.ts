/**
 * Static blog content for NIE Danmark.
 *
 * This module is the single source of truth for blog articles rendered at
 * /blog, /blog/[slug] (Danish) and /en/blog, /en/blog/[slug] (English).
 * Content is split by language into blog-data-da.ts and blog-data-en.ts,
 * cross-linked article-by-article via `translationSlug`, and merged here
 * into a single BLOG_POSTS export. SEO metadata (titles/descriptions, FAQ
 * schema, internal linking via relatedSlugs) lives alongside each article.
 */

import { BLOG_POSTS_DA } from "./blog-data-da";
import { BLOG_POSTS_EN } from "./blog-data-en";

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogPost {
  /** URL-safe identifier, e.g. "hvad-er-et-nie-nummer" */
  slug: string;
  /** Language this article is written in */
  locale: "da" | "en";
  /** Slug of the matching article in the other language (cross-link for hreflang & language switching) */
  translationSlug: string;
  /** Display title used as the H1 on the article page */
  title: string;
  /** SEO <title> – can differ slightly from the display title */
  metaTitle: string;
  /** SEO meta description, kept under ~160 characters */
  metaDescription: string;
  /** Short summary shown on cards and used as fallback OG description */
  excerpt: string;
  /** Category label used for grouping/filtering on the index page */
  category: string;
  /** Free-text tags used for related-content signals */
  tags: string[];
  /** ISO 8601 date string, e.g. "2025-04-14" */
  publishedAt: string;
  /** Estimated reading time in minutes */
  readTime: number;
  /** Full article body as semantic HTML */
  content: string;
  /** Frequently asked questions powering FAQPage schema.org markup */
  faqs: BlogFaq[];
  /** Slugs of 2-3 related posts in the same language (must exist in BLOG_POSTS) */
  relatedSlugs: string[];
}

export const BLOG_CATEGORIES = [
  "NIE-nummer",
  "Flytning til Spanien",
  "Bolig & ejendom",
  "Skat & økonomi",
  "Ophold & visum",
  "Pension & senior",
  "Praktiske guides",
] as const;

export const BLOG_POSTS: BlogPost[] = [...BLOG_POSTS_DA, ...BLOG_POSTS_EN];
