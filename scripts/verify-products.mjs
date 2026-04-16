#!/usr/bin/env node
/**
 * Verifies that the API returns products. Run with the API already running:
 *   npm run dev --workspace=api   (in one terminal)
 *   node scripts/verify-products.mjs
 */
const API_BASE = process.env.API_BASE ?? "http://127.0.0.1:4000";
const PRODUCTS_URL = `${API_BASE}/api/products`;

async function main() {
  console.log("Checking API at", PRODUCTS_URL, "...");
  try {
    const res = await fetch(PRODUCTS_URL);
    if (!res.ok) {
      console.error("FAIL: API returned", res.status, res.statusText);
      process.exit(1);
    }
    const data = await res.json();
    const count = Array.isArray(data) ? data.length : 0;
    if (count === 0) {
      console.error("FAIL: API returned 0 products. Run: npm run db:seed --workspace=api");
      process.exit(1);
    }
    console.log("OK: API returned", count, "products");
    if (data[0]?.name) console.log("  Sample:", data[0].name);
  } catch (err) {
    console.error("FAIL: Could not reach API.", err.message);
    console.error("  Ensure the API is running: npm run dev --workspace=api");
    process.exit(1);
  }
}

main();
