import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapDbProperty } from "@/lib/db-mappers";
import { parsePropertyPayload } from "@/lib/api-property";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const row = await prisma.property.findUnique({ where: { id } });
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(mapDbProperty(row));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load property" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const allowedToggleOnly = new Set(["featured", "published", "status", "partial", "mode"]);
    const onlyToggleFields = Object.keys(body).every((k) => allowedToggleOnly.has(k));
    const hasToggle =
      typeof body.featured === "boolean" ||
      typeof body.published === "boolean" ||
      typeof body.status === "string";
    const isToggleOnly = onlyToggleFields && hasToggle && body.title === undefined;

    if (isToggleOnly) {
      const updated = await prisma.property.update({
        where: { id },
        data: {
          ...(typeof body.featured === "boolean" ? { featured: body.featured } : {}),
          ...(typeof body.published === "boolean" ? { published: body.published } : {}),
          ...(typeof body.status === "string" ? { status: body.status } : {}),
        },
      });
      return NextResponse.json(mapDbProperty(updated));
    }

    const merged = { ...mapExistingToPayload(existing), ...body };
    const data = parsePropertyPayload(merged);
    const updated = await prisma.property.update({
      where: { id },
      data,
    });
    return NextResponse.json(mapDbProperty(updated));
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
    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}

function mapExistingToPayload(row: {
  title: string;
  slug: string;
  propertyCode: string;
  status: string;
  featured: boolean;
  published: boolean;
  location: string;
  village: string;
  taluka: string;
  district: string;
  lat: number;
  lng: number;
  priceTotal: number;
  pricePerSqft: number;
  areaSqft: number;
  areaGuntha: number;
  areaAcre: number;
  zoningType: string;
  titleClarity: string;
  roadAccess: boolean;
  gallery: string;
  brochure: string | null;
  highlights: string;
  nearbyLandmarks: string;
  investmentReasoning: string;
  whyThisProperty: string;
  seoTitle: string | null;
  seoDescription: string | null;
}) {
  return {
    title: row.title,
    slug: row.slug,
    propertyCode: row.propertyCode,
    status: row.status,
    featured: row.featured,
    published: row.published,
    location: row.location,
    village: row.village,
    taluka: row.taluka,
    district: row.district,
    lat: row.lat,
    lng: row.lng,
    priceTotal: row.priceTotal,
    pricePerSqft: row.pricePerSqft,
    areaSqft: row.areaSqft,
    areaGuntha: row.areaGuntha,
    areaAcre: row.areaAcre,
    zoningType: row.zoningType,
    titleClarity: row.titleClarity,
    roadAccess: row.roadAccess,
    galleryText: JSON.parse(row.gallery || "[]").join("\n"),
    brochure: row.brochure ?? "",
    highlightsText: JSON.parse(row.highlights || "[]").join("\n"),
    landmarksText: (JSON.parse(row.nearbyLandmarks || "[]") as { name: string; distance: string; type?: string }[])
      .map((l) => `${l.name} | ${l.distance} | ${l.type || "other"}`)
      .join("\n"),
    investmentReasoning: row.investmentReasoning,
    whyThisProperty: row.whyThisProperty,
    seoTitle: row.seoTitle ?? "",
    seoDescription: row.seoDescription ?? "",
  };
}
