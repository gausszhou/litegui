import { expect, test } from "@playwright/test";

const BLENDER_URL = process.env.LITEGUI_BLENDER_URL ?? "http://127.0.0.1:5175/";

test("blender workbench mounts the Blender-style shell", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(BLENDER_URL);

  await expect(page.locator(".be-topbar")).toBeVisible();
  await expect(page.locator(".be-workspace-tab.active")).toHaveText("Layout");
  await expect(page.locator(".be-area-header")).toBeVisible();
  await expect(page.locator(".be-tree-row")).toHaveCount(4);
  await expect(page.locator(".be-prop-tab")).toHaveCount(13);
  await expect(page.locator(".be-timeline")).toBeVisible();
  await expect(page.locator(".be-statusbar")).toContainText("LiteGUI");
  expect(errors).toEqual([]);
});

test("blender menus and workspace tabs switch layouts", async ({ page }) => {
  await page.goto(BLENDER_URL);

  await page.locator("#menubar .be-menu-btn", { hasText: "File" }).click();
  await expect(page.locator(".be-popup")).toBeVisible();
  await page.locator(".be-popup-item", { hasText: "New" }).first().click();
  await expect(page.locator("#status-left")).toContainText("New scene");

  await page.locator(".be-workspace-tab", { hasText: "Modeling" }).click();
  await expect(page.locator(".be-workspace-tab.active")).toHaveText("Modeling");

  await page.locator(".be-workspace-tab", { hasText: "Scripting" }).click();
  await expect(page.locator(".be-script-editor")).toBeVisible();
  await expect(page.locator(".be-timeline")).toBeHidden();

  await page.locator(".be-workspace-tab", { hasText: "Layout" }).click();
  await expect(page.locator(".be-timeline")).toBeVisible();
});

test("blender selects objects and edits transform properties", async ({ page }) => {
  await page.goto(BLENDER_URL);

  const camera = page.locator(".be-tree-row", { hasText: "Camera" }).first();
  await camera.click();
  await expect(camera).toHaveClass(/selected/);
  await expect(page.locator(".be-viewport-info")).toContainText("Camera");

  const locationRow = page.locator(".be-prop-row", { hasText: "Location" }).first();
  const x = locationRow.locator("input").first();
  await x.fill("2.5");
  await x.press("Enter");
  await expect(x).toHaveValue("2.50");

  await page.locator("#viewport-header [data-menu='wire']").click();
  await expect(page.locator("#viewport-header [data-menu='wire']")).toHaveClass(/active/);
});

test("blender timeline, playback and keyboard shortcuts work", async ({ page }) => {
  await page.goto(BLENDER_URL);

  const timeline = page.locator("#timeline-canvas");
  await timeline.click({ position: { x: 500, y: 45 } });
  const frame = page.locator("#frame-input");
  await expect(frame).not.toHaveValue("1");

  await page.locator("canvas.be-canvas").click({ position: { x: 620, y: 400 } });
  await page.keyboard.press("Space");
  await page.waitForTimeout(250);
  const playingFrame = Number(await frame.inputValue());
  expect(playingFrame).toBeGreaterThan(1);
  await page.keyboard.press("Space");

  await page.keyboard.press("n");
  await expect(page.locator("#viewport-sidebar")).toBeVisible();
  await page.keyboard.press("n");
  await expect(page.locator("#viewport-sidebar")).toBeHidden();

  await page.keyboard.press("Tab");
  await expect(page.locator("#viewport-header")).toContainText("Edit Mode");
  await page.keyboard.press("Tab");

  await page.locator("canvas.be-canvas").click({ position: { x: 620, y: 400 } });
  await page.keyboard.press("g");
  await page.mouse.move(700, 400);
  await page.mouse.move(760, 440);
  await page.keyboard.press("Enter");
  await expect(page.locator("#status-left")).toContainText("Transform applied");
});
