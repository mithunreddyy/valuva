require("dotenv").config(); // Add this line!

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log(
    "DATABASE_URL:",
    process.env.DATABASE_URL ? "✅ Found" : "❌ Not found"
  );
  console.log("First 20 chars:", process.env.DATABASE_URL?.substring(0, 20));

  try {
    await prisma.$connect();
    console.log("✅ Database connection successful!");

    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✅ Query successful:", result);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
