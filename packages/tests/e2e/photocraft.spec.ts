import { expect, test } from "@playwright/test";

const PHOTOCRAFT_URL = process.env.LITEGUI_PHOTOCRAFT_URL ?? "http://127.0.0.1:5176/";

test("photocraft mounts the Affinity-style editor shell", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(PHOTOCRAFT_URL);

  await expect(page.locator(".pc-menubar")).toBeVisible();
  await expect(page.locator(".pc-menu-btn")).toHaveCount(10);
  await expect(page.locator(".pc-tool")).toHaveCount(15);
  await expect(page.locator("canvas.pc-canvas")).toBeVisible();
  await expect(page.locator("#curves-canvas")).toBeVisible();
  await expect(page.locator(".pc-layer-row")).toHaveCount(3);
  await expect(page.locator(".pc-status")).toContainText("RGB Color 8-bit");
  await expect(page.locator(".pc-doc-name")).toHaveText("great-wave.jpg");
  await expect(page.locator("#status-hint")).toContainText("Ready");

  expect(errors).toEqual([]);
});

test("tools switch active state and menus open, act and close", async ({ page }) => {
  await page.goto(PHOTOCRAFT_URL);

  const brush = page.locator('.pc-tool[data-tool="brush"]');
  await brush.click();
  await expect(brush).toHaveClass(/active/);
  await expect(page.locator("#status-hint")).toContainText("Paint Brush selected");

  const lasso = page.locator('.pc-tool[data-tool="lasso"]');
  await lasso.click();
  await expect(lasso).toHaveClass(/active/);
  await expect(brush).not.toHaveClass(/active/);

  await page.locator(".pc-menu-btn", { hasText: "File" }).click();
  await expect(page.locator(".pc-popup")).toBeVisible();
  await expect(page.locator(".pc-popup-item").first()).toBeVisible();

  await page.locator(".pc-popup-item", { hasText: "Document Setup" }).click();
  await expect(page.locator("#status-hint")).toContainText("Document Setup");
  await expect(page.locator(".pc-popup")).toHaveCount(0);

  await page.locator(".pc-menu-btn", { hasText: "View" }).click();
  await expect(page.locator(".pc-popup")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".pc-popup")).toHaveCount(0);
});

test("layers select and visibility toggles update the canvas", async ({ page }) => {
  await page.goto(PHOTOCRAFT_URL);

  const captionRow = page.locator(".pc-layer-row", { hasText: "Caption" }).first();
  await captionRow.click();
  await expect(captionRow).toHaveClass(/selected/);
  await expect(page.locator("#status-hint")).toContainText("Caption layer selected");

  const captionEye = page.locator('[data-eye="caption"]');
  await expect(page.locator("#artwork-caption")).toBeVisible();
  await captionEye.click();
  await expect(page.locator("#artwork-caption")).toBeHidden();
  await expect(page.locator("#status-hint")).toContainText("Caption hidden");
  await expect(page.locator("#layers-label")).toHaveText("3 layers");

  await page.locator('[data-eye="caption"]').click();
  await expect(page.locator("#artwork-caption")).toBeVisible();

  await page.locator('[data-eye="background"]').click();
  await expect(page.locator("#status-hint")).toContainText("Background hidden");
});

test("canvas zooms with the wheel, pans and opens a context menu", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(PHOTOCRAFT_URL);
  const canvas = page.locator("canvas.pc-canvas");
  await expect(canvas).toBeVisible();

  const before = await page.locator("#zoom-label").textContent();
  const box = await canvas.boundingBox();
  if (!box) throw new Error("canvas has no box");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, -420);
  await expect
    .poll(async () => page.locator("#zoom-label").textContent(), { timeout: 4000 })
    .not.toBe(before);

  await page.locator('.pc-tool[data-tool="hand"]').click();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 70, box.y + box.height / 2 + 40, { steps: 6 });
  await page.mouse.up();

  await canvas.click({ button: "right", position: { x: 300, y: 220 } });
  await expect(page.locator(".pc-popup")).toBeVisible();
  await page.locator(".pc-popup-item", { hasText: "Fit to Window" }).click();
  await expect(page.locator("#status-hint")).toContainText("Fit to window");

  expect(errors).toEqual([]);
});

test("curves panel adds and drags a control point", async ({ page }) => {
  await page.goto(PHOTOCRAFT_URL);

  const curves = page.locator("#curves-canvas");
  await expect(curves).toBeVisible();
  await expect(curves).toHaveAttribute("data-points", "4");

  const before = await page.locator("#curves-readout").textContent();
  const box = await curves.boundingBox();
  if (!box) throw new Error("curves canvas has no box");

  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.5 + 24, box.y + box.height * 0.5 - 22, { steps: 8 });
  await page.mouse.up();

  await expect(curves).toHaveAttribute("data-points", "5");
  await expect.poll(async () => page.locator("#curves-readout").textContent()).not.toBe(before);

  await page.locator("#curves-reset").click();
  await expect(page.locator("#status-hint")).toContainText("Curves reset");
  await expect(curves).toHaveAttribute("data-points", "2");
});
