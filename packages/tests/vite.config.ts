import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const packagesRoot = join(repoRoot, "packages");

// 覆盖率 provider 从 tests 包内解析：根目录不安装 vitest 的 peer 依赖。
// Vitest 2 的 custom provider 类型没有覆盖 reporter/include，运行时支持，这里只放宽该字段的类型。
const requireFromTests = createRequire(import.meta.url);
const coverageProvider = requireFromTests.resolve("@vitest/coverage-v8");

// 直接指向各包源码：既能测 workspace 引用，也让覆盖率统计到源文件而不是 node_modules 软链。
export default defineConfig({
  root: repoRoot,
  cacheDir: join(repoRoot, "node_modules/.vitest"),
  resolve: {
    alias: [
      {
        find: /^@gausszhou\/litegui-core$/,
        replacement: join(packagesRoot, "core/src/index.ts")
      },
      {
        find: /^@gausszhou\/litegui-components\/style\.css$/,
        replacement: join(packagesRoot, "components/src/styles/index.scss")
      },
      {
        find: /^@gausszhou\/litegui-vue$/,
        replacement: join(packagesRoot, "vue/src/index.ts")
      },
      {
        find: /^@gausszhou\/litegui-elements$/,
        replacement: join(packagesRoot, "elements/src/index.ts")
      },
      {
        find: /^@gausszhou\/litegui-components$/,
        replacement: join(packagesRoot, "components/src/index.ts")
      }
    ]
  },
  test: {
    environment: "jsdom",
    setupFiles: [join(packagesRoot, "tests/src/setup.ts")],
    include: ["packages/tests/src/**/*.test.ts"],
    restoreMocks: true,
    coverage: {
      provider: "custom",
      customProviderModule: coverageProvider,
      reporter: ["text", "html"],
      include: [
        "packages/core/src/**/*.ts",
        "packages/components/src/**/*.ts",
        "packages/elements/src/**/*.ts",
        "packages/vue/src/**/*.ts"
      ],
      exclude: [
        "packages/components/src/entries/**",
        "packages/components/src/umd.ts",
        // Inspector/Tree 仍为 experimental（@ts-nocheck + 上游 prototype 风格 API），
        // 和拆分到独立包时期一样不纳入覆盖率统计。
        "packages/components/src/components/Inspector.ts",
        "packages/components/src/components/Tree.ts",
        "**/*.d.ts"
      ],
      reportsDirectory: join(repoRoot, "coverage"),
      thresholds: {
        statements: 70,
        branches: 65,
        functions: 70,
        lines: 70
      }
    } as any
  }
});
