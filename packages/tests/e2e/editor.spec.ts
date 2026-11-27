import { expect, test, type Locator, type Page } from "@playwright/test";

const EDITOR_URL = process.env.LITEGUI_EDITOR_URL ?? "http://127.0.0.1:5174/";

/** boundingBox 可能为 null，统一断言后再取值，避免测试里到处写 ! */
async function boxOf(locator: Locator, label = "element") {
  const box = await locator.boundingBox();
  expect(box, `${label} 应该有布局盒`).not.toBeNull();
  return box as { x: number; y: number; width: number; height: number };
}

async function openEditor(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(EDITOR_URL);
  await expect(page.locator(".lg-menu__item").first()).toBeVisible();
  await expect(page.locator(".lg-area").first()).toBeVisible();
  return errors;
}

test("页面铺满视口，右侧面板不超出 viewport", async ({ page }) => {
  const errors = await openEditor(page);
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();

  // #app 必须真正撑满视口（之前是 0 高，导致 Area 撑破页面）
  const appBox = await boxOf(page.locator("#app"), "#app");
  expect(appBox.width).toBeCloseTo(viewport!.width, 0);
  expect(appBox.height).toBeCloseTo(viewport!.height, 0);
  expect(appBox.height).toBeGreaterThan(0);

  // 页面本身不滚动：所有内容都在视口内
  const scroll = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    bodyMargin: getComputedStyle(document.body).margin
  }));
  expect(scroll.bodyMargin).toBe("0px");
  expect(scroll.width).toBeLessThanOrEqual(viewport!.width + 1);
  expect(scroll.height).toBeLessThanOrEqual(viewport!.height + 1);

  // 顶部主菜单约 30px，Area 在它下方铺满剩余高度
  const menuBox = await boxOf(page.locator(".lg-menu").first(), "menubar");
  expect(menuBox.height).toBeGreaterThanOrEqual(28);
  expect(menuBox.height).toBeLessThanOrEqual(32);
  const areaBox = await boxOf(page.locator("#mainarea"), "mainarea");
  expect(areaBox.y).toBeCloseTo(menuBox.height, 0);
  expect(areaBox.height).toBeCloseTo(viewport!.height - menuBox.height, 0);

  // 右侧 dock 面板 320-360 宽，且四边都不越界
  const panel = page.locator("#right-panel");
  const panelBox = await boxOf(panel, "right panel");
  expect(panelBox.width).toBeGreaterThanOrEqual(320);
  expect(panelBox.width).toBeLessThanOrEqual(360);
  expect(panelBox.x).toBeGreaterThanOrEqual(0);
  expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(viewport!.width + 0.5);
  expect(panelBox.y + panelBox.height).toBeLessThanOrEqual(viewport!.height + 0.5);

  // 面板内容区被约束在面板内（内部滚动/裁剪），而不是把页面撑高
  const contentOverflow = await panel
    .locator("> .lg-panel__content")
    .evaluate((element) => getComputedStyle(element).overflowY);
  expect(["auto", "scroll", "hidden"]).toContain(contentOverflow);
  await expect(page.locator("#bottom-panel")).toBeVisible();
  await expect(page.locator(".lg-dialog").first()).toBeVisible();

  expect(errors).toEqual([]);
});

test("顶部菜单可以打开、关闭并执行菜单项", async ({ page }) => {
  await page.goto(EDITOR_URL);

  const fileButton = page.locator(".lg-menu__item", { hasText: "File" }).first();
  await fileButton.click();
  await expect(page.locator(".lg-menu__panel").first()).toBeVisible();
  await expect(page.locator(".lg-menu__panel-item", { hasText: "New" }).first()).toBeVisible();

  // 下拉项右侧显示快捷键（与 Blender 菜单一致）
  const saveItem = page
    .locator(".lg-menu__panel-item")
    .filter({ has: page.locator(".lg-menu__name", { hasText: /^Save$/ }) })
    .first();
  await expect(saveItem.locator(".lg-menu__shortcut")).toHaveText("Ctrl+S");

  // 再次点击同一个主菜单项收起面板
  await fileButton.click();
  await expect(page.locator(".lg-menu__panel")).toHaveCount(0);

  // 点击菜单外面也能收起
  await fileButton.click();
  await expect(page.locator(".lg-menu__panel").first()).toBeVisible();
  await page.mouse.click(30, 400);
  await expect(page.locator(".lg-menu__panel")).toHaveCount(0);

  // Esc 也能收起
  await fileButton.click();
  await expect(page.locator(".lg-menu__panel").first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".lg-menu__panel")).toHaveCount(0);

  // View > Fixed size / Maximize 真正执行（createMenu() 里的回调生效）
  const viewButton = page.locator(".lg-menu__item", { hasText: "View" }).first();
  await viewButton.click();
  await page.locator(".lg-menu__panel-item", { hasText: "Fixed size" }).first().click();
  await expect(page.locator(".lg-app")).toHaveCSS("width", "1000px");
  await expect(page.locator(".lg-app")).toHaveCSS("height", "600px");

  await viewButton.click();
  await page.locator(".lg-menu__panel-item", { hasText: "Maximize" }).first().click();
  const viewport = page.viewportSize()!;
  const appBox = await boxOf(page.locator(".lg-app"), ".lg-app");
  expect(appBox.width).toBeCloseTo(viewport.width, 0);
  expect(appBox.height).toBeCloseTo(viewport.height, 0);
});

test("Table 浮窗有数据行且列宽一致，Dialog 可以拖动和关闭", async ({ page }) => {
  await page.goto(EDITOR_URL);

  const tableDialog = page.locator(".lg-dialog", { hasText: "Table dialog" });
  await expect(tableDialog).toBeVisible();
  const table = tableDialog.locator(".lg-table");
  await expect(table).toBeVisible();

  // 表头 3 列 + 10 行数据
  await expect(table.locator("th")).toHaveCount(3);
  await expect(table.locator("tr")).toHaveCount(11);
  const firstRowCells = table.locator("tr").nth(1).locator("td");
  await expect(firstRowCells).toHaveCount(3);
  await expect(firstRowCells.first()).not.toBeEmpty();

  // 表头列宽和首行单元格一致（不再错位/换行）
  const headerWidths = await table.locator("th").evaluateAll((cells) =>
    cells.map((cell) => Math.round(cell.getBoundingClientRect().width / 2) * 2)
  );
  const cellWidths = await firstRowCells.evaluateAll((cells) =>
    cells.map((cell) => Math.round(cell.getBoundingClientRect().width / 2) * 2)
  );
  expect(cellWidths).toEqual(headerWidths);

  // 数据行都在同一行内（没有被挤成两行）
  const cellTops = await firstRowCells.evaluateAll((cells) => cells.map((cell) => Math.round(cell.getBoundingClientRect().top)));
  expect(new Set(cellTops).size).toBe(1);

  // 不再有最小化按钮（最小化对编辑器没有意义，已从 Dialog 配置中移除）
  await expect(tableDialog.locator(".lg-dialog__button--minimize")).toHaveCount(0);

  // 拖动标题栏：首次按下就跟随鼠标，不会跳
  const before = await boxOf(tableDialog, "dialog");
  const header = await boxOf(tableDialog.locator("> .lg-dialog__header"), "dialog header");
  const startX = header.x + 80;
  const startY = header.y + header.height / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 40, startY + 30, { steps: 6 });
  await page.mouse.up();
  await expect.poll(async () => Math.round((await boxOf(tableDialog, "dialog")).x - before.x)).toBe(40);
  const after = await boxOf(tableDialog, "dialog");
  expect(Math.round(after.y - before.y)).toBe(30);
  const viewport = page.viewportSize()!;
  expect(after.x).toBeGreaterThanOrEqual(0);
  expect(after.y).toBeGreaterThanOrEqual(0);
  expect(after.x + after.width).toBeLessThanOrEqual(viewport.width + 0.5);
  expect(after.y + after.height).toBeLessThanOrEqual(viewport.height + 0.5);

  // 关闭第一个浮窗
  const dialogs = page.locator(".lg-dialog");
  const countBefore = await dialogs.count();
  await tableDialog.locator(".lg-dialog__button--close").click();
  await expect(dialogs).toHaveCount(countBefore - 1);
});

test("Tree 右键菜单可以打开并在点击别处后关闭", async ({ page }) => {
  await page.goto(EDITOR_URL);

  const node = page.locator('.editor-tree .ltreeitem[data-item_id="Child2"]');
  await node.click({ button: "right" });
  const menu = page.locator(".lg-context-menu");
  await expect(menu).toBeVisible();
  await expect(menu.locator(".lg-context-menu__item", { hasText: "Rename" })).toBeVisible();

  await page.mouse.click(30, 400);
  await expect(menu).toHaveCount(0);
});

test("面板关闭后可以通过 View 菜单重新打开", async ({ page }) => {
  await page.goto(EDITOR_URL);

  const panel = page.locator("#right-panel");
  const areaBefore = await boxOf(page.locator("#canvasarea"), "canvas area");
  await panel.locator("> .lg-panel__header .lg-panel__close").click();
  await expect(page.locator("#right-panel")).toHaveCount(0);
  const areaAfter = await boxOf(page.locator("#canvasarea"), "canvas area");
  expect(areaAfter.width).toBeGreaterThan(areaBefore.width + 200);

  // 从菜单恢复，面板内容（tab / tree / inspector）都在
  await page.locator(".lg-menu__item", { hasText: "View" }).first().click();
  await page.locator(".lg-menu__panel-item", { hasText: "Side panel" }).first().click();
  await expect(page.locator("#right-panel")).toBeVisible();
  await expect(page.locator("#right-panel .lg-tabs__tab")).toHaveCount(3);
  await expect(page.locator("#right-panel .editor-tree")).toBeVisible();
  await expect(page.locator("#right-panel .editor-inspector")).toBeVisible();

  const box = await boxOf(page.locator("#right-panel"), "right panel");
  const viewport = page.viewportSize()!;
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 0.5);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 0.5);
});

test("默认主题是 Blender 深色", async ({ page }) => {
  await page.goto(EDITOR_URL);

  const panel = page.locator("#right-panel");
  await expect(panel).toHaveCSS("background-color", "rgb(46, 46, 46)");
  await expect(panel.locator("> .lg-panel__header")).toHaveCSS("background-color", "rgb(43, 43, 43)");
  await expect(panel.locator("> .lg-panel__header")).toHaveCSS("color", "rgb(240, 240, 240)");

  // 面板头 30px、正文 13px
  const headerBox = await boxOf(panel.locator("> .lg-panel__header"), "panel header");
  expect(headerBox.height).toBeCloseTo(30, 0);
  await expect(panel.locator("> .lg-panel__header .lg-panel__title")).toHaveCSS("font-size", "13px");

  // 没有浅色主题标记，也没有旧的紫色渐变
  await expect(page.locator("html")).not.toHaveAttribute("data-lg-theme", "light");
  await expect(panel).toHaveCSS("background-image", "none");
});

test("右侧面板：三个 tab、Tree 选择、26px 行高", async ({ page }) => {
  await page.goto(EDITOR_URL);

  const tabs = page.locator(".editor-tabs");
  await expect(tabs.locator(".lg-tabs__tab")).toHaveCount(3);
  await expect(tabs.locator(".lg-tabs__tab", { hasText: "Info" })).toBeVisible();
  await expect(tabs.locator(".lg-tabs__tab", { hasText: "Tree" })).toBeVisible();
  await expect(tabs.locator(".lg-tabs__tab", { hasText: "Extra" })).toBeVisible();

  // tab 切换
  await tabs.locator(".lg-tabs__tab", { hasText: "Info" }).click();
  await expect(page.locator(".lg-tabs__panel", { hasText: "LiteGUI 经典编辑器布局" })).toBeVisible();
  await tabs.locator(".lg-tabs__tab", { hasText: "Extra" }).click();
  await expect(page.locator(".lg-tabs__panel", { hasText: "独立滚动" })).toBeVisible();
  await tabs.locator(".lg-tabs__tab", { hasText: "Tree" }).click();

  // Tree 行高 26px
  const node = page.locator('.editor-tree .ltreeitem[data-item_id="Child2"]');
  await expect(node).toBeVisible();
  const nodeBox = await boxOf(node, "tree node");
  expect(Math.round(nodeBox.height)).toBe(26);

  // 点击选中
  await node.click();
  await expect(node).toHaveClass(/selected/);
  await expect(page.locator(".lg-console__log")).toContainText("Tree selected: Child2");

  // Tree 不撑破右侧面板
  const panelBox = await boxOf(page.locator("#right-panel"), "right panel");
  const treeBox = await boxOf(page.locator(".editor-tree"), "tree");
  expect(treeBox.x + treeBox.width).toBeLessThanOrEqual(panelBox.x + panelBox.width);
  expect(treeBox.y + treeBox.height).toBeLessThanOrEqual(panelBox.y + panelBox.height);
});

test("Inspector 可编辑，标签列与向量控件不重叠", async ({ page }) => {
  await page.goto(EDITOR_URL);

  // 标签列 88-100px
  const stringRows = page
    .locator(".editor-inspector .widget")
    .filter({ has: page.locator(".wname", { hasText: /^String$/ }) });
  await expect(stringRows).toHaveCount(1);
  const stringRow = stringRows.first();
  const nameWidth = await stringRow
    .locator(".wname")
    .evaluate((element) => element.getBoundingClientRect().width);
  expect(nameWidth).toBeGreaterThanOrEqual(88);
  expect(nameWidth).toBeLessThanOrEqual(100);

  // 编辑后值保留，并触发 onchange（写到底部 Console）
  const stringInput = stringRow.locator("input").first();
  await stringInput.fill("hello");
  await stringInput.press("Enter");
  await expect(stringInput).toHaveValue("hello");
  await expect(page.locator(".lg-console__log")).toContainText('Widget change: String -> "hello"');

  // Vector3 三个分量在同一行、从左到右不重叠
  const vectorRows = page
    .locator(".editor-inspector .widget")
    .filter({ has: page.locator(".wname", { hasText: /^Vector3$/ }) });
  await expect(vectorRows).toHaveCount(1);
  const vectorRow = vectorRows.first();
  const inputs = vectorRow.locator("input");
  await expect(inputs).toHaveCount(3);
  const boxes = await inputs.evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
    })
  );
  expect(new Set(boxes.map((box) => Math.round(box.top))).size).toBe(1);
  for (let i = 1; i < boxes.length; i += 1) {
    expect(boxes[i].left).toBeGreaterThanOrEqual(boxes[i - 1].right - 1);
  }

  // 控件不超出面板右边界
  const panelBox = await boxOf(page.locator("#right-panel"), "right panel");
  for (const box of boxes) {
    expect(box.right).toBeLessThanOrEqual(panelBox.x + panelBox.width);
  }
});

test("拖动面板分隔条可以调整右侧面板宽度", async ({ page }) => {
  await page.goto(EDITOR_URL);

  const splitbar = page.locator("#mainarea > .lg-area__splitbar--horizontal");
  await expect(splitbar).toBeVisible();
  const barBox = await boxOf(splitbar, "splitbar");
  const panel = page.locator("#right-panel");
  const before = await boxOf(panel, "right panel");

  // 从分隔条靠上的位置开始拖，避免和浮动窗口重叠
  const dragY = barBox.y + 16;
  const dragX = barBox.x + barBox.width / 2;
  await page.mouse.move(dragX, dragY);
  await page.mouse.down();
  await page.mouse.move(dragX - 60, dragY, { steps: 6 });
  await page.mouse.up();

  const after = await boxOf(panel, "right panel");
  expect(after.width).toBeGreaterThan(before.width + 30);

  // 拖动后依然不超出视口
  const viewport = page.viewportSize()!;
  expect(after.x + after.width).toBeLessThanOrEqual(viewport.width + 0.5);
  expect(after.y + after.height).toBeLessThanOrEqual(viewport.height + 0.5);
});
