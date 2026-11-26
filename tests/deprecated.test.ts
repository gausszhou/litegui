import { afterEach, describe, expect, it, vi } from "vitest";
import { deprecate, resetDeprecationWarnings } from "../src/core/deprecated";
import { Area } from "../src/packages/Area";
import { Tabs } from "../src/packages/Tabs";

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
