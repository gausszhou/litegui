import { describe, expect, it } from "vitest";
import {
  beautifyCode,
  beautifyJSON,
  createElementFromString,
  dataURItoBlob,
  escapeHtmlEntities,
  purgeElement
} from "../src/packages/utils";

describe("utils", () => {
  it("creates an element wrapper from a string", () => {
    const element = createElementFromString("<b>hello</b>");
    expect(element.querySelector("b")?.textContent).toBe("hello");
  });

  it("purges function properties", () => {
    const target: any = { attributes: [{ name: "removeMe" }], removeMe: () => undefined, childNodes: [] };
    purgeElement(target);
    expect(target.removeMe).toBeNull();
  });

  it("highlights code and JSON", () => {
    const code = beautifyCode("const value = 12;", undefined as never, true);
    expect(code).toContain("<span class='rsv'>const</span>");
    expect(code).toContain("<span class='num'>12</span>");

    const json = beautifyJSON('{"ok": true, "n": 3}', true);
    expect(json).toContain("<span class='rsv'>true</span>");
    expect(json).toContain("<span class='num'>3</span>");
  });

  it("converts data URIs to blobs", () => {
    const blob = dataURItoBlob("data:text/plain;base64,aGVsbG8=");
    expect(blob.size).toBe(5);
    expect(blob.type).toBe("text/plain");
  });

  it("escapes HTML entities", () => {
    expect(escapeHtmlEntities("&<>")).toBe("&amp;&lt;&gt;");
  });
});
