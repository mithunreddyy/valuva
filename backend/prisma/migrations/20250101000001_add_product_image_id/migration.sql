-- Add id to product_images if it doesn't exist
-- This migration ensures ProductImage has an id field
-- Note: If the table already has an id, this will be a no-op

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'product_images' AND column_name = 'id'
  ) THEN
    ALTER TABLE "product_images" ADD COLUMN "id" TEXT;
    UPDATE "product_images" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;
    ALTER TABLE "product_images" ALTER COLUMN "id" SET NOT NULL;
    ALTER TABLE "product_images" ADD CONSTRAINT "product_images_pkey" PRIMARY KEY ("id");
  END IF;
END $$;

