/** Shared types for the PdfCraft workbench demo. */

export type PageKind =
  | "cover"
  | "contents"
  | "foreword"
  | "chapter"
  | "features"
  | "expressive"
  | "scripts"
  | "math"
  | "vector"
  | "tables"
  | "code"
  | "markup"
  | "form"
  | "blank"
  | "checklist"
  | "invoice"
  | "terms"
  | "grid";

export type Rotation = 0 | 90 | 180 | 270;

export type CommentKind = "note" | "highlight" | "underline" | "textbox";

export type FieldType = "text" | "checkbox" | "radio" | "select" | "textarea";

export interface Page {
  id: string;
  kind: PageKind;
  label: string;
  title: string;
  /** Running-header section name, e.g. "Setting Text". */
  section: string;
  rotation: Rotation;
  blank?: boolean;
}

export interface Reply {
  id: string;
  author: string;
  initials: string;
  date: string;
  body: string;
  accent?: string;
}

export interface Comment {
  id: string;
  pageId: string;
  kind: CommentKind;
  author: string;
  initials: string;
  date: string;
  body: string;
  quote?: string;
  accent: string;
  replies: Reply[];
  resolved?: boolean;
}

/** A flat bookmark row; `depth` drives the nested outline. */
export interface Bookmark {
  id: string;
  title: string;
  pageId?: string;
  depth: number;
}

export interface FieldDef {
  id: string;
  name: string;
  pageId: string;
  type: FieldType;
  label: string;
  options?: string[];
}

export interface DocMeta {
  title: string;
  author: string;
  subject: string;
  keywords: string;
}

export interface PdfDoc {
  id: string;
  name: string;
  pages: Page[];
  comments: Comment[];
  bookmarks: Bookmark[];
  fields: FieldDef[];
  values: Record<string, string | boolean>;
  meta: DocMeta;
  dirty: boolean;
}

export interface PageSnapshot {
  docId: string;
  pages: Page[];
  comments: Comment[];
  bookmarks: Bookmark[];
  fields: FieldDef[];
  values: Record<string, string | boolean>;
  meta: DocMeta;
}

export interface HistoryEntry {
  label: string;
  snapshot: PageSnapshot;
  time: number;
}
