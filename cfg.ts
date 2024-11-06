import "server-only";

export const CLERK_WEBHOOK_SECRET = getEnvVar("CLERK_WEBHOOK_SECRET");
export const STRIPE_SECRET_KEY = getEnvVar("STRIPE_SECRET_KEY");
export const AWS_REGION = getEnvVar("AWS_REGION");
export const AWS_ACCESS_KEY_ID = getEnvVar("AWS_ACCESS_KEY_ID");
export const AWS_SECRET_ACCESS_KEY = getEnvVar("AWS_SECRET_ACCESS_KEY");
export const AWS_PRIVATE_BUCKET_ARN = getEnvVar("AWS_PRIVATE_BUCKET_ARN");
export const AWS_PRIVATE_BUCKET_NAME = getEnvVar("AWS_PRIVATE_BUCKET_NAME");
export const AWS_PUBLIC_BUCKET_ARN = getEnvVar("AWS_PUBLIC_BUCKET_ARN");
export const AWS_PUBLIC_BUCKET_NAME = getEnvVar("AWS_PUBLIC_BUCKET_NAME");
export const AWS_PUBLIC_BUCKET_URL = getEnvVar("AWS_PUBLIC_BUCKET_URL");
export const HOST_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://noos-three.vercel.app";

function getEnvVar(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Please add ${name} to .env`);
  }
  return value;
}
