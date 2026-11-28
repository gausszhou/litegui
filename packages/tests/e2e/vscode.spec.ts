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
  await expect(page.locator(".lg-menu__item")).toHaveText([
    "File",
    "Edit",
    "Selection",
    "View",
    "Go",
    "Run",
    "Terminal",
    "Help"
  ]);
  await expect(page.locator(".lg-toolbar__tool")).toHaveCount(5);
  await expect(page.locator(".app-tree .ltreeitem")).toHaveCount(19);
  await expect(page.locator(".app-titlebar .lg-searchbox__input")).toBeVisible();

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

test("menu bar opens and closes the File menu", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(VSCODE_URL, { waitUntil: "networkidle" });

  await page.locator(".lg-menu__item", { hasText: "File" }).click();
  await expect(page.locator(".lg-menu__panel")).toBeVisible();
  await expect(page.locator(".lg-menu__panel-item")).toHaveText(["New File", "Save", "Close Editor", "Open File"]);

  await page.locator(".lg-menu__item", { hasText: "File" }).click();
  await expect(page.locator(".lg-menu__panel")).toHaveCount(0);
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
