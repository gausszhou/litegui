import { expect, test } from "@playwright/test";

const DOCS_URL = process.env.LITEGUI_DOCS_URL ?? "http://127.0.0.1:5178/litegui/docs/";

const COMPONENT_PAGES = [
  "area",
  "box",
  "panel",
  "split",
  "tabs",
  "dialog",
  "menu",
  "context-menu",
  "button",
  "checkbox",
  "slider",
  "searchbox",
  "dragger",
  "line-editor",
  "list",
  "complex-list",
  "table",
  "console",
];

test("every component page renders a live demo", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  for (const slug of COMPONENT_PAGES) {
    await page.goto(`${DOCS_URL}components/${slug}`);
    await expect(page.locator(".lg-demo"), slug).toBeVisible();
    await expect(page.locator(".lg-demo-error"), slug).toHaveCount(0);
    expect(await page.locator(".lg-demo *").count(), slug).toBeGreaterThan(0);
  }

  expect(errors).toEqual([]);
});

test("component gallery lists all entry pages", async ({ page }) => {
  await page.goto(`${DOCS_URL}components`);
  await expect(page.locator(".component-card")).toHaveCount(COMPONENT_PAGES.length);
});

test("menu demo opens a submenu aligned with its parent item", async ({ page }) => {
  await page.goto(`${DOCS_URL}components/menu`);
  await page.locator(".lg-demo .lite-menu-item", { hasText: "文件" }).click();

  const parent = page.locator(".lg-demo .lite-menu-panel-item", { hasText: "使用配置文件新建窗口" });
  await parent.click();

  const submenu = page.locator(".lg-demo .lite-menu-panel").nth(1);
  await expect(submenu).toBeVisible();

  const parentBox = await parent.boundingBox();
  const submenuBox = await submenu.boundingBox();
  expect(parentBox && submenuBox).toBeTruthy();
  expect(Math.abs(submenuBox!.y - parentBox!.y)).toBeLessThanOrEqual(6);
  expect(submenuBox!.x).toBeGreaterThanOrEqual(parentBox!.x + parentBox!.width - 6);
});

test("dialog demo stays inside its demo container", async ({ page }) => {
  await page.goto(`${DOCS_URL}components/dialog`);

  const container = page.locator(".lg-demo");
  const dialog = container.locator(".litedialog");
  await expect(dialog).toBeVisible();

  const containerBox = await container.boundingBox();
  const dialogBox = await dialog.boundingBox();
  expect(containerBox && dialogBox).toBeTruthy();
  expect(dialogBox!.x).toBeGreaterThanOrEqual(containerBox!.x);
  expect(dialogBox!.x + dialogBox!.width).toBeLessThanOrEqual(containerBox!.x + containerBox!.width + 1);
});
