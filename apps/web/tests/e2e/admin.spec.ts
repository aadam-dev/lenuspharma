import { test, expect } from "@playwright/test";

test.describe("Admin login", () => {
  test("renders login form with all fields", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/password/i).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("shows brand header", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByText("Lenus Admin")).toBeVisible();
    await expect(page.getByText(/authorized personnel only/i)).toBeVisible();
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel(/email address/i).fill("wrong@example.com");
    await page.getByLabel(/password/i).first().fill("wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).click();
    // Error message appears (from API or network failure)
    await expect(
      page.locator('[class*="red"]').or(page.getByText(/invalid|failed|error/i))
    ).toBeVisible({ timeout: 8000 });
  });

  test("password toggle shows and hides password", async ({ page }) => {
    await page.goto("/admin/login");
    const passwordInput = page.getByLabel(/password/i).first();
    await expect(passwordInput).toHaveAttribute("type", "password");
    // Click the eye toggle button
    await page.getByRole("button", { name: "" }).last().click();
    await expect(passwordInput).toHaveAttribute("type", "text");
  });
});

test.describe("Admin auth guard", () => {
  test("redirects /admin/orders to login when not authenticated", async ({ page }) => {
    // Clear any stored session
    await page.context().clearCookies();
    await page.goto("/admin/orders");
    // Client-side redirect: wait for navigation
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 5000 });
  });

  test("redirects /admin/products to login when not authenticated", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/admin/products");
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 5000 });
  });

  test("redirects /admin/reports to login when not authenticated", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/admin/reports");
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 5000 });
  });
});
