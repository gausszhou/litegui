import { beforeAll, describe, expect, it } from "vitest";

beforeAll(() => {
  document.body.innerHTML = '<div id="app"></div>';
});

describe("demo page", () => {
  it("mounts the main area on window load", async () => {
    await import("../../../apps/demo/src/main.ts");
    expect(typeof window.onload).toBe("function");
    window.onload?.call(window, new Event("load"));

    const app = document.querySelector("#app");
    expect(app?.querySelector(".lg-area")).not.toBeNull();
    expect(document.querySelector(".lg-modal-backdrop")).not.toBeNull();
  });
});
