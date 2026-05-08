"use client";

import { useCallback, useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import type { Blog } from "@/types";
import { Plus, Pencil, Eye, EyeOff, ExternalLink, X } from "lucide-react";
import Link from "next/link";

export default function AdminBlogsPage() {
  const [list, setList] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Blog | null | "new">(null);

  const refresh = useCallback(() => {
    setLoading(true);
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((data: Blog[]) => setList(Array.isArray(data) ? data : []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AdminLayout currentPath="/admin/content/blogs">
      <div className="p-6 space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#0D2F5B] text-2xl font-bold">Blog posts</h1>
            <p className="text-[#6B7B94] text-sm">
              {loading ? "Loading…" : `${list.length} posts in database`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="flex items-center gap-2 bg-[#0D2F5B] text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" /> New post
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2DDD6] divide-y divide-[#F7F3ED]">
          {list.map((b) => (
            <div key={b.id} className="p-4 flex items-start gap-4">
              {b.featuredImage && (
                <img src={b.featuredImage} alt="" className="w-20 h-14 object-cover rounded-lg flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-[#162338] font-semibold truncate">{b.title}</h2>
                  {!b.published && (
                    <span className="text-xs bg-[#B86A3C]/10 text-[#B86A3C] px-2 py-0.5 rounded-full">Draft</span>
                  )}
                </div>
                <p className="text-[#6B7B94] text-sm line-clamp-1">{b.excerpt}</p>
                <p className="text-xs text-[#6B7B94] mt-1">
                  /blog/{b.slug} · {b.category}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={async () => {
                    await fetch(`/api/blogs/${b.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ published: !b.published }),
                    });
                    refresh();
                  }}
                  className="p-2 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-[#0D2F5B]"
                  title={b.published ? "Unpublish" : "Publish"}
                >
                  {b.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <Link
                  href={`/blog/${b.slug}`}
                  target="_blank"
                  className="p-2 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-[#0D2F5B]"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setEditing(b)}
                  className="p-2 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-[#B86A3C]"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {!loading && list.length === 0 && (
            <p className="p-8 text-center text-[#6B7B94]">No posts yet. Seed the database or create one.</p>
          )}
        </div>
      </div>

      {editing && (
        <BlogEditorModal
          blog={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        />
      )}
    </AdminLayout>
  );
}

function BlogEditorModal({
  blog,
  onClose,
  onSaved,
}: {
  blog: Blog | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(blog?.title ?? "");
  const [slug, setSlug] = useState(blog?.slug ?? "");
  const [excerpt, setExcerpt] = useState(blog?.excerpt ?? "");
  const [content, setContent] = useState(blog?.content ?? "");
  const [author, setAuthor] = useState(blog?.author ?? "Plotsify");
  const [category, setCategory] = useState(blog?.category ?? "Blog");
  const [tagsText, setTagsText] = useState(blog?.tags.join(", ") ?? "");
  const [featuredImage, setFeaturedImage] = useState(blog?.featuredImage ?? "");
  const [published, setPublished] = useState(blog?.published ?? false);
  const [seoTitle, setSeoTitle] = useState(blog?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(blog?.seoDescription ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!blog) return;
    setTitle(blog.title);
    setSlug(blog.slug);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setAuthor(blog.author);
    setCategory(blog.category);
    setTagsText(blog.tags.join(", "));
    setFeaturedImage(blog.featuredImage ?? "");
    setPublished(blog.published);
    setSeoTitle(blog.seoTitle ?? "");
    setSeoDescription(blog.seoDescription ?? "");
  }, [blog]);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        title,
        slug: slug || undefined,
        excerpt,
        content,
        author,
        category,
        tagsText,
        featuredImage: featuredImage || undefined,
        published,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
      };
      const url = blog ? `/api/blogs/${blog.id}` : "/api/blogs";
      const method = blog ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error || "Save failed");
      }
      onSaved();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl border border-[#E2DDD6] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-[#E2DDD6] sticky top-0 bg-white">
          <h2 className="text-[#0D2F5B] font-bold">{blog ? "Edit post" : "New post"}</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-[#F7F3ED]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <label className="block text-sm">
            <span className="font-medium text-[#162338]">Title *</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-[#162338]">Slug (optional)</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1 w-full border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-[#162338]">Excerpt</span>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="mt-1 w-full border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm resize-none"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-[#162338]">Body</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="mt-1 w-full border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm resize-none"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="font-medium text-[#162338]">Author</span>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="mt-1 w-full border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-[#162338]">Category</span>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm"
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="font-medium text-[#162338]">Tags (comma-separated)</span>
            <input
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              className="mt-1 w-full border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-[#162338]">Featured image URL</span>
            <input
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className="mt-1 w-full border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Published (visible on /blog)
          </label>
          <label className="block text-sm">
            <span className="font-medium text-[#162338]">SEO title</span>
            <input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="mt-1 w-full border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-[#162338]">SEO description</span>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              rows={2}
              className="mt-1 w-full border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm resize-none"
            />
          </label>
        </div>
        <div className="p-4 border-t border-[#E2DDD6] flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-[#6B7B94]">
            Cancel
          </button>
          <button
            type="button"
            disabled={saving || !title.trim()}
            onClick={save}
            className="px-4 py-2 rounded-lg bg-[#B86A3C] text-white text-sm font-semibold disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
