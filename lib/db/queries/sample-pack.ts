import prisma from "@/lib/db/cfg/client";
import { createSamplePackName } from "@/lib/utils";
import "server-only";

export async function createSamplePack({
  clerkId,
  name,
  description,
  price,
  imgUrl,
  title,
  url,
  stripePaymentLink,
}: {
  clerkId: string;
  name: string;
  description?: string;
  price: number;
  imgUrl: string;
  title: string;
  url: string;
  stripePaymentLink: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    console.log("creating sample pack", {
      clerkId,
      name,
      description,
      price,
      imgUrl,
      title,
      url,
      stripePaymentLink,
    });

    const samplePack = await prisma.samplePack.create({
      data: {
        creatorId: user.id,
        name,
        description,
        price,
        imgUrl,
        title,
        url,
        stripePaymentLink,
      },
    });

    return samplePack;
  } catch (error) {
    console.error("Error creating sample pack", error);
    return null;
  }
}

export async function getSamplePack({
  userName,
  samplePackName,
}: {
  userName: string;
  samplePackName: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: { userName },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const data = await prisma.samplePack.findFirst({
      where: {
        creatorId: user.id,
        name: samplePackName,
      },
      include: {
        samples: true,
        creator: {
          select: {
            userName: true,
            imgUrl: true,
          },
        },
      },
    });

    if (!data) throw new Error("Sample pack not found");
    return data;
  } catch (error) {
    console.error("Error getting sample pack", error);
    return null;
  }
}

export async function updateSamplePack({
  name,
  userName,
  title,
  description,
  price,
  userId,
}: {
  name: string;
  userName: string;
  title: string;
  description?: string;
  price: number;
  userId: number;
}) {
  try {
    const samplePack = await prisma.samplePack.findFirst({
      where: {
        creatorId: userId,
        name,
      },
    });

    if (!samplePack) {
      throw new Error("Sample pack not found");
    }

    const updatedPack = await prisma.samplePack.update({
      where: {
        id: samplePack.id,
      },
      data: {
        title,
        description,
        price,
        name: createSamplePackName(title),
      },
    });

    return updatedPack;
  } catch (error) {
    console.error("Error updating sample pack", {
      error,
      name,
      userName,
    });
    return null;
  }
}

export async function deleteSamplePack({
  samplePackName,
  userName,
}: {
  samplePackName: string;
  userName: string;
}) {
  try {
    // TODO try to optimize this
    const user = await prisma.user.findUnique({
      where: { userName },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const samplePack = await prisma.samplePack.findFirst({
      where: {
        creatorId: user.id,
        name: samplePackName,
      },
    });

    if (!samplePack) {
      throw new Error("Sample pack not found");
    }

    const deleteSamples = prisma.sample.deleteMany({
      where: {
        samplePackId: samplePack.id,
      },
    });

    const deleteSamplePack = prisma.samplePack.delete({
      where: {
        id: samplePack.id,
      },
    });

    await prisma.$transaction([deleteSamples, deleteSamplePack]);

    return true;
  } catch (error) {
    console.error("Error deleting sample pack", {
      error,
      samplePackName,
      userName,
    });
    return null;
  }
}
