import { test, expect } from "@playwright/test";

test.describe("/login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("renders 로그인 heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
  });

  test("shows email/password inputs, 로그인 submit, Google button, and 회원가입 link", async ({
    page,
  }) => {
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();

    // The main form's 로그인 submit button (inside main content, not navbar)
    const submit = page
      .locator("main")
      .getByRole("button", { name: "로그인", exact: true });
    await expect(submit).toBeVisible();

    // Google continue button
    await expect(
      page.getByRole("button", { name: /Google로 계속하기/ })
    ).toBeVisible();

    // 회원가입 link (body CTA, not nav — use 'link' role)
    await expect(
      page.getByRole("link", { name: "회원가입" }).first()
    ).toBeVisible();
  });
});

test.describe("/register page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("renders 회원가입 heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "회원가입" })
    ).toBeVisible();
  });

  test("shows email/password inputs, 가입하기 submit, Google button, and 로그인 link", async ({
    page,
  }) => {
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(
      page.getByRole("button", { name: "가입하기" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Google로 계속하기/ })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "로그인" }).first()
    ).toBeVisible();
  });
});

test.describe("navbar auth state (logged-out)", () => {
  test("desktop: shows 로그인 + 회원가입 buttons in nav", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const nav = page.locator("nav").first();
    await expect(nav.getByRole("link", { name: "로그인" })).toBeVisible();
    await expect(
      nav.getByRole("link", { name: /회원가입/ })
    ).toBeVisible();
  });

  test("mobile: hamburger visible, clicking opens menu", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const hamburger = page.getByRole("button", { name: "메뉴 열기" });
    await expect(hamburger).toBeVisible();

    // Mobile menu links are hidden until hamburger is clicked.
    await hamburger.click();

    // After opening, both 로그인 and 회원가입 links should render within the nav.
    const nav = page.locator("nav").first();
    await expect(nav.getByRole("link", { name: "로그인" })).toBeVisible();
    await expect(
      nav.getByRole("link", { name: "회원가입" })
    ).toBeVisible();
  });
});
