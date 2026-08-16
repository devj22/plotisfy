"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  featuredImage?: string;
  createdAt: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs?published=true")
      .then((r) => r.json())
      .then((data) => setBlogs(Array.isArray(data) ? data : []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#0D2F5B] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">Investment Insights</h1>
            <p className="text-white/70 text-lg">Land market research, buyer guides, and legal explainers from the Plotzify team.</p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F7F3ED]">
          <div className="max-w-5xl mx-auto">
            {loading && (
              <p className="text-center text-[#6B7B94]">Loading articles...</p>
            )}
            {!loading && blogs.length === 0 && (
              <div className="text-center py-16">
                <p className="text-[#6B7B94] text-lg mb-2">No articles published yet.</p>
                <p className="text-[#6B7B94] text-sm">Check back soon for investment insights and market updates.</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="bg-white rounded-2xl border border-[#E2DDD6] overflow-hidden hover:shadow-md transition-shadow group"
                >
                  {blog.featuredImage && (
                    <img src={blog.featuredImage} alt={blog.title} className="w-full h-44 object-cover" />
                  )}
                  <div className="p-5">
                    <span className="text-xs font-semibold text-[#B86A3C] bg-[#B86A3C]/10 px-2 py-1 rounded-full">
                      {blog.category}
                    </span>
                    <h2 className="text-[#162338] font-bold text-base mt-3 mb-2 group-hover:text-[#0D2F5B] transition-colors line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="text-[#6B7B94] text-sm line-clamp-2 mb-4">{blog.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-[#6B7B94]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1 text-[#0D2F5B] font-semibold">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}
