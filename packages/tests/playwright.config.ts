import { defineConfig, devices } from "@playwright/test";

// demo 与 editor 现在各自是独立 app，分别起一个 dev server。
const DEMO_URL = process.env.LITEGUI_DEMO_URL ?? "http://127.0.0.1:5173/";
const EDITOR_URL = process.env.LITEGUI_EDITOR_URL ?? "http://127.0.0.1:5174/";
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
      command: "pnpm --filter @gausszhou/litegui-demo dev",
      url: DEMO_URL,
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
