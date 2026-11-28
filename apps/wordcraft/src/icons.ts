/**
 * Inline SVG icon set for the WordCraft demo.
 *
 * Icons are intentionally drawn on a 24×24 grid with 1.5px strokes so they sit
 * comfortably in the compact ribbon and status bar.
 */

const stroke = (body: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

const glyph = (body: string) => `<svg viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;

const icons: Record<string, string> = {
  /* shell */
  save: stroke('<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4"/><path d="M8 20v-6h8v6"/>'),
  undo: stroke('<path d="M9 7L4 12l5 5"/><path d="M4 12h9a5 5 0 0 1 0 10h-2"/>'),
  redo: stroke('<path d="M15 7l5 5-5 5"/><path d="M20 12h-9a5 5 0 0 0 0 10h2"/>'),
  more: glyph(
    '<circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>'
  ),
  search: stroke('<circle cx="10.5" cy="10.5" r="5.5"/><path d="M15 15l5 5"/>'),
  chevron: stroke('<path d="M7 10l5 5 5-5"/>'),
  close: stroke('<path d="M6 6l12 12M18 6L6 18"/>'),
  plus: stroke('<path d="M12 5v14M5 12h14"/>'),
  minus: stroke('<path d="M5 12h14"/>'),
  check: stroke('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  info: stroke(
    '<circle cx="12" cy="12" r="8"/><path d="M12 11v5"/><circle cx="12" cy="8" r=".8" fill="currentColor" stroke="none"/>'
  ),
  settings: stroke(
    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1z"/>'
  ),
  print: stroke('<path d="M7 9V3h10v6"/><rect x="4" y="9" width="16" height="7" rx="1.5"/><path d="M7 14h10v7H7z"/>'),
  share: stroke('<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5H5V6h5"/>'),
  reply: stroke('<path d="M9 8L4 13l5 5"/><path d="M4 13h10a6 6 0 0 1 0 12h-1"/>'),

  /* clipboard & font */
  paste: stroke(
    '<path d="M8 5H5v16h14V5h-3"/><rect x="8" y="3" width="8" height="4" rx="1"/><path d="M8 13h8M8 17h5"/>'
  ),
  cut: stroke('<circle cx="7" cy="18" r="2.4"/><circle cx="17" cy="18" r="2.4"/><path d="M8.6 16L18 4M15.4 16L6 4"/>'),
  copy: stroke('<rect x="8" y="8" width="12" height="12" rx="1.5"/><path d="M16 8V4H4v12h4"/>'),
  painter: stroke('<path d="M4 6h10v5H4z"/><path d="M9 11v4h5v5h4v-9h-9"/>'),
  fontColor: glyph(
    '<path d="M6 18L11.2 5h1.6L18 18h-2.2l-1.3-3.4H9.4L8.1 18z" fill="currentColor"/><rect x="5" y="20.5" width="14" height="2.5" rx="1" fill="currentColor"/>'
  ),
  highlight: glyph(
    '<path d="M5 19h14v2H5z" fill="currentColor"/><path d="M8 15.5L6 17v-4l7.5-7.5 3 3L9 16z" fill="currentColor"/>'
  ),
  bold: glyph(
    '<text x="12" y="17.2" text-anchor="middle" font-family="Georgia, serif" font-size="16" font-weight="700" fill="currentColor">B</text>'
  ),
  italic: glyph(
    '<text x="12" y="17" text-anchor="middle" font-family="Georgia, serif" font-size="16" font-style="italic" fill="currentColor">I</text>'
  ),
  underline: glyph(
    '<text x="12" y="15.5" text-anchor="middle" font-family="Georgia, serif" font-size="15" fill="currentColor">U</text><path d="M6 19.5h12" stroke="currentColor" stroke-width="1.8"/>'
  ),
  strike: glyph(
    '<text x="12" y="16" text-anchor="middle" font-family="Georgia, serif" font-size="15" fill="currentColor">S</text><path d="M5 12h14" stroke="currentColor" stroke-width="1.6"/>'
  ),
  subscript: glyph(
    '<text x="9" y="14" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="currentColor">X</text><text x="16.5" y="20" text-anchor="middle" font-family="Georgia, serif" font-size="9" fill="currentColor">2</text>'
  ),
  superscript: glyph(
    '<text x="8" y="16" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="currentColor">X</text><text x="16" y="10" text-anchor="middle" font-family="Georgia, serif" font-size="9" fill="currentColor">2</text>'
  ),
  changeCase: glyph(
    '<text x="7" y="17" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="currentColor">A</text><text x="16" y="17" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="currentColor">a</text>'
  ),
  fontGrow: glyph(
    '<text x="9" y="17" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="currentColor">A</text><path d="M14 9l3-3 3 3M17 6v9" stroke="currentColor" stroke-width="1.5" fill="none"/>'
  ),
  fontShrink: glyph(
    '<text x="9" y="17" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="currentColor">A</text><path d="M14 6l3 3 3-3M17 9V3" stroke="currentColor" stroke-width="1.5" fill="none"/>'
  ),
  select: stroke('<rect x="4" y="4" width="12" height="12" rx="1" stroke-dasharray="3 2"/><path d="M9 20h11V9"/>'),
  star: stroke('<path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.8-5.4 2.8 1-6L3.2 9.4l6.1-.9z"/>'),
  keyboard: stroke(
    '<rect x="2" y="6" width="20" height="12" rx="1.5"/><path d="M6 10h1M10 10h1M14 10h1M18 10h1M6 14h1M18 14h1M9 14h6"/>'
  ),
  clearFormat: stroke('<path d="M7 6h11"/><path d="M12 6l-3 12"/><path d="M12 18h5"/><circle cx="18.5" cy="7" r="3"/>'),

  /* paragraph */
  bullets: stroke(
    '<circle cx="5" cy="7" r="1.2" fill="currentColor"/><circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="5" cy="17" r="1.2" fill="currentColor"/><path d="M9 7h11M9 12h11M9 17h11"/>'
  ),
  numbering: stroke(
    '<path d="M9 7h11M9 12h11M9 17h11"/><text x="5" y="9" text-anchor="middle" font-size="8" fill="currentColor">1</text><text x="5" y="14" text-anchor="middle" font-size="8" fill="currentColor">2</text><text x="5" y="19" text-anchor="middle" font-size="8" fill="currentColor">3</text>'
  ),
  multilevel: stroke(
    '<path d="M9 6h11M12 12h8M15 18h5"/><circle cx="5" cy="6" r="1" fill="currentColor"/><circle cx="8" cy="12" r="1" fill="currentColor"/><circle cx="11" cy="18" r="1" fill="currentColor"/>'
  ),
  indentInc: stroke(
    '<path d="M11 6h9M11 12h9M11 18h9"/><path d="M4 9l4 3-4 3z" fill="currentColor"/><path d="M3 6v12"/>'
  ),
  indentDec: stroke(
    '<path d="M11 6h9M11 12h9M11 18h9"/><path d="M8 9L4 12l4 3z" fill="currentColor"/><path d="M3 6v12"/>'
  ),
  alignLeft: stroke('<path d="M4 6h16M4 10h10M4 14h16M4 18h12"/>'),
  alignCenter: stroke('<path d="M4 6h16M7 10h10M4 14h16M6 18h12"/>'),
  alignRight: stroke('<path d="M4 6h16M10 10h10M4 14h16M8 18h12"/>'),
  alignJustify: stroke('<path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>'),
  lineSpacing: stroke('<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 5v14M2 7l2-2 2 2M2 17l2 2 2-2"/>'),
  shading: stroke(
    '<rect x="4" y="5" width="16" height="14" rx="1"/><path d="M4 15h16" fill="none"/><path d="M7 18h2M11 18h2M15 18h2"/>'
  ),
  borders: stroke('<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 12h18M12 5v14"/>'),
  sort: stroke('<path d="M7 5v14M4 8l3-3 3 3M17 19V5M14 16l3 3 3-3"/>'),

  /* insert */
  coverPage: stroke('<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M8 7h8M8 10h5M8 16h8"/>'),
  blankPage: stroke('<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M12 8v8M8 12h8"/>'),
  pageBreak: stroke('<path d="M5 3h14v6H5zM5 15h14v6H5z"/><path d="M3 12h4M10 12h4M17 12h4" stroke-dasharray="2 2"/>'),
  table: stroke('<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 10h18M3 14.5h18M9 5v14M15 5v14"/>'),
  picture: stroke(
    '<rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="8.5" cy="9" r="1.6"/><path d="M4 18l5-5 4 4 3-3 4 4"/>'
  ),
  shape: stroke('<rect x="3" y="6" width="9" height="12"/><circle cx="16.5" cy="12" r="4.5"/>'),
  smartart: stroke(
    '<rect x="3" y="9" width="6" height="6"/><rect x="15" y="3" width="6" height="6"/><rect x="15" y="15" width="6" height="6"/><path d="M9 12h3V6h3M12 12v6h3"/>'
  ),
  chart: stroke(
    '<path d="M4 20V4"/><path d="M4 20h16"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/>'
  ),
  link: stroke(
    '<path d="M10 14a5 5 0 0 1 0-7l2-2a5 5 0 0 1 7 7l-1.5 1.5"/><path d="M14 10a5 5 0 0 1 0 7l-2 2a5 5 0 0 1-7-7l1.5-1.5"/>'
  ),
  bookmark: stroke('<path d="M7 3h10v18l-5-4-5 4z"/>'),
  crossref: stroke('<path d="M4 6h7M4 12h7M4 18h7"/><path d="M15 6h5M15 12h5M15 18h5"/><path d="M12 3v18"/>'),
  comment: stroke('<path d="M4 5h16v11H9l-5 4z"/>'),
  header: stroke('<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M4 8h16"/><path d="M8 5.5h8"/>'),
  footer: stroke('<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M4 16h16"/><path d="M8 19h8"/>'),
  pageNumber: stroke(
    '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M12 15.5v-5l-1.5 1"/><circle cx="12" cy="19" r=".8" fill="currentColor"/>'
  ),
  textBox: stroke('<rect x="3" y="6" width="18" height="12" rx="1"/><path d="M8 15V9h8M12 9v6"/>'),
  quickParts: stroke(
    '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><path d="M17 13v8M13 17h8"/>'
  ),
  wordArt: glyph(
    '<text x="12" y="17" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="15" fill="currentColor">A</text><path d="M4 20l4-5 4 3 4-6 4 4" stroke="currentColor" stroke-width="1.5" fill="none"/>'
  ),
  dropCap: glyph(
    '<text x="7" y="17" font-family="Georgia, serif" font-size="16" fill="currentColor">A</text><path d="M12 8h8M12 12h8M12 16h8" stroke="currentColor" stroke-width="1.5"/>'
  ),
  equation: glyph(
    '<text x="12" y="17" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="currentColor">π</text><path d="M4 5h16" stroke="currentColor" stroke-width="1.5"/>'
  ),
  symbol: glyph(
    '<text x="9" y="16" text-anchor="middle" font-size="14" fill="currentColor">Ω</text><text x="17" y="20" text-anchor="middle" font-size="12" fill="currentColor">¶</text>'
  ),

  /* draw */
  pen: stroke('<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M13 7l4 4"/>'),
  highlighter: stroke('<path d="M6 20h7"/><path d="M8 16l-2-2 8-9 4 4-8 9z"/><path d="M13 6l5 5"/>'),
  eraser: stroke('<path d="M4 17l7-7 7 7-3 3H7z"/><path d="M11 10l5-5 4 4-5 5"/><path d="M4 21h16"/>'),
  lasso: stroke(
    '<path d="M12 4c-4.4 0-8 2.7-8 6s3.6 6 8 6c2 0 3.8-.6 5.2-1.5"/><path d="M17 14c0 2-1 3.5-2.5 4.2"/><circle cx="15" cy="20" r="1.3"/>'
  ),
  inkShape: stroke('<path d="M5 17c2-6 4-9 7-9s5 3 7 9"/><path d="M4 20h16"/>'),
  replay: stroke(
    '<path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 4v5h5"/><path d="M10 11l5 2-5 2z" fill="currentColor"/>'
  ),

  /* design & layout */
  theme: stroke('<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16"/>'),
  colors: stroke('<circle cx="9" cy="9" r="4"/><circle cx="15" cy="9" r="4"/><circle cx="12" cy="15" r="4"/>'),
  fonts: glyph(
    '<text x="8" y="16" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="currentColor">A</text><text x="16" y="17" text-anchor="middle" font-family="Arial" font-size="12" fill="currentColor">a</text>'
  ),
  spacing: stroke('<path d="M5 6h14M5 12h14M5 18h14"/><path d="M12 3v3M12 18v3"/>'),
  effects: stroke(
    '<circle cx="12" cy="12" r="5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>'
  ),
  watermark: stroke('<circle cx="12" cy="12" r="8"/><path d="M6 18L18 6"/>'),
  pageColor: stroke(
    '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M8 18l8-8v5l-5 5z" fill="currentColor"/>'
  ),
  margins: stroke(
    '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M7 3v18M17 3v18M3 8h18M3 16h18" stroke-dasharray="2 2"/>'
  ),
  orientation: stroke(
    '<rect x="3" y="6" width="18" height="12" rx="1"/><path d="M7 6v12M3 9h18M3 15h18" stroke-dasharray="2 2"/>'
  ),
  pageSize: stroke('<rect x="4" y="2" width="12" height="20" rx="1"/><path d="M20 8v8l-4 4V8z"/>'),
  columns: stroke('<path d="M3 4h18v16H3z"/><path d="M12 4v16"/><path d="M3 9h18M3 15h18" stroke-dasharray="2 2"/>'),
  breaks: stroke('<path d="M5 3h14v7H5zM5 15h14v6H5z"/><path d="M3 12.5h18" stroke-dasharray="2 2"/>'),
  lineNumbers: stroke('<path d="M9 5h11M9 10h11M9 15h11M9 20h11"/><path d="M4 5h2M4 10h2M4 15h2M4 20h2"/>'),
  hyphenation: stroke('<path d="M4 6h7M4 12h5M4 18h8"/><path d="M14 12h6M16 9v6"/>'),
  position: stroke('<rect x="8" y="8" width="8" height="8"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>'),
  wrap: stroke('<rect x="3" y="6" width="5" height="12"/><path d="M10 9h9M10 13h7M10 17h9"/>'),
  selectionPane: stroke(
    '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 3v18"/><path d="M12 8h6M12 12h6M12 16h6"/>'
  ),

  /* references */
  toc: stroke('<path d="M4 5h16M4 11h10M4 17h7"/><path d="M16 11h4M16 17h4"/><path d="M14 13l2-2 2 2" fill="none"/>'),
  update: stroke(
    '<path d="M20 11a8 8 0 0 0-14-5L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14 5l2-2"/><path d="M20 20v-4h-4"/>'
  ),
  addText: stroke('<path d="M4 6h10M9 6v13"/><path d="M17 4v10M13 11h8"/>'),
  footnote: stroke('<path d="M5 5h14M5 10h9"/><path d="M5 16h5"/><path d="M17 13v6M14 16h6"/>'),
  nextFootnote: stroke('<path d="M4 6h9M4 11h6"/><path d="M4 17h4"/><path d="M16 9v8M12 13h8"/>'),
  showNotes: stroke('<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M4 15h16"/><path d="M8 18h8M8 7h8"/>'),
  researcher: stroke('<circle cx="11" cy="11" r="6"/><path d="M15.5 15.5L21 21"/><path d="M8 11h6M11 8v6"/>'),
  citation: stroke('<path d="M6 4h12v16H6z"/><path d="M9 8h6M9 12h6M9 16h3"/>'),
  sources: stroke('<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h8M8 11h8M8 15h5"/>'),
  bibStyle: glyph(
    '<text x="7" y="16" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="currentColor">APA</text><path d="M15 8l4 3-4 3" stroke="currentColor" stroke-width="1.5" fill="none"/>'
  ),
  captions: stroke('<rect x="4" y="4" width="16" height="10" rx="1"/><path d="M7 18h10"/>'),
  index: stroke('<path d="M5 3h14v18H5z"/><path d="M8 7h8M8 11h8M8 15h5"/>'),
  authorities: stroke('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>'),

  /* mailings */
  envelopes: stroke('<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 7l9 6 9-6"/>'),
  labels: stroke('<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 9h18M3 14h18M12 4v16"/>'),
  merge: stroke('<circle cx="8" cy="8" r="3"/><circle cx="16" cy="16" r="3"/><path d="M11 8h5M8 11v5"/>'),
  recipients: stroke(
    '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.5 2.5-6 6-6s6 2.5 6 6"/><path d="M17 8h4M19 6v4M17 15h4"/>'
  ),
  address: stroke('<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M8 8h8M8 12h8M8 16h5"/>'),
  greeting: stroke('<path d="M3 6h18v12H3z"/><path d="M7 10h10M7 14h6"/>'),
  mergeField: stroke('<path d="M4 6h16M4 12h7M4 18h7"/><path d="M15 11l4 3-4 3"/>'),
  preview: stroke('<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  finish: stroke('<circle cx="12" cy="12" r="8"/><path d="M8 12l3 3 5-6"/>'),

  /* review */
  spelling: glyph(
    '<text x="8" y="16" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="currentColor">abc</text><path d="M4 20l6-16 6 16M7 15h6" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M16 9l2 2 4-4" stroke="currentColor" stroke-width="1.5" fill="none"/>'
  ),
  thesaurus: stroke(
    '<path d="M4 5h6a3 3 0 0 1 3 3v11a3 3 0 0 0-3-3H4z"/><path d="M20 5h-4a3 3 0 0 0-3 3v11a3 3 0 0 1 3-3h4z"/>'
  ),
  wordCount: glyph(
    '<text x="6" y="12" text-anchor="middle" font-size="7" fill="currentColor">123</text><text x="6" y="20" text-anchor="middle" font-size="7" fill="currentColor">456</text><path d="M13 6h7M13 12h7M13 18h7" stroke="currentColor" stroke-width="1.5"/>'
  ),
  readAloud: stroke('<path d="M4 10v4h3l5 4V6L7 10z"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>'),
  accessibility: stroke('<circle cx="12" cy="5" r="2"/><path d="M4 9h16M12 9v5M12 14l-4 7M12 14l4 7"/>'),
  newComment: stroke('<path d="M4 5h11v9H8l-4 3z"/><path d="M18 12v8M14 16h8"/>'),
  deleteComment: stroke('<path d="M4 5h11v9H8l-4 3z"/><path d="M16 13l6 6M22 13l-6 6"/>'),
  showComments: stroke('<path d="M3 5h12v9H8l-4 3z"/><path d="M18 8h3v8l-3 2v-2h-2"/>'),
  trackChanges: stroke('<path d="M6 4l12 12-3 3L3 7z"/><path d="M14 6l4 4"/><path d="M3 21h18"/>'),
  markup: stroke(
    '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M7 9h10M7 13h6M7 17h8" stroke-dasharray="2 2"/>'
  ),
  reviewingPane: stroke(
    '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M14 4v16"/><path d="M6 8h5M6 12h5M17 8h1M17 12h1"/>'
  ),
  accept: stroke('<path d="M4 12l4 4L20 5"/><path d="M16 13v6H4V7h8"/>'),
  reject: stroke('<path d="M6 6l12 12M18 6L6 18"/><path d="M16 13v6H4V7h8"/>'),
  compare: stroke('<path d="M4 4h7v16H4zM13 4h7v16h-7z"/><path d="M7 8h1M7 12h1M16 8h1M16 12h1"/>'),
  protect: stroke(
    '<rect x="5" y="10" width="14" height="10" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15" r="1.3"/>'
  ),
  restrict: stroke('<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/><path d="M9 12l2 2 4-4"/>'),

  /* view */
  readMode: stroke('<path d="M4 5h7v14H4zM13 5h7v14h-7z"/><path d="M7 9h1M7 13h1M16 9h1M16 13h1"/>'),
  printLayout: stroke('<rect x="6" y="3" width="12" height="18" rx="1"/><path d="M9 7h6M9 11h6M9 15h4"/>'),
  webLayout: stroke(
    '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 8h18"/><circle cx="5.5" cy="6.5" r=".6" fill="currentColor"/>'
  ),
  outline: stroke('<path d="M5 6h14M8 11h11M11 16h8M14 21h5"/>'),
  draft: stroke('<path d="M4 5h16M4 10h16M4 15h11M4 20h7"/>'),
  ruler: stroke('<rect x="3" y="8" width="18" height="8" rx="1"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/>'),
  navPane: stroke(
    '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M9 4v16"/><path d="M5 8h2M5 12h2M5 16h2"/>'
  ),
  gridlines: stroke('<rect x="3" y="3" width="18" height="18"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>'),
  marks: glyph(
    '<text x="7" y="10" font-size="11" fill="currentColor">¶</text><text x="15" y="10" font-size="11" fill="currentColor">·</text><text x="7" y="19" font-size="11" fill="currentColor">¶</text><text x="15" y="19" font-size="11" fill="currentColor">·</text>'
  ),
  onePage: stroke('<rect x="7" y="3" width="10" height="18" rx="1"/>'),
  multiPage: stroke('<rect x="3" y="5" width="8" height="14"/><rect x="13" y="5" width="8" height="14"/>'),
  pageWidth: stroke('<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M6 12h12M9 9l-3 3 3 3M15 9l3 3-3 3"/>'),
  zoom: stroke('<circle cx="10" cy="10" r="6"/><path d="M15 15l5 5M8 10h4M10 8v4"/>'),
  newWindow: stroke(
    '<rect x="3" y="5" width="12" height="14" rx="1"/><path d="M9 3h12v12"/><path d="M15 9h6v10H11V9"/>'
  ),
  arrange: stroke(
    '<rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/>'
  ),
  split: stroke('<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 12h18"/>'),
  macros: stroke('<path d="M5 7l4 5-4 5M12 7l4 5-4 5"/><path d="M19 8v8"/>'),
  focus: stroke('<path d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4"/>'),
  reading: stroke('<path d="M4 5h16v13H4z"/><path d="M7 9h10M7 13h6"/>'),
  viewMode: stroke('<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M8 4v16"/>'),

  /* misc */
  file: stroke('<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>'),
  home: stroke('<path d="M3 11l9-8 9 8"/><path d="M6 10v10h12V10"/>'),
  arrowLeft: stroke('<path d="M15 5l-7 7 7 7"/>'),
  external: stroke('<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5H5V6h5"/>'),
  discord: stroke(
    '<path d="M8 6c-2 1-4 3-4 7 2 2 4 3 6 3l1-2c1 .3 2 .3 3 0l1 2c2 0 4-1 6-3 0-4-2-6-4-7l-1 2c-2-.5-4-.5-6 0z"/><circle cx="9.5" cy="13" r="1"/><circle cx="15.5" cy="13" r="1"/>'
  )
};

export function icon(name: string, size = 16): string {
  const markup =
    icons[name] ??
    icons.doc ??
    stroke('<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M8 8h8M8 12h8M8 16h5"/>');
  return `<span class="wc-icon" style="width:${size}px;height:${size}px">${markup}</span>`;
}

export function hasIcon(name: string): boolean {
  return name in icons;
}
