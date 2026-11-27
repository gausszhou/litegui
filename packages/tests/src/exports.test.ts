import { describe, expect, it } from "vitest";
import LiteGUI, { Inspector, Tree } from "@gausszhou/litegui-components";

describe("main entry exports", () => {
  it("exposes Inspector and Tree on the LiteGUI namespace", () => {
    expect(LiteGUI.Inspector).toBe(Inspector);
    expect(LiteGUI.Tree).toBe(Tree);
  });

  it("renders a Tree", () => {
    const tree = new Tree({
      id: "root",
      children: [{ id: "a" }, { id: "b" }]
    });

    expect(tree.root.className).toContain("litetree");
    expect(tree.root.querySelectorAll(".ltreeitem").length).toBe(3);
  });

  it("renders an Inspector widget", () => {
    // Inspector 仍用 prototype 风格 API（@ts-nocheck），类型只声明了构造签名的子集
    const inspector = new Inspector({ id: "options" }) as any;
    inspector.addString("name", "Untitled");

    expect(inspector.root.className).toContain("inspector");
    expect(inspector.root.querySelectorAll(".widget").length).toBeGreaterThan(0);
  });
});
