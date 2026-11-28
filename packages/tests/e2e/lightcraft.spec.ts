import { expect, test } from "@playwright/test";

const LIGHTCRAFT_URL = process.env.LITEGUI_LIGHTCRAFT_URL ?? "http://127.0.0.1:5181/";

/** 读取显影画布中心区域的饱和度，用来验证管线真的改变了像素。 */
async function centerSaturation(page: import("@playwright/test").Page): Promise<number> {
  return page.evaluate(() => {
    const canvas = document.querySelector<HTMLCanvasElement>(".lc-photo:not(.lc-photo--before)");
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return -1;
    const data = context.getImageData(Math.floor(canvas.width / 2) - 8, Math.floor(canvas.height / 2) - 8, 16, 16).data;
    let r = 0;
    let g = 0;
    let b = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }
    const count = data.length / 4;
    return Math.abs(r / count - g / count) + Math.abs(g / count - b / count);
  });
}

test("lightcraft mounts the photo library shell", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));

  await page.goto(LIGHTCRAFT_URL);

  await expect(page.locator(".lc-topbar")).toBeVisible();
  await expect(page.locator(".lc-side__title")).toHaveText("我的照片");
  await expect(page.locator(".lc-lib-title")).toHaveText("所有照片");
  await expect(page.locator(".lc-lib-count")).toHaveText("24 张照片");
  await expect(page.locator(".lc-tile")).toHaveCount(24);
  await expect(page.locator(".lc-panel__meta")).toContainText("ISO");
  await expect(page.locator(".lg-toolbar__tool")).toHaveCount(4);
  await expect(page.locator("#lc-status-zoom")).toContainText("%");

  expect(errors).toEqual([]);
});

test("albums, search and ratings filter the library", async ({ page }) => {
  await page.goto(LIGHTCRAFT_URL);

  await page.locator(".lc-side__row", { hasText: "夜空" }).first().click();
  await expect(page.locator(".lc-lib-title")).toHaveText("夜空");
  await expect(page.locator(".lc-tile")).toHaveCount(2);

  await page.locator(".lc-side__row", { hasText: "所有照片" }).first().click();
  await expect(page.locator(".lc-tile")).toHaveCount(24);

  await page.fill("#lc-search", "极光");
  await expect(page.locator(".lc-tile")).toHaveCount(2);

  await page.fill("#lc-search", "没有这张照片");
  await expect(page.locator(".lc-empty")).toBeVisible();
  await page.fill("#lc-search", "");

  await page.locator(".lc-tile").nth(1).click();
  await page.keyboard.press("4");
  await expect(page.locator("#lc-bb-center .lc-rating__star.is-on")).toHaveCount(4);
});

test("develop adjusts, undoes and compares before/after", async ({ page }) => {
  await page.goto(LIGHTCRAFT_URL);

  await page.locator('[data-photo="mountains-lake-dawn"]').first().dblclick();
  await expect(page.locator("#lc-develop")).toBeVisible();
  await expect(page.locator(".lc-filmstrip")).toBeVisible();
  await expect(page.locator("#lc-status-zoom")).not.toHaveText("100%");

  const exposure = page.locator(".lc-slider").first();
  const rail = exposure.locator(".lc-slider__rail");
  const box = await rail.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.up();

  await expect(exposure.locator(".lc-slider__value")).not.toHaveText("0.00");
  await expect(page.locator(".lc-edit-head__count")).toContainText("项调整");

  await page.keyboard.press("Control+z");
  await expect(exposure.locator(".lc-slider__value")).toHaveText("0.00");

  await page.keyboard.down("\\");
  await expect(page.locator(".lc-compare-line")).toBeVisible();
  await expect(page.locator(".lc-compare-badge")).toContainText("修改前");
  await page.keyboard.up("\\");
  await expect(page.locator(".lc-compare-line")).toBeHidden();
});

test("presets and masks change the rendered pixels", async ({ page }) => {
  await page.goto(LIGHTCRAFT_URL);
  await page.locator('[data-photo="mountains-lake-dawn"]').first().dblclick();
  await expect(page.locator("#lc-develop")).toBeVisible();
  await expect
    .poll(async () => centerSaturation(page), { timeout: 10_000 })
    .toBeGreaterThan(4);

  await page.locator(".lc-section__head", { hasText: "预设" }).first().click();
  await page.locator(".lc-preset[data-preset='mono-film']").click();
  await expect.poll(async () => centerSaturation(page), { timeout: 10_000 }).toBeLessThan(2);

  await page.keyboard.press("Control+z");
  await expect.poll(async () => centerSaturation(page), { timeout: 10_000 }).toBeGreaterThan(4);

  await page.locator(".lg-toolbar__tool[data-tool='mask']").click();
  await page.locator(".lc-mask-tool[data-mask-kind='radial']").click();
  await expect(page.locator(".lc-mask-row")).toHaveCount(1);
  await expect(page.locator(".lc-mask-handle").first()).toBeVisible();

  const maskExposure = page.locator(".lc-section--mask-adjust .lc-slider").nth(1);
  const rail = maskExposure.locator(".lc-slider__rail");
  const box = await rail.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;
  await page.mouse.move(box.x + box.width * 0.68, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.up();
  await expect(maskExposure.locator(".lc-slider__value")).not.toHaveText("0.00");

  await page.locator(".lg-toolbar__tool[data-tool='history']").click();
  await expect(page.locator(".lc-history__row").first()).toContainText("导入");
  await expect(page.locator(".lc-history__row").last()).toContainText("遮罩");
});

test("exports the developed photo and shows the shortcut dialog", async ({ page }) => {
  await page.goto(LIGHTCRAFT_URL);
  await page.locator('[data-photo="mountains-lake-dawn"]').first().dblclick();
  await expect(page.locator("#lc-develop")).toBeVisible();

  await page.locator("#lc-export").click();
  await expect(page.locator(".lc-modal__title")).toHaveText("导出照片");
  const downloadPromise = page.waitForEvent("download");
  await page.locator(".lc-modal__foot .lc-btn--primary").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/lightcraft\.(jpg|png)$/);

  await page.keyboard.press("?");
  await expect(page.locator(".lc-shortcuts__row")).toHaveCount(15);
  await page.keyboard.press("Escape");
  await expect(page.locator(".lc-modal")).toHaveCount(0);
});
