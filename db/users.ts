import prisma from "@/db/client";

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
};

export async function updateUser({ clerkId, name, email }: UpdateUser) {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        clerkId,
      },
      data: {
        name,
        email,
      },
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}

type CreateUser = UpdateUser;

export async function createUser({ clerkId, name, email }: CreateUser) {
  try {
    const newUser = await prisma.user.create({
      data: {
        clerkId,
        name,
        email,
      },
    });
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}
