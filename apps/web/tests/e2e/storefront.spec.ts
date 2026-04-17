import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads with brand and navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Lenus/i);
    await expect(page.getByRole("link", { name: /LenusPharmacy/i }).first()).toBeVisible();
  });

  test("header shows phone number and WhatsApp link", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("054 832 5792")).toBeVisible();
    await expect(page.getByText(/Upload Prescription via WhatsApp/i)).toBeVisible();
  });

  test("desktop nav links are present", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("header nav");
    await expect(nav.getByRole("link", { name: "Products" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Branches" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "About" })).toBeVisible();
  });

  test("Browse Products CTA navigates to /products", async ({ page }) => {
    await page.goto("/");
    // Click the first visible Browse Products link
    await page.getByRole("link", { name: /Browse Products/i }).first().click();
    await expect(page).toHaveURL(/\/products/);
  });
});

test.describe("Products page", () => {
  test("loads and shows product listings or empty state", async ({ page }) => {
    await page.goto("/products");
    // Either products appear or an empty-state message — page must not crash
    await expect(page.locator("main")).toBeVisible();
    await expect(page).not.toHaveURL(/500|error/i);
  });

  test("search input is present", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  });

  test("search filters results without crashing", async ({ page }) => {
    await page.goto("/products");
    const search = page.getByPlaceholder(/search/i);
    await search.fill("paracetamol");
    await page.waitForTimeout(400);
    await expect(page).not.toHaveURL(/error/i);
    await expect(page.locator("main")).toBeVisible();
  });
});

test.describe("About page", () => {
  test("loads successfully", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("main")).toBeVisible();
    await expect(page).not.toHaveURL(/error/i);
  });
});
