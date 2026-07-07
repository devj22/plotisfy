import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const deal = await prisma.deal.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.propertySlug !== undefined && { propertySlug: body.propertySlug }),
        ...(body.originalPrice !== undefined && { originalPrice: Number(body.originalPrice) }),
        ...(body.dealPrice !== undefined && { dealPrice: Number(body.dealPrice) }),
        ...(body.validUntil !== undefined && { validUntil: body.validUntil ? new Date(body.validUntil) : null }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.badge !== undefined && { badge: body.badge }),
        ...(body.published !== undefined && { published: Boolean(body.published) }),
        ...(body.featured !== undefined && { featured: Boolean(body.featured) }),
      },
    });
    return NextResponse.json(deal);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update deal" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.deal.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete deal" }, { status: 500 });
  }
}
