"use server";

import "server-only";

import log from "@/log";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { auth, currentUser } from "@clerk/nextjs/server";
import { AWS_PRIVATE_BUCKET_NAME, AWS_PUBLIC_BUCKET_NAME } from "@/cfg";
import { createPresignedUrl } from "@/aws/mod";
import { headers } from "next/headers";

import {
  createAccountSession,
  createConnectedAccount,
  createPaymentLink,
  createProduct,
  deleteStripeProduct,
  updateProduct,
} from "@/stripe";

import {
  createSamplePack,
  deleteSamplePack,
  readUser,
  storeEmail,
  updateSamplePack,
  updateUserStripeId,
  updateUserUsedStorage,
} from "@/db/mod";

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
    const ok = await deleteSamplePack({
      samplePackName,
      userName,
    });

    if (!ok) throw new Error("Error deleting sample pack");
    if (!user.stripeId) throw new Error("User not linked to stripe");
    // TODO delete stripe product
  } catch (error) {
    await log.error("Error updating sample pack", {
      error,
      userName,
      samplePackName,
    });

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

    if (!updatedProduct) throw new Error("Error updating stripe product");

    const updatedPack = await updateSamplePack({
      ...updateData,
      stripePaymentLink: updatedProduct.newPaymentLink,
      userId: user.id,
    });

    if (!updatedPack) throw new Error("Error updating sample pack on our db");
    return updatedPack.name;
  } catch (error) {
    await log.error("Error updating sample pack", {
      error,
      updateData,
    });

    throw new Error();
  }
}

// TODO: put limits on title length etc
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
  samples: z.array(z.object({ url: z.string(), name: z.string() })),
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
      stripeProductId: stripeProduct.product.id,
      userName: user.username,
      key,
    });

    if (!stripePaymentLink) {
      await deleteStripeProduct({
        stripeProductId: stripeProduct.product.id,
        stripeConnectedAccountId: userData.stripeId,
      });

      throw new Error(
        `Error creating payment link. Stripe product deleted: ${stripeProduct.product.id}`
      );
    }

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
      samples,
    });

    if (!newSamplePack) {
      await deleteStripeProduct({
        stripeProductId: stripeProduct.product.id,
        stripeConnectedAccountId: userData.stripeId,
      });

      throw new Error(
        `Error creating sample pack. Stripe product deleted: ${stripeProduct.product.id}`
      );
    }

    return true;
  } catch (error) {
    await log.error("Error persisting sample pack data", {
      error,
      samplePackData,
    });
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

    // TODO optimize this
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
    await log.error("Error handling create pre-signed URL:", { error });
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
    await log.error("Error creating account session", {
      error,
      createData,
    });
    throw new Error();
  }
}

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, "10 s"),
});

const subscribeToBetaActionSchema = z.object({
  email: z.string().email(),
});

type SubscribeToBetaActionSchema = z.infer<typeof subscribeToBetaActionSchema>;

export async function subscribeToBetaAction(data: SubscribeToBetaActionSchema) {
  try {
    subscribeToBetaActionSchema.parse(data);
    const ip = await getIp();
    if (!ip) throw new Error("Error getting ip");
    const { success } = await ratelimit.limit(ip);
    if (!success) throw new Error("Rate limit exceeded");
    const ok = await storeEmail(data.email);
    if (!ok) throw new Error("Error storing email");
  } catch (error) {
    await log.error("Error subscribing to beta", {
      error,
      data,
    });

    throw new Error();
  }
}

async function getIp() {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  const realIp = h.get("x-real-ip");
  if (forwardedFor) return forwardedFor.split(",").at(0)?.trim();
  if (realIp) return realIp.trim();
  return null;
}

const setCountryActionSchema = z.object({
  country: z.string().min(2).max(10),
});

type SetCountry = z.infer<typeof setCountryActionSchema>;

export default async function setCountryAction(data: SetCountry) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("User not signed in");
    setCountryActionSchema.parse(data);
    const stripeId = await createConnectedAccount({
      clerkId,
      country: data.country,
    });
    if (!stripeId) throw new Error("Error creating connected account");
    const ok = await updateUserStripeId({ clerkId, stripeId });
    if (!ok) throw new Error("Error updating user Stripe ID");
  } catch (error) {
    await log.error("Error setting country", { error, data });
    throw new Error();
  }
}

const updateUserUsedStorageActionSchema = z.object({
  newFileSizeInBytes: z.bigint(),
  samplePackName: z.string(),
});

type UpdateUserUsedStorageActionSchema = z.infer<
  typeof updateUserUsedStorageActionSchema
>;

export async function updateUserUsedStorageAction(
  updateData: UpdateUserUsedStorageActionSchema
) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not signed in");
    updateUserUsedStorageActionSchema.parse(updateData);
    const { newFileSizeInBytes } = updateData;
    const user = await readUser(userId);
    if (!user) throw new Error("User not found");
    const ok = await updateUserUsedStorage({
      userName: user.userName,
      samplePackName: updateData.samplePackName,
      newFileSizeInBytes,
    });

    if (!ok) throw new Error("Error updating user storage used");
  } catch (error) {
    await log.error("Error updating user storage used", {
      error,
      updateData,
    });
    throw new Error();
  }
}
