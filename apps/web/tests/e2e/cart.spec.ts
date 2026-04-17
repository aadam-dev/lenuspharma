import { test, expect } from "@playwright/test";

test.describe("Cart", () => {
  test("cart page loads and shows empty state", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.locator("main")).toBeVisible();
    // Should show empty cart message when nothing in cart
    await expect(page.getByText(/your cart is empty|no items/i)).toBeVisible();
  });

  test("cart icon in header links to /cart", async ({ page }) => {
    await page.goto("/");
    const cartLink = page.locator("header").getByRole("link", { name: /cart/i });
    await expect(cartLink).toBeVisible();
    await cartLink.click();
    await expect(page).toHaveURL(/\/cart/);
  });

  test("cart badge starts hidden with no items", async ({ page }) => {
    await page.goto("/");
    // Badge should not be visible when cart is empty
    const badge = page.locator("header").getByText(/^\d+$/);
    await expect(badge).not.toBeVisible();
  });
});

test.describe("Checkout page", () => {
  test("loads checkout form", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page.locator("main")).toBeVisible();
  });
});
