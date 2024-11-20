"use server";

import s3 from "@/lib/aws/client";
import crypto from "node:crypto";
import { AWS_PRIVATE_BUCKET_NAME, AWS_PUBLIC_BUCKET_NAME } from "@/cfg";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { isDev } from "@/lib/utils";
import {
  ListBucketsCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CreateBucketCommand,
} from "@aws-sdk/client-s3";
import "server-only";

const FIVE_MIN_IN_SECONDS = 5 * 60;
const ONE_DAY_IN_SECONDS = 24 * 60 * 60;

(async () => {
  if (!isDev) return;
  await createLocalStackBuckets();
})();

async function createLocalStackBuckets() {
  const buckets = await listBuckets();
  if (buckets && buckets.length > 0) return;
  [AWS_PUBLIC_BUCKET_NAME, AWS_PRIVATE_BUCKET_NAME].forEach(
    async (bucket) =>
      await s3.send(
        new CreateBucketCommand({
          Bucket: bucket,
          CreateBucketConfiguration: {
            LocationConstraint: "eu-central-1",
          },
        })
      )
  );
}

export async function listBuckets() {
  try {
    const data = await s3.send(new ListBucketsCommand({}));
    return data.Buckets;
  } catch (error) {
    console.error("Error listing buckets:", error);
    return null;
  }
}

export async function createPresignedUrl({
  bucketName,
  fileType,
}: {
  bucketName: string;
  fileType: "image" | "samples" | "zip";
}) {
  try {
    const randomPrefix = crypto.randomBytes(16).toString("hex");
    const key = `uploads/${fileType}/${randomPrefix}`;
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const url = await getSignedUrl(s3, command, {
      expiresIn: FIVE_MIN_IN_SECONDS,
    });

    return { url, key };
  } catch (error) {
    console.error("Error creating presigned URL:", error);
    return null;
  }
}

export async function getObject({
  bucketName,
  key,
}: {
  bucketName: string;
  key: string;
}) {
  try {
    const data = await s3.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );

    if (!data) {
      throw new Error("No data in the response");
    }

    return data;
  } catch (error) {
    console.error("Error getting object:", error);
    return null;
  }
}

export async function deleteObject({
  bucketName,
  key,
}: {
  bucketName: string;
  key: string;
}) {
  try {
    const data = await s3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );
    return data;
  } catch (error) {
    console.error("Error deleting object:", error);
    return null;
  }
}

export async function createSamplePackDownloadUrl(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: AWS_PRIVATE_BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3, command, {
      expiresIn: ONE_DAY_IN_SECONDS,
    });

    return url;
  } catch (error) {
    console.error("Error creating presigned URL:", error);
    return null;
  }
}
