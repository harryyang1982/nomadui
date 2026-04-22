import { test, expect, Page } from "@playwright/test";

/**
 * Open the Select combobox associated with a given label (예산/지역/환경/최고 계절)
 * and click the option with the given label.
 *
 * The Select component (base-ui) renders a button-like trigger with
 * data-slot="select-trigger". The label is the sibling <label> element — we
 * locate the containing wrapper via `:has(label)` and reach the trigger inside.
 */
async function selectOption(page: Page, label: string, option: string) {
  const trigger = page
    .locator(`div.space-y-1:has(label:text-is("${label}"))`)
    .locator('[data-slot="select-trigger"]');
  await expect(trigger).toBeVisible();
  await trigger.click();

  // base-ui renders items in a portal; target the list that is currently open.
  const openList = page.locator(
    '[data-slot="select-content"][data-open], [data-slot="select-content"]'
  );
  const item = openList
    .locator('[data-slot="select-item"]')
    .filter({ hasText: new RegExp(`^${escapeRegExp(option)}$`) });
  await item.first().click();
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test.describe("filter bar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("selecting 강원도 narrows cards and adds region query", async ({
    page,
  }) => {
    await selectOption(page, "지역", "강원도");

    await page.waitForURL(/region=%EA%B0%95%EC%9B%90%EB%8F%84|region=강원도/);
    expect(decodeURIComponent(page.url())).toContain("region=강원도");

    // Seed: 강릉, 춘천, 속초 → 3 cities in 강원도
    const cards = page.locator('a[href^="/city/"]');
    await expect.poll(async () => await cards.count()).toBeLessThanOrEqual(5);
    expect(await cards.count()).toBeGreaterThanOrEqual(1);

    // Specific 강원도 city should appear
    await expect(page.getByText(/강릉|춘천|속초/).first()).toBeVisible();
  });

  test("adding 예산 filter preserves region param", async ({ page }) => {
    await selectOption(page, "지역", "강원도");
    await page.waitForURL(/region=/);

    await selectOption(page, "예산", "100만원 이하");
    await page.waitForURL(/budget=/);

    // URLSearchParams decodes both %20 and + to spaces, whereas
    // decodeURIComponent leaves '+' alone. Use the parser so the assertion
    // is invariant to which form the router picks.
    const params = new URL(page.url()).searchParams;
    expect(params.get("region")).toBe("강원도");
    expect(params.get("budget")).toBe("100만원 이하");
  });

  test("choosing 전체 removes that filter param", async ({ page }) => {
    await selectOption(page, "지역", "강원도");
    await page.waitForURL(/region=/);

    await selectOption(page, "지역", "전체");
    await page.waitForURL((url) => !url.search.includes("region="));

    expect(page.url()).not.toContain("region=");
  });
});
