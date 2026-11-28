import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const CADCRAFT_URL = process.env.LITEGUI_CADCRAFT_URL ?? "http://127.0.0.1:5180/";

async function openApp(page: Page) {
  await page.goto(CADCRAFT_URL);
  await expect(page.locator("#cad-canvas")).toBeVisible();
  await expect(page.locator(".cad-cmd-prompt")).toHaveText("Command:");
}

async function worldToPage(page: Page, x: number, y: number) {
  const box = await page.locator("#cad-canvas").boundingBox();
  if (!box) throw new Error("canvas has no bounding box");
  const point = await page.evaluate(
    ([px, py]) => {
      const renderer = (window as unknown as { __CADCRAFT__: { renderer: { worldToScreen: (p: { x: number; y: number }) => { x: number; y: number } } } })
        .__CADCRAFT__.renderer;
      return renderer.worldToScreen({ x: px, y: py });
    },
    [x, y] as const
  );
  return { x: box.x + point.x, y: box.y + point.y };
}

async function runCommand(page: Page, command: string) {
  const input = page.locator("#command-input");
  await input.click();
  await input.fill(command);
  await input.press("Enter");
}

async function entityCount(page: Page): Promise<number> {
  return page.evaluate(() => (window as unknown as { __CADCRAFT__: { entityCount: () => number } }).__CADCRAFT__.entityCount());
}

test("cadcraft mounts the drafting shell", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
  });

  await openApp(page);

  await expect(page).toHaveTitle("LiteGUI CADCraft");
  await expect(page.locator(".cad-brand")).toHaveText("CADCraft");
  await expect(page.locator(".cad-doc-name")).toHaveText("apartment.dxf");
  await expect(page.locator(".cad-menu-btn")).toHaveCount(11);
  await expect(page.locator(".cad-tool").first()).toBeVisible();
  expect(await page.locator(".cad-tool").count()).toBeGreaterThan(30);
  await expect(page.locator(".cad-layer-row")).toHaveCount(9);
  await expect(page.locator(".cad-status-toggle")).toHaveCount(8);
  await expect(page.locator("#props-title")).toHaveText("No selection");
  await expect(page.locator("#doc-name")).toBeVisible();
  await expect(page.locator(".cad-layouttabs .lg-tabs__tab")).toHaveCount(4);

  expect(errors).toEqual([]);
});

test("menus open, actions run and Escape closes", async ({ page }) => {
  await openApp(page);

  await page.locator(".cad-menu-btn", { hasText: "File" }).click();
  await expect(page.locator(".cad-popup")).toBeVisible();
  await expect(page.locator(".cad-popup__item")).toHaveCount(6);
  await page.keyboard.press("Escape");
  await expect(page.locator(".cad-popup")).toHaveCount(0);

  await page.locator(".cad-menu-btn", { hasText: "Draw" }).click();
  await page.locator(".cad-popup__item", { hasText: "Circle" }).click();
  await expect(page.locator(".cad-cmd-prompt")).toContainText("Specify center point");
  await page.keyboard.press("Escape");
  await expect(page.locator(".cad-cmd-prompt")).toHaveText("Command:");
});

test("the command line draws geometry and supports typed coordinates", async ({ page }) => {
  await openApp(page);
  const before = await entityCount(page);

  await runCommand(page, "LINE");
  await expect(page.locator(".cad-cmd-prompt")).toContainText("Specify first point");

  const start = await worldToPage(page, 1500, 1500);
  await page.mouse.click(start.x, start.y);
  await expect(page.locator(".cad-cmd-prompt")).toContainText("Specify next point");

  const input = page.locator("#command-input");
  await input.fill("@2000<0");
  await input.press("Enter");
  await input.fill("@0,1500");
  await input.press("Enter");
  await page.keyboard.press("Enter");

  await expect.poll(() => entityCount(page)).toBe(before + 2);
  await expect(page.locator(".lg-console__log")).toContainText("2 line segments drawn");

  // Undo removes the pair again.
  await page.locator("#command-input").click();
  await page.keyboard.press("Control+z");
  await expect.poll(() => entityCount(page)).toBe(before);
});

test("selection drives the properties palette and layers toggle", async ({ page }) => {
  await openApp(page);

  const wall = await worldToPage(page, 6000, 7800);
  await page.mouse.click(wall.x, wall.y);
  await expect(page.locator("#props-title")).toContainText("Polyline");
  await expect(page.locator("#props-body")).toContainText("Vertices");
  await expect(page.locator("#props-body")).toContainText("A-WALL");

  const doorRow = page.locator('.cad-layer-row[data-layer="door"]');
  await doorRow.locator('[data-layer-act="visible"]').click();
  await expect(page.locator("#status-hint")).toContainText("A-DOOR turned off");
  await expect(doorRow).toHaveClass(/is-off/);
  await doorRow.locator('[data-layer-act="visible"]').click();
  await expect(doorRow).not.toHaveClass(/is-off/);

  await page.keyboard.press("Escape");
  await expect(page.locator("#props-title")).toHaveText("No selection");
});

test("layout tabs switch model and paper space", async ({ page }) => {
  await openApp(page);

  await page.locator(".cad-layouttabs .lg-tabs__tab", { hasText: "Layout1" }).click();
  await expect(page.locator("#view-badge")).toHaveText("PAPER");
  await expect(page.locator(".cad-status-mode")).toHaveText("PAPER");

  await page.locator(".cad-layouttabs .lg-tabs__tab", { hasText: "Layout2" }).click();
  await expect(page.locator("#view-badge")).toHaveText("PAPER");

  await page.locator(".cad-layouttabs .lg-tabs__tab", { hasText: "Model" }).click();
  await expect(page.locator("#view-badge")).toHaveText("MODEL");
  await expect(page.locator(".cad-status-mode")).toHaveText("MODEL");
});

test("layer manager and plot dialogs open, edit and close", async ({ page }) => {
  await openApp(page);

  await runCommand(page, "LAYER");
  const layerDialog = page.locator("#layer-manager");
  await expect(layerDialog).toBeVisible();
  await expect(layerDialog.locator("tbody tr")).toHaveCount(9);

  await layerDialog.locator('[data-lm="new"]').click();
  await expect(layerDialog.locator("tbody tr")).toHaveCount(10);
  await expect(page.locator("#layer-list .cad-layer-row")).toHaveCount(10);

  await page.keyboard.press("Escape");
  await expect(page.locator("#layer-manager")).toHaveCount(0);

  await runCommand(page, "LAYER");
  await expect(page.locator("#layer-manager")).toBeVisible();
  await page.locator("#layer-manager .lg-dialog__button--close").click();
  await expect(page.locator("#layer-manager")).toHaveCount(0);

  await runCommand(page, "PLOT");
  const plotDialog = page.locator("#cad-plot");
  await expect(plotDialog).toBeVisible();
  await expect(plotDialog.locator("#plot-format")).toHaveValue("png");
  await page.keyboard.press("Escape");
  await expect(page.locator("#cad-plot")).toHaveCount(0);
});

test("SAVE downloads a DXF drawing", async ({ page }) => {
  await openApp(page);

  const downloadPromise = page.waitForEvent("download");
  await runCommand(page, "SAVE");
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("apartment.dxf");
  const filePath = await download.path();
  expect(filePath).toBeTruthy();
  const content = readFileSync(filePath as string, "utf8");
  expect(content).toContain("SECTION");
  expect(content).toContain("ENTITIES");
  expect(content).toContain("LWPOLYLINE");
  expect(content).toContain("A-WALL");
});
