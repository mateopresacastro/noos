import "server-only";
import log from "@/lib/log";
import prisma from "@/lib/db/cfg/client";
import { createSamplePackName } from "@/lib/utils";

export async function createSamplePack({
  clerkId,
  name,
  description,
  price,
  imgUrl,
  title,
  url,
  stripePaymentLink,
  stripeProductId,
}: {
  clerkId: string;
  name: string;
  description?: string;
  price: number;
  imgUrl: string;
  title: string;
  url: string;
  stripePaymentLink: string;
  stripeProductId: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) throw new Error("User not found");
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
        stripeProductId,
      },
    });

    await log.info("Sample pack created", samplePack);

    return samplePack;
  } catch (error) {
    await log.error("Error creating sample pack", { error });
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

    if (!user) throw new Error("User not found");
    const data = await prisma.samplePack.findFirst({
      where: {
        creatorId: user.id,
        name: samplePackName,
      },
      select: {
        title: true,
        imgUrl: true,
        name: true,
        stripePaymentLink: true,
        description: true,
        price: true,
        stripeProductId: true,
        samples: {
          select: {
            url: true,
            title: true,
            order: true,
          },
        },
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
    await log.error("Error getting sample pack", {
      error,
      userName,
      samplePackName,
    });
    return null;
  }
}

export type SamplePack = Awaited<ReturnType<typeof getSamplePack>>;

type SamplePackInput = {
  name: string;
  userName: string;
  title: string;
  description?: string;
  price: number;
  userId: number;
  stripePaymentLink?: string;
};

type UpdateSamplePackData = Pick<
  SamplePackInput,
  "title" | "description" | "price" | "name"
> & {
  stripePaymentLink?: string;
};

export async function updateSamplePack(input: SamplePackInput) {
  try {
    const samplePack = await prisma.samplePack.findFirst({
      where: {
        creatorId: input.userId,
        name: input.name,
      },
    });

    if (!samplePack) {
      throw new Error("Sample pack not found");
    }

    const data: UpdateSamplePackData = {
      title: input.title,
      description: input.description,
      price: input.price,
      name: createSamplePackName(input.title),
    };

    if (input.stripePaymentLink) {
      data.stripePaymentLink = input.stripePaymentLink;
    }

    const updatedPack = await prisma.samplePack.update({
      where: {
        id: samplePack.id,
      },
      data,
    });

    return updatedPack;
  } catch (error) {
    await log.error("Error updating sample pack", {
      error,
      name: input.name,
      userName: input.userName,
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
      select: { id: true, storageUsed: true },
    });

    if (!user) throw new Error("User not found");
    const samplePack = await prisma.samplePack.findFirst({
      where: {
        creatorId: user.id,
        name: samplePackName,
      },
    });

    if (!samplePack) throw new Error("Sample pack not found");
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
    const { totalSize } = samplePack;
    const newStorageUsed =
      BigInt(user.storageUsed ?? 0) - BigInt(totalSize ?? 0);
    await prisma.user.update({
      where: {
        userName,
      },
      data: {
        storageUsed: newStorageUsed,
      },
    });

    return true;
  } catch (error) {
    await log.error("Error deleting sample pack", {
      error,
      samplePackName,
      userName,
    });
    return null;
  }
}

export async function addSampleToSamplePack(
  samplePackId: number,
  samples: { url: string; name: string }[]
) {
  try {
    const newSamples = await prisma.sample.createMany({
      data: samples.map(({ url, name }, index) => ({
        url,
        samplePackId,
        title: name, // TODO fix inconsistencies on naming
        order: index,
      })),
    });
    if (newSamples.count === 0) throw new Error("No samples created");
    return newSamples;
  } catch (error) {
    await log.error("Error adding sample to sample pack:", {
      error,
      samplePackId,
      samples,
    });
    return null;
  }
}

export async function deleteSample(sampleId: number) {
  try {
    return await prisma.sample.delete({
      where: { id: sampleId },
    });
  } catch (error) {
    await log.error("Error deleting sample:", { error });
    return null;
  }
}

export async function getSample(sampleId: number) {
  try {
    return await prisma.sample.findUnique({
      where: { id: sampleId },
    });
  } catch (error) {
    await log.error("Error retrieving sample:", { error, sampleId });
    return null;
  }
}

type CreateUser = {
  clerkId: string;
  name: string;
  email: string;
  userName: string;
  imgUrl: string;
  stripeId?: string;
};

export async function createUser({
  clerkId,
  name,
  email,
  userName,
  imgUrl,
  stripeId,
}: CreateUser) {
  try {
    const newUser = await prisma.user.create({
      data: {
        clerkId,
        name,
        email,
        userName,
        imgUrl,
        stripeId,
      },
    });
    return newUser;
  } catch (error) {
    await log.error("Error creating user:", {
      error,
      clerkId,
      userName,
    });
    return null;
  }
}

export async function readUser(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });
    return user;
  } catch (error) {
    await log.error("Error reading user:", { error, clerkId });
    return null;
  }
}

type UpdateUser = {
  clerkId: string;
  name: string;
  email: string;
  userName: string;
  imgUrl: string;
};

export async function updateUser({
  clerkId,
  name,
  email,
  userName,
  imgUrl,
}: UpdateUser) {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        clerkId,
      },
      data: {
        name,
        email,
        userName,
        imgUrl,
      },
    });
    return updatedUser;
  } catch (error) {
    await log.error("Error updating user:", { error, clerkId });
    return null;
  }
}

type UpdateStripeId = {
  clerkId: string;
  stripeId: string;
};

export async function updateUserStripeId({
  clerkId,
  stripeId,
}: UpdateStripeId) {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        clerkId,
      },
      data: {
        stripeId,
      },
    });
    return updatedUser;
  } catch (error) {
    await log.error("Error updating user Stripe ID:", { error, clerkId });
    return null;
  }
}

export async function deleteUser(clerkId: string) {
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        clerkId,
      },
    });
    return deletedUser;
  } catch (error) {
    await log.error("Error deleting user:", { error, clerkId });
    return null;
  }
}

export async function getData(userName: string) {
  try {
    const data = await prisma.user.findUnique({
      where: { userName },
      include: {
        samplePacks: {
          include: {
            samples: true,
          },
        },
      },
    });

    if (!data) throw new Error("User not found");
    return data;
  } catch (error) {
    await log.error(`Error getting sample packs from user: ${userName}`, {
      error,
      userName,
    });
    return null;
  }
}

export async function storeEmail(email: string) {
  try {
    const newEmail = await prisma.interestedUser.create({
      data: {
        email,
      },
    });

    if (!newEmail) throw new Error("Error storing email");
    return newEmail;
  } catch (error) {
    await log.error("Error storing email", { error, email });
    return null;
  }
}

export async function doesUserHaveStripeAccount(userName: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        userName,
      },
    });

    if (!user) throw new Error("User not found");

    return user.stripeId !== null;
  } catch (error) {
    await log.error("Error checking if user has stripe account", {
      error,
      userName,
    });
    return false;
  }
}

export async function updateUserUsedStorage({
  userName,
  newFileSizeInBytes,
}: {
  userName: string;
  newFileSizeInBytes: bigint;
}) {
  try {
    const userData = await prisma.user.findUnique({
      where: {
        userName,
      },
      select: {
        storageUsed: true,
      },
    });

    if (!userData) throw new Error("User not found");
    const newStorageUsed = userData.storageUsed + BigInt(newFileSizeInBytes);
    const updatedUser = await prisma.user.update({
      where: {
        userName,
      },
      data: {
        storageUsed: newStorageUsed,
      },
    });

    return updatedUser;
  } catch (error) {
    await log.error("Error updating user storage used", {
      error,
      userName,
      newFileSizeInBytes,
    });

    return null;
  }
}

export async function getUserUsedStorage(userName: string) {
  try {
    const userData = await prisma.user.findUnique({
      where: {
        userName,
      },
      select: {
        storageUsed: true,
      },
    });

    if (!userData) throw new Error("User not found");
    return userData.storageUsed;
  } catch (error) {
    await log.error("Error getting user storage used", {
      error,
      userName,
    });
  }
}

export async function increaseTimesSold(stripeProductId: string) {
  try {
    const updatedSamplePack = await prisma.samplePack.update({
      where: {
        stripeProductId,
      },
      data: {
        timesSold: {
          increment: 1,
        },
      },
    });

    return updatedSamplePack;
  } catch (error) {
    await log.error("Error increasing times sold", {
      error,
      stripeProductId,
    });

    return null;
  }
}
