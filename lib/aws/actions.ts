"use server";

import { createPresignedUrl } from "@/lib/aws/mod";
import { currentUser } from "@clerk/nextjs/server";
import { AWS_PRIVATE_BUCKET_NAME, AWS_PUBLIC_BUCKET_NAME } from "@/cfg";
import { addSampleToSamplePack, createSamplePack } from "@/lib/db/mod";
import "server-only";

export async function handleCreatePreSignedUrl(numOfSamples: number) {
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

    console.log("Signed URLs:", {
      zipFileSignedUrl,
      imageSignedUrl,
      samplesSignedUrls,
    });

    return {
      zipFileSignedUrl,
      imageSignedUrl,
      samplesSignedUrls,
    };
  } catch (error) {
    console.error("Error handling create pre-signed URL:", error);
    // I throw here becase this function will be consumed by TanStack Query
    // No message for security
    throw new Error();
  }
}

type SamplePack = {
  samplePackName: string;
  description?: string;
  price: number;
  imgUrl: string;
  title: string;
  url: string;
};

type Sample = {
  url: string;
};

export async function handlePersistData({
  samplePack: { samplePackName, description, price, imgUrl, title, url },
  samples,
}: {
  samplePack: SamplePack;
  samples: Sample[];
}) {
  try {
    const user = await currentUser();
    if (!user) throw new Error();
    // TODO: sanitize inputs
    const newSamplePack = await createSamplePack({
      clerkId: user.id,
      samplePackName,
      description,
      price,
      imgUrl,
      title,
      url,
    });

    if (!newSamplePack) throw new Error();
    const samplesCreated = await addSampleToSamplePack(
      newSamplePack.id,
      samples
    );

    if (!samplesCreated) throw new Error();
  } catch (error) {
    console.error("Error persisting data", error);
    return null;
  }
}