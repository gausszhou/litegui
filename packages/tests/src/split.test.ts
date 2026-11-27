import { describe, expect, it } from "vitest";
import { Split } from "@gausszhou/litegui";

describe("Split", () => {
  it("creates vertical sections with percentage sizes", () => {
    const split = new Split([50, 50], { vertical: true, id: "split" });

    expect(split.root.id).toBe("split");
    expect(split.root.className).toContain("vsplit");
    expect(split.sections).toHaveLength(2);
    expect(split.sections[0].element.style.height).toBe("50%");
  });

  it("creates horizontal sections and supports adding content", () => {
    const split = new Split(["200px", "calc(100% - 200px)"], { vertical: false });
    const child = document.createElement("div");
    split.getSection(0).add(child);

    expect(split.root.className).toContain("hsplit");
    expect(split.sections[0].element.style.width).toBe("200px");
    expect(split.sections[0].element.contains(child)).toBe(true);
  });
});

import { describe as describeSplitExtra, expect as expectSplitExtra, it as itSplitExtra } from "vitest";

describeSplitExtra("Split sections", () => {
  itSplitExtra("adds a section with the parent orientation", () => {
    const split = new Split([50, 50], { vertical: true });
    split.addSection({ id: "extra", height: "30%" } as never);

    const section = split.sections[2];
    expectSplitExtra(section.element.id).toBe("extra");
    expectSplitExtra(section.element.style.height).toBe("30%");
  });
});
