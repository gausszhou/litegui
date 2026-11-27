import { expect, test } from "@playwright/test";

const BLENDER_URL = process.env.LITEGUI_BLENDER_URL ?? "http://127.0.0.1:5175/";

const WORKSPACES = [
  "Layout",
  "Modeling",
  "Sculpting",
  "UV Editing",
  "Texture Paint",
  "Shading",
  "Animation",
  "Rendering",
  "Compositing",
  "Geometry Nodes",
  "Scripting"
];

async function openWorkspace(page: import("@playwright/test").Page, name: string) {
  await page.locator(".be-workspace-tab", { hasText: name }).click();
  await expect(page.locator(".be-workspace-tab.active")).toHaveText(name);
}

test("blender workbench mounts the Blender-style shell", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(BLENDER_URL);

  await expect(page.locator(".be-topbar")).toBeVisible();
  await expect(page.locator(".be-workspace-tab.active")).toHaveText("Layout");
  await expect(page.locator("#viewport-header")).toBeVisible();
  await expect(page.locator(".be-tree-row")).toHaveCount(4);
  await expect(page.locator(".be-prop-tab")).toHaveCount(13);
  await expect(page.locator("#timeline")).toBeVisible();
  await expect(page.locator(".be-statusbar")).toContainText("LiteGUI");
  await expect(page.locator("#status-stats")).toContainText("Frame: 1");
  expect(errors).toEqual([]);
});

test("blender menus close with Escape and workspace tabs switch layouts", async ({ page }) => {
  await page.goto(BLENDER_URL);

  const file = page.locator("#menubar .be-menu-btn", { hasText: "File" });
  await file.click();
  await expect(page.locator(".be-popup")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".be-popup")).toHaveCount(0);

  await file.click();
  await page.locator(".be-popup-item", { hasText: "New" }).first().click();
  await expect(page.locator("#status-left")).toContainText("New scene");

  const noTimeline = ["Shading", "Rendering", "Compositing", "Geometry Nodes", "Scripting"];
  for (const name of WORKSPACES) {
    await openWorkspace(page, name);
    if (name === "Scripting") {
      await expect(page.locator(".be-script-editor")).toBeVisible();
    }
    if (noTimeline.includes(name)) {
      await expect(page.locator("#timeline")).toBeHidden();
    } else {
      await expect(page.locator("#timeline")).toBeVisible();
    }
  }

  await openWorkspace(page, "Layout");
  await expect(page.locator("#timeline")).toBeVisible();
});

test("blender every workspace has an interactive editor surface", async ({ page }) => {
  await page.goto(BLENDER_URL);

  await openWorkspace(page, "Sculpting");
  await expect(page.locator("#viewport-region")).toBeVisible();
  await expect(page.locator("#viewport-toolbar .lg-toolbar__tool")).toHaveCount(6);
  await expect(page.locator("#viewport-toolbar .lg-toolbar__tool").first()).toHaveClass(/lg-toolbar__tool--active/);

  await openWorkspace(page, "UV Editing");
  await expect(page.locator("#uv-region")).toBeVisible();
  await expect(page.locator("#uv-editor")).toBeVisible();
  await expect(page.locator("#viewport-region")).toBeVisible();

  await openWorkspace(page, "Shading");
  await expect(page.locator("#nodes-region")).toBeVisible();
  await expect(page.locator("#shading-node-editor")).toBeVisible();
  await expect(page.locator("#shading-node-editor .lg-node-editor__node")).toHaveCount(4);
  await expect(page.locator("#shading-node-editor .lg-node-editor__link")).toHaveCount(3);

  await openWorkspace(page, "Animation");
  const timelineBox = await page.locator(".be-timeline-slot").boundingBox();
  expect(timelineBox?.height ?? 0).toBeGreaterThan(180);

  await openWorkspace(page, "Rendering");
  await expect(page.locator("#render-region")).toBeVisible();
  await expect(page.locator("#render-editor")).toBeVisible();
  await expect(page.locator("#render-editor .lg-image-editor__title")).toContainText("Render Result");
  await expect(page.locator("#viewport-region")).toBeHidden();

  await openWorkspace(page, "Compositing");
  await expect(page.locator("#compositing-node-editor .lg-node-editor__node")).toHaveCount(3);
  await expect(page.locator("#preview-region")).toBeVisible();
  await expect(page.locator("#preview-editor")).toBeVisible();

  await openWorkspace(page, "Geometry Nodes");
  await expect(page.locator("#geometry-node-editor .lg-node-editor__node")).toHaveCount(4);
  await expect(page.locator("#viewport-region")).toBeVisible();

  await openWorkspace(page, "Texture Paint");
  await expect(page.locator("#viewport-toolbar .lg-toolbar__tool")).toHaveCount(5);

  await openWorkspace(page, "Scripting");
  await expect(page.locator("#script-editor .lg-text-editor__textarea")).toBeVisible();
  await expect(page.locator(".be-script-editor")).toBeVisible();
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
  await expect(page.locator("#status-left")).toContainText("Location X");

  const transformPanel = page.locator(".be-prop-title", { hasText: "Transform" }).first();
  await transformPanel.click();
  await expect(page.locator(".be-prop-body").first()).toBeHidden();
  await transformPanel.click();
  await expect(page.locator(".be-prop-body").first()).toBeVisible();

  const lightRow = page.locator(".be-tree-row", { hasText: "Light" }).first();
  await lightRow.locator(".be-tree-eye").click();
  await expect(lightRow).toHaveClass(/hidden-object/);
  await lightRow.locator(".be-tree-eye").click();
  await expect(lightRow).not.toHaveClass(/hidden-object/);

  const cameraRow = page.locator(".be-tree-row", { hasText: "Camera" }).first();
  await cameraRow.locator(".be-tree-selectable").click();
  await expect(cameraRow.locator(".be-tree-selectable")).toHaveClass(/off/);
  await cameraRow.locator(".be-tree-selectable").click();
  await expect(cameraRow.locator(".be-tree-selectable")).not.toHaveClass(/off/);

  await page.locator("#viewport-header [data-menu='wire']").click();
  await expect(page.locator("#viewport-header [data-menu='wire']")).toHaveClass(/active/);
  await page.locator("#viewport-header [data-menu='solid']").click();
  await expect(page.locator("#viewport-header [data-menu='solid']")).toHaveClass(/active/);
});

test("blender timeline, playback and keyboard shortcuts work", async ({ page }) => {
  await page.goto(BLENDER_URL);

  const timeline = page.locator("#timeline-canvas");
  await timeline.click({ position: { x: 500, y: 45 } });
  const frame = page.locator("#frame-input");
  await expect(frame).not.toHaveValue("1");

  await page.locator("canvas.be-canvas").click({ position: { x: 470, y: 256 } });
  await page.keyboard.press("Space");
  await page.waitForTimeout(300);
  const playingFrame = Number(await frame.inputValue());
  expect(playingFrame).toBeGreaterThan(1);
  await page.keyboard.press("Space");

  await page.keyboard.press("n");
  await expect(page.locator("#viewport-sidebar")).toBeVisible();
  await expect(page.locator("#viewport-sidebar input[data-field='loc']").first()).toBeVisible();
  await page.keyboard.press("n");
  await expect(page.locator("#viewport-sidebar")).toBeHidden();

  await page.keyboard.press("t");
  await expect(page.locator("#viewport-toolbar")).toBeHidden();
  await page.keyboard.press("t");
  await expect(page.locator("#viewport-toolbar")).toBeVisible();

  await page.locator("canvas.be-canvas").click({ position: { x: 470, y: 256 } });
  await page.keyboard.press("Tab");
  await expect(page.locator("#viewport-header")).toContainText("Edit Mode");
  await page.keyboard.press("1");
  await expect(page.locator("#status-left")).toContainText("vertex");
  await page.keyboard.press("2");
  await expect(page.locator("#status-left")).toContainText("edge");
  await page.keyboard.press("Tab");
  await expect(page.locator("#viewport-header")).toContainText("Object Mode");

  await page.keyboard.press("Numpad1");
  await expect(page.locator("#status-left")).toContainText("Front Orthographic");

  await page.keyboard.press("Shift+a");
  await expect(page.locator(".be-popup")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".be-popup")).toHaveCount(0);

  await page.locator("canvas.be-canvas").click({ position: { x: 600, y: 380 }, button: "right" });
  await expect(page.locator(".be-popup")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".be-popup")).toHaveCount(0);

  await page.keyboard.press("f");
  await expect(page.locator("#status-left")).toContainText("Focused Cube");
});

test("blender G/R/S transform, cancel, and undo keep object state consistent", async ({ page }) => {
  await page.goto(BLENDER_URL);

  await page.locator("canvas.be-canvas").click({ position: { x: 470, y: 256 } });
  const locationX = page.locator(".be-prop-row", { hasText: "Location" }).first().locator("input").first();
  const initial = await locationX.inputValue();

  await page.mouse.move(470, 318);
  await page.keyboard.press("g");
  await expect(page.locator('#viewport-toolbar [data-tool="move"]')).toHaveClass(/active/);
  await page.mouse.move(530, 348, { steps: 4 });
  await page.keyboard.press("Enter");
  await expect(page.locator("#status-left")).toContainText("Transform applied");
  const moved = await locationX.inputValue();
  expect(moved).not.toBe(initial);

  await page.keyboard.press("Control+z");
  await expect(page.locator("#status-left")).toContainText("Undo");
  await expect(locationX).toHaveValue(initial);

  await page.mouse.move(470, 318);
  await page.keyboard.press("g");
  await page.mouse.move(540, 360, { steps: 4 });
  await page.mouse.click(540, 360, { button: "right" });
  await expect(page.locator("#status-left")).toContainText("Transform cancelled");
  await expect(page.locator(".be-popup")).toHaveCount(0);
  await expect(locationX).toHaveValue(initial);
});

test("blender node editor supports dragging, linking and node creation", async ({ page }) => {
  await page.goto(BLENDER_URL);
  await openWorkspace(page, "Shading");

  const nodes = page.locator("#shading-node-editor .lg-node-editor__node");
  await expect(nodes).toHaveCount(4);

  const noiseHeader = page.locator('.lg-node-editor__node[data-node-id="noise"] .lg-node-editor__node-header');
  const noiseBox = await noiseHeader.boundingBox();
  if (!noiseBox) throw new Error("noise node missing");
  await page.mouse.move(noiseBox.x + noiseBox.width / 2, noiseBox.y + noiseBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(noiseBox.x + noiseBox.width / 2 + 40, noiseBox.y + noiseBox.height / 2 + 16, { steps: 5 });
  await page.mouse.up();
  const movedLeft = await page.locator('.lg-node-editor__node[data-node-id="noise"]').evaluate((el) => (el as HTMLElement).style.left);
  expect(Number.parseFloat(movedLeft)).toBeGreaterThan(20);

  const source = page.locator('.lg-node-editor__port[data-node="noise"][data-port="color"][data-kind="output"] .lg-node-editor__dot');
  const target = page.locator('.lg-node-editor__port[data-node="principled"][data-port="rough"][data-kind="input"] .lg-node-editor__dot');
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  if (!sourceBox || !targetBox) throw new Error("ports missing");
  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 6 });
  await page.mouse.up();
  await expect(page.locator("#shading-node-editor .lg-node-editor__link")).toHaveCount(4);

  await page.locator("#nodes-header", { hasText: "Add Node" }).getByRole("button", { name: "Add Node" }).click();
  await page.locator(".be-popup-item", { hasText: "Noise Texture" }).first().click();
  await expect(nodes).toHaveCount(5);
  await expect(page.locator("#status-left")).toContainText("Added node");

  const addedNode = nodes.last().locator(".lg-node-editor__node-header");
  await addedNode.click();
  await page.keyboard.press("Delete");
  await expect(nodes).toHaveCount(4);
});

test("blender scripting text editor, tabs and run action work", async ({ page }) => {
  await page.goto(BLENDER_URL);
  await openWorkspace(page, "Scripting");

  const textarea = page.locator("#script-editor .lg-text-editor__textarea");
  await expect(textarea).toBeVisible();
  await textarea.click();
  await page.keyboard.press("Control+End");
  await page.keyboard.type("\n# e2e note");
  await expect(page.locator("#script-editor .lg-text-editor__gutter")).toContainText("11");

  await page.locator("#script-editor .lg-text-editor__tab", { hasText: "Console" }).click();
  await expect(page.locator("#script-editor .lg-text-editor__tab", { hasText: "Console" })).toHaveClass(/lg-text-editor__tab--active/);
  expect(await textarea.evaluate((el) => (el as HTMLTextAreaElement).readOnly)).toBe(true);
  await expect(textarea).toHaveValue(/Python 3/);

  await page.locator("#script-editor .lg-text-editor__tab", { hasText: "Text" }).click();
  await textarea.click();
  await page.keyboard.press("Control+Enter");
  await expect(page.locator("#status-left")).toContainText("Script executed");

  await page.locator("#script-editor .lg-text-editor__tab", { hasText: "Console" }).click();
  await expect(textarea).toHaveValue(/Run Text/);
});

test("blender image editors zoom, render and the right area resizer works", async ({ page }) => {
  await page.goto(BLENDER_URL);

  await openWorkspace(page, "UV Editing");
  const zoom = page.locator("#uv-editor .lg-image-editor__zoom");
  const beforeZoom = await zoom.textContent();
  await page.locator("#uv-editor .lg-image-editor__btn", { hasText: "+" }).click();
  await expect(zoom).not.toHaveText(beforeZoom ?? "");

  await page.locator("#menubar .be-menu-btn", { hasText: "Render" }).click();
  await page.locator(".be-popup-item", { hasText: "Render Image" }).first().click();
  await expect(page.locator("#status-left")).toContainText("Render complete", { timeout: 10_000 });
  await openWorkspace(page, "Rendering");
  await expect(page.locator("#render-editor .lg-image-editor__image")).toBeVisible();

  await openWorkspace(page, "Layout");
  const right = page.locator("#right-column");
  const beforeWidth = (await right.boundingBox())?.width ?? 0;
  const resizer = await page.locator("#right-resizer").boundingBox();
  if (!resizer) throw new Error("resizer missing");
  await page.mouse.move(resizer.x + 3, resizer.y + 100);
  await page.mouse.down();
  await page.mouse.move(resizer.x - 60, resizer.y + 100, { steps: 6 });
  await page.mouse.up();
  const afterWidth = (await right.boundingBox())?.width ?? 0;
  expect(afterWidth).toBeGreaterThan(beforeWidth + 20);
});
