import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { BLOG_POSTS, type BlogPost } from "@/lib/blog-data";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://nie-danmark.dk";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("da-DK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return {
      title: "Artiklen blev ikke fundet",
      description: "Den artikel, du leder efter, findes ikke eller er blevet flyttet.",
    };
  }

  const url = `${BASE_URL}/blog/${post.slug}`;

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.metaTitle,
      description: post.metaDescription,
      locale: "da_DK",
      siteName: "NIE Danmark",
      publishedTime: post.publishedAt,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  const url = `${BASE_URL}/blog/${post.slug}`;
  const relatedPosts = post.relatedSlugs
    .map((relatedSlug) => getPost(relatedSlug))
    .filter((related): related is BlogPost => Boolean(related))
    .slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    inLanguage: "da-DK",
    author: {
      "@type": "Organization",
      name: "NIE Danmark",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "NIE Danmark",
      url: BASE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  const faqSchema =
    post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <main className="min-h-screen">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Hero */}
      <section className="bg-[#0f172a] pt-32 pb-16 text-white">
        <div className="max-w-3xl mx-auto px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-[#d4af37] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbage til bloggen
          </Link>
          <span className="inline-block bg-[#d4af37] text-[#0f172a] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
          <p className="text-lg text-slate-300 mb-6 leading-relaxed">{post.excerpt}</p>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime} min. læsning
            </span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <article
            className="prose prose-slate max-w-none
              prose-headings:text-[#0f172a] prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
              prose-p:text-slate-600 prose-p:leading-relaxed
              prose-li:text-slate-600
              prose-strong:text-[#0f172a]
              prose-a:text-[#0f172a] prose-a:underline hover:prose-a:text-[#d4af37]
              prose-blockquote:border-l-[#d4af37] prose-blockquote:text-slate-600 prose-blockquote:not-italic"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-slate-100">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      {post.faqs.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#0f172a] mb-10">Ofte stillede spørgsmål</h2>
            <div className="space-y-4">
              {post.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group border border-slate-200 rounded-xl overflow-hidden bg-white"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors">
                    <span className="font-semibold text-[#0f172a] pr-4">{faq.question}</span>
                    <span className="text-[#d4af37] flex-shrink-0 text-xl">+</span>
                  </summary>
                  <div className="px-6 pb-6 text-slate-600 leading-relaxed">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related articles */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#0f172a] mb-10 text-center">Relaterede artikler</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all"
                >
                  <div className="p-7 flex flex-col flex-1">
                    <span className="inline-block w-fit bg-[#0f172a]/5 text-[#0f172a] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
                      {related.category}
                    </span>
                    <h3 className="text-lg font-bold text-[#0f172a] mb-3 leading-snug group-hover:text-[#d4af37] transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">{related.excerpt}</p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-4 border-t border-slate-100">
                      <Clock className="w-3.5 h-3.5" />
                      {related.readTime} min. læsning
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-4">Klar til at få dit NIE-nummer?</h2>
          <p className="text-slate-600 mb-8">
            Vi guider dig sikkert gennem hele ansøgningsprocessen – fra dokumentation til godkendelse, for en
            fast pris på 210 EUR uden skjulte gebyrer.
          </p>
          <Link
            href="/ansogning"
            className="inline-flex items-center gap-2 bg-[#d4af37] text-[#0f172a] px-8 py-4 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
          >
            Start din ansøgning <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
