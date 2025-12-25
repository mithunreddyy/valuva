import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton
 * Prevents multiple instances of PrismaClient in development
 * Connection pooling is configured via DATABASE_URL parameters:
 * postgresql://user:password@host:port/db?connection_limit=10&pool_timeout=20
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
