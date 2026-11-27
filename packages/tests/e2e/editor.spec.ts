import { expect, test } from "@playwright/test";

const EDITOR_URL = process.env.LITEGUI_EDITOR_URL ?? "http://127.0.0.1:5174/";

test("classic editor mounts menus, area, panels and dialogs", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(EDITOR_URL);

  await expect(page.locator(".lg-menu__item").first()).toBeVisible();
  await expect(page.locator(".lg-area").first()).toBeVisible();
  await expect(page.locator(".lg-panel", { hasText: "Docked Right Panel" })).toBeVisible();
  await expect(page.locator(".lg-dialog").first()).toBeVisible();
  await expect(page.locator(".lg-table tr").first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("classic editor menus and close buttons work", async ({ page }) => {
  await page.goto(EDITOR_URL);

  await page.locator(".lg-menu__item").first().click();
  await expect(page.locator(".lg-menu__panel").first()).toBeVisible();
  await page.keyboard.press("Escape");

  const dialogs = page.locator(".lg-dialog");
  const before = await dialogs.count();
  await dialogs.first().locator(".lg-dialog__button--close").click();
  await expect(dialogs).toHaveCount(before - 1);
});

test("classic editor theme is Blender dark by default", async ({ page }) => {
  await page.goto(EDITOR_URL);

  const panel = page.locator(".lg-panel").first();
  const header = panel.locator(".lg-panel__header");
  const bg = await panel.evaluate((element) => getComputedStyle(element).backgroundColor);
  const headerBg = await header.evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(bg).toBe("rgb(46, 46, 46)");
  expect(headerBg).toBe("rgb(43, 43, 43)");
});
