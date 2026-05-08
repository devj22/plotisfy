import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapDbProperty } from "@/lib/db-mappers";
import { parsePropertyPayload } from "@/lib/api-property";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get("published") === "true";

    const rows = await prisma.property.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    });

    return NextResponse.json(rows.map(mapDbProperty));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load properties" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const data = parsePropertyPayload(body);

    const created = await prisma.property.create({ data });
    return NextResponse.json(mapDbProperty(created), { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid payload";
    console.error(e);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
