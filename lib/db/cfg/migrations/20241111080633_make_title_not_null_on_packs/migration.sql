/*
  Warnings:

  - Made the column `title` on table `Sample` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `SamplePack` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Sample" ALTER COLUMN "title" SET NOT NULL;

-- AlterTable
ALTER TABLE "SamplePack" ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "price" SET DEFAULT 0.0;
