import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const published = searchParams.get("published");
  try {
    const where = published === "true" ? { published: true } : {};
    const deals = await prisma.deal.findMany({ where, orderBy: { createdAt: "desc" } });
    return NextResponse.json(deals);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch deals" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const deal = await prisma.deal.create({
      data: {
        title: body.title,
        description: body.description ?? "",
        propertySlug: body.propertySlug ?? "",
        originalPrice: Number(body.originalPrice ?? 0),
        dealPrice: Number(body.dealPrice ?? 0),
        validUntil: body.validUntil ? new Date(body.validUntil) : null,
        image: body.image ?? null,
        badge: body.badge ?? "",
        published: Boolean(body.published),
        featured: Boolean(body.featured),
      },
    });
    return NextResponse.json(deal, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create deal" }, { status: 500 });
  }
}
