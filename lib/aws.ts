import "server-only";

import {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  isDev,
} from "@/cfg";

import {
  ListBucketsCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

export const s3 = new S3Client(clientCfg);

export async function listBuckets() {
  try {
    const data = await s3.send(new ListBucketsCommand({}));
    return data.Buckets || [];
  } catch (error) {
    console.error("Error listing buckets:", error);
    return null;
  }
}

export async function createPresignedUrl({
  bucketName,
  key,
}: {
  bucketName: string;
  key: string;
}) {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return url;
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
