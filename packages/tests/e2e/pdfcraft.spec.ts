import { expect, test } from "@playwright/test";

const PDFCRAFT_URL = process.env.LITEGUI_PDFCRAFT_URL ?? "http://127.0.0.1:5182/";

test("pdfcraft mounts the PDF workbench with the showcase document", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));

  await page.goto(PDFCRAFT_URL);

  await expect(page.locator(".pf-app")).toBeVisible();
  await expect(page.locator(".pf-tab-name")).toHaveText("pdfcraft-showcase.pdf");
  await expect(page.locator(".pf-page-wrap")).toHaveCount(13);
  await expect(page.locator(".pf-tools-head h2")).toHaveText("All tools");
  await expect(page.locator(".pf-comment")).toHaveCount(14);
  await expect(page.locator("#pf-banner")).toContainText("13 interactive form fields");
  await expect(page.locator("#pf-status-right")).toContainText("US Letter");
  await expect(page.locator("#pf-dock")).toBeVisible();

  expect(errors).toEqual([]);
});

test("page navigation, find-as-you-type and the command palette work", async ({ page }) => {
  await page.goto(PDFCRAFT_URL);

  await page.fill("#pf-page-input", "4");
  await page.press("#pf-page-input", "Enter");
  await expect(page.locator("#pf-status-right")).toContainText("Page 4 of 13");

  await page.keyboard.press("Control+f");
  await page.fill("#pf-find-input", "type");
  await expect(page.locator("#pf-findbar")).toBeVisible();
  await expect.poll(async () => page.locator("mark.pf-hit").count()).toBeGreaterThan(10);
  await page.keyboard.press("Escape");
  await expect(page.locator("mark.pf-hit")).toHaveCount(0);

  await page.keyboard.press("Control+k");
  await expect(page.locator(".pf-palette")).toBeVisible();
  await page.fill("#pf-palette-input", "organize");
  await page.keyboard.press("Enter");
  await expect(page.locator(".pf-organizer")).toBeVisible();
  await expect(page.locator(".pf-org-card")).toHaveCount(13);
  await page.keyboard.press("Escape");
  await expect(page.locator(".pf-organizer")).toBeHidden();
});

test("text selections become threaded comments and move to the side panel", async ({ page }) => {
  await page.goto(PDFCRAFT_URL);

  await page.evaluate(() => {
    const wrap = document.querySelectorAll(".pf-page-wrap")[3];
    wrap.scrollIntoView({ block: "center" });
    const paragraph = wrap.querySelector(".pg-chapter-cols .pg-para");
    if (!paragraph) throw new Error("chapter paragraph missing");
    const range = document.createRange();
    range.selectNodeContents(paragraph);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    paragraph.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
  });

  await expect(page.locator(".pf-selpop")).toBeVisible();
  await page.locator('.pf-selpop [data-sel="highlight"]').click();
  await expect(page.locator(".pf-comment")).toHaveCount(15);
  await expect(page.locator(".pg-annot-highlight")).not.toHaveCount(0);

  const newest = page.locator(".pf-comment").last();
  await newest.locator("[data-comment-reply]").click();
  await page.fill("[data-reply-input]", "Agreed — keep this wording.");
  await page.locator("[data-reply-submit]").click();
  await expect(newest.locator(".pf-reply")).toHaveCount(1);
});

test("the organizer rotates pages, undo restores them and the canvas comes back", async ({ page }) => {
  await page.goto(PDFCRAFT_URL);

  await page.locator('[data-tool="organize"]').click();
  await expect(page.locator(".pf-organizer")).toBeVisible();
  await expect(page.locator(".pf-org-card")).toHaveCount(13);

  await page.locator(".pf-org-card").nth(1).click();
  await page.locator('[data-org="rotate-cw"]').click();
  await expect(page.locator(".pf-org-card").nth(1).locator(".pf-org-rot")).toHaveText("90°");

  await page.keyboard.press("Control+z");
  await expect(page.locator(".pf-org-card").nth(1).locator(".pf-org-rot")).toHaveCount(0);

  await page.locator('[data-org="done"]').click();
  await expect(page.locator(".pf-organizer")).toBeHidden();
  await expect(page.locator("#pf-dock")).toBeVisible();
});

test("form fields, read mode, tabs and PDF export stay wired together", async ({ page }) => {
  await page.goto(PDFCRAFT_URL);

  // Fill a form field from the Fields panel.
  await page.locator('[data-side-tab="fields"]').click();
  await page.locator(".pf-field-row").nth(12).click();
  await expect(page.locator("#pf-page-input")).toHaveValue("13");
  await page.fill('[data-field="name"]', "Grace Hopper");
  await expect(page.locator(".pf-field-row").first().locator(".pf-field-value")).toHaveText("Grace Hopper");

  // Read mode hides the side panels and switches to two-up.
  await page.locator('[data-persona="read"]').click();
  await expect(page.locator(".pf-pages")).toHaveClass(/mode-two/);
  await expect(page.locator("#pf-tools")).toBeHidden();
  await expect(page.locator("#pf-side")).toBeHidden();

  await page.locator('[data-persona="all"]').click();
  await expect(page.locator(".pf-pages")).toHaveClass(/mode-continuous/);

  // A second bundled document opens in its own tab.
  await page.locator("#pf-open").click();
  await page.locator('[data-open-doc="notes"]').click();
  await expect(page.locator(".pf-tab")).toHaveCount(2);
  await expect(page.locator(".pf-tab.is-active .pf-tab-name")).toHaveText("field-notes.pdf");
  await page.locator(".pf-tab").first().click();
  await expect(page.locator(".pf-tab.is-active .pf-tab-name")).toHaveText("pdfcraft-showcase.pdf");

  // Export produces a real PDF download.
  await page.keyboard.press("Control+k");
  await page.fill("#pf-palette-input", "export a pdf");
  await page.keyboard.press("Enter");
  await expect(page.locator(".pf-dialog")).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.locator("[data-export]").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("pdfcraft-showcase-export.pdf");
  const stream = await download.createReadStream();
  let head = "";
  if (stream) {
    for await (const chunk of stream) {
      head += chunk.toString("latin1");
      if (head.length >= 8) break;
    }
  }
  expect(head.startsWith("%PDF-1.4")).toBe(true);
});
