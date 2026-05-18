import type { Property, Blog, Landmark } from "@/types";
import type { Property as DbProperty, Blog as DbBlog } from "@prisma/client";

function parseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function mapDbProperty(row: DbProperty): Property {
  return {
    id: row.id,
    slug: row.slug,
    propertyCode: row.propertyCode,
    title: row.title,
    status: row.status as Property["status"],
    featured: row.featured,
    published: row.published,
    location: row.location,
    village: row.village,
    taluka: row.taluka,
    district: row.district,
    coordinates: { lat: row.lat, lng: row.lng },
    priceTotal: row.priceTotal,
    pricePerSqft: row.pricePerSqft,
    areaSqft: row.areaSqft,
    areaGuntha: row.areaGuntha,
    areaAcre: row.areaAcre,
    zoningType: row.zoningType,
    titleClarity: row.titleClarity as Property["titleClarity"],
    roadAccess: row.roadAccess,
    gallery: parseJson<string[]>(row.gallery, []),
    brochure: row.brochure ?? undefined,
    highlights: parseJson<string[]>(row.highlights, []),
    nearbyLandmarks: parseJson<Landmark[]>(row.nearbyLandmarks, []),
    investmentReasoning: row.investmentReasoning,
    whyThisProperty: row.whyThisProperty,
    seoTitle: row.seoTitle ?? undefined,
    seoDescription: row.seoDescription ?? undefined,
    createdAt: row.createdAt.toISOString().slice(0, 10),
    updatedAt: row.updatedAt.toISOString().slice(0, 10),
  };
}

export function mapDbBlog(row: DbBlog): Blog {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    category: row.category,
    tags: parseJson<string[]>(row.tags, []),
    featuredImage: row.featuredImage ?? undefined,
    published: row.published,
    seoTitle: row.seoTitle ?? undefined,
    seoDescription: row.seoDescription ?? undefined,
    createdAt: row.createdAt.toISOString().slice(0, 10),
  };
}
