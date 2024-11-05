"use server";
import "server-only";
import s3 from "@/lib/aws/client";
import crypto from "node:crypto";
import { isDev, AWS_PRIVATE_BUCKET_NAME, AWS_PUBLIC_BUCKET_NAME } from "@/cfg";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { currentUser } from "@clerk/nextjs/server";
import {
  ListBucketsCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CreateBucketCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";

(async () => {
  if (!isDev) return;
  await createLocalStackBuckets();
  await listAllObjects();
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

  console.log("Buckets created on localstack", await listBuckets());
}

async function listAllObjects() {
  [AWS_PUBLIC_BUCKET_NAME, AWS_PRIVATE_BUCKET_NAME].forEach(async (bucket) => {
    const objects = await s3.send(new ListObjectsCommand({ Bucket: bucket }));
    console.log("Objects in bucket: ", bucket, objects);
  });
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

const FIFTEEN_MIN_IN_SECONDS = 15 * 60;

export async function createPresignedUrl({
  bucketName,
}: {
  bucketName: string;
}) {
  try {
    const randomPrefix = crypto.randomBytes(16).toString("hex");
    const key = `uploads/${randomPrefix}`;
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const url = await getSignedUrl(s3, command, {
      expiresIn: FIFTEEN_MIN_IN_SECONDS,
    });

    return { url, key };
  } catch (error) {
    console.error("Error creating presigned URL:", error);
    return null;
  }
}

export async function handleCreatePreSignedUrl(
  bucket: "private" | "public",
  key: string
) {
  const user = await currentUser();
  if (!user) throw new Error();
  const bucketName =
    bucket === "private" ? AWS_PRIVATE_BUCKET_NAME : AWS_PUBLIC_BUCKET_NAME;

  const result = await createPresignedUrl({ bucketName });
  if (!result) throw new Error();
  return result;
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

    if (!data.Body) {
      throw new Error("No data in the response");
    }

    return data.Body;
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
