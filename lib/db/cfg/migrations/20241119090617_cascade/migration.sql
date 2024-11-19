-- DropForeignKey
ALTER TABLE "Sample" DROP CONSTRAINT "Sample_samplePackId_fkey";

-- DropForeignKey
ALTER TABLE "SamplePack" DROP CONSTRAINT "SamplePack_creatorId_fkey";

-- AddForeignKey
ALTER TABLE "SamplePack" ADD CONSTRAINT "SamplePack_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_samplePackId_fkey" FOREIGN KEY ("samplePackId") REFERENCES "SamplePack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
