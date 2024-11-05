"use server";
import "server-only";
import crypto from "node:crypto";

import {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  isDev,
  AWS_PRIVATE_BUCKET_NAME,
  AWS_PUBLIC_BUCKET_NAME,
} from "@/cfg";

import {
  ListBucketsCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  S3Client,
  CreateBucketCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { currentUser } from "@clerk/nextjs/server";

const clientCfg = isDev
  ? {
      endpoint: "http://localhost:4566",
      region: "eu-central-1",
      credentials: {
        accessKeyId: "test",
        secretAccessKey: "test",
      },
      forcePathStyle: true,
    }
  : {
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    };

const s3 = new S3Client(clientCfg);

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
