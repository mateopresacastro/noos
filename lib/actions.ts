"use server";

import "server-only";
import { z } from "zod";
import log from "@/lib/log";
import { auth, currentUser } from "@clerk/nextjs/server";
import { AWS_PRIVATE_BUCKET_NAME, AWS_PUBLIC_BUCKET_NAME } from "@/cfg";
import { createAccountSession, createOnboardingLink } from "@/lib/stripe";
import { createPresignedUrl } from "@/lib/aws/mod";
import { createPaymentLink, createProduct, updateProduct } from "@/lib/stripe";
import {
  addSampleToSamplePack,
  createSamplePack,
  deleteSamplePack,
  readUser,
  updateSamplePack,
} from "@/lib/db/queries";

export async function createStripeAccountLinkAction() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("User not signed in");
    const data = await readUser(clerkId);
    if (!data || !data.stripeId) throw new Error("User not found");
    const url = await createOnboardingLink(data.stripeId);

    return url;
  } catch (error) {
    log.error("Error creating stripe account link", { error });
    throw new Error();
  }
}

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
    if (!userId) throw new Error("User not signed in");
    deleteSamplePackActionSchema.parse({ samplePackName, userName });
    const user = await readUser(userId);
    if (!user) throw new Error("User not found");
    if (user.userName !== userName) throw new Error("User not authorized");
    const deletedPack = await deleteSamplePack({
      samplePackName,
      userName,
    });

    if (!deletedPack) throw new Error("Error deleting sample pack");
  } catch (error) {
    log.error("Error updating sample pack", {
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
  imgUrl: z.string().url().optional(),
  samplePackName: z.string(),
});

type UpdateSamplePackActionSchema = z.infer<
  typeof updateSamplePackActionSchema
>;

export async function updateSamplePackAction(
  updateData: UpdateSamplePackActionSchema
) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not signed in");
    updateSamplePackActionSchema.parse(updateData);
    const user = await readUser(userId);
    if (!user) throw new Error("User not found");
    if (user.userName !== updateData.userName) {
      throw new Error("User not authorized");
    }

    if (user.stripeId === null) {
      throw new Error("No stripe account linked");
    }

    const updatedProduct = await updateProduct({
      title: updateData.title,
      description: updateData.description,
      price: updateData.price,
      imgUrl: updateData.imgUrl,
      userName: updateData.userName,
      samplePackName: updateData.samplePackName,
      stripeConnectedAccountId: user.stripeId,
      clerkId: userId,
    });

    if (!updatedProduct) throw new Error("Error updating stirpe product");

    const updatedPack = await updateSamplePack({
      ...updateData,
      stripePaymentLink: updatedProduct.newPaymentLink,
      userId: user.id,
    });

    if (!updatedPack) throw new Error("Error updating sample pack on our db");
    return updatedPack.name;
  } catch (error) {
    log.error("Error updating sample pack", {
      error,
      updateData,
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
    key: z.string(),
  }),
  samples: z.array(z.object({ url: z.string() })),
});

type SamplePackData = z.infer<typeof persistSamplePackDataActionSchema>;

export async function persistSamplePackDataAction(
  samplePackData: SamplePackData
) {
  try {
    log.info("persisting data", samplePackData);
    const user = await currentUser();
    if (!user || !user.username) {
      throw new Error("User not found or username not set");
    }

    persistSamplePackDataActionSchema.parse(samplePackData);
    const {
      samplePack: { name, description, price, imgUrl, title, url, key },
      samples,
    } = samplePackData;

    const userData = await readUser(user.id);
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
      key,
    });

    if (!stripeProduct) throw new Error("Error creating product");
    const stripePaymentLink = await createPaymentLink({
      priceId: stripeProduct.priceId,
      stripeConnectedAccountId: userData.stripeId,
      productId: stripeProduct.product.id,
      userName: user.username,
      key,
    });

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
      stripeProductId: stripeProduct.product.id,
    });

    if (!newSamplePack) throw new Error("Error creating sample pack");
    const samplesCreated = await addSampleToSamplePack(
      newSamplePack.id,
      samples
    );

    if (!samplesCreated) throw new Error("Error creating samples");
    return true;
  } catch (error) {
    log.error("Error persisting sample pack data", { error, samplePackData });
    throw new Error();
  }
}

export async function createPreSignedUrlAction(numOfSamples: number) {
  try {
    const user = await currentUser();
    if (!user) throw new Error();

    if (!numOfSamples || typeof numOfSamples !== "number") {
      throw new TypeError(
        `Invalid number of samples. Expected a number, got: ${numOfSamples}`
      );
    }

    const zipFileSignedUrl = await createPresignedUrl({
      bucketName: AWS_PRIVATE_BUCKET_NAME,
      fileType: "zip",
    });
    if (!zipFileSignedUrl) throw new Error("Error creating zip signed URL");

    const imageSignedUrl = await createPresignedUrl({
      bucketName: AWS_PUBLIC_BUCKET_NAME,
      fileType: "image",
    });
    if (!imageSignedUrl) throw new Error("Error creating image signed URL");

    const samplesSignedUrlsPromises = new Array(numOfSamples)
      .fill(null)
      .map(() =>
        createPresignedUrl({
          bucketName: AWS_PUBLIC_BUCKET_NAME,
          fileType: "samples",
        })
      );

    const samplesSignedUrlsSettled = await Promise.allSettled(
      samplesSignedUrlsPromises
    );

    if (
      samplesSignedUrlsSettled.some(
        (result) => result.status === "rejected" || !result.value
      )
    ) {
      throw new Error("Error creating samples signed URLs");
    }

    const samplesSignedUrls = samplesSignedUrlsSettled
      .filter(
        (
          result
        ): result is PromiseFulfilledResult<{ url: string; key: string }> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value);

    return {
      zipFileSignedUrl,
      imageSignedUrl,
      samplesSignedUrls,
    };
  } catch (error) {
    log.error("Error handling create pre-signed URL:", { error });
    // I throw here becase this function will be consumed by TanStack Query
    // No message for security
    throw new Error();
  }
}

const createAccountSessionActionSchema = z.object({
  userName: z.string(),
});

type CreateAccountSessionActionSchema = z.infer<
  typeof createAccountSessionActionSchema
>;

export async function createAccountSessionAction(
  createData: CreateAccountSessionActionSchema
) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not signed in");
    createAccountSessionActionSchema.parse(createData);
    const user = await readUser(userId);
    if (!user) throw new Error("User not found");
    if (user.userName !== createData.userName) {
      throw new Error("User not authorized");
    }

    if (user.stripeId === null) {
      throw new Error("No stripe account linked");
    }

    const clientSecret = await createAccountSession(user.stripeId);
    if (!clientSecret) throw new Error("Error creating account session");

    return clientSecret;
  } catch (error) {
    log.error("Error creating account session", {
      error,
      createData,
    });
    throw new Error();
  }
}
