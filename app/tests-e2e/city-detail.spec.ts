import { test, expect } from "@playwright/test";

const SEOUL_ID = "11111111-1111-1111-1111-000000000001";
const MISSING_ID = "00000000-0000-0000-0000-000000000999";

test.describe("city detail page — Seoul", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/city/${SEOUL_ID}`);
  });

  test("renders 서울 (Seoul) heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /서울[\s\S]*Seoul/ })
    ).toBeVisible();
  });

  test("metric cards are visible", async ({ page }) => {
    await expect(page.getByText("월 생활비")).toBeVisible();
    await expect(page.getByText("인터넷", { exact: true })).toBeVisible();
    await expect(page.getByText("안전 점수")).toBeVisible();
    await expect(page.getByText("현재 날씨")).toBeVisible();
    await expect(page.getByText("공기질(AQI)")).toBeVisible();
  });

  test("has back-to-home link", async ({ page }) => {
    const backLink = page.getByRole("link", { name: /← 홈으로 돌아가기/ });
    await expect(backLink).toBeVisible();
  });

  test("renders city tag pills", async ({ page }) => {
    // seed: ['도심','카페많음','빠른인터넷','외국인친화']
    await expect(page.getByText("도심", { exact: true }).first()).toBeVisible();
    await expect(
      page.getByText("카페많음", { exact: true }).first()
    ).toBeVisible();
  });

  test("리뷰 section exists with empty state", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "리뷰" })).toBeVisible();
    // Seed has no reviews for Seoul, so empty state renders
    await expect(page.getByText("아직 리뷰가 없습니다")).toBeVisible();
  });
});

test.describe("city detail page — missing id", () => {
  test("responds with 404 / not-found for an unknown id", async ({ page }) => {
    const response = await page.goto(`/city/${MISSING_ID}`);
    // Next.js notFound() returns a 404 status for the document
    expect(response?.status()).toBe(404);
    // Default 404 contains "404" or "This page could not be found"
    await expect(
      page.getByText(/404|This page could not be found|Not Found/i).first()
    ).toBeVisible();
  });
});
