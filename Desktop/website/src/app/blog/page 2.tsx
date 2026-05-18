import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import { getPublishedBlogs } from "@/lib/cms";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog – Land Investment Guides & News",
  description: "Insights on Panvel, Khalapur, land investment, and infrastructure in Maharashtra.",
};

export default async function BlogIndexPage() {
  const blogs = await getPublishedBlogs();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F7F3ED]">
        <section className="bg-[#0D2F5B] py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-3">Plotsify Blog</h1>
            <p className="text-white/70">
              Guides, market context, and updates for land investors in Panvel and Khalapur.
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          {blogs.length === 0 ? (
            <p className="text-[#6B7B94] text-center py-12">No published posts yet. Add one from the admin.</p>
          ) : (
            blogs.map((b) => (
              <Link
                key={b.id}
                href={`/blog/${b.slug}`}
                className="block bg-white rounded-2xl border border-[#E2DDD6] p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {b.featuredImage && (
                    <img
                      src={b.featuredImage}
                      alt=""
                      className="w-full sm:w-40 h-32 object-cover rounded-xl flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-[#B86A3C] text-xs font-semibold uppercase">{b.category}</span>
                    <h2 className="text-[#0D2F5B] text-xl font-bold mt-1 mb-2">{b.title}</h2>
                    <p className="text-[#6B7B94] text-sm line-clamp-2">{b.excerpt}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-[#6B7B94]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(b.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span>{b.author}</span>
                      <span className="text-[#0D2F5B] font-semibold flex items-center gap-1 ml-auto">
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </section>
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}
