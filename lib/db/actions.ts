"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { deleteSamplePack, readUser, updateSamplePack } from "@/lib/db/mod";
import "server-only";

const deleteSamplePackActionSchema = z.object({
  samplePackName: z.string(),
  userName: z.string(),
});

type DeleteSamplePackActionSchema = z.infer<
  typeof deleteSamplePackActionSchema
>;

export async function deleteSamplePackAction({
  samplePackName,
  userName,
}: DeleteSamplePackActionSchema) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not signed in");
    }
    deleteSamplePackActionSchema.parse({ samplePackName, userName });

    const user = await readUser({ clerkId: userId });
    if (!user) {
      throw new Error("User not found");
    }

    if (user.userName !== userName) {
      throw new Error("User not authorized");
    }

    const deletedPack = await deleteSamplePack({
      samplePackName,
      userName,
    });

    if (!deletedPack) {
      throw new Error("Error deleting sample pack");
    }
  } catch (error) {
    console.error("Error updating sample pack", {
      error,
      userName,
      samplePackName,
    });

    // I throw here becase this action will be consumed by TanStack Query
    // No message for security
    throw new Error();
  }
}

const updateSamplePackActionSchema = z.object({
  samplePackName: z.string(),
  userName: z.string(),
  title: z.string().min(5).max(50),
  description: z.string().min(5).max(100).optional(),
  price: z.number().min(0),
});

type UpdateSamplePackActionSchema = z.infer<
  typeof updateSamplePackActionSchema
>;

export async function updateSamplePackAction(
  args: UpdateSamplePackActionSchema
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not signed in");
    }

    updateSamplePackActionSchema.parse(args);

    const user = await readUser({ clerkId: userId });
    if (!user) {
      throw new Error("User not found");
    }

    if (user.userName !== args.userName) {
      throw new Error("User not authorized");
    }

    const updatedPack = await updateSamplePack({ ...args, userId: user.id });

    if (!updatedPack) {
      throw new Error("Error updating sample pack");
    }

    return updatedPack.name;
  } catch (error) {
    console.error("Error updating sample pack", {
      error,
      args,
    });

    // I throw here becase this action will be consumed by TanStack Query
    // No message for security
    throw new Error();
  }
}
