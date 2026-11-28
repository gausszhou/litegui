import { expect, test } from "@playwright/test";

const GRIDCRAFT_URL = process.env.LITEGUI_GRIDCRAFT_URL ?? "http://127.0.0.1:5184/";

test("gridcraft mounts the spreadsheet workbench", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto(GRIDCRAFT_URL);

  await expect(page.locator(".gc-app")).toBeVisible();
  await expect(page.locator("#gc-doc-title")).toHaveText("Quarterly Sales Dashboard");
  await expect(page.locator(".gc-ribbon-tab")).toHaveCount(9);
  await expect(page.locator(".gc-sheet-tab")).toHaveCount(5);
  await expect(page.locator('.gc-cell[data-key="A2"]')).toContainText("Quarterly Sales Dashboard");
  await expect(page.locator(".gc-chart")).toHaveCount(2);
  expect(await page.locator(".gc-cell").count()).toBeGreaterThan(1000);
  await expect(page.locator("#gc-status")).toHaveText("Ready");

  expect(errors).toEqual([]);
});

test("cells recalculate formulas and undo restores values", async ({ page }) => {
  await page.goto(GRIDCRAFT_URL);

  const b5 = page.locator('.gc-cell[data-key="B5"]');
  const f5 = page.locator('.gc-cell[data-key="F5"] .gc-cell-text');
  await b5.click();
  await expect(page.locator("#gc-name-box")).toHaveValue("B5");
  await expect(page.locator("#gc-formula-input")).toHaveValue("48200");

  await page.keyboard.type("50000");
  await page.keyboard.press("Enter");
  await expect(page.locator('.gc-cell[data-key="B5"] .gc-cell-text')).toHaveText("$50,000");
  await expect(f5).toHaveText("$219,220");

  await page.keyboard.press("Control+z");
  await expect(page.locator('.gc-cell[data-key="B5"] .gc-cell-text')).toHaveText("$48,200");
  await expect(f5).toHaveText("$217,420");

  await page.locator('.gc-cell[data-key="H12"]').click();
  await page.keyboard.type("=SUM(B5:B10)");
  await page.keyboard.press("Enter");
  await expect(page.locator('.gc-cell[data-key="H12"] .gc-cell-text')).toHaveText("304820");
});

test("pivot field pane moves fields and refreshes the report", async ({ page }) => {
  await page.goto(GRIDCRAFT_URL);
  await page.locator(".gc-sheet-tab", { hasText: "Pivot" }).first().click();

  await expect(page.locator(".gc-pane--pivot")).toBeVisible();
  await expect(page.locator(".gc-pivot-chip-label")).toHaveCount(4);
  await expect(page.locator('.gc-cell[data-key="B4"]')).toContainText("Backpacks");

  await page.locator(".gc-pivot-field", { hasText: "Product" }).locator("input").click();
  await expect(page.locator(".gc-pivot-chip-label", { hasText: "Product" })).toHaveCount(0);
  await expect(page.locator('.gc-cell[data-key="A4"]')).toContainText("Row Labels");
  await expect(page.locator('.gc-cell[data-key="C4"]')).toContainText("Grand Total");
  await expect(page.locator('.gc-cell[data-key="A5"]')).toContainText("East");
});

test("charts select into Chart Design and reshape from the format pane", async ({ page }) => {
  await page.goto(GRIDCRAFT_URL);

  await page.locator(".gc-chart").first().click();
  await expect(page.locator(".gc-ribbon-tab.is-active")).toHaveText("Chart Design");
  await expect(page.locator(".gc-pane--chart")).toBeVisible();

  await page.locator("[data-chart-type]").selectOption("bar");
  await expect(page.locator(".gc-chart").first().locator(".gc-chart-svg")).toBeVisible();
  await expect(page.locator(".gc-chart").first().locator("rect").first()).toBeVisible();

  await page.locator("[data-chart-legend]").selectOption("none");
  await expect(page.locator(".gc-chart").first().locator("text", { hasText: "Q1" })).toHaveCount(0);
});

test("table filters hide rows and can be cleared", async ({ page }) => {
  await page.goto(GRIDCRAFT_URL);

  await page.locator(".gc-filter-btn").first().click();
  await expect(page.locator(".gc-menu")).toBeVisible();
  await page.locator(".gc-menu-item", { hasText: "North" }).first().click();
  await expect(page.locator('.gc-cell[data-key="A5"]')).toHaveCount(0);

  await page.locator(".gc-filter-btn").first().click();
  await page.locator(".gc-menu-item", { hasText: "Clear Filter" }).first().click();
  await expect(page.locator('.gc-cell[data-key="A5"]')).toContainText("North");
});
