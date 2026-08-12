import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import TrackedContactLink from "@/components/ui/TrackedContactLink";
import ReadingProgress from "@/components/blog/ReadingProgress";
import BlogShareBar from "@/components/blog/BlogShareBar";
import { getBlogBySlug, getPublishedBlogs } from "@/lib/cms";
import { estimateReadingMinutes, splitParagraphs, parseNumberedParagraph, initials } from "@/lib/blog";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronLeft, ChevronRight, Calendar, Clock, Phone, MessageCircle } from "lucide-react";

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

  const allPublished = await getPublishedBlogs();
  const others = allPublished.filter((b) => b.slug !== post.slug);
  const related = [
    ...others.filter((b) => b.category === post.category),
    ...others.filter((b) => b.category !== post.category),
  ].slice(0, 3);

  const paragraphs = splitParagraphs(post.content);
  const readingMinutes = estimateReadingMinutes(post.content);

  return (
    <>
      <ReadingProgress />
      <Navbar />
      <article className="min-h-screen bg-[#F7F3ED]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-[#E2DDD6]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-1.5 text-xs text-[#6B7B94]">
            <Link href="/" className="hover:text-[#0D2F5B] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-[#0D2F5B] transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#162338] font-medium truncate">{post.category}</span>
          </div>
        </div>

        {/* Hero */}
        <header className="relative gradient-navy text-white px-4 sm:px-6 lg:px-8 py-14 md:py-16 overflow-hidden">
          <div className="absolute -top-16 -right-16 w-72 h-72 bg-[#B86A3C]/10 rounded-full" />
          <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-white/5 rounded-full" />
          <div className="relative max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white font-medium mb-5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> All posts
            </Link>
            <span className="text-[#B86A3C] text-xs font-bold uppercase tracking-widest">{post.category}</span>
            <h1 className="text-3xl md:text-[2.75rem] font-bold mt-3 mb-4 leading-tight">{post.title}</h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-2xl">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-7 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#B86A3C] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {initials(post.author)}
                </div>
                <span className="text-sm text-white/80 font-medium">{post.author}</span>
              </div>
              <span className="flex items-center gap-1.5 text-sm text-white/60">
                <Calendar className="w-4 h-4" />
                {new Date(post.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-white/60">
                <Clock className="w-4 h-4" />
                {readingMinutes} min read
              </span>
            </div>
          </div>
        </header>

        {post.featuredImage && (
          <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImage}
              alt=""
              className="w-full rounded-2xl shadow-lg object-cover max-h-96"
            />
          </div>
        )}

        {/* Body */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Content */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2DDD6] p-6 md:p-10">
            {paragraphs.length > 0 ? (
              <div>
                {paragraphs.map((para, i) => {
                  const numbered = parseNumberedParagraph(para);
                  if (numbered) {
                    return (
                      <div key={i} className="flex gap-3.5 mb-5">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#0D2F5B]/8 text-[#0D2F5B] text-xs font-bold flex items-center justify-center mt-0.5">
                          {numbered.number}
                        </span>
                        <p className="text-[#2c3a4d] text-[16px] leading-[1.8]">{numbered.text}</p>
                      </div>
                    );
                  }
                  return (
                    <p
                      key={i}
                      className={
                        i === 0
                          ? "text-[#162338] text-[19px] leading-[1.7] font-medium mb-6"
                          : "text-[#2c3a4d] text-[16px] leading-[1.8] mb-5"
                      }
                    >
                      {para}
                    </p>
                  );
                })}
              </div>
            ) : (
              <p className="text-[#6B7B94]">Full article body can be added from the admin.</p>
            )}

            {post.tags.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-4 mt-10 pt-6 border-t border-[#E2DDD6]">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <span key={t} className="text-xs bg-[#F7F3ED] text-[#6B7B94] px-2.5 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
                <BlogShareBar title={post.title} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 space-y-5">
            <div className="bg-[#0D2F5B] rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg leading-snug mb-1.5">Have questions about this?</h3>
              <p className="text-white/60 text-sm mb-5">
                Talk to our land investment team — no pressure, just facts.
              </p>
              <div className="space-y-2.5">
                <TrackedContactLink
                  href="tel:+918169693894"
                  className="w-full flex items-center justify-center gap-2 bg-white text-[#0D2F5B] font-bold text-sm py-3 rounded-xl hover:bg-[#F7F3ED] transition-colors"
                >
                  <Phone className="w-4 h-4" /> Call Us
                </TrackedContactLink>
                <TrackedContactLink
                  href="https://wa.me/918169693894"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-sm py-3 rounded-xl hover:bg-[#1eb558] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Us
                </TrackedContactLink>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2DDD6] p-6">
              <h3 className="text-[#0D2F5B] font-bold text-sm mb-3">Explore Listings</h3>
              <div className="space-y-2 text-sm">
                <Link href="/properties" className="flex items-center justify-between text-[#162338] hover:text-[#0D2F5B] py-1.5 group">
                  All Properties <ChevronRight className="w-3.5 h-3.5 text-[#6B7B94] group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link href="/land-deals" className="flex items-center justify-between text-[#162338] hover:text-[#0D2F5B] py-1.5 group">
                  Ongoing Land Deals <ChevronRight className="w-3.5 h-3.5 text-[#6B7B94] group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link href="/book-site-visit" className="flex items-center justify-between text-[#162338] hover:text-[#0D2F5B] py-1.5 group">
                  Book a Site Visit <ChevronRight className="w-3.5 h-3.5 text-[#6B7B94] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <h2 className="text-[#0D2F5B] text-xl font-bold mb-5">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="bg-white rounded-2xl border border-[#E2DDD6] p-5 hover:shadow-md transition-shadow group"
                >
                  <span className="text-xs font-semibold text-[#B86A3C] bg-[#B86A3C]/10 px-2 py-1 rounded-full">
                    {r.category}
                  </span>
                  <h3 className="text-[#162338] font-bold text-base mt-3 mb-2 group-hover:text-[#0D2F5B] transition-colors line-clamp-2">
                    {r.title}
                  </h3>
                  <p className="text-[#6B7B94] text-sm line-clamp-2">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
      <Footer />
      <MobileCTA />
    </>
  );
}
