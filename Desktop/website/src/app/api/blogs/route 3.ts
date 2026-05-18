import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapDbBlog } from "@/lib/db-mappers";
import { parseBlogPayload } from "@/lib/api-blog";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get("published") === "true";

    const rows = await prisma.blog.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(rows.map(mapDbBlog));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load blogs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const data = parseBlogPayload(body);
    const created = await prisma.blog.create({ data });
    return NextResponse.json(mapDbBlog(created), { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid payload";
    console.error(e);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
