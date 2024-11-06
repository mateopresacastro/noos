import s3 from "@/lib/aws/client";
import {
  listBuckets,
  createPresignedUrl,
  getObject,
  deleteObject,
} from "@/lib/aws/mod";

import {
  CreateBucketCommand,
  DeleteBucketCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

describe("AWS S3 integration tests with LocalStack", () => {
  beforeAll(async () => {
    await s3.send(new CreateBucketCommand({ Bucket: "test-bucket" }));
  });

  afterAll(async () => {
    await s3.send(new DeleteBucketCommand({ Bucket: "test-bucket" }));
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
      const data = await createPresignedUrl({
        bucketName: "test-bucket",
        fileType: "image",
      });

      expect(data?.url).toContain("http://localhost:4566");
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
