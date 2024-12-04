import { test, expect } from "@playwright/test";
import { clerk, setupClerkTestingToken } from "@clerk/testing/playwright";

test.describe("Auth", () => {
  test("Should redirect to sign-up page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Start Selling" }).click();
    await expect(
      page.getByRole("heading", { name: "Create your account" })
    ).toBeVisible();
    await page.goto("/");
    await page.getByRole("button", { name: "Sign up" }).click();
    await expect(
      page.getByRole("heading", { name: "Create your account" })
    ).toBeVisible();
    await page.getByRole("link", { name: "Pricing" }).click();
    await page.getByRole("button", { name: "Get started" }).click();
    await expect(
      page.getByRole("heading", { name: "Create your account" })
    ).toBeVisible();
  });

  test("Should protect routes", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(
      page.getByRole("heading", { name: "This page could not be found." })
    ).toBeVisible();
    await page.goto("/dashboard/general");
    await expect(
      page.getByRole("heading", { name: "This page could not be found." })
    ).toBeVisible();
    await page.goto("/upload");
    await expect(
      page.getByRole("heading", { name: "This page could not be found." })
    ).toBeVisible();
    await page.goto("/country");
    await expect(
      page.getByRole("heading", { name: "This page could not be found." })
    ).toBeVisible();
  });
});

test.describe("Signed in", () => {
  test("Should see upload and dashboard buttons", async ({ page }) => {
    await setupClerkTestingToken({ page });
    await page.goto("/");
    await clerk.signIn({
      page,
      signInParams: {
        strategy: "email_code",
        identifier: process.env.CLERK_TEST_USER_EMAIL!,
      },
    });
    await page.waitForURL("/");
    await expect(page.getByRole("link", { name: "Upload" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
  });
});

test.describe("Producer page", () => {
  test("Should render producer page", async ({ page }) => {
    const userName = process.env.CLERK_TEST_USERNAME!;
    await page.goto(`/${userName}`);
    await expect(page.getByText(`@${userName}`)).toBeVisible();
    await expect(page.getByText("Packs")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "sample-pack-1" })
    ).toBeVisible();
  });

  test("Should be able to see settings button when logged in as owner", async ({
    page,
  }) => {
    await setupClerkTestingToken({ page });
    const userName = process.env.CLERK_TEST_USERNAME!;
    await page.goto(`/${userName}`);
    await clerk.signIn({
      page,
      signInParams: {
        strategy: "email_code",
        identifier: process.env.CLERK_TEST_USER_EMAIL!,
      },
    });

    await expect(page.getByTestId("settings-button")).toBeVisible();
  });
});

test.describe("Sample pack page", () => {
  test("Should navigate to the pack page", async ({ page }) => {
    const userName = process.env.CLERK_TEST_USERNAME!;
    await page.goto(`/${userName}`);
    await page.getByRole("link", { name: "sample-pack-1" }).click();
    await page.waitForURL(`/${userName}/sample-pack-1`);
    await expect(page.getByRole("button", { name: "Buy" })).toBeVisible();
    await expect(
      page
        .locator("div")
        .filter({ hasText: /title-1/ })
        .nth(1)
    ).toBeVisible();
  });
});
