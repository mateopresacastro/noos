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
    await page.waitForURL("/country");
    await expect(
      page.getByRole("heading", { name: "This page could not be found." })
    ).toBeVisible();
  });
});

test.describe("Signed in", () => {
  test("Should see correct header buttons if signed in", async ({ page }) => {
    await setupClerkTestingToken({ page });
    await page.goto("/");
    await clerk.signIn({
      page,
      signInParams: {
        strategy: "email_code",
        identifier: process.env.CLERK_TEST_USER_EMAIL!,
      },
    });
    await Promise.all([
      expect(page.getByRole("link", { name: "Upload" })).toBeVisible(),
      expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible(),
      expect(page.getByRole("button", { name: "Log in" })).not.toBeVisible(),
      expect(page.getByRole("button", { name: "Sign up" })).not.toBeVisible(),
    ]);
  });

  test("Should see correct header buttons when signed out", async ({
    page,
  }) => {
    await page.goto("/");
    await Promise.all([
      expect(page.getByRole("link", { name: "Upload" })).not.toBeVisible(),
      expect(page.getByRole("link", { name: "Dashboard" })).not.toBeVisible(),
      expect(page.getByRole("button", { name: "Log in" })).toBeVisible(),
      expect(page.getByRole("button", { name: "Sign up" })).toBeVisible(),
    ]);
  });
});

test.describe("Producer page", () => {
  test("Should render producer page", async ({ page }) => {
    const userName = process.env.CLERK_TEST_USERNAME!;
    await page.goto(`/${userName}`);
    await Promise.all([
      expect(page.getByText(`@${userName}`)).toBeVisible(),
      expect(page.getByText("Packs")).toBeVisible(),
      expect(page.getByRole("link", { name: "sample-pack-1" })).toBeVisible(),
    ]);
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

  test("Should not able to see settings button", async ({ page }) => {
    await setupClerkTestingToken({ page });
    const userName = process.env.CLERK_TEST_USERNAME!;
    await page.goto(`/${userName}`);
    await expect(page.getByTestId("settings-button")).not.toBeVisible();
  });
});

test.describe("Sample pack page", () => {
  test("Should navigate to the pack page and not see update button", async ({
    page,
  }) => {
    const userName = process.env.CLERK_TEST_USERNAME!;
    await page.goto(`/${userName}`);
    await page.getByRole("link", { name: "sample-pack-1" }).click();
    await Promise.all([
      expect(page.getByRole("button", { name: "Buy" })).toBeVisible(),
      expect(
        page
          .locator("div")
          .filter({ hasText: /title-1/ })
          .nth(1)
      ).toBeVisible(),
      expect(page.getByTestId("update-pack-button")).not.toBeVisible(),
    ]);
  });

  test("Should be able to see update button if owner", async ({ page }) => {
    await setupClerkTestingToken({ page });
    const userName = process.env.CLERK_TEST_USERNAME!;
    await page.goto(`/${userName}/sample-pack-1`);
    await clerk.signIn({
      page,
      signInParams: {
        strategy: "email_code",
        identifier: process.env.CLERK_TEST_USER_EMAIL!,
      },
    });

    await expect(page.getByTestId("update-pack-button")).toBeVisible();
  });
});

test.describe("Search", () => {
  test("Should search for users", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("Search...").click();
    await page.getByPlaceholder("Search...").fill("producer");
    await page.waitForURL("/search?q=producer");
    await expect(
      page.getByRole("link", {
        name: `${process.env.CLERK_TEST_USERNAME!} producer-1 @${process.env
          .CLERK_TEST_USERNAME!}`,
      })
    ).toBeVisible();
    await expect(page.getByText("No sample packs found")).toBeVisible();
    await expect(page.getByText("No samples found")).toBeVisible();
  });

  test("Should search for samples", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("Search...").click();
    await page.getByPlaceholder("Search...").fill("title-1");
    await page.waitForURL("/search?q=title-1");

    await expect(
      page.getByRole("link", {
        name: `title-1 @${process.env.CLERK_TEST_USERNAME!}`,
      })
    ).toBeVisible();

    await expect(page.getByText("No producers found")).toBeVisible();
    await expect(page.getByText("No sample packs found")).toBeVisible();

    await page.getByPlaceholder("Search...").dblclick();
    await page.getByPlaceholder("Search...").fill("title");
    await page.waitForURL("/search?q=title");
    const promises = Array(5)
      .fill(null)
      .map((_, i) =>
        expect(
          page.getByRole("link", {
            name: `title-${i + 1} @${process.env.CLERK_TEST_USERNAME!}`,
          })
        ).toBeVisible()
      );

    await Promise.all(promises);
  });

  test("Should display message when no term", async ({ page }) => {
    await page.goto("/search");
    await expect(page.getByText("Please enter a search term")).toBeVisible();
  });
});
