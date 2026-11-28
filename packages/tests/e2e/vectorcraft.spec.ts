import { expect, test } from "@playwright/test";

const VECTORCRAFT_URL = process.env.LITEGUI_VECTORCRAFT_URL ?? "http://127.0.0.1:5179/";

test("vectorcraft mounts the Illustrator-style shell", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));

  await page.goto(VECTORCRAFT_URL);

  await expect(page.locator(".vc-topbar")).toBeVisible();
  await expect(page.locator(".vc-menu-btn")).toHaveCount(9);
  await expect(page.locator(".lg-toolbar__tool")).toHaveCount(26);
  await expect(page.locator(".vc-canvas")).toBeVisible();
  await expect(page.locator("#vc-doctab")).toContainText("neon-drive.vectorcraft");
  await expect(page.locator(".vc-appearance")).toBeVisible();
  await expect(page.locator(".vc-app-row")).toHaveCount(4);
  await expect(page.locator("#vc-ctxbar")).toBeVisible();
  await expect(page.locator("#vc-selection-state")).toHaveText("Selection");
  await expect(page.locator("#vc-zoom")).toContainText("%");
  await expect(page.locator(".vc-world [data-obj]")).toHaveCount(7);

  expect(errors).toEqual([]);
});

test("layer selection, transform editing and undo work", async ({ page }) => {
  await page.goto(VECTORCRAFT_URL);

  await page.click("[data-tab='layers']");
  await expect(page.locator(".vc-layer-row")).toHaveCount(7);

  await page.locator(".vc-layer-row", { hasText: "Sun" }).click();
  await page.click("[data-tab='properties']");

  await expect(page.locator("#vc-selection-state")).toHaveText("Selection");
  await expect(page.locator("[data-prop='width']").first()).toHaveValue("364");

  const xInput = page.locator("[data-prop='x']").first();
  await xInput.fill("240");
  await xInput.press("Enter");
  await expect(xInput).toHaveValue("240");

  await page.keyboard.press("Control+z");
  await expect(page.locator("[data-prop='x']").first()).toHaveValue("214");
});

test("shape tools create vector objects and undo removes them", async ({ page }) => {
  await page.goto(VECTORCRAFT_URL);

  const objects = page.locator(".vc-world [data-obj]");
  const before = await objects.count();

  const ellipseTool = page.locator(".lg-toolbar__tool[data-tool='ellipse']");
  await ellipseTool.click();
  await expect(ellipseTool).toHaveClass(/lg-toolbar__tool--active/);

  const stage = await page.locator("#vc-stage").boundingBox();
  expect(stage).not.toBeNull();
  if (!stage) return;

  await page.mouse.move(stage.x + 220, stage.y + 240);
  await page.mouse.down();
  await page.mouse.move(stage.x + 360, stage.y + 340, { steps: 6 });
  await page.mouse.up();

  await expect(objects).toHaveCount(before + 1);
  await expect(page.locator("#vc-ctxbar")).toBeVisible();

  await page.keyboard.press("Control+z");
  await expect(objects).toHaveCount(before);
});

test("menus open and close, view toggles update the stage", async ({ page }) => {
  await page.goto(VECTORCRAFT_URL);

  await page.locator("[data-menu='File']").click();
  await expect(page.locator(".vc-menu")).toBeVisible();
  await expect(page.locator(".vc-menu-item").first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".vc-menu")).toHaveCount(0);

  await expect(page.locator(".vc-rulers")).toBeHidden();
  await page.locator("[data-menu='View']").click();
  await page.locator(".vc-menu-item", { hasText: "Show Rulers" }).click();
  await expect(page.locator(".vc-rulers")).toBeVisible();

  await page.locator("[data-menu='View']").click();
  await page.locator(".vc-menu-item", { hasText: "Outline Mode" }).click();
  await expect(page.locator(".vc-stage.is-outline")).toHaveCount(1);
});

test("layer visibility and library swatches affect the artwork", async ({ page }) => {
  await page.goto(VECTORCRAFT_URL);

  await page.click("[data-tab='layers']");
  const creditRow = page.locator(".vc-layer-row", { hasText: "made with VectorCraft" }).first();
  const creditLayer = page.locator(".vc-world [data-obj]", { hasText: "made with VectorCraft" });
  await expect(creditLayer).toHaveCount(1);

  await creditRow.locator("[data-layer-action='visible']").click();
  await expect(creditRow).toHaveClass(/is-hidden/);
  await expect(creditLayer).toHaveCount(0);

  await creditRow.locator("[data-layer-action='visible']").click();
  await expect(creditLayer).toHaveCount(1);

  await page.click("[data-tab='libraries']");
  await expect(page.locator(".vc-lib-swatch")).toHaveCount(14);
  await expect(page.locator(".vc-lib-gradient")).toHaveCount(6);

  await page.locator(".vc-lib-gradient").first().click();
  await page.click("[data-tab='properties']");
  await expect(page.locator(".vc-appearance-row .vc-swatch").first()).toHaveClass(/vc-swatch--gradient/);
});
