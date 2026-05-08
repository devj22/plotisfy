import { PrismaClient } from "@prisma/client";
import { PROPERTIES, BLOGS } from "../src/lib/data";

const prisma = new PrismaClient();

async function main() {
  for (const p of PROPERTIES) {
    await prisma.property.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        propertyCode: p.propertyCode,
        title: p.title,
        status: p.status,
        featured: p.featured,
        published: p.published,
        location: p.location,
        village: p.village,
        taluka: p.taluka,
        district: p.district,
        lat: p.coordinates.lat,
        lng: p.coordinates.lng,
        priceTotal: p.priceTotal,
        pricePerSqft: p.pricePerSqft,
        areaSqft: p.areaSqft,
        areaGuntha: p.areaGuntha,
        areaAcre: p.areaAcre,
        zoningType: p.zoningType,
        titleClarity: p.titleClarity,
        roadAccess: p.roadAccess,
        gallery: JSON.stringify(p.gallery),
        brochure: p.brochure ?? null,
        highlights: JSON.stringify(p.highlights),
        nearbyLandmarks: JSON.stringify(p.nearbyLandmarks),
        investmentReasoning: p.investmentReasoning,
        whyThisProperty: p.whyThisProperty,
        seoTitle: p.seoTitle ?? null,
        seoDescription: p.seoDescription ?? null,
      },
      update: {
        propertyCode: p.propertyCode,
        title: p.title,
        status: p.status,
        featured: p.featured,
        published: p.published,
        location: p.location,
        village: p.village,
        taluka: p.taluka,
        district: p.district,
        lat: p.coordinates.lat,
        lng: p.coordinates.lng,
        priceTotal: p.priceTotal,
        pricePerSqft: p.pricePerSqft,
        areaSqft: p.areaSqft,
        areaGuntha: p.areaGuntha,
        areaAcre: p.areaAcre,
        zoningType: p.zoningType,
        titleClarity: p.titleClarity,
        roadAccess: p.roadAccess,
        gallery: JSON.stringify(p.gallery),
        brochure: p.brochure ?? null,
        highlights: JSON.stringify(p.highlights),
        nearbyLandmarks: JSON.stringify(p.nearbyLandmarks),
        investmentReasoning: p.investmentReasoning,
        whyThisProperty: p.whyThisProperty,
        seoTitle: p.seoTitle ?? null,
        seoDescription: p.seoDescription ?? null,
      },
    });
  }

  for (const b of BLOGS) {
    await prisma.blog.upsert({
      where: { slug: b.slug },
      create: {
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt,
        content: b.content || "",
        author: b.author,
        category: b.category,
        tags: JSON.stringify(b.tags),
        featuredImage: b.featuredImage ?? null,
        published: b.published,
        seoTitle: b.seoTitle ?? null,
        seoDescription: b.seoDescription ?? null,
      },
      update: {
        title: b.title,
        excerpt: b.excerpt,
        content: b.content || "",
        author: b.author,
        category: b.category,
        tags: JSON.stringify(b.tags),
        featuredImage: b.featuredImage ?? null,
        published: b.published,
        seoTitle: b.seoTitle ?? null,
        seoDescription: b.seoDescription ?? null,
      },
    });
  }

  console.log(`Seeded ${PROPERTIES.length} properties and ${BLOGS.length} blogs.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
