import { afterEach, describe, expect, it } from "vitest";
import { LiteGUI } from "@gausszhou/litegui-components";

afterEach(() => {
  delete document.documentElement.dataset.lgTheme;
  document.body.innerHTML = "";
  LiteGUI.modalbg_div = null;
  LiteGUI.container = null;
  LiteGUI.root = document.body;
  LiteGUI.content = document.body;
});

describe("theme", () => {
  it("sets and reads the theme", () => {
    expect(LiteGUI.setTheme("light")).toBe("light");
    expect(LiteGUI.getTheme()).toBe("light");
    expect(document.documentElement.dataset.lgTheme).toBe("light");

    LiteGUI.setTheme("dark");
    expect(document.documentElement.dataset.lgTheme).toBe("dark");
  });

  it("applies the theme from init options", () => {
    const container = document.createElement("div");
    container.id = "app";
    document.body.appendChild(container);

    LiteGUI.init({ container: "#app", theme: "light" });

    expect(document.documentElement.dataset.lgTheme).toBe("light");
  });
});
