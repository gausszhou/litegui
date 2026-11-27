export function sizeToCSS(value: any): string {
  if (value === undefined || value === null) return "auto";
  if (typeof value === "string") return value;
  if (value >= 0) return (value | 0) + "px";
  return "calc( 100% - " + Math.abs(value | 0) + "px )";
}

export function createElement(
  tag: string,
  idClass: string,
  content: string,
  style: string | Record<string, string> = "",
  events: Record<string, EventListener> = {}
) {
  const element = document.createElement(tag);

  if (idClass) {
    for (const token of idClass.split(" ")) {
      if (token[0] === ".") element.classList.add(token.slice(1));
      else if (token[0] === "#") element.id = token.slice(1);
      else element.id = token;
    }
  }

  if (content) element.innerHTML = content;

  if (style) {
    if (typeof style === "string") {
      element.setAttribute("style", style);
    } else {
      Object.entries(style).forEach(([key, value]) => {
        (element.style as any)[key] = value;
      });
    }
  }

  Object.entries(events).forEach(([event, callback]) => {
    element.addEventListener(event, callback);
  });

  return element;
}

export function createListItem(
  code: string,
  values: Record<string, string>,
  style?: string | Record<string, string>
) {
  const element = document.createElement("span");
  element.innerHTML = code;

  if (values) {
    for (const selector in values) {
      const child = element.querySelector(selector) as HTMLElement | null;
      if (child) child.textContent = values[selector];
    }
  }

  if (style && typeof style !== "string") {
    Object.entries(style).forEach(([key, value]) => {
      (element.style as any)[key] = value;
    });
  }

  return element;
}

export function remove(element: any): boolean {
  if (!element) return false;

  if (typeof element === "string") {
    document.querySelectorAll(element).forEach((child) => child.parentElement?.removeChild(child));
  } else if (element instanceof Array || element instanceof NodeList) {
    Array.from(element).forEach((child) => remove(child));
  } else if (element.root?.parentNode) {
    element.root.parentNode.removeChild(element.root);
  } else if (element.parentNode) {
    element.parentNode.removeChild(element);
  }

  return true;
}

export function isCursorOverElement(event: MouseEvent, element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  if (!rect) return false;
  return (
    event.pageY > rect.top &&
    event.pageY < rect.top + rect.height &&
    event.pageX > rect.left &&
    event.pageX < rect.left + rect.width
  );
}

export function draggable(
  container: HTMLElement,
  draggerElement?: HTMLElement,
  onStart?: Function,
  onFinish?: Function,
  onIsDraggable?: Function
) {
  const handle = draggerElement || container;
  handle.addEventListener("mousedown", handleMouse);
  handle.style.cursor = "move";

  let prevX = 0;
  let prevY = 0;
  let rect = container.getClientRects()[0];
  let x = rect ? rect.left : 0;
  let y = rect ? rect.top : 0;

  container.style.position = "absolute";
  container.style.left = x + "px";
  container.style.top = y + "px";

  function handleMouse(e: MouseEvent) {
    if (e.type === "mousedown") {
      if (!rect) {
        rect = container.getClientRects()[0];
        x = rect ? rect.left : 0;
        y = rect ? rect.top : 0;
      }

      if (onIsDraggable && onIsDraggable(container, e) === false) {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }

      prevX = e.clientX;
      prevY = e.clientY;
      document.addEventListener("mousemove", handleMouse);
      document.addEventListener("mouseup", handleMouse);
      if (onStart) onStart(container, e);
      e.stopPropagation();
      e.preventDefault();
      return false;
    }

    if (e.type === "mouseup") {
      document.removeEventListener("mousemove", handleMouse);
      document.removeEventListener("mouseup", handleMouse);
      if (onFinish) onFinish(container, e);
      return;
    }

    if (e.type === "mousemove") {
      x += e.clientX - prevX;
      y += e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;
      container.style.left = x + "px";
      container.style.top = y + "px";
    }
    return true;
  }
}

export function escapeHTML(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}
