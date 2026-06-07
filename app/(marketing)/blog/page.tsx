import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { BLOG_CATEGORIES, BLOG_POSTS } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog – Guides om NIE-nummer og livet i Spanien",
  description:
    "Artikler og guides om NIE-nummer, flytning til Spanien, bolig, skat og hverdagen som dansker i Spanien. Skrevet til dig, der vil have styr på det hele.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("da-DK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const sortedPosts = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const [featured, ...rest] = sortedPosts;

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#0f172a] pt-32 pb-20 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-8">
            <span className="text-[#d4af37]">✓</span>
            <span>Skrevet til danskere i og på vej til Spanien</span>
          </div>
          <h1 className="text-5xl font-bold mb-6">Guides om NIE-nummer og livet i Spanien</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Praktiske artikler om NIE-nummer, flytning, bolig, skat og hverdagen som dansker i Spanien – så du
            kan tage de rigtige beslutninger med ro i maven.
          </p>
        </div>
      </section>

      {/* Category filters */}
      <section className="bg-white border-b border-slate-100 py-6 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/blog"
              className="px-5 py-2 rounded-full text-sm font-semibold bg-[#0f172a] text-white hover:bg-slate-800 transition-colors"
            >
              Alle artikler
            </Link>
            {BLOG_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/blog?kategori=${encodeURIComponent(category)}`}
                className="px-5 py-2 rounded-full text-sm font-semibold border border-slate-200 text-slate-600 hover:border-[#d4af37] hover:text-[#0f172a] transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured post */}
      {featured && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6">
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid md:grid-cols-2 gap-0 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-shadow"
            >
              <div className="bg-[#0f172a] p-10 md:p-12 flex flex-col justify-center text-white">
                <span className="inline-block w-fit bg-[#d4af37] text-[#0f172a] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5">
                  {featured.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-[#d4af37] transition-colors">
                  {featured.title}
                </h2>
                <p className="text-slate-300 mb-6 leading-relaxed">{featured.excerpt}</p>
                <div className="flex items-center gap-5 text-sm text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(featured.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {featured.readTime} min. læsning
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#0f172a] via-slate-700 to-[#d4af37]/30 hidden md:flex items-center justify-center p-12">
                <span className="text-7xl font-bold text-white/10">{featured.category}</span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Post grid */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-12 text-center">Alle artikler</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all"
              >
                <div className="p-7 flex flex-col flex-1">
                  <span className="inline-block w-fit bg-[#0f172a]/5 text-[#0f172a] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-bold text-[#0f172a] mb-3 leading-snug group-hover:text-[#d4af37] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime} min.
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-4">Klar til at komme i gang?</h2>
          <p className="text-slate-600 mb-8">
            Vi guider dig sikkert gennem hele NIE-ansøgningen – fra dokumentation til godkendelse, for en fast
            pris på 210 EUR uden skjulte gebyrer.
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
