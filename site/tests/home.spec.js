import { test, expect } from "@playwright/test";

test("title", async ({ page }) => {
  await page.goto("/");

  const title = page.getByRole("heading", { name: "MarketLab" });
  const subtitle = page.getByRole("heading", {
    name: "Boring tools for the data-savvy retail investor",
  });

  await expect(title).toBeVisible();
  await expect(subtitle).toBeVisible();
});

test("disclaimer", async ({ page }) => {
  await page.goto("/");

  const footer = page.locator("footer");

  await expect(footer).toContainText(
    /All content on this application is information of a general nature/,
  );
});
