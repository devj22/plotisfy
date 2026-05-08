import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapDbProperty } from "@/lib/db-mappers";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const row = await prisma.property.findUnique({ where: { slug } });
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(mapDbProperty(row));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load property" }, { status: 500 });
  }
}
