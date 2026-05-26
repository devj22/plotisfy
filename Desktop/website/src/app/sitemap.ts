import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://plotzify.com";

  const [properties, blogs] = await Promise.all([
    prisma.property.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.blog.findMany({ where: { published: true }, select: { slug: true, createdAt: true } }),
  ]).catch(() => [[], []]);

  const propertyUrls = (properties as { slug: string; updatedAt: Date }[]).map((p) => ({
    url: `${baseUrl}/properties/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const blogUrls = (blogs as { slug: string; createdAt: Date }[]).map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: b.createdAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/properties`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/locations/panvel`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/locations/khalapur`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/why-invest`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/testimonials`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/faqs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/book-site-visit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    ...propertyUrls,
    ...blogUrls,
  ];
}
