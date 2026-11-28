import { expect, test } from "@playwright/test";

const VSCODE_URL = "http://127.0.0.1:5173/";

function collectPageErrors(page: import("@playwright/test").Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

test("vscode boots the VS Code-style shell without errors", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(VSCODE_URL, { waitUntil: "networkidle" });

  await expect(page).toHaveTitle("LiteGUI VS Code");
  await expect(page.locator("#activity-menu")).toBeVisible();
  await page.locator("#activity-menu").click();
  await expect(page.locator(".app-menu-flyout--root .app-menu-flyout__label")).toHaveText([
    "File",
    "Edit",
    "Selection",
    "View",
    "Go",
    "Run",
    "Terminal",
    "Help"
  ]);
  await page.keyboard.press("Escape");
  await expect(page.locator(".lg-toolbar__tool")).toHaveCount(5);
  await expect(page.locator(".app-tree .ltreeitem")).toHaveCount(19);
  await expect(page.locator(".app-titlebar .lg-searchbox__input")).toBeVisible();
  await expect(page.locator("#nav-back")).toBeDisabled();
  await expect(page.locator("#nav-forward")).toBeDisabled();
  await expect(page.locator(".app-titlebar__layout")).toHaveCount(4);

  await expect(page.locator("#editor-tabs .lg-tabs__tab")).toHaveCount(1);
  await expect(page.locator("#editor-tabs .lg-tabs__tab--selected .lg-tabs__tab-title")).toHaveText("main.ts");
  await expect(page.locator("#editor-tabs .lg-tabs__panel[aria-hidden='false'] .monaco-editor .view-lines")).toContainText(
    /new\s+App\(\)/
  );
  await expect(page.locator("#breadcrumb")).toContainText("src");

  const status = page.locator(".lg-status-bar");
  await expect(status).toContainText("master");
  await expect(status).toContainText("Ln 1, Col 1");
  await expect(status).toContainText("UTF-8");
  await expect(status).toContainText("TypeScript");

  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(/[\u4e00-\u9fff]/);
  await expect(page.locator("a")).toHaveCount(0);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});

test("Explorer opens files in tabs and tabs can be closed", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(VSCODE_URL, { waitUntil: "networkidle" });

  await page.locator(".app-tree .ltreeitem", { hasText: "README.md" }).click();
  await expect(page.locator("#editor-tabs .lg-tabs__tab")).toHaveCount(2);
  await expect(page.locator("#editor-tabs .lg-tabs__tab--selected .lg-tabs__tab-title")).toHaveText("README.md");
  await expect(page.locator("#editor-tabs .lg-tabs__panel[aria-hidden='false'] .monaco-editor .view-lines")).toContainText(
    /LiteGUI\s+VS\s+Code/
  );
  await expect(page.locator("#breadcrumb")).toContainText("README.md");

  await page.locator("#editor-tabs .lg-tabs__tab--selected .app-tab-close").click();
  await expect(page.locator("#editor-tabs .lg-tabs__tab")).toHaveCount(1);
  await expect(page.locator("#editor-tabs .lg-tabs__tab--selected .lg-tabs__tab-title")).toHaveText("main.ts");

  expect(errors).toEqual([]);
});

test("the editor accepts typing and tracks the cursor in the status bar", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(VSCODE_URL, { waitUntil: "networkidle" });

  const editor = page.locator("#editor-tabs .lg-tabs__panel[aria-hidden='false'] .monaco-editor");
  await editor.click();
  await page.keyboard.press("Control+Home");
  await page.keyboard.type("const value = 42;");
  await page.keyboard.press("Enter");
  await page.keyboard.type("console.log(value);");

  await expect(page.locator(".lg-status-bar")).toContainText("Ln 2");
  await expect(page.locator(".app-status__branch-name")).toHaveText("master*");
  await expect(page.locator("#editor-tabs .lg-tabs__tab--selected .lg-tabs__tab-title")).toContainText("●");

  await page.keyboard.press("Control+S");
  await expect(page.locator(".app-toast")).toContainText("Saved main.ts");
  await expect(page.locator(".app-status__branch-name")).toHaveText("master");
  expect(errors).toEqual([]);
});

test("activity menu opens the File submenu", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(VSCODE_URL, { waitUntil: "networkidle" });

  await page.locator("#activity-menu").click();
  const root = page.locator(".app-menu-flyout--root");
  await expect(root).toBeVisible();
  await expect(root.locator(".app-menu-flyout__label")).toHaveText([
    "File",
    "Edit",
    "Selection",
    "View",
    "Go",
    "Run",
    "Terminal",
    "Help"
  ]);

  await root.locator(".app-menu-flyout__item", { hasText: "File" }).hover();
  const submenu = page.locator(".app-menu-flyout--submenu");
  await expect(submenu).toBeVisible();
  await expect(submenu.locator(".app-menu-flyout__label")).toHaveText([
    "New Text File",
    "New File…",
    "Open File…",
    "Save",
    "Close Editor"
  ]);

  await page.keyboard.press("Escape");
  await expect(root).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("Ctrl+Shift+P opens and filters the command palette", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(VSCODE_URL, { waitUntil: "networkidle" });

  await page.keyboard.press("Control+Shift+P");
  const palette = page.locator("#command-palette");
  await expect(palette).toBeVisible();
  await expect(page.locator("#command-input")).toBeFocused();
  await expect(page.locator(".app-command-item")).toHaveCount(13);

  await page.locator("#command-input").fill("theme");
  await expect(page.locator(".app-command-item")).toHaveCount(1);
  await expect(page.locator(".app-command-item")).toContainText("View: Toggle Theme");

  await page.keyboard.press("Escape");
  await expect(palette).toBeHidden();
  expect(errors).toEqual([]);
});

test("title bar search filters the Explorer tree", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(VSCODE_URL, { waitUntil: "networkidle" });

  const search = page.locator(".app-titlebar .lg-searchbox__input");
  await search.fill("Button");

  await expect(page.locator(".app-tree .ltreeitem", { hasText: "Button.ts" })).toBeVisible();
  await expect(page.locator(".app-tree .ltreeitem", { hasText: "main.ts" })).toHaveCount(0);
  await expect(page.locator(".app-sidebar .lg-panel__title")).toContainText(/results/i);

  await search.fill("");
  await expect(page.locator(".app-tree .ltreeitem", { hasText: "main.ts" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("right-clicking a file in the Explorer opens the context menu", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(VSCODE_URL, { waitUntil: "networkidle" });

  await page.locator(".app-tree .ltreeitem", { hasText: "package.json" }).click({ button: "right" });
  const menu = page.locator(".lg-context-menu");
  await expect(menu).toBeVisible();
  await expect(menu.locator(".lg-context-menu__item:not(.lg-context-menu__item--separator)")).toHaveText([
    "Open",
    "Copy Path",
    "Delete"
  ]);

  await menu.locator(".lg-context-menu__item", { hasText: "Open" }).click();
  await expect(page.locator("#editor-tabs .lg-tabs__tab--selected .lg-tabs__tab-title")).toHaveText("package.json");
  expect(errors).toEqual([]);
});

test("the bottom-left Manage menu mirrors the VS Code manage flyout", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(VSCODE_URL, { waitUntil: "networkidle" });

  await expect(page.locator("#manage-button")).toBeVisible();
  await page.locator("#manage-button").click();

  const menu = page.locator(".app-menu-flyout--root");
  await expect(menu).toBeVisible();
  await expect(menu.locator(".app-menu-flyout__label")).toHaveText([
    "Command Palette…",
    "Profile (Default)",
    "Settings",
    "Extensions",
    "Keyboard Shortcuts",
    "Snippets",
    "Tasks",
    "Themes",
    "Layout Density",
    "Backup and Sync Settings…",
    "Check for Updates…"
  ]);
  await expect(menu.locator(".app-menu-flyout__shortcut")).toHaveText([
    "Ctrl+Shift+P",
    "Ctrl+,",
    "Ctrl+Shift+X",
    "Ctrl+K Ctrl+S"
  ]);
  await expect(menu.locator(".app-menu-flyout__more")).toHaveCount(3);

  await menu.locator(".app-menu-flyout__item", { hasText: "Themes" }).hover();
  const submenu = page.locator(".app-menu-flyout--submenu");
  await expect(submenu).toBeVisible();
  await expect(submenu.locator(".app-menu-flyout__label")).toHaveText(["Dark Modern", "Light Modern", "Browse Themes…"]);
  await expect(submenu.locator(".app-menu-flyout__item--checked")).toContainText("Dark Modern");

  await submenu.locator(".app-menu-flyout__item", { hasText: "Light Modern" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-lg-theme", "light");
  await expect(page.locator(".app-menu-flyout")).toHaveCount(0);

  await page.locator("#manage-button").click();
  await page.locator(".app-menu-flyout__item", { hasText: "Layout Density" }).hover();
  await page
    .locator(".app-menu-flyout--submenu .app-menu-flyout__item", { hasText: "Compact" })
    .click();
  await expect(page.locator("#app-shell")).toHaveClass(/density-compact/);
  await expect(page.locator(".app-menu-flyout")).toHaveCount(0);

  await page.locator("#manage-button").click();
  await page.keyboard.press("Escape");
  await expect(page.locator(".app-menu-flyout")).toHaveCount(0);

  await page.locator("#account-button").click();
  await expect(page.locator(".app-menu-flyout__item", { hasText: "You are not signed in" })).toBeVisible();
  await page.keyboard.press("Escape");

  await page.locator("#manage-button").click();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.locator("#command-palette")).toBeVisible();
  expect(errors).toEqual([]);
});

test("title bar history and layout controls work", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(VSCODE_URL, { waitUntil: "networkidle" });

  await page.locator(".app-tree .ltreeitem", { hasText: "package.json" }).click();
  await expect(page.locator("#editor-tabs .lg-tabs__tab--selected .lg-tabs__tab-title")).toHaveText("package.json");
  await expect(page.locator("#nav-back")).toBeEnabled();

  await page.locator("#nav-back").click();
  await expect(page.locator("#editor-tabs .lg-tabs__tab--selected .lg-tabs__tab-title")).toHaveText("main.ts");
  await expect(page.locator("#nav-forward")).toBeEnabled();

  await page.locator("#nav-forward").click();
  await expect(page.locator("#editor-tabs .lg-tabs__tab--selected .lg-tabs__tab-title")).toHaveText("package.json");

  await page.locator("#layout-sidebar").click();
  await expect(page.locator("#app-shell")).toHaveClass(/sidebar-hidden/);
  await page.locator("#layout-sidebar").click();
  await expect(page.locator("#app-shell")).not.toHaveClass(/sidebar-hidden/);

  await page.locator("#layout-panel").click();
  await expect(page.locator("#terminal-drawer")).toBeVisible();
  await page.locator("#layout-panel").click();
  await expect(page.locator("#terminal-drawer")).toBeHidden();

  await page.locator("#layout-activity").click();
  await expect(page.locator("#app-shell")).toHaveClass(/activity-hidden/);
  await page.locator("#layout-activity").click();
  await expect(page.locator("#app-shell")).not.toHaveClass(/activity-hidden/);

  await page.locator("#titlebar-account").click();
  await expect(page.locator(".app-menu-flyout__item", { hasText: "You are not signed in" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".app-menu-flyout")).toHaveCount(0);

  expect(errors).toEqual([]);
});

test("status bar language and layout menus work", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(VSCODE_URL, { waitUntil: "networkidle" });

  await page.locator("#layout-customize").click();
  await expect(page.locator(".app-menu-flyout__item", { hasText: "Primary Side Bar" })).toBeVisible();
  await page.locator(".app-menu-flyout__item", { hasText: "Minimap" }).click();
  await expect(page.locator(".app-menu-flyout")).toHaveCount(0);

  await page.locator("#status-language").click();
  await expect(page.locator(".app-menu-flyout__item", { hasText: "JSON" })).toBeVisible();
  await page.locator(".app-menu-flyout__item", { hasText: "JSON" }).click();
  await expect(page.locator("#status-language")).toContainText("JSON");

  expect(errors).toEqual([]);
});

test("explorer mirrors VS Code file tree chrome", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(VSCODE_URL, { waitUntil: "networkidle" });

  await expect(page.locator(".app-sidebar .lg-panel__title")).toHaveText("Folders");
  await expect(page.locator(".app-tree-action")).toHaveCount(4);
  await expect(
    page.locator(".app-tree .ltreeitem", { hasText: "package.json" }).locator(".app-file-icon--npm")
  ).toBeVisible();
  await expect(page.locator(".app-git-badge--R")).toHaveCount(2);
  await expect(page.locator(".app-folder-icon").first()).toBeVisible();
  await expect(page.locator(".app-timeline__header")).toContainText("Timeline");

  await page.locator(".app-sidebar__menu").click();
  await expect(page.locator(".app-menu-flyout__item", { hasText: "Collapse Folders in Explorer" })).toBeVisible();
  await page.keyboard.press("Escape");

  await page.locator(".app-timeline__header").click();
  await expect(page.locator(".app-timeline__body")).toBeVisible();
  await expect(page.locator(".app-timeline__item")).toHaveCount(3);

  const srcRow = page.locator('[data-item_id="dir:src"]');
  await srcRow.click();
  await expect(page.locator('[data-item_id="dir:src/components"]')).toBeHidden();
  await srcRow.click();
  await expect(page.locator('[data-item_id="dir:src/components"]')).toBeVisible();

  await page.locator('.app-tree-action[data-tree-action="new-file"]').click();
  await expect(page.locator("#editor-tabs .lg-tabs__tab--selected .lg-tabs__tab-title")).toContainText("untitled-1.ts");
  await expect(page.locator(".app-tree .ltreeitem")).toHaveCount(20);

  await page.locator('.app-tree-action[data-tree-action="collapse-all"]').click();
  expect(await page.locator(".app-tree .ltreeitem.hidden").count()).toBeGreaterThan(0);

  expect(errors).toEqual([]);
});
