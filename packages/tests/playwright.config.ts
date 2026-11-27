import { defineConfig, devices } from "@playwright/test";

// demo 与 editor 现在各自是独立 app，分别起一个 dev server。
const DEMO_URL = process.env.LITEGUI_DEMO_URL ?? "http://127.0.0.1:5173/";
const EDITOR_URL = process.env.LITEGUI_EDITOR_URL ?? "http://127.0.0.1:5174/";

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
      command: "pnpm --filter @gausszhou/litegui-demo dev -- --host 127.0.0.1 --port 5173",
      url: DEMO_URL,
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: "pnpm --filter @gausszhou/litegui-editor dev -- --host 127.0.0.1 --port 5174",
      url: EDITOR_URL,
      reuseExistingServer: true,
      timeout: 120_000,
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
