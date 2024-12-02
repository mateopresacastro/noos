import { test, expect } from "@playwright/test";

test("Protected pages", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start Selling" }).waitFor();
  await page.getByRole("button", { name: "Start Selling" }).click();
  await expect(
    page.getByRole("heading", { name: "Create your account" })
  ).toBeVisible();
  await page.goto("/");
  await page.getByRole("button", { name: "Sign up" }).click();
  await expect(
    page.getByRole("heading", { name: "Create your account" })
  ).toBeVisible();
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
  await page.getByRole("link", { name: "Pricing" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Get started" }).click();
  await expect(
    page.getByRole("heading", { name: "Create your account" })
  ).toBeVisible();
});
