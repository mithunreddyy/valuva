import {
  DiscountType,
  PrismaClient,
  SectionType,
  UserRole,
} from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  const hashedPassword = await bcrypt.hash("Admin@123", 12);

  await prisma.admin.upsert({
    where: { email: "admin@valuva.com" },
    update: {
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
    create: {
      email: "admin@valuva.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: UserRole.SUPER_ADMIN,
    },
  });
  console.log("✅ Admin created/updated");

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "men" },
      update: {
        description: "Men's clothing collection",
        isActive: true,
        sortOrder: 1,
      },
      create: {
        name: "Men",
        slug: "men",
        description: "Men's clothing collection",
        isActive: true,
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "women" },
      update: {
        description: "Women's clothing collection",
        isActive: true,
        sortOrder: 2,
      },
      create: {
        name: "Women",
        slug: "women",
        description: "Women's clothing collection",
        isActive: true,
        sortOrder: 2,
      },
    }),
  ]);
  console.log("✅ Categories created/updated");

  const subCategories = await Promise.all([
    prisma.subCategory.upsert({
      where: {
        categoryId_slug: {
          categoryId: categories[0].id,
          slug: "t-shirts",
        },
      },
      update: {
        sortOrder: 1,
      },
      create: {
        name: "T-Shirts",
        slug: "t-shirts",
        categoryId: categories[0].id,
        sortOrder: 1,
      },
    }),
    prisma.subCategory.upsert({
      where: {
        categoryId_slug: {
          categoryId: categories[0].id,
          slug: "jeans",
        },
      },
      update: {
        sortOrder: 2,
      },
      create: {
        name: "Jeans",
        slug: "jeans",
        categoryId: categories[0].id,
        sortOrder: 2,
      },
    }),
    prisma.subCategory.upsert({
      where: {
        categoryId_slug: {
          categoryId: categories[1].id,
          slug: "dresses",
        },
      },
      update: {
        sortOrder: 1,
      },
      create: {
        name: "Dresses",
        slug: "dresses",
        categoryId: categories[1].id,
        sortOrder: 1,
      },
    }),
    prisma.subCategory.upsert({
      where: {
        categoryId_slug: {
          categoryId: categories[1].id,
          slug: "tops",
        },
      },
      update: {
        sortOrder: 2,
      },
      create: {
        name: "Tops",
        slug: "tops",
        categoryId: categories[1].id,
        sortOrder: 2,
      },
    }),
  ]);
  console.log("✅ SubCategories created/updated");

  for (let i = 1; i <= 20; i++) {
    const categoryIndex = i % 2; // Fixed: use % 2 since we only have 2 categories
    const sku = `PROD-${i.toString().padStart(3, "0")}`;
    const slug = `product-${i}`;

    const product = await prisma.product.upsert({
      where: { slug },
      update: {
        name: `Product ${i}`,
        description: `High-quality product ${i} with excellent features`,
        basePrice: 999 + i * 100,
        compareAtPrice: 1499 + i * 100,
        brand: i % 2 === 0 ? "Brand A" : "Brand B",
        material: "Cotton",
        categoryId: categories[categoryIndex].id,
        subCategoryId: subCategories[categoryIndex]?.id,
        isActive: true,
        isFeatured: i <= 6,
        isNewArrival: i <= 8,
        totalStock: 100,
      },
      create: {
        name: `Product ${i}`,
        slug,
        description: `High-quality product ${i} with excellent features`,
        basePrice: 999 + i * 100,
        compareAtPrice: 1499 + i * 100,
        sku,
        brand: i % 2 === 0 ? "Brand A" : "Brand B",
        material: "Cotton",
        categoryId: categories[categoryIndex].id,
        subCategoryId: subCategories[categoryIndex]?.id,
        isActive: true,
        isFeatured: i <= 6,
        isNewArrival: i <= 8,
        totalStock: 100,
      },
    });

    // Delete existing primary image if exists, then create new one
    await prisma.productImage.deleteMany({
      where: {
        productId: product.id,
        isPrimary: true,
      },
    });

    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: `https://placehold.co/600x800/png?text=Product+${i}`,
        isPrimary: true,
        sortOrder: 0,
      },
    });

    await Promise.all([
      prisma.productVariant.upsert({
        where: { sku: `${product.sku}-S-BLK` },
        update: {
          size: "S",
          color: "Black",
          colorHex: "#000000",
          price: product.basePrice,
          stock: 25,
          isActive: true,
        },
        create: {
          productId: product.id,
          sku: `${product.sku}-S-BLK`,
          size: "S",
          color: "Black",
          colorHex: "#000000",
          price: product.basePrice,
          stock: 25,
        },
      }),
      prisma.productVariant.upsert({
        where: { sku: `${product.sku}-M-BLK` },
        update: {
          size: "M",
          color: "Black",
          colorHex: "#000000",
          price: product.basePrice,
          stock: 25,
          isActive: true,
        },
        create: {
          productId: product.id,
          sku: `${product.sku}-M-BLK`,
          size: "M",
          color: "Black",
          colorHex: "#000000",
          price: product.basePrice,
          stock: 25,
        },
      }),
      prisma.productVariant.upsert({
        where: { sku: `${product.sku}-L-WHT` },
        update: {
          size: "L",
          color: "White",
          colorHex: "#FFFFFF",
          price: product.basePrice,
          stock: 25,
          isActive: true,
        },
        create: {
          productId: product.id,
          sku: `${product.sku}-L-WHT`,
          size: "L",
          color: "White",
          colorHex: "#FFFFFF",
          price: product.basePrice,
          stock: 25,
        },
      }),
      prisma.productVariant.upsert({
        where: { sku: `${product.sku}-XL-WHT` },
        update: {
          size: "XL",
          color: "White",
          colorHex: "#FFFFFF",
          price: product.basePrice,
          stock: 25,
          isActive: true,
        },
        create: {
          productId: product.id,
          sku: `${product.sku}-XL-WHT`,
          size: "XL",
          color: "White",
          colorHex: "#FFFFFF",
          price: product.basePrice,
          stock: 25,
        },
      }),
    ]);
  }
  console.log("✅ Products and variants created/updated");

  await Promise.all([
    prisma.coupon.upsert({
      where: { code: "WELCOME10" },
      update: {
        description: "10% off for new customers",
        discountType: DiscountType.PERCENTAGE,
        discountValue: 10,
        minPurchase: 500,
        maxDiscount: 200,
        usageLimit: 1000,
        isActive: true,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      create: {
        code: "WELCOME10",
        description: "10% off for new customers",
        discountType: DiscountType.PERCENTAGE,
        discountValue: 10,
        minPurchase: 500,
        maxDiscount: 200,
        usageLimit: 1000,
        isActive: true,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.coupon.upsert({
      where: { code: "FLAT500" },
      update: {
        description: "₹500 off on orders above ₹2000",
        discountType: DiscountType.FIXED_AMOUNT,
        discountValue: 500,
        minPurchase: 2000,
        isActive: true,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      create: {
        code: "FLAT500",
        description: "₹500 off on orders above ₹2000",
        discountType: DiscountType.FIXED_AMOUNT,
        discountValue: 500,
        minPurchase: 2000,
        isActive: true,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);
  console.log("✅ Coupons created/updated");

  // Delete existing sections and recreate them
  await prisma.homepageSection.deleteMany({});

  await prisma.homepageSection.createMany({
    data: [
      {
        type: SectionType.HERO_BANNER,
        title: "Summer Collection 2024",
        subtitle: "Up to 50% off",
        isActive: true,
        sortOrder: 1,
        config: {
          image: "https://placehold.co/1920x600/png?text=Summer+Collection",
          buttonText: "Shop Now",
          buttonLink: "/products",
        },
      },
      {
        type: SectionType.FEATURED_PRODUCTS,
        title: "Featured Products",
        subtitle: "Our best selling items",
        isActive: true,
        sortOrder: 2,
        config: { limit: 12 },
      },
      {
        type: SectionType.NEW_ARRIVALS,
        title: "New Arrivals",
        subtitle: "Check out the latest trends",
        isActive: true,
        sortOrder: 3,
        config: { limit: 12 },
      },
    ],
  });
  console.log("✅ Homepage sections created/updated");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📧 Admin Credentials:");
  console.log("   Email: admin@valuva.com");
  console.log("   Password: Admin@123\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
