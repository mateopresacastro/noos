import "server-only";
import log from "@/log";
import prisma from "@/db/client";
import { createSamplePackName } from "@/utils";

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
  samples,
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
  samples: {
    name: string;
    url: string;
    duration: number;
  }[];
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
        samples: {
          create: samples.map(({ name, url, duration }, index) => ({
            url,
            duration,
            title: name, // TODO fix inconsistencies on naming
            order: index,
          })),
        },
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
            duration: true,
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
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { userName },
        select: { id: true, storageUsed: true },
      });

      if (!user) throw new Error("User not found");

      const deletedSamplePack = await tx.samplePack.delete({
        where: {
          creatorId_name: {
            creatorId: user.id,
            name: samplePackName,
          },
        },
        select: {
          totalSize: true,
        },
      });

      const newStorageUsed =
        BigInt(user.storageUsed ?? 0) -
        BigInt(deletedSamplePack.totalSize ?? 0);

      await tx.user.update({
        where: { id: user.id },
        data: {
          storageUsed: newStorageUsed,
        },
      });
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
      select: {
        imgUrl: true,
        name: true,
        userName: true,
        samplePacks: {
          select: {
            title: true,
            imgUrl: true,
            name: true,
            samples: {
              select: {
                title: true,
                duration: true,
                url: true,
              },
            },
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
  samplePackName,
}: {
  userName: string;
  newFileSizeInBytes: bigint;
  samplePackName: string;
}) {
  try {
    await prisma.$transaction(async (tx) => {
      const userData = await tx.user.findUnique({
        where: { userName },
        select: { storageUsed: true, id: true },
      });

      if (!userData) throw new Error("User not found");

      await tx.samplePack.update({
        where: {
          creatorId_name: {
            creatorId: userData.id,
            name: samplePackName,
          },
        },
        data: { totalSize: newFileSizeInBytes },
      });

      const newStorageUsed = userData.storageUsed + BigInt(newFileSizeInBytes);
      await tx.user.update({
        where: {
          userName,
        },
        data: {
          storageUsed: newStorageUsed,
        },
      });
    });

    return true;
  } catch (error) {
    await log.error("Error updating user storage used", {
      error,
      userName,
      newFileSizeInBytes,
      samplePackName,
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

function getSearchableFields(q: string) {
  return q
    .trim()
    .split(" ")
    .filter((word) => word !== " ")
    .join(" | ");
}

export async function searchSamplePacks(q: string, limit = 10) {
  try {
    const search = getSearchableFields(q);
    const result = await prisma.samplePack.findMany({
      where: {
        OR: [{ title: { search } }, { description: { search } }],
      },
      orderBy: {
        _relevance: {
          fields: ["title", "description"],
          sort: "desc",
          search,
        },
      },
      select: {
        description: true,
        imgUrl: true,
        title: true,
        price: true,
        name: true,
        samples: {
          select: {
            title: true,
            duration: true,
            url: true,
          },
        },
        creator: {
          select: {
            userName: true,
          },
        },
      },
      take: limit,
    });

    return result;
  } catch (error) {
    await log.error("Error searching for sample packs", {
      q,
      error,
    });
  }
}

export async function searchUser(q: string, limit = 10) {
  try {
    const search = getSearchableFields(q);
    const result = await prisma.user.findMany({
      where: {
        OR: [{ userName: { search } }, { name: { search } }],
      },
      orderBy: {
        _relevance: {
          fields: ["userName", "name"],
          sort: "desc",
          search,
        },
      },
      select: {
        imgUrl: true,
        userName: true,
        name: true,
      },
      take: limit,
    });

    return result;
  } catch (error) {
    await log.error("Error searching for users", {
      q,
      error,
    });
  }
}

export async function searchSample(q: string, limit = 10) {
  try {
    const search = getSearchableFields(q);
    const result = await prisma.sample.findMany({
      where: {
        title: { search },
      },
      orderBy: {
        _relevance: {
          fields: ["title"],
          sort: "desc",
          search,
        },
      },
      select: {
        title: true,
        duration: true,
        samplePack: {
          select: {
            name: true,
            creator: {
              select: {
                userName: true,
              },
            },
          },
        },
      },
      take: limit,
    });

    return result;
  } catch (error) {
    await log.error("Error searching for users", {
      q,
      error,
    });
  }
}

export async function getAllUsersData() {
  try {
    const result = await prisma.user.findMany({
      select: {
        userName: true,
        createdAt: true,
        samplePacks: {
          select: {
            name: true,
            createdAt: true,
          },
        },
      },
    });

    return result;
  } catch (error) {
    await log.error("Error getting all users data", {
      error,
    });
  }

  return null;
}
