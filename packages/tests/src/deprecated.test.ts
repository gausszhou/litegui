import { afterEach, describe, expect, it, vi } from "vitest";
import { deprecate, resetDeprecationWarnings } from "@gausszhou/litegui-core";
import { Area } from "@gausszhou/litegui";
import { Tabs } from "@gausszhou/litegui";

afterEach(() => {
  resetDeprecationWarnings();
  vi.restoreAllMocks();
});

describe("deprecation warnings", () => {
  it("warns only once per id", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    deprecate("test-id", "first");
    deprecate("test-id", "second");

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain("first");
  });

  it("warns for legacy Area and Tabs constructors", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    new Area("area-id", {});
    new Tabs("tabs-id", {});

    expect(warn.mock.calls.some(([message]) => String(message).includes("Area(id"))).toBe(true);
    expect(warn.mock.calls.some(([message]) => String(message).includes("Tabs(id"))).toBe(true);
  });
});
