import { describe, expect, it } from "vitest";
import { Console } from "../src/packages/Console";

describe("Console", () => {
  it("adds messages with severity classes and clears them", () => {
    const consoleWidget = new Console({ prompt: ">" });

    consoleWidget.log("hello");
    consoleWidget.warn("careful");
    consoleWidget.error("boom");

    const messages = consoleWidget.$log.querySelectorAll("pre.msg");
    expect(messages).toHaveLength(3);
    expect(messages[0].className).toContain("msglog");
    expect(messages[1].className).toContain("msgwarn");
    expect(messages[2].className).toContain("msgerror");

    consoleWidget.clear();
    expect(consoleWidget.$log.children).toHaveLength(0);
  });

  it("returns an updatable message handle", () => {
    const consoleWidget = new Console({});
    const message = consoleWidget.addMessage("first", "msglog");

    message.update("second");
    expect(consoleWidget.$log.textContent).toContain("second");
  });
});
