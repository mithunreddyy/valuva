-- AlterTable
ALTER TABLE "admins" ADD COLUMN "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "mfaSecret" TEXT,
ADD COLUMN "backupCodes" TEXT[] DEFAULT ARRAY[]::TEXT[];

