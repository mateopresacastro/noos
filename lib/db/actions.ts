"use server";

import "server-only";
import { z } from "zod";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  addSampleToSamplePack,
  createSamplePack,
  deleteSamplePack,
  readUser,
  updateSamplePack,
} from "@/lib/db/queries/mod";
import { createProduct } from "@/lib/stripe/queries/products";
import { createPaymentLink } from "@/lib/stripe/queries/links";

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
  name: z.string(),
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

type SamplePack = {
  name: string;
  description?: string;
  price: number;
  imgUrl: string;
  title: string;
  url: string;
};

type Sample = {
  url: string;
};

export async function persistSamplePackDataAction({
  samplePack: { name, description, price, imgUrl, title, url },
  samples,
}: {
  samplePack: SamplePack;
  samples: Sample[];
}) {
  try {
    const user = await currentUser();
    if (!user || !user.username) {
      throw new Error("User not found or username not set");
    }

    const userData = await readUser({ clerkId: user.id });
    if (!userData || !userData.stripeId) {
      throw new Error("User not found or stripeId not set");
    }

    // TODO: sanitize inputs
    const stripeProduct = await createProduct({
      title,
      description,
      price,
      imgUrl,
      samplePackName: name,
      userName: user.username,
      clerkId: user.id,
      stripeConnectedAccountId: userData.stripeId,
    });

    if (!stripeProduct) throw new Error("Error creating product");

    const stripePaymentLink = await createPaymentLink(
      stripeProduct.priceId,
      userData.stripeId
    );

    if (!stripePaymentLink) throw new Error("Error creating payment link");

    const newSamplePack = await createSamplePack({
      clerkId: user.id,
      name,
      description,
      price,
      imgUrl,
      title,
      url,
      stripePaymentLink,
    });

    if (!newSamplePack) throw new Error("Error creating sample pack");

    const samplesCreated = await addSampleToSamplePack(
      newSamplePack.id,
      samples
    );

    if (!samplesCreated) throw new Error("Error creating samples");
    return true;
  } catch (error) {
    console.error("Error persisting sample pack data", error);
    throw new Error();
  }
}
