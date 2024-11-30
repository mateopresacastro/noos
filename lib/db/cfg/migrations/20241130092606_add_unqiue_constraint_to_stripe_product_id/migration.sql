/*
  Warnings:

  - A unique constraint covering the columns `[stripeProductId]` on the table `SamplePack` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SamplePack_stripeProductId_key" ON "SamplePack"("stripeProductId");
