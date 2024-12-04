import { clerkSetup } from "@clerk/testing/playwright";
import { test as setup } from "@playwright/test";

setup("global setup", async () => {
  await clerkSetup({ frontendApiUrl: "http://127.0.0.1:3000" });
});
