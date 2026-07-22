/*
  Warnings:

  - A unique constraint covering the columns `[streamKey]` on the table `Stream` will be added. If there are existing duplicate values, this will fail.
  - The required column `streamKey` was added to the `Stream` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "public"."Stream" ADD COLUMN     "streamKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stream_streamKey_key" ON "public"."Stream"("streamKey");
