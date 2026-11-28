/** In-page text search and annotation anchoring for the rendered page DOM. */

export interface SearchHit {
  pageId: string;
  pageIndex: number;
  mark: HTMLElement;
  snippet: string;
  order: number;
}

interface TextEntry {
  node: Text;
  start: number;
  end: number;
}

const SKIP_SELECTOR = "script, style, svg, textarea, input, select, mark.pf-hit, .pg-annot";
const BLOCK_SELECTOR = "p, li, td, th, h1, h2, h3, blockquote, figcaption, .pg-caption, .pg-label, .pg-script-sample";

function collectText(root: HTMLElement): TextEntry[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: node => {
      const text = node as Text;
      const parent = text.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (parent.closest(SKIP_SELECTOR)) return NodeFilter.FILTER_REJECT;
      if (!text.data.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const entries: TextEntry[] = [];
  let offset = 0;
  let node = walker.nextNode();
  while (node) {
    const text = node as Text;
    entries.push({ node: text, start: offset, end: offset + text.data.length });
    offset += text.data.length;
    node = walker.nextNode();
  }
  return entries;
}

function blockSnippet(element: Element, query: string): string {
  const block = element.closest(BLOCK_SELECTOR) ?? element;
  const text = (block.textContent ?? "").replace(/\s+/g, " ").trim();
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  const start = Math.max(0, index - 42);
  const end = Math.min(text.length, index + query.length + 58);
  return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;
}

/** Wrap every occurrence of `query` inside one page body with a <mark>. */
export function highlightInPage(
  page: HTMLElement,
  pageId: string,
  pageIndex: number,
  query: string,
  hits: SearchHit[]
): void {
  const body = page.querySelector<HTMLElement>(".pg-body");
  if (!body || !query.trim()) return;
  const needle = query.toLowerCase();
  const nodes = collectText(body).map(entry => entry.node);

  for (const textNode of nodes) {
    const haystack = textNode.data.toLowerCase();
    let index = haystack.indexOf(needle);
    if (index === -1) continue;
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    while (index !== -1) {
      if (index > cursor) fragment.appendChild(document.createTextNode(textNode.data.slice(cursor, index)));
      const mark = document.createElement("mark");
      mark.className = "pf-hit";
      mark.textContent = textNode.data.slice(index, index + needle.length);
      fragment.appendChild(mark);
      hits.push({
        pageId,
        pageIndex,
        mark,
        snippet: blockSnippet(textNode.parentElement ?? body, query),
        order: hits.length
      });
      cursor = index + needle.length;
      index = haystack.indexOf(needle, cursor);
    }
    if (cursor < textNode.data.length) fragment.appendChild(document.createTextNode(textNode.data.slice(cursor)));
    textNode.parentNode?.replaceChild(fragment, textNode);
  }
}

/** Remove every search highlight and merge the split text nodes back together. */
export function clearSearchHighlights(root: ParentNode): void {
  const marks = Array.from(root.querySelectorAll<HTMLElement>("mark.pf-hit"));
  const parents = new Set<ParentNode>();
  for (const mark of marks) {
    const parent = mark.parentNode;
    if (!parent) continue;
    parents.add(parent);
    parent.replaceChild(document.createTextNode(mark.textContent ?? ""), mark);
  }
  for (const parent of parents) parent.normalize();
}

export function clearCurrentHit(root: ParentNode): void {
  root.querySelectorAll("mark.pf-hit.is-current").forEach(mark => mark.classList.remove("is-current"));
}

export function scrollToHit(mark: HTMLElement): void {
  mark.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  mark.classList.add("is-current");
  window.setTimeout(() => mark.classList.remove("is-current"), 1800);
}

/* ------------------------------------------------------------------ quotes */

interface IndexedText {
  text: string;
  /** normalized position -> global original offset */
  map: number[];
  entries: TextEntry[];
}

function normalizeWithMap(entries: TextEntry[]): IndexedText {
  const chars: string[] = [];
  const map: number[] = [];
  let pendingSpace = false;
  for (const entry of entries) {
    const data = entry.node.data;
    for (let i = 0; i < data.length; i += 1) {
      const char = data[i];
      const global = entry.start + i;
      if (/\s/.test(char)) {
        pendingSpace = chars.length > 0;
        continue;
      }
      if (pendingSpace) {
        chars.push(" ");
        map.push(global);
        pendingSpace = false;
      }
      chars.push(char.toLowerCase());
      map.push(global);
    }
  }
  return { text: chars.join(""), map, entries };
}

function wrapGlobalRange(
  indexed: IndexedText,
  start: number,
  end: number,
  className: string,
  commentId: string
): HTMLElement[] {
  const marks: HTMLElement[] = [];
  for (const entry of indexed.entries) {
    const localStart = Math.max(start, entry.start) - entry.start;
    const localEnd = Math.min(end, entry.end) - entry.start;
    if (localEnd <= 0 || localStart >= entry.end - entry.start) continue;
    const node = entry.node;
    if (!node.parentNode) continue;
    const text = node.data;
    const before = text.slice(0, localStart);
    const matched = text.slice(localStart, localEnd);
    const after = text.slice(localEnd);
    const mark = document.createElement("span");
    mark.className = `pg-annot ${className}`;
    mark.dataset.commentId = commentId;
    mark.textContent = matched;
    const fragment = document.createDocumentFragment();
    if (before) fragment.appendChild(document.createTextNode(before));
    fragment.appendChild(mark);
    if (after) fragment.appendChild(document.createTextNode(after));
    node.parentNode.replaceChild(fragment, node);
    marks.push(mark);
  }
  return marks;
}

/**
 * Find a quote in a page (whitespace and case tolerant) and wrap its segments.
 * Returns the first wrapped segment so callers can scroll to it.
 */
export function wrapQuote(page: HTMLElement, quote: string, commentId: string, className: string): HTMLElement | null {
  const body = page.querySelector<HTMLElement>(".pg-body");
  if (!body) return null;
  const indexed = normalizeWithMap(collectText(body));
  const needle = quote.replace(/\s+/g, " ").trim().toLowerCase();
  if (!needle) return null;
  const found = indexed.text.indexOf(needle);
  if (found === -1) return null;
  const start = indexed.map[found];
  const end = indexed.map[found + needle.length - 1] + 1;
  const marks = wrapGlobalRange(indexed, start, end, className, commentId);
  return marks[0] ?? null;
}

/** Return the selected text plus the page element that owns it. */
export function selectionInfo(): { text: string; pageId: string } | null {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || !selection.rangeCount) return null;
  const text = selection.toString().replace(/\s+/g, " ").trim();
  if (text.length < 2) return null;
  const range = selection.getRangeAt(0);
  const node = range.commonAncestorContainer;
  const element = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  const page = element?.closest<HTMLElement>(".pf-page-wrap");
  const pageId = page?.dataset.pageId;
  if (!pageId) return null;
  if (element?.closest("input, textarea, select, .pf-org-card")) return null;
  return { text, pageId };
}
