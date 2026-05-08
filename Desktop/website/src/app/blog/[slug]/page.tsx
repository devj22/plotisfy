import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import { getBlogBySlug } from "@/lib/cms";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronLeft, Calendar } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post || !post.published) return { title: "Post" };
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post || !post.published) notFound();

  return (
    <>
      <Navbar />
      <article className="min-h-screen bg-[#F7F3ED]">
        <div className="bg-white border-b border-[#E2DDD6]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm text-[#0D2F5B] font-medium hover:text-[#B86A3C]"
            >
              <ChevronLeft className="w-4 h-4" /> All posts
            </Link>
          </div>
        </div>

        <header className="bg-[#0D2F5B] text-white px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto">
            <span className="text-[#B86A3C] text-xs font-semibold uppercase">{post.category}</span>
            <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4">{post.title}</h1>
            <p className="text-white/80 text-lg">{post.excerpt}</p>
            <div className="flex items-center gap-4 mt-6 text-sm text-white/60">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span>{post.author}</span>
            </div>
          </div>
        </header>

        {post.featuredImage && (
          <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
            <img
              src={post.featuredImage}
              alt=""
              className="w-full rounded-2xl shadow-lg object-cover max-h-80"
            />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl border border-[#E2DDD6] p-8 prose prose-neutral max-w-none">
            {post.content ? (
              <div className="text-[#162338] text-base leading-relaxed whitespace-pre-wrap">{post.content}</div>
            ) : (
              <p className="text-[#6B7B94]">Full article body can be added from the admin.</p>
            )}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-[#E2DDD6]">
                {post.tags.map((t) => (
                  <span key={t} className="text-xs bg-[#F7F3ED] text-[#6B7B94] px-2 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
      <Footer />
      <MobileCTA />
    </>
  );
}
