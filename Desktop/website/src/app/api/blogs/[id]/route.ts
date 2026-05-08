import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapDbBlog } from "@/lib/db-mappers";
import { parseBlogPayload } from "@/lib/api-blog";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const row = await prisma.blog.findUnique({ where: { id } });
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(mapDbBlog(row));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load blog" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const toggleOnly =
      Object.keys(body).every((k) => ["published", "partial"].includes(k)) &&
      typeof body.published === "boolean";

    if (toggleOnly) {
      const updated = await prisma.blog.update({
        where: { id },
        data: { published: Boolean(body.published) },
      });
      return NextResponse.json(mapDbBlog(updated));
    }

    const merged = {
      title: existing.title,
      slug: existing.slug,
      excerpt: existing.excerpt,
      content: existing.content,
      author: existing.author,
      category: existing.category,
      tagsText: (JSON.parse(existing.tags || "[]") as string[]).join(", "),
      featuredImage: existing.featuredImage ?? "",
      published: existing.published,
      seoTitle: existing.seoTitle ?? "",
      seoDescription: existing.seoDescription ?? "",
      ...body,
    };
    const data = parseBlogPayload(merged);
    const updated = await prisma.blog.update({ where: { id }, data });
    return NextResponse.json(mapDbBlog(updated));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed";
    console.error(e);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
