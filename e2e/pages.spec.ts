import { expect, test } from "@playwright/test";

test("demo page mounts the layout", async ({ page }) => {
  await page.goto("/demo/");

  await expect(page.locator("#app .litearea")).toBeVisible();
  await expect(page.locator(".litemodalbg")).toBeAttached();
});

test("editor page mounts menus, dialogs and tables", async ({ page }) => {
  await page.goto("/editor/");

  await expect(page.locator(".litearea").first()).toBeVisible();
  await expect(page.locator(".lite-menu").first()).toBeVisible();
  await expect(page.locator(".litedialog").first()).toBeVisible();
  await expect(page.locator(".litetable").first()).toBeAttached();
});

test("theme variables switch between dark and light", async ({ page }) => {
  await page.goto("/demo/");

  const dark = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--lg-color-bg").trim()
  );

  await page.evaluate(() => {
    document.documentElement.dataset.lgTheme = "light";
  });

  const light = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--lg-color-bg").trim()
  );

  expect(dark).not.toBe(light);
});
