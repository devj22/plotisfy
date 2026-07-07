import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const project = await prisma.gatedProject.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.developer !== undefined && { developer: body.developer }),
        ...(body.totalUnits !== undefined && { totalUnits: Number(body.totalUnits) }),
        ...(body.priceMin !== undefined && { priceMin: Number(body.priceMin) }),
        ...(body.priceMax !== undefined && { priceMax: Number(body.priceMax) }),
        ...(body.amenities !== undefined && { amenities: JSON.stringify(body.amenities) }),
        ...(body.gallery !== undefined && { gallery: JSON.stringify(body.gallery) }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.featured !== undefined && { featured: Boolean(body.featured) }),
        ...(body.published !== undefined && { published: Boolean(body.published) }),
        ...(body.brochure !== undefined && { brochure: body.brochure }),
      },
    });
    return NextResponse.json(project);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.gatedProject.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
