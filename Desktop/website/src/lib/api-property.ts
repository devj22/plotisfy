import type { Landmark, Property } from "@/types";
import { slugify } from "@/lib/utils";

function num(v: unknown, fallback = 0): number {
  const n = typeof v === "number" ? v : typeof v === "string" ? parseFloat(v) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v.trim() : fallback;
}

function bool(v: unknown, fallback = false): boolean {
  if (typeof v === "boolean") return v;
  return fallback;
}

function parseLandmarks(text: string): Landmark[] {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const out: Landmark[] = [];
  for (const line of lines) {
    const parts = line.split("|").map((p) => p.trim());
    if (parts.length >= 2) {
      out.push({
        name: parts[0],
        distance: parts[1],
        type: (parts[2] as Landmark["type"]) || "other",
      });
    }
  }
  return out;
}

/** Build Prisma-ready fields from admin wizard / API JSON */
export function parsePropertyPayload(body: Record<string, unknown>): {
  slug: string;
  propertyCode: string;
  title: string;
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
} {
  const title = str(body.title);
  if (!title) throw new Error("Title is required");

  const slug = slugify(str(body.slug) || title);
  const areaSqft = num(body.areaSqft);
  const priceTotal = num(body.priceTotal);
  let pricePerSqft = num(body.pricePerSqft);
  if (!pricePerSqft && areaSqft > 0) pricePerSqft = Math.round(priceTotal / areaSqft);

  const coords = body.coordinates as { lat?: number; lng?: number } | undefined;
  const lat = coords?.lat ?? num(body.lat);
  const lng = coords?.lng ?? num(body.lng);

  let highlights: string[] = [];
  if (Array.isArray(body.highlights)) {
    highlights = body.highlights.map((h) => String(h));
  } else if (typeof body.highlightsText === "string") {
    highlights = body.highlightsText.split("\n").map((l) => l.trim()).filter(Boolean);
  }

  let gallery: string[] = [];
  if (Array.isArray(body.gallery)) {
    gallery = body.gallery.map((g) => String(g)).filter(Boolean);
  } else if (typeof body.galleryText === "string") {
    gallery = body.galleryText
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (gallery.length === 0) {
    gallery = ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"];
  }

  let landmarks: Landmark[] = [];
  if (Array.isArray(body.nearbyLandmarks)) {
    landmarks = body.nearbyLandmarks as Landmark[];
  } else if (typeof body.landmarksText === "string") {
    landmarks = parseLandmarks(body.landmarksText);
  }

  const propertyCode =
    str(body.propertyCode) || `PLT-${Date.now().toString(36).toUpperCase()}`;

  return {
    slug,
    propertyCode,
    title,
    status: str(body.status, "available") || "available",
    featured: bool(body.featured),
    published: bool(body.published, true),
    location: str(body.location, "Panvel"),
    village: str(body.village),
    taluka: str(body.taluka),
    district: str(body.district, "Raigad"),
    lat: lat || 18.99,
    lng: lng || 73.1,
    priceTotal,
    pricePerSqft,
    areaSqft,
    areaGuntha: num(body.areaGuntha) || (areaSqft > 0 ? areaSqft / 1089 : 0),
    areaAcre: num(body.areaAcre) || (areaSqft > 0 ? areaSqft / 43560 : 0),
    zoningType: str(body.zoningType, "Residential"),
    titleClarity: str(body.titleClarity, "clear"),
    roadAccess: bool(body.roadAccess, true),
    gallery: JSON.stringify(gallery),
    brochure: str(body.brochure) || null,
    highlights: JSON.stringify(highlights),
    nearbyLandmarks: JSON.stringify(landmarks),
    investmentReasoning: str(body.investmentReasoning),
    whyThisProperty: str(body.whyThisProperty),
    seoTitle: str(body.seoTitle) || null,
    seoDescription: str(body.seoDescription) || null,
  };
}
