import {
  DiscountType,
  PrismaClient,
  Product,
  ProductVariant,
  SectionType,
  UserRole,
} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  const hashedPassword = await bcrypt.hash("Admin@123", 12);

  const admin = await prisma.admin.create({
    data: {
      email: "admin@valuva.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: UserRole.SUPER_ADMIN,
    },
  });
  console.log("✅ Admin created");

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Men",
        slug: "men",
        description: "Men's clothing collection",
        isActive: true,
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: "Women",
        slug: "women",
        description: "Women's clothing collection",
        isActive: true,
        sortOrder: 2,
      },
    }),
  ]);
  console.log("✅ Categories created");

  const subCategories = await Promise.all([
    prisma.subCategory.create({
      data: {
        name: "T-Shirts",
        slug: "t-shirts",
        categoryId: categories[0].id,
        sortOrder: 1,
      },
    }),
    prisma.subCategory.create({
      data: {
        name: "Jeans",
        slug: "jeans",
        categoryId: categories[0].id,
        sortOrder: 2,
      },
    }),
    prisma.subCategory.create({
      data: {
        name: "Dresses",
        slug: "dresses",
        categoryId: categories[1].id,
        sortOrder: 1,
      },
    }),
    prisma.subCategory.create({
      data: {
        name: "Tops",
        slug: "tops",
        categoryId: categories[1].id,
        sortOrder: 2,
      },
    }),
  ]);
  console.log("✅ SubCategories created");

  const products: { product: Product; variants: ProductVariant[] }[] = [];
  for (let i = 1; i <= 20; i++) {
    const categoryIndex = i % 3;
    const product = await prisma.product.create({
      data: {
        name: `Product ${i}`,
        slug: `product-${i}`,
        description: `High-quality product ${i} with excellent features`,
        basePrice: 999 + i * 100,
        compareAtPrice: 1499 + i * 100,
        sku: `PROD-${i.toString().padStart(3, "0")}`,
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

    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: `https://placehold.co/600x800/png?text=Product+${i}`,
        isPrimary: true,
        sortOrder: 0,
      },
    });

    const variants = await Promise.all([
      prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: `${product.sku}-S-BLK`,
          size: "S",
          color: "Black",
          colorHex: "#000000",
          price: product.basePrice,
          stock: 25,
        },
      }),
      prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: `${product.sku}-M-BLK`,
          size: "M",
          color: "Black",
          colorHex: "#000000",
          price: product.basePrice,
          stock: 25,
        },
      }),
      prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: `${product.sku}-L-WHT`,
          size: "L",
          color: "White",
          colorHex: "#FFFFFF",
          price: product.basePrice,
          stock: 25,
        },
      }),
      prisma.productVariant.create({
        data: {
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

    products.push({ product, variants });
  }
  console.log("✅ Products and variants created");

  await prisma.coupon.createMany({
    data: [
      {
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
      {
        code: "FLAT500",
        description: "₹500 off on orders above ₹2000",
        discountType: DiscountType.FIXED_AMOUNT,
        discountValue: 500,
        minPurchase: 2000,
        isActive: true,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    ],
  });
  console.log("✅ Coupons created");

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
  console.log("✅ Homepage sections created");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📧 Admin Credentials:");
  console.log("   Email: admin@ecommerce.com");
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
