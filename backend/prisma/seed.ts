import "dotenv/config";
/**
 * Simple seed for dev: creates admin user + sample products.
 * Run: npm run seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("adminpassword", 10);

  await prisma.user.upsert({
    where: { email: "admin@valuva.local" },
    update: {},
    create: {
      email: "admin@valuva.local",
      name: "Admin",
      password: passwordHash,
      role: "ADMIN",
      phone: "9999999999",
    },
  });

  const existing = await prisma.product.count();
  if (existing === 0) {
    await prisma.product.createMany({
      data: [
        {
          title: "Everyday Tee",
          slug: "everyday-tee",
          price: 799,
          category: "Tops",
          stock: 50,
        },
        {
          title: "Studio Trouser",
          slug: "studio-trouser",
          price: 1999,
          category: "Bottoms",
          stock: 30,
        },
      ],
    });
  }

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
