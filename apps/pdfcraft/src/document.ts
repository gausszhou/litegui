import type { Bookmark, Comment, FieldDef, Page, PageKind, PdfDoc, Rotation, Reply } from "./types";

let uid = 0;
export function nextId(prefix: string): string {
  uid += 1;
  return `${prefix}-${uid}`;
}

const PAGE_KINDS: Record<string, { label: string; title: string; section: string }> = {
  cover: { label: "Cover", title: "Cover", section: "Cover" },
  contents: { label: "i", title: "Contents", section: "Front matter" },
  foreword: { label: "ii", title: "Why a specimen?", section: "Foreword" },
  chapter: { label: "1", title: "Setting Text", section: "Setting Text" },
  features: { label: "2", title: "OpenType Features", section: "OpenType Features" },
  expressive: { label: "3", title: "Expressive Type", section: "Expressive Type" },
  scripts: { label: "4", title: "Scripts of the World", section: "Scripts of the World" },
  math: { label: "5", title: "Mathematics", section: "Mathematics" },
  vector: { label: "6", title: "Vector Graphics", section: "Vector Graphics" },
  tables: { label: "7", title: "Data & Tables", section: "Data & Tables" },
  code: { label: "8", title: "Code & Images", section: "Code & Images" },
  markup: { label: "9", title: "Review & Markup", section: "Review & Markup" },
  form: { label: "10", title: "Interactive Form", section: "Interactive Form" },
  blank: { label: "", title: "Blank page", section: "Untitled" },
  checklist: { label: "1", title: "Site checklist", section: "Field notes" },
  invoice: { label: "2", title: "Invoice 2026-114", section: "Billing" },
  terms: { label: "3", title: "Terms & signature", section: "Terms" },
  grid: { label: "4", title: "Appendix: work grid", section: "Appendix" }
};

export function createPage(kind: PageKind, overrides: Partial<Page> = {}): Page {
  const spec = PAGE_KINDS[kind];
  return {
    id: nextId("page"),
    kind,
    label: spec.label,
    title: spec.title,
    section: spec.section,
    rotation: 0,
    ...overrides
  };
}

function reply(author: string, initials: string, date: string, body: string): Reply {
  return { id: nextId("reply"), author, initials, date, body };
}

function comment(data: Omit<Comment, "id" | "replies"> & { replies?: Reply[] }): Comment {
  return { id: nextId("comment"), replies: data.replies ?? [], ...data };
}

const EDITOR = { author: "PdfCraft Reviewer", initials: "PR", accent: "#c2412d" };
const LAYOUT = { author: "Layout Editor", initials: "LE", accent: "#3c6e9f" };
const ENGINE = { author: "Type Engine", initials: "TE", accent: "#8a6d3b" };

export const SHOWCASE_META = {
  title: "pdfcraft-showcase",
  author: "The PdfCraft contributors",
  subject: "A specimen document for the LiteGUI PDF workbench demo",
  keywords: "typography, pdf, specimen, litegui, demo"
};

/** The 13-page specimen document the workbench opens with. */
export function createShowcase(): PdfDoc {
  const pages: Page[] = [
    createPage("cover", { label: "Cover" }),
    createPage("contents"),
    createPage("foreword"),
    createPage("chapter"),
    createPage("features"),
    createPage("expressive"),
    createPage("scripts"),
    createPage("math"),
    createPage("vector"),
    createPage("tables"),
    createPage("code"),
    createPage("markup"),
    createPage("form")
  ];
  const id = (kind: PageKind): string => pages.find(page => page.kind === kind)!.id;

  const comments: Comment[] = [
    comment({
      ...EDITOR,
      pageId: id("foreword"),
      kind: "highlight",
      date: "2026-09-30 15:32",
      quote: "Every kerning pair is a small promise",
      body: "Keep this wording — it is the thesis of the whole specimen.",
      replies: [reply("Layout Editor", "LE", "2026-09-30 15:36", "Agreed. I moved it into the pull quote slot.")]
    }),
    comment({
      ...LAYOUT,
      pageId: id("foreword"),
      kind: "note",
      date: "2026-09-30 15:40",
      body: "The tracking ladder needs a real 0 row; the current caption reads -0."
    }),
    comment({
      ...EDITOR,
      pageId: id("chapter"),
      kind: "note",
      date: "2026-09-30 15:43",
      body: "Drop cap: two lines deep and baseline-aligned with the first line of the column."
    }),
    comment({
      ...EDITOR,
      pageId: id("chapter"),
      kind: "highlight",
      date: "2026-09-30 15:44",
      quote: "Good typography is noticed only when it is missing.",
      body: "Pull quote candidate. Set it across both columns.",
      replies: [reply("Type Engine", "TE", "2026-09-30 15:49", "Fits in two lines at 26pt with 3pt of tracking.")]
    }),
    comment({
      ...ENGINE,
      pageId: id("features"),
      kind: "highlight",
      date: "2026-09-30 15:51",
      quote: "ffi · ffl · ff",
      body: "All three ligatures are present in the text face, including the rare ffl."
    }),
    comment({
      ...LAYOUT,
      pageId: id("expressive"),
      kind: "note",
      date: "2026-09-30 15:56",
      body: "Keep the layered word inside the trim: the shadow bleeds past the margin at 125%."
    }),
    comment({
      ...LAYOUT,
      pageId: id("scripts"),
      kind: "note",
      date: "2026-09-30 16:02",
      body: "Vertical Japanese in the right margin reads top-to-bottom, right-to-left."
    }),
    comment({
      ...ENGINE,
      pageId: id("math"),
      kind: "note",
      date: "2026-09-30 16:05",
      body: "The integral limits should be centred on the sign, not the sigma."
    }),
    comment({
      ...LAYOUT,
      pageId: id("vector"),
      kind: "note",
      date: "2026-09-30 16:09",
      body: "Colour chips: four sRGB stops, names set in small caps below each swatch."
    }),
    comment({
      ...EDITOR,
      pageId: id("tables"),
      kind: "highlight",
      date: "2026-09-30 16:12",
      quote: "Q3 figures are provisional",
      body: "Add a footnote so nobody quotes this row in a deck.",
      replies: [
        reply("Layout Editor", "LE", "2026-09-30 16:15", "Footnote 4 added under the table."),
        reply("PdfCraft Reviewer", "PR", "2026-09-30 16:18", "Resolved — keeping it for the next revision.")
      ]
    }),
    comment({
      ...ENGINE,
      pageId: id("code"),
      kind: "note",
      date: "2026-09-30 16:21",
      body: "The listing overflows its column by 4pt in the current font."
    }),
    comment({
      ...EDITOR,
      pageId: id("markup"),
      kind: "highlight",
      date: "2026-09-30 16:26",
      quote: "Sticky notes hold threaded discussions",
      body: "Marker colour should match the comment rail accent."
    }),
    comment({
      author: "Rina Okafor",
      initials: "RO",
      accent: "#3f7d5c",
      pageId: id("markup"),
      kind: "underline",
      date: "2026-09-30 16:29",
      quote: "Please cite a source for this claim.",
      body: "Underline comments are a nice extra: they never obscure the glyphs."
    }),
    comment({
      ...ENGINE,
      pageId: id("form"),
      kind: "textbox",
      date: "2026-09-30 16:34",
      body: "FreeText: typed straight onto the page, with a /DA and rich text."
    })
  ];

  const bookmarks: Bookmark[] = [
    { id: nextId("bm"), title: "Cover", pageId: id("cover"), depth: 0 },
    { id: nextId("bm"), title: "Contents", pageId: id("contents"), depth: 0 },
    { id: nextId("bm"), title: "Why a specimen?", pageId: id("foreword"), depth: 0 },
    { id: nextId("bm"), title: "Chapter One — Setting Text", pageId: id("chapter"), depth: 0 },
    { id: nextId("bm"), title: "Setting Text", pageId: id("chapter"), depth: 1 },
    { id: nextId("bm"), title: "OpenType Features", pageId: id("features"), depth: 1 },
    { id: nextId("bm"), title: "Chapter Two — Expressive Type", pageId: id("expressive"), depth: 0 },
    { id: nextId("bm"), title: "Expressive Type", pageId: id("expressive"), depth: 1 },
    { id: nextId("bm"), title: "Scripts of the World", pageId: id("scripts"), depth: 1 },
    { id: nextId("bm"), title: "Chapter Three — Form & Figure", pageId: id("math"), depth: 0 },
    { id: nextId("bm"), title: "Mathematics", pageId: id("math"), depth: 1 },
    { id: nextId("bm"), title: "Vector Graphics", pageId: id("vector"), depth: 1 },
    { id: nextId("bm"), title: "Data & Tables", pageId: id("tables"), depth: 1 },
    { id: nextId("bm"), title: "Chapter Four — Production", pageId: id("code"), depth: 0 },
    { id: nextId("bm"), title: "Code & Images", pageId: id("code"), depth: 1 },
    { id: nextId("bm"), title: "Review & Markup", pageId: id("markup"), depth: 1 },
    { id: nextId("bm"), title: "Interactive Form", pageId: id("form"), depth: 1 }
  ];

  const formPage = id("form");
  const textField = (id: string, label: string): FieldDef => ({
    id,
    name: label,
    pageId: formPage,
    type: id === "message" ? "textarea" : "text",
    label
  });
  const fields: FieldDef[] = [
    textField("name", "Full name"),
    textField("email", "Email"),
    textField("company", "Company"),
    {
      id: "country",
      name: "Country",
      pageId: formPage,
      type: "select",
      label: "Country",
      options: ["United Kingdom", "Germany", "Japan", "United States", "Brazil"]
    },
    { id: "role-individual", name: "Role: Individual", pageId: formPage, type: "radio", label: "Role: Individual" },
    { id: "role-team", name: "Role: Team", pageId: formPage, type: "radio", label: "Role: Team" },
    { id: "role-student", name: "Role: Student", pageId: formPage, type: "radio", label: "Role: Student" },
    {
      id: "interests-updates",
      name: "Interests: Product updates",
      pageId: formPage,
      type: "checkbox",
      label: "Interests: Product updates"
    },
    {
      id: "interests-research",
      name: "Interests: Research",
      pageId: formPage,
      type: "checkbox",
      label: "Interests: Research"
    },
    textField("message", "Message"),
    textField("signature", "Signature"),
    textField("date", "Date"),
    { id: "consent", name: "Consent", pageId: formPage, type: "checkbox", label: "Consent" }
  ];

  return {
    id: nextId("doc"),
    name: "pdfcraft-showcase.pdf",
    pages,
    comments,
    bookmarks,
    fields,
    values: {
      name: "Ada Lovelace",
      email: "ada@example.com",
      company: "Analytical Engines",
      country: "United Kingdom",
      "role-individual": true,
      "role-team": false,
      "role-student": false,
      "interests-updates": true,
      "interests-research": false,
      message: "Please keep the pull quote on page 1.",
      signature: "A. Lovelace",
      date: "2026-10-01",
      consent: true
    },
    meta: SHOWCASE_META,
    dirty: false
  };
}

/** A compact second document used by Open / Combine / tabs. */
export function createFieldNotes(): PdfDoc {
  const pages: Page[] = [
    createPage("checklist", { label: "1" }),
    createPage("invoice", { label: "2" }),
    createPage("terms", { label: "3" }),
    createPage("grid", { label: "4" })
  ];
  const id = (kind: PageKind): string => pages.find(page => page.kind === kind)!.id;

  return {
    id: nextId("doc"),
    name: "field-notes.pdf",
    pages,
    comments: [
      comment({
        ...LAYOUT,
        pageId: id("checklist"),
        kind: "note",
        date: "2026-10-02 09:12",
        body: "Tick the boxes before the press check; everything after is a follow-up."
      })
    ],
    bookmarks: [
      { id: nextId("bm"), title: "Site checklist", pageId: id("checklist"), depth: 0 },
      { id: nextId("bm"), title: "Invoice 2026-114", pageId: id("invoice"), depth: 0 },
      { id: nextId("bm"), title: "Terms & signature", pageId: id("terms"), depth: 0 },
      { id: nextId("bm"), title: "Appendix: work grid", pageId: id("grid"), depth: 0 }
    ],
    fields: [],
    values: {},
    meta: {
      title: "field-notes",
      author: "PdfCraft Studio",
      subject: "Checklist, invoice and signature for the print run",
      keywords: "checklist, invoice, print"
    },
    dirty: false
  };
}

export function cloneDoc(doc: PdfDoc, overrides: Partial<PdfDoc> = {}): PdfDoc {
  return {
    ...doc,
    id: nextId("doc"),
    pages: doc.pages.map(page => ({ ...page })),
    comments: doc.comments.map(item => ({ ...item, replies: item.replies.map(entry => ({ ...entry })) })),
    bookmarks: doc.bookmarks.map(item => ({ ...item })),
    fields: doc.fields.map(field => ({ ...field })),
    values: { ...doc.values },
    meta: { ...doc.meta },
    ...overrides
  };
}

/** Pages cloned for extract/split destinations, with stable page ids. */
export function clonePages(pages: Page[]): Page[] {
  return pages.map(page => ({ ...page, id: nextId("page") }));
}

export function pageLabel(page: Page): string {
  return page.blank ? "—" : page.label || "—";
}

export function rotatePage(page: Page, direction: 1 | -1): void {
  const order: Rotation[] = [0, 90, 180, 270];
  const index = order.indexOf(page.rotation);
  page.rotation = order[(index + direction + 4) % 4];
}
