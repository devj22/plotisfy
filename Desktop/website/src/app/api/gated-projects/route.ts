import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const published = searchParams.get("published");
  try {
    const where = published === "true" ? { published: true } : {};
    const projects = await prisma.gatedProject.findMany({ where, orderBy: { createdAt: "desc" } });
    return NextResponse.json(projects);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch gated projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const project = await prisma.gatedProject.create({
      data: {
        slug,
        title: body.title,
        description: body.description ?? "",
        location: body.location ?? "",
        developer: body.developer ?? "",
        totalUnits: Number(body.totalUnits ?? 0),
        priceMin: Number(body.priceMin ?? 0),
        priceMax: Number(body.priceMax ?? 0),
        amenities: JSON.stringify(body.amenities ?? []),
        gallery: JSON.stringify(body.gallery ?? []),
        status: body.status ?? "coming_soon",
        featured: Boolean(body.featured),
        published: Boolean(body.published),
        brochure: body.brochure ?? null,
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
