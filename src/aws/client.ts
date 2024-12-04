import { S3Client } from "@aws-sdk/client-s3";
import { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from "@/cfg";
import { isDev, isTest } from "@/utils";

const clientCfg =
  isDev || isTest
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

export default s3;
