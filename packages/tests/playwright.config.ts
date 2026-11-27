import { defineConfig, devices } from "@playwright/test";

// coder / editor / blender / photocraft 各自是独立 app，分别起 dev server。
const CODER_URL = process.env.LITEGUI_CODER_URL ?? "http://127.0.0.1:5173/";
const EDITOR_URL = process.env.LITEGUI_EDITOR_URL ?? "http://127.0.0.1:5174/";
const BLENDER_URL = process.env.LITEGUI_BLENDER_URL ?? "http://127.0.0.1:5175/";
const PHOTOCRAFT_URL = process.env.LITEGUI_PHOTOCRAFT_URL ?? "http://127.0.0.1:5176/";
const DOCS_URL = process.env.LITEGUI_DOCS_URL ?? "http://127.0.0.1:5178/litegui/docs/";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: [
    {
      command: "pnpm --filter @gausszhou/litegui-coder dev",
      url: CODER_URL,
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: "pnpm --filter @gausszhou/litegui-editor dev",
      url: EDITOR_URL,
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: "pnpm --filter @gausszhou/litegui-blender dev",
      url: BLENDER_URL,
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: "pnpm --filter @gausszhou/litegui-photocraft dev",
      url: PHOTOCRAFT_URL,
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: "pnpm -w docs:dev",
      url: DOCS_URL,
      reuseExistingServer: true,
      timeout: 180_000,
    },
  ],
  projects: [
    {
      name: "chrome",
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],
});
