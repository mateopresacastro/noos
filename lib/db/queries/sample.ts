import prisma from "@/lib/db/cfg/client";
import "server-only";

export async function addSampleToSamplePack(
  samplePackId: number,
  samples: { url: string }[]
) {
  try {
    const newSamples = await prisma.sample.createMany({
      data: samples.map(({ url }) => ({ url, samplePackId })),
    });
    if (!newSamples || newSamples.count === 0)
      throw new Error("No samples created");
    return newSamples;
  } catch (error) {
    console.error("Error adding sample to sample pack:", error);
    return null;
  }
}

export async function deleteSample(sampleId: number) {
  try {
    return await prisma.sample.delete({
      where: { id: sampleId },
    });
  } catch (error) {
    console.error("Error deleting sample:", error);
    return null;
  }
}

export async function getSample(sampleId: number) {
  try {
    return await prisma.sample.findUnique({
      where: { id: sampleId },
    });
  } catch (error) {
    console.error("Error retrieving sample:", error);
    return null;
  }
}
