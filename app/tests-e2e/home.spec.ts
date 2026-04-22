import { test, expect } from "@playwright/test";

test.describe("home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders hero heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /대한민국에서[\s\S]*노마드하기/ })
    ).toBeVisible();
  });

  test("renders at least 12 city cards", async ({ page }) => {
    const cityLinks = page.locator('a[href^="/city/"]');
    await expect(cityLinks.first()).toBeVisible();
    expect(await cityLinks.count()).toBeGreaterThanOrEqual(12);
  });

  test("first card has rank badge, Seoul text, Mbps and ₩ cost", async ({
    page,
  }) => {
    const firstCard = page.locator('a[href^="/city/"]').first();
    await expect(firstCard).toBeVisible();

    // Rank #1 badge
    await expect(firstCard.getByText("#1", { exact: true })).toBeVisible();
    // Korean 서울 + English (Seoul)
    await expect(firstCard.getByText(/서울/)).toBeVisible();
    await expect(firstCard.getByText(/Seoul/)).toBeVisible();
    // Internet speed in Mbps
    await expect(firstCard.getByText(/Mbps/)).toBeVisible();
    // Cost with ₩ symbol
    await expect(firstCard.getByText(/₩[\d,]+/)).toBeVisible();
  });

  test("first card shows weather emoji, °C temp, and AQI", async ({ page }) => {
    const firstCard = page.locator('a[href^="/city/"]').first();
    // Weather block contains emoji + °C
    await expect(firstCard.getByText(/°C/)).toBeVisible();
    // AQI block
    await expect(firstCard.getByText(/AQI\s+\d+/)).toBeVisible();
    // At least one known weather emoji ☀️, 🌧, or 🌤
    const weatherText = await firstCard.innerText();
    expect(weatherText).toMatch(/[☀️🌧🌤]/u);
  });

  test("shows 도시 리스트 heading and 더 많은 도시 보기 button", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: "도시 리스트" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /더 많은 도시 보기/ })
    ).toBeVisible();
  });
});
