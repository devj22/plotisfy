import { prisma } from "@/lib/prisma";
import { mapDbProperty, mapDbBlog } from "@/lib/db-mappers";
import type { Property, Blog } from "@/types";

export async function getAllProperties(): Promise<Property[]> {
  const rows = await prisma.property.findMany({ orderBy: { updatedAt: "desc" } });
  return rows.map(mapDbProperty);
}

export async function getPublishedProperties(): Promise<Property[]> {
  const rows = await prisma.property.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
  });
  return rows.map(mapDbProperty);
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const row = await prisma.property.findUnique({ where: { slug } });
  return row ? mapDbProperty(row) : null;
}

export async function getPropertiesByLocation(location: string): Promise<Property[]> {
  const rows = await prisma.property.findMany({
    where: { published: true, location },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map(mapDbProperty);
}

export async function getAllBlogs(): Promise<Blog[]> {
  const rows = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(mapDbBlog);
}

export async function getPublishedBlogs(): Promise<Blog[]> {
  const rows = await prisma.blog.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapDbBlog);
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const row = await prisma.blog.findUnique({ where: { slug } });
  return row ? mapDbBlog(row) : null;
}
