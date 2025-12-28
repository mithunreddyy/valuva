-- AlterTable
ALTER TABLE "products" ADD COLUMN "shortDescription" TEXT,
ADD COLUMN "longDescription" TEXT,
ADD COLUMN "washCareInstructions" TEXT,
ADD COLUMN "specifications" JSONB,
ADD COLUMN "sizeGuide" JSONB,
ADD COLUMN "shippingInfo" JSONB;

