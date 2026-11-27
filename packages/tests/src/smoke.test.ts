import { describe, expect, it, vi } from "vitest";
import { Button } from "@gausszhou/litegui";
import { SearchBox } from "@gausszhou/litegui";

describe("test environment", () => {
  it("renders and interacts with a Button", () => {
    const callback = vi.fn();
    const button = new Button("Save", { callback });

    expect(button.root.querySelector("button")?.textContent).toBe("Save");

    button.content.click();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("renders and updates a SearchBox", () => {
    const callback = vi.fn();
    const box = new SearchBox("initial", { callback });

    expect(box.getValue()).toBe("initial");

    box.setValue("next");
    expect(box.getValue()).toBe("next");
    expect(callback).toHaveBeenCalledWith("next");
  });
});
