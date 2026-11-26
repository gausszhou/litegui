import EventMitter from "../packages/EventMitter";

type EventCallback = ((event: any) => void) | EventListener;

function toElementList(element: any): any[] {
  if (typeof element === "string") {
    return Array.from(document.querySelectorAll(element));
  }
  if (element instanceof NodeList || element instanceof Array) {
    return Array.from(element);
  }
  return [element];
}

export function bind(element: any, event: string, callback: EventCallback) {
  if (!element) throw new Error("Cannot bind to null");
  if (!event) throw new Error("Event bind missing");
  if (!callback) throw new Error("Bind callback missing");

  for (const target of toElementList(element)) {
    bindTarget(target, event, callback);
  }
}

function bindTarget(target: any, event: string, callback: EventCallback) {
  if (target instanceof EventMitter) {
    target.on(event, callback as any);
    return;
  }
  if (typeof target.addEventListener === "function") {
    target.addEventListener(event, callback as EventListener);
    return;
  }

  if (!(target.__events instanceof EventMitter)) {
    Object.defineProperty(target, "__events", {
      value: new EventMitter(),
      enumerable: false,
      configurable: true
    });
  }
  target.__events.on(event, callback as any);
}

export function unbind(element: any, event: string, callback: EventCallback) {
  for (const target of toElementList(element)) {
    if (target instanceof EventMitter) {
      target.off(event, callback as any);
    } else if (typeof target.removeEventListener === "function") {
      target.removeEventListener(event, callback as EventListener);
    } else if (target.__events instanceof EventMitter) {
      target.__events.off(event, callback as any);
    }
  }
}

export function trigger(element: any, eventName: string, params?: any): CustomEvent {
  const event = new CustomEvent(eventName, {
    bubbles: true,
    cancelable: true,
    detail: params
  });

  if (element instanceof EventMitter) {
    element.emit(eventName, event);
  } else if (element && typeof element.dispatchEvent === "function") {
    element.dispatchEvent(event);
  } else if (element?.__events instanceof EventMitter) {
    element.__events.emit(eventName, event);
  } else if (element && typeof element.fireEvent === "function") {
    element.fireEvent(event);
  }

  return event;
}
