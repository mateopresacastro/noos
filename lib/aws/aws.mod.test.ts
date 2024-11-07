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
  beforeEach(async () => {
    try {
      await s3.send(new CreateBucketCommand({ Bucket: "test-bucket" }));
    } catch (error) {
      console.log(error);
    }
  });

  afterAll(async () => {
    try {
      await s3.send(new DeleteBucketCommand({ Bucket: "test-bucket" }));
    } catch (error) {
      console.error("Error in afterAll bucket deletion", error);
    }
  });

  describe("listBuckets", () => {
    it("should return a list of buckets", async () => {
      const result = await listBuckets();
      console.log("List buckets result on test", result);
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
      const putObjectResult = await s3.send(
        new PutObjectCommand({
          Bucket: "test-bucket",
          Key: "test-key",
          Body: "sample-data",
        })
      );

      console.log("getObject put object check", putObjectResult);
      const data = await getObject({
        bucketName: "test-bucket",
        key: "test-key",
      });

      console.log("getObject", { data });
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
