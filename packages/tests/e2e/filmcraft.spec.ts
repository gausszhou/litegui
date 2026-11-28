import { expect, test } from "@playwright/test";
import { fileURLToPath } from "node:url";

const FILMCRAFT_URL = process.env.LITEGUI_FILMCRAFT_URL ?? "http://127.0.0.1:5177/";
const fixture = fileURLToPath(new URL("../fixtures/filmcraft-frame.png", import.meta.url));

test("filmcraft mounts the editing workspace", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));

  await page.goto(FILMCRAFT_URL);

  await expect(page.locator(".fc-topbar")).toBeVisible();
  await expect(page.locator(".fc-top-tab")).toHaveCount(3);
  await expect(page.locator(".fc-project-title")).toHaveText("Night of the Living Dead - Trailer");
  await expect(page.locator(".fc-tool-btn")).toHaveCount(9);
  await expect(page.locator(".fc-media-card")).toHaveCount(8);
  await expect(page.locator(".fc-clip")).toHaveCount(13);
  await expect(page.locator("#fc-program")).toBeVisible();
  await expect(page.locator(".fc-panel-tabs").first()).toContainText("Effect Controls");
  expect(errors).toEqual([]);
});

test("transport plays, pauses and scrubs the sequence", async ({ page }) => {
  await page.goto(FILMCRAFT_URL);
  const time = page.locator("#fc-monitor-time");
  const before = await time.innerText();

  await page.keyboard.press("Space");
  await expect(time).not.toHaveText(before, { timeout: 3000 });
  await page.keyboard.press("Space");

  const paused = await time.innerText();
  await page.waitForTimeout(350);
  await expect(time).toHaveText(paused);

  const ruler = await page.locator("#fc-ruler").boundingBox();
  expect(ruler).not.toBeNull();
  if (!ruler) return;
  await page.mouse.click(ruler.x + 15 * 28 + 2, ruler.y + 10);
  await expect(time).toContainText("00:00:15");
});

test("clip selection, properties and undo are wired", async ({ page }) => {
  await page.goto(FILMCRAFT_URL);

  await page.locator('[data-clip-id="v1-charade"]').click();
  await expect(page.locator("#fc-right-body")).toContainText("Charade (1963).mp4");

  const scale = page.locator('[data-prop="transform.scale"]');
  await scale.fill("120");
  await scale.press("Enter");
  await expect(scale).toHaveValue("120");

  await page.keyboard.press("Control+z");
  await expect(page.locator('[data-prop="transform.scale"]')).toHaveValue("100");
});

test("razor splits a clip and the title tool creates a graphic", async ({ page }) => {
  await page.goto(FILMCRAFT_URL);
  const clips = page.locator(".fc-clip");
  const before = await clips.count();

  await page.locator('[data-tool="razor"]').click();
  const clip = await page.locator('[data-clip-id="v1-charade"]').boundingBox();
  expect(clip).not.toBeNull();
  if (!clip) return;
  await page.mouse.click(clip.x + clip.width / 2, clip.y + 18);
  await expect(clips).toHaveCount(before + 1);

  await page.locator('[data-tool="title"]').click();
  const ruler = await page.locator("#fc-ruler").boundingBox();
  expect(ruler).not.toBeNull();
  if (!ruler) return;
  await page.mouse.click(ruler.x + 18 * 28 + 2, ruler.y + 10);
  await expect(page.locator(".fc-clip--title")).toHaveCount(3);
  await expect(page.locator("#fc-right-body .fc-textarea")).toBeVisible();
});

test("color workspace exposes scopes and lumetri controls", async ({ page }) => {
  await page.goto(FILMCRAFT_URL);

  await page.locator(".fc-workspace-btn").click();
  await page.locator(".fc-menu-item", { hasText: "Color" }).click();

  await expect(page.locator("#fc-left-tabs")).toContainText("Lumetri Scopes");
  await expect(page.locator("#fc-waveform")).toBeVisible();
  await expect(page.locator("#fc-vector")).toBeVisible();
  await expect(page.locator("#fc-right-tabs")).toContainText("Lumetri Color");

  const exposure = page.locator('[data-grade="exposure"]');
  await exposure.evaluate((element: HTMLInputElement) => {
    element.value = "18";
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await expect(page.locator('[data-grade-out="exposure"]').first()).toHaveText("+18.0");
});

test("export renders a frame and project, and media import updates the bin", async ({ page }) => {
  await page.goto(FILMCRAFT_URL);

  await page.locator('[data-view="export"]').click();
  await expect(page.locator(".fc-export-layout")).toBeVisible();
  await expect(page.locator(".fc-export-btn")).toBeVisible();

  const downloads: string[] = [];
  page.on("download", download => downloads.push(download.suggestedFilename()));
  await page.locator('[data-action="export-start"]').click();
  await expect(page.locator("#fc-export-status")).toHaveText("Export complete", { timeout: 8000 });
  expect(downloads.length).toBe(2);

  await page.locator('[data-view="edit"]').click();
  await page.setInputFiles('input[type="file"]', fixture);
  await expect(page.locator(".fc-bin-count")).toHaveText("9 items");
  await expect(page.locator(".fc-media-card")).toHaveCount(9);
});
