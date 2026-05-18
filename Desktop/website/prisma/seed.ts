import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [propertyCount, blogCount] = await Promise.all([
    prisma.property.count(),
    prisma.blog.count(),
  ]);
  console.log(`Database ready. ${propertyCount} properties, ${blogCount} blogs.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
