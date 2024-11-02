/*
  Warnings:

  - Added the required column `imgUrl` to the `SamplePack` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SamplePack" ADD COLUMN     "imgUrl" TEXT NOT NULL;
