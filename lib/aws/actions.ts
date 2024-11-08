"use server";

import "server-only";
import { createPresignedUrl } from "@/lib/aws/mod";
import { currentUser } from "@clerk/nextjs/server";
import { AWS_PRIVATE_BUCKET_NAME, AWS_PUBLIC_BUCKET_NAME } from "@/cfg";

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