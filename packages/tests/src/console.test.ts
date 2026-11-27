import { describe, expect, it } from "vitest";
import { Console } from "@gausszhou/litegui-components";

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

import { describe as describeConsole, expect as expectConsole, it as itConsole, vi as viConsole } from "vitest";

describeConsole("Console input", () => {
  itConsole("processes commands and history", () => {
    const widget = new Console({ prompt: ">" });
    const onCommand = viConsole.fn();
    widget.onProcessCommand = onCommand;

    widget.$input.value = "help";
    widget.processKeyDown({ keyCode: 13, preventDefault: viConsole.fn(), stopPropagation: viConsole.fn() });

    expectConsole(onCommand).toHaveBeenCalledWith("help");
    expectConsole(widget.history).toEqual(["help"]);

    widget.processKeyDown({ keyCode: 38, preventDefault: viConsole.fn(), stopPropagation: viConsole.fn() });
    expectConsole(widget.$input.value).toBe("help");
  });

  itConsole("autocompletes with tab", () => {
    const widget = new Console({});
    widget.onAutocomplete = (value: string) => value + "_done";
    widget.$input.value = "cmd";

    widget.processKeyDown({ keyCode: 9, preventDefault: viConsole.fn(), stopPropagation: viConsole.fn() });

    expectConsole(widget.$input.value).toBe("cmd_done");
  });

  itConsole("formats object and array messages", () => {
    const widget = new Console({});
    widget.addMessage({ a: 1 }, "msglog");
    widget.addMessage(["a", "b"], "msglog");

    expectConsole(widget.$log.querySelectorAll("pre.msg")).toHaveLength(3);
  });
});
