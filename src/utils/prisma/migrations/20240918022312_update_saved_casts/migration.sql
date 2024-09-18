/*
  Warnings:

  - The primary key for the `saved_casts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `saved_casts` table. All the data in the column will be lost.
  - You are about to drop the column `ownerFid` on the `saved_casts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "saved_casts" DROP CONSTRAINT "saved_casts_pkey",
DROP COLUMN "id",
DROP COLUMN "ownerFid",
ADD CONSTRAINT "saved_casts_pkey" PRIMARY KEY ("castHash", "collectionsId");
