import { slugify } from "@/lib/utils";

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v.trim() : fallback;
}

function bool(v: unknown, fallback = false): boolean {
  if (typeof v === "boolean") return v;
  return fallback;
}

export function parseBlogPayload(body: Record<string, unknown>) {
  const title = str(body.title);
  if (!title) throw new Error("Title is required");

  const slug = str(body.slug) || slugify(title);
  let tags: string[] = [];
  if (Array.isArray(body.tags)) {
    tags = body.tags.map((t) => String(t));
  } else if (typeof body.tagsText === "string") {
    tags = body.tagsText.split(/[,]/).map((t) => t.trim()).filter(Boolean);
  }

  return {
    title,
    slug,
    excerpt: str(body.excerpt),
    content: str(body.content),
    author: str(body.author, "Plotsify"),
    category: str(body.category, "Blog"),
    tags: JSON.stringify(tags),
    featuredImage: str(body.featuredImage) || null,
    published: bool(body.published, false),
    seoTitle: str(body.seoTitle) || null,
    seoDescription: str(body.seoDescription) || null,
  };
}
