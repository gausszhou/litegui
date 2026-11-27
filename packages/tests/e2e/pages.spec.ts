import { expect, test } from "@playwright/test";

const DEMO_URL = process.env.LITEGUI_DEMO_URL ?? "http://127.0.0.1:5173/";
const EDITOR_URL = process.env.LITEGUI_EDITOR_URL ?? "http://127.0.0.1:5174/";

test("demo page mounts the layout", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(DEMO_URL);

  await expect(page.locator("#app .lg-area")).toBeVisible();
  await expect(page.locator(".lg-modal-backdrop")).toBeAttached();
  expect(errors).toEqual([]);
});

test("mobile viewport keeps the demo usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 720 });
  await page.goto(DEMO_URL);

  const area = page.locator("#app .lg-area");
  await expect(area).toBeVisible();
  const box = await area.boundingBox();
  expect(box?.width).toBeGreaterThan(300);
});

test("submenu aligns with its parent item", async ({ page }) => {
  await page.goto(DEMO_URL);
  await page.locator(".lg-menu__item", { hasText: "文件" }).click();

  const parent = page.locator(".lg-menu__panel-item", { hasText: "使用配置文件新建窗口" });
  await parent.click();

  const submenu = page.locator(".lg-menu__panel").nth(1);
  await expect(submenu).toBeVisible();

  const parentBox = await parent.boundingBox();
  const submenuBox = await submenu.boundingBox();
  expect(parentBox && submenuBox).toBeTruthy();
  // 顶部与父项对齐（面板自身有 4px 内边距）
  expect(Math.abs(submenuBox!.y - parentBox!.y)).toBeLessThanOrEqual(6);
  // 左侧贴着父面板右缘展开，而不是回到菜单栏下方
  expect(submenuBox!.x).toBeGreaterThanOrEqual(parentBox!.x + parentBox!.width - 6);
});

test("submenu stays inside a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 720 });
  await page.goto(DEMO_URL);
  await page.locator(".lg-menu__item", { hasText: "文件" }).click();
  await page.locator(".lg-menu__panel-item", { hasText: "使用配置文件新建窗口" }).click();

  const submenu = page.locator(".lg-menu__panel").nth(1);
  await expect(submenu).toBeVisible();
  const box = await submenu.boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
});
