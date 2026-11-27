import { describe, expect, it } from "vitest";
import { Dialog } from "@gausszhou/litegui";
import { Panel } from "@gausszhou/litegui";

describe("lifecycle", () => {
  it("does not leak closed dialogs", () => {
    for (let index = 0; index < 100; index += 1) {
      const dialog = new Dialog({ title: `Dialog ${index}` });
      dialog.show();
      dialog.close();
    }

    expect(Dialog.INSTANCE_LIST).toHaveLength(0);
    expect(document.querySelectorAll(".litedialog")).toHaveLength(0);
  });

  it("removes closed panels from the document", () => {
    const panel = new Panel({ title: "Panel", close: true });
    document.body.appendChild(panel.root);

    panel.close();

    expect(document.body.contains(panel.root)).toBe(false);
  });
});
