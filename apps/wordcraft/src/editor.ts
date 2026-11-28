/** Small DOM editing helpers shared by the WordCraft shell and ribbon actions. */

export const STYLE_IDS = ["normal", "nospacing", "heading1", "title", "heading2", "subtitle"] as const;

export type StyleId = (typeof STYLE_IDS)[number];

export function q<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
}

export function qa<T extends Element>(root: ParentNode, selector: string): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

export function isEditable(node: Node | null): boolean {
  if (!node) return false;
  const element = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  return Boolean(element?.closest('[contenteditable="true"]'));
}

export function closestBlock(node: Node | null, editor: HTMLElement): HTMLElement | null {
  let element: Node | null = node;
  while (element && element !== editor) {
    if (element.nodeType === Node.ELEMENT_NODE) {
      const el = element as HTMLElement;
      if (/^(P|LI|H1|H2|H3|H4|H5|H6|BLOCKQUOTE|TD|TH|DIV)$/.test(el.tagName)) {
        if (el.classList.contains("wc-page-body")) break;
        return el;
      }
    }
    element = element.parentNode;
  }
  return null;
}

export function selectedBlocks(editor: HTMLElement): HTMLElement[] {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return [];
  const range = selection.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return [];
  if (range.collapsed) {
    const block = closestBlock(range.startContainer, editor);
    return block ? [block] : [];
  }
  const blocks: HTMLElement[] = [];
  const walker = document.createTreeWalker(editor, NodeFilter.SHOW_ELEMENT, {
    acceptNode: node => {
      const el = node as HTMLElement;
      if (!/^(P|LI|H1|H2|H3|H4|BLOCKQUOTE|TD|TH)$/.test(el.tagName)) return NodeFilter.FILTER_SKIP;
      return range.intersectsNode(el) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  while (walker.nextNode()) blocks.push(walker.currentNode as HTMLElement);
  if (blocks.length === 0) {
    const block = closestBlock(range.startContainer, editor);
    if (block) blocks.push(block);
  }
  return blocks;
}

export function selectionInEditor(editor: HTMLElement): boolean {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;
  return editor.contains(selection.getRangeAt(0).commonAncestorContainer);
}

export function execInEditor(editor: HTMLElement, command: string, value?: string): boolean {
  if (!selectionInEditor(editor)) return false;
  document.execCommand("styleWithCSS", false, "true");
  document.execCommand(command, false, value);
  return true;
}

export function applyInlineStyle(editor: HTMLElement, styles: Partial<CSSStyleDeclaration>): boolean {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return false;
  const range = selection.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return false;

  const span = document.createElement("span");
  for (const [key, value] of Object.entries(styles)) {
    if (typeof value === "string" && value) span.style.setProperty(key, value);
  }

  try {
    range.surroundContents(span);
  } catch {
    const fragment = range.extractContents();
    span.appendChild(fragment);
    range.insertNode(span);
  }
  selection.removeAllRanges();
  const next = document.createRange();
  next.selectNodeContents(span);
  selection.addRange(next);
  return true;
}

export function applyBlockStyle(editor: HTMLElement, styleId: string): HTMLElement[] {
  const blocks = selectedBlocks(editor);
  for (const block of blocks) {
    block.removeAttribute("data-style");
    if (styleId && styleId !== "normal") block.setAttribute("data-style", styleId);
    else block.setAttribute("data-style", "normal");
  }
  return blocks;
}

export function setBlockAttribute(editor: HTMLElement, name: string, value: string): HTMLElement[] {
  const blocks = selectedBlocks(editor);
  for (const block of blocks) block.setAttribute(name, value);
  return blocks;
}

export function toggleBlockClass(editor: HTMLElement, className: string, force?: boolean): boolean {
  const blocks = selectedBlocks(editor);
  const shouldAdd = force ?? !blocks.every(block => block.classList.contains(className));
  for (const block of blocks) {
    block.classList.toggle(className, shouldAdd);
  }
  return shouldAdd;
}

export function insertHtml(editor: HTMLElement, html: string): boolean {
  if (!selectionInEditor(editor)) return false;
  document.execCommand("insertHTML", false, html);
  return true;
}

export interface WordStats {
  words: number;
  characters: number;
  paragraphs: number;
}

export function wordStats(editor: HTMLElement): WordStats {
  const text = editor.innerText.replace(/\s+/g, " ").trim();
  const words = text.length === 0 ? 0 : (text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? []).length;
  return {
    words,
    characters: text.replace(/ /g, "").length,
    paragraphs: qa<HTMLElement>(editor, "p, li, h1, h2, h3, h4, blockquote").length
  };
}

export interface OutlineEntry {
  element: HTMLElement;
  level: number;
  text: string;
}

const LEVELS: Record<string, number> = {
  title: 1,
  heading1: 2,
  heading2: 3,
  heading3: 4
};

export function buildOutline(editor: HTMLElement): OutlineEntry[] {
  const entries: OutlineEntry[] = [];
  const nodes = qa<HTMLElement>(
    editor,
    '[data-style="title"], [data-style="heading1"], [data-style="heading2"], [data-style="heading3"], h1, h2, h3'
  );
  const seen = new Set<HTMLElement>();
  for (const element of nodes) {
    if (seen.has(element)) continue;
    seen.add(element);
    const style = element.getAttribute("data-style");
    const tagLevel = Number(element.tagName.slice(1));
    const level = style ? LEVELS[style] ?? 3 : Math.min(4, Math.max(2, tagLevel));
    const text = element.textContent?.replace(/\s+/g, " ").trim() ?? "";
    if (text) entries.push({ element, level, text });
  }
  return entries;
}

export function textRanges(editor: HTMLElement, query: string): Range[] {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return [];
  const ranges: Range[] = [];
  const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, {
    acceptNode: node => (node.nodeValue && node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT)
  });
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const haystack = node.nodeValue?.toLocaleLowerCase() ?? "";
    let index = haystack.indexOf(needle);
    while (index !== -1) {
      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + needle.length);
      ranges.push(range);
      index = haystack.indexOf(needle, index + needle.length);
    }
  }
  return ranges;
}

export function selectRange(range: Range): void {
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

export function replaceRange(range: Range, text: string): void {
  range.deleteContents();
  const node = document.createTextNode(text);
  range.insertNode(node);
  range.setStartAfter(node);
  range.collapse(true);
  selectRange(range);
}

export function replaceAllText(editor: HTMLElement, query: string, replacement: string): number {
  const ranges = textRanges(editor, query);
  for (let index = ranges.length - 1; index >= 0; index -= 1) {
    const range = ranges[index];
    range.deleteContents();
    range.insertNode(document.createTextNode(replacement));
  }
  return ranges.length;
}

export function unwrap(element: Element): void {
  const parent = element.parentNode;
  if (!parent) return;
  while (element.firstChild) parent.insertBefore(element.firstChild, element);
  parent.removeChild(element);
  parent.normalize();
}

export function acceptChange(root: HTMLElement): string | null {
  const change = nearestChange(root);
  if (!change) return null;
  const kind = change.classList.contains("wc-ins") ? "insertion" : "deletion";
  if (change.classList.contains("wc-ins")) unwrap(change);
  else change.remove();
  return `Accepted ${kind}`;
}

export function rejectChange(root: HTMLElement): string | null {
  const change = nearestChange(root);
  if (!change) return null;
  const kind = change.classList.contains("wc-ins") ? "insertion" : "deletion";
  if (change.classList.contains("wc-ins")) change.remove();
  else unwrap(change);
  return `Rejected ${kind}`;
}

function nearestChange(root: HTMLElement): HTMLElement | null {
  const changes = qa<HTMLElement>(root, ".wc-ins, .wc-del");
  if (changes.length === 0) return null;
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const anchor = selection.getRangeAt(0).startContainer;
    const containing = changes.find(change => change.contains(anchor));
    if (containing) return containing;
    const next = changes.find(change => change.compareDocumentPosition(anchor) & Node.DOCUMENT_POSITION_PRECEDING);
    if (next) return next;
  }
  return changes[0];
}

export function pageOf(element: Element | null, pagesRoot: HTMLElement): HTMLElement | null {
  return (element?.closest(".wc-page") as HTMLElement | null) ?? pagesRoot.querySelector<HTMLElement>(".wc-page");
}

export function ensureFootnoteList(page: HTMLElement): HTMLElement {
  const existing = page.querySelector<HTMLElement>(".wc-footnotes");
  if (existing) return existing;
  const list = document.createElement("div");
  list.className = "wc-footnotes";
  list.setAttribute("aria-label", "Footnotes");
  const footer = page.querySelector(".wc-page-footer");
  if (footer) page.insertBefore(list, footer);
  else page.appendChild(list);
  return list;
}

export function flashElement(element: HTMLElement): void {
  element.classList.remove("wc-flash");
  void element.offsetWidth;
  element.classList.add("wc-flash");
  window.setTimeout(() => element.classList.remove("wc-flash"), 1400);
}
