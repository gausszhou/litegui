import { expect, test } from "@playwright/test";

test("demo page mounts the layout", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/demo/");

  await expect(page.locator("#app .litearea")).toBeVisible();
  await expect(page.locator(".litemodalbg")).toBeAttached();
  expect(errors).toEqual([]);
});

test("editor page mounts menus, dialogs and tables", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/editor/");

  await expect(page.locator(".litearea").first()).toBeVisible();
  await expect(page.locator(".lite-menu").first()).toBeVisible();
  await expect(page.locator(".litedialog").first()).toBeVisible();
  await expect(page.locator(".litetable").first()).toBeAttached();
  expect(errors).toEqual([]);
});

test("editor opens menus and closes dialogs", async ({ page }) => {
  await page.goto("/editor/");

  await page.locator(".lite-menu-item").first().click();
  await expect(page.locator(".lite-menu-panel").first()).toBeVisible();

  const dialogs = page.locator(".litedialog");
  const before = await dialogs.count();
  await dialogs.first().locator(".close-button").click();
  await expect(dialogs).toHaveCount(before - 1);
});

test("editor renders table rows and switches tabs", async ({ page }) => {
  await page.goto("/editor/");

  const rows = page.locator(".litetable tr");
  await expect(rows.first()).toBeVisible();
  expect(await rows.count()).toBeGreaterThan(1);

  const tabs = page.locator(".litetabs .wtab");
  await expect(tabs.first()).toBeVisible();
  await tabs.nth(1).click();
  await expect(tabs.nth(1)).toHaveClass(/selected/);
});

test("mobile viewport keeps the demo usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 720 });
  await page.goto("/demo/");

  const area = page.locator("#app .litearea");
  await expect(area).toBeVisible();
  const box = await area.boundingBox();
  expect(box?.width).toBeGreaterThan(300);
});
