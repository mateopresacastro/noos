/*
  Warnings:

  - A unique constraint covering the columns `[creatorId,name]` on the table `SamplePack` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `SamplePack` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SamplePack" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SamplePack_creatorId_name_key" ON "SamplePack"("creatorId", "name");
