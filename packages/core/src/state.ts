import EventMitter from "./EventMitter";

export const coreState = {
  root: null as HTMLElement | null,
  content: null as HTMLElement | null,
  modalbg: null as HTMLDivElement | null,
  windows: [] as Window[],
  events: new EventMitter(),
  specialCodes: {
    close: "&#10005;",
    navicon: "&#9776;",
    refresh: "&#8634;",
    gear: "&#9881;",
    open_folder: "&#128194;",
    download: "&#11123;",
    tick: "&#10003;",
    trash: "&#128465;"
  }
};

export function getRoot(): HTMLElement {
  return coreState.root || document.body;
}

export function getContent(): HTMLElement {
  return coreState.content || getRoot();
}

export function getModalBackground(): HTMLDivElement | null {
  return coreState.modalbg;
}

export function showModalBackground(show: boolean) {
  if (coreState.modalbg) {
    coreState.modalbg.style.display = show ? "block" : "none";
  }
}

export type LiteTheme = "dark" | "light";

let currentTheme: LiteTheme = "dark";

export function setTheme(theme: LiteTheme): LiteTheme {
  currentTheme = theme;
  document.documentElement.dataset.lgTheme = theme;
  return currentTheme;
}

export function getTheme(): LiteTheme {
  return currentTheme;
}
