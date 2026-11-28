import { expect, test } from "@playwright/test";

const WORDCRAFT_URL = process.env.LITEGUI_WORDCRAFT_URL ?? "http://127.0.0.1:5183/";

test("wordcraft mounts the Word-style workbench", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));

  await page.goto(WORDCRAFT_URL);

  await expect(page.locator(".wc-titlebar")).toBeVisible();
  await expect(page.locator(".wc-tab")).toHaveCount(11);
  await expect(page.locator("#ribbon-body .wc-group")).toHaveCount(5);
  await expect(page.locator(".wc-style-card")).toHaveCount(6);
  await expect(page.locator("#wc-page-1")).toBeVisible();
  await expect(page.locator("#wc-page-2")).toBeAttached();
  await expect(page.locator("#status-page")).toHaveText("Page 1 of 2");
  await expect(page.locator("#status-words")).toContainText("words");
  await expect(page.locator(".wc-doc-title")).toContainText("The Open Studio Handbook");

  expect(errors).toEqual([]);
});

test("ribbon tabs swap groups and keep the document mounted", async ({ page }) => {
  await page.goto(WORDCRAFT_URL);

  await page.locator('[data-tab="insert"]').click();
  await expect(page.locator(".wc-group__label", { hasText: "Tables" })).toBeVisible();
  await expect(page.locator(".wc-rbtn", { hasText: "Cover Page" })).toBeVisible();

  await page.locator('[data-tab="references"]').click();
  await expect(page.locator(".wc-rbtn", { hasText: "Insert Citation" })).toBeVisible();
  await expect(page.locator(".wc-rbtn", { hasText: "Insert Footnote" })).toBeVisible();

  await page.locator('[data-tab="review"]').click();
  await expect(page.locator(".wc-rbtn", { hasText: "Track Changes" })).toBeVisible();
  await expect(page.locator("#wc-page-1")).toBeVisible();

  await page.locator('[data-tab="view"]').click();
  await expect(page.locator(".wc-rbtn", { hasText: "Read Mode" })).toBeVisible();
});

test("styles, formatting and word count are interactive", async ({ page }) => {
  await page.goto(WORDCRAFT_URL);

  const heading = page.locator(".wc-page-body h2", { hasText: "Why share a studio?" });
  await heading.click();
  await page.locator('.wc-style-card[data-value="heading2"]').click();
  await expect(heading).toHaveAttribute("data-style", "heading2");

  const paragraph = page.locator(".wc-page-body p").first();
  await paragraph.click();
  await page.keyboard.press("Home");
  for (let index = 0; index < 5; index += 1) await page.keyboard.press("Shift+ArrowRight");
  await page.keyboard.press("Control+b");
  const selectionWeight = await page.evaluate(() => {
    const node = window.getSelection()?.anchorNode;
    const element = node?.nodeType === Node.ELEMENT_NODE ? (node as Element) : node?.parentElement;
    return element ? getComputedStyle(element).fontWeight : "";
  });
  expect(Number(selectionWeight)).toBeGreaterThanOrEqual(600);

  const before = await page.locator("#status-words").textContent();
  await page.locator(".wc-page-body p").first().click();
  await page.keyboard.press("End");
  await page.keyboard.type(" A new sentence.");
  await expect(page.locator("#status-words")).not.toHaveText(before ?? "");
});

test("track changes, comments and navigation work together", async ({ page }) => {
  await page.goto(WORDCRAFT_URL);

  await page.locator('[data-tab="review"]').click();
  await page.locator('.wc-rbtn[data-command="track-changes"]').click();
  await expect(page.locator("#wc-app")).toHaveClass(/wc-tracking/);
  await expect(page.locator("#status-track")).toBeVisible();
  await expect(page.locator(".wc-rbtn[data-command='track-changes']")).toHaveClass(/is-active/);

  await page.locator('.wc-rbtn[data-command="insert-comment"]').click();
  await page.locator("#comment-input").fill("Check the kiln booking wording.");
  await page.locator('[data-comment-action="post"]').click();
  await expect(page.locator(".wc-comment")).toHaveCount(4);
  await expect(page.locator("#comments-rail")).toBeVisible();

  await page.locator('[data-tab="home"]').click();
  await page.locator('.wc-rbtn[data-command="find"]').click();
  await page.locator("#find-input").fill("studio");
  await expect(page.locator("#find-count")).not.toHaveText("0 of 0");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Escape");

  await page.locator("#nav-search").fill("Membership");
  await expect(page.locator(".wc-nav-result").first()).toContainText(/membership/i);
  await expect(page.locator(".wc-nav-result")).not.toHaveCount(0);
  await page.locator("#nav-search").fill("");
  await page.locator('[data-nav-tab="pages"]').click();
  await expect(page.locator(".wc-nav-page")).toHaveCount(2);
});

test("layout, zoom and dark mode update the shell", async ({ page }) => {
  await page.goto(WORDCRAFT_URL);

  await page.locator('[data-tab="layout"]').click();
  await page.locator('[data-command="orientation"]').click();
  await page.locator(".wc-popup__item", { hasText: "Landscape" }).click();
  await expect(page.locator("#wc-page-1")).toHaveCSS("width", "1100px");

  await page.locator('[data-command="margins"]').click();
  await page.locator(".wc-popup__item", { hasText: "Narrow" }).click();
  await expect(page.locator("#wc-page-1")).toHaveCSS("padding-left", "30px");

  await page.locator('[data-command="zoom-in"]').click();
  await expect(page.locator("#status-zoom")).toHaveText("110%");

  await page.locator('[data-tab="view"]').click();
  await page.locator('.wc-rbtn[data-command="dark-mode"]').click();
  await expect(page.locator("#wc-app")).toHaveClass(/wc-dark/);
  await expect(page.locator("#wc-app")).toHaveCSS("background-color", "rgb(32, 32, 32)");
});

test("references insert a table of contents and fill the page", async ({ page }) => {
  await page.goto(WORDCRAFT_URL);
  await page.locator('[data-tab="references"]').click();
  await page.locator('.wc-rbtn[data-command="insert-toc"]').click();
  await expect(page.locator("[data-toc]")).toBeVisible();
  await expect(page.locator(".wc-toc__row")).not.toHaveCount(0);

  await page.locator('.wc-rbtn[data-command="insert-bibliography"]').click();
  await expect(page.locator("[data-bibliography]")).toBeVisible();
  await expect(page.locator(".wc-reference")).toHaveCount(3);
});

test("file backstage opens and closes", async ({ page }) => {
  await page.goto(WORDCRAFT_URL);
  await page.locator(".wc-tab--file").click();
  await expect(page.locator("#backstage")).toBeVisible();
  await page.locator(".wc-backstage__nav-item", { hasText: "Info" }).click();
  await expect(page.locator("#backstage-panel")).toContainText("Location");
  await page.locator(".wc-backstage__back").click();
  await expect(page.locator("#backstage")).toBeHidden();
});
