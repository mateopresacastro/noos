import "server-only";
import prisma from "@/lib/db/client";
import { createSamplePackName } from "@/lib/utils";

type User = {
  clerkId: string;
};

export async function readUser({ clerkId }: User) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });
    return user;
  } catch (error) {
    console.error("Error reading user:", error);
    return null;
  }
}

export async function deleteUser({ clerkId }: User) {
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        clerkId,
      },
    });
    return deletedUser;
  } catch (error) {
    console.error("Error deleting user:", error);
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
    console.error("Error updating user:", error);
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
    console.error("Error creating user:", error);
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
    console.error(`Error getting sample packs from user: ${userName}`, error);
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

export async function createSamplePack({
  clerkId,
  samplePackName,
  description,
  price,
  imgUrl,
  title,
  url,
}: {
  clerkId: string;
  samplePackName: string;
  description?: string;
  price: number;
  imgUrl: string;
  title: string;
  url: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const samplePack = await prisma.samplePack.create({
      data: {
        creatorId: user.id,
        name: samplePackName,
        description,
        price,
        imgUrl,
        title,
        url,
      },
    });

    return samplePack;
  } catch (error) {
    console.error("Error creating sample pack", error);
    return null;
  }
}

export async function addSampleToSamplePack(
  samplePackId: number,
  samples: { url: string }[]
) {
  try {
    const newSamples = await prisma.sample.createMany({
      data: samples.map(({ url }) => ({
        url,
        samplePackId,
      })),
    });

    if (!newSamples || newSamples.count === 0) {
      throw new Error("No samples created");
    }

    return newSamples;
  } catch (error) {
    console.error("Error adding sample to sample pack", error);
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

export async function updateSamplePack({
  samplePackName,
  userName,
  title,
  description,
  price,
  userId,
}: {
  samplePackName: string;
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
        name: samplePackName,
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
      samplePackName,
      userName,
    });
    return null;
  }
}
