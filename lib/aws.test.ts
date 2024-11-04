import {
  s3,
  listBuckets,
  createPresignedUrl,
  getObject,
  deleteObject,
} from "@/lib/aws";

import {
  CreateBucketCommand,
  DeleteBucketCommand,
  ListBucketsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

async function deleteBuckets() {
  try {
    const data = await s3.send(new ListBucketsCommand({}));
    if (data.Buckets) {
      for (const bucket of data.Buckets) {
        await s3.send(new DeleteBucketCommand({ Bucket: bucket.Name }));
      }
    }
  } catch (error) {
    console.error("Error deleting all buckets:", error);
  }
}

describe("AWS S3 integration tests with LocalStack", () => {
  beforeAll(async () => {
    await deleteBuckets();
    await s3.send(new CreateBucketCommand({ Bucket: "test-bucket" }));
  });

  afterAll(async () => {
    await deleteBuckets();
  });

  describe("listBuckets", () => {
    it("should return a list of buckets", async () => {
      const result = await listBuckets();
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ Name: "test-bucket" }),
        ])
      );
    });
  });

  describe("createPresignedUrl", () => {
    it("should create a presigned URL", async () => {
      const url = await createPresignedUrl({
        bucketName: "test-bucket",
        key: "test-key",
      });
      expect(url).toContain("http://localhost:4566");
    });
  });

  describe("getObject", () => {
    it("should retrieve object data", async () => {
      await s3.send(
        new PutObjectCommand({
          Bucket: "test-bucket",
          Key: "test-key",
          Body: "sample-data",
        })
      );
      const data = await getObject({
        bucketName: "test-bucket",
        key: "test-key",
      });
      expect(data).toBeDefined();
    });
  });

  describe("deleteObject", () => {
    it("should delete an object", async () => {
      await s3.send(
        new PutObjectCommand({
          Bucket: "test-bucket",
          Key: "test-key",
          Body: "sample-data",
        })
      );
      const result = await deleteObject({
        bucketName: "test-bucket",
        key: "test-key",
      });
      expect(result).toBeDefined();
    });
  });
});
