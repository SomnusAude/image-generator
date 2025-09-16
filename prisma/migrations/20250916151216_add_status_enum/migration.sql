/*
  Warnings:

  - The `status` column on the `Image` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('pending', 'done', 'error');

-- AlterTable
ALTER TABLE "public"."Image" DROP COLUMN "status",
ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'pending';
