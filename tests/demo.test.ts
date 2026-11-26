import { beforeAll, describe, expect, it } from "vitest";

beforeAll(() => {
  document.body.innerHTML = '<div id="app"></div>';
});

describe("demo page", () => {
  it("mounts the main area on window load", async () => {
    // @ts-expect-error demo is a plain JavaScript entry, not part of the library types
    await import("../demo/index.js");
    expect(typeof window.onload).toBe("function");
    window.onload?.call(window, new Event("load"));

    const app = document.querySelector("#app");
    expect(app?.querySelector(".litearea")).not.toBeNull();
    expect(document.querySelector(".litemodalbg")).not.toBeNull();
  });
});
