import prisma from "@/lib/db/client";

export function createUser(user: CreateUser) {
  return create(user);
}

export function updateUser(user: UpdateUser) {
  return update(user);
}

export function deleteUser(user: User) {
  return deleteInternal(user);
}

export function readUser(user: User) {
  return read(user);
}

type User = {
  clerkId: string;
};

async function read({ clerkId }: User) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

async function deleteInternal({ clerkId }: User) {
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

async function update({ clerkId, name, email }: UpdateUser) {
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

async function create({ clerkId, name, email }: CreateUser) {
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
