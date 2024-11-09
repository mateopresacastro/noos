"use server";

import "server-only";
import { z } from "zod";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createPaymentLink, createProduct } from "@/lib/stripe/queries/mod";
import {
  addSampleToSamplePack,
  createSamplePack,
  deleteSamplePack,
  readUser,
  updateSamplePack,
} from "@/lib/db/queries/mod";

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
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("User not signed in");
    deleteSamplePackActionSchema.parse({ samplePackName, userName });
    const user = await readUser({ clerkId });
    if (!user) throw new Error("User not found");
    if (user.userName !== userName) throw new Error("User not authorized");
    const deletedPack = await deleteSamplePack({
      samplePackName,
      userName,
    });

    if (!deletedPack) throw new Error("Error deleting sample pack");
  } catch (error) {
    console.error("Error updating sample pack", {
      error,
      userName,
      samplePackName,
    });

    // The action will be consumed by TanStack Query
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
  updateSamplePackData: UpdateSamplePackActionSchema
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("User not signed in");
    updateSamplePackActionSchema.parse(updateSamplePackData);
    const user = await readUser({ clerkId });
    if (!user) throw new Error("User not found");
    if (user.userName !== updateSamplePackData.userName) {
      throw new Error("User not authorized");
    }

    const updatedPack = await updateSamplePack({
      ...updateSamplePackData,
      userId: user.id,
    });

    if (!updatedPack) throw new Error("Error updating sample pack");
    return updatedPack.name;
  } catch (error) {
    console.error("Error updating sample pack", {
      error,
      updateSamplePackData,
    });

    // The action will be consumed by TanStack Query
    // No message for security
    throw new Error();
  }
}

const persistSamplePackDataActionSchema = z.object({
  samplePack: z.object({
    name: z.string(),
    description: z.string().optional(),
    price: z.number(),
    imgUrl: z.string(),
    title: z.string(),
    url: z.string(),
  }),
  samples: z.array(z.object({ url: z.string() })),
});

type SamplePackData = z.infer<typeof persistSamplePackDataActionSchema>;

export async function persistSamplePackDataAction(
  samplePackData: SamplePackData
) {
  try {
    const user = await currentUser();
    if (!user || !user.username) {
      throw new Error("User not found or username not set");
    }

    persistSamplePackDataActionSchema.parse(samplePackData);
    const {
      samplePack: { name, description, price, imgUrl, title, url },
      samples,
    } = samplePackData;

    const userData = await readUser({ clerkId: user.id });
    if (!userData || !userData.stripeId) {
      throw new Error("User not found or stripeId not set");
    }

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
