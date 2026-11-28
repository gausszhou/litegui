/**
 * Inline SVG icon set for PdfCraft.
 *
 * Every icon is a 24×24 stroke glyph so the workbench can tint it with
 * `currentColor` and scale it without a network request.
 */

const ICONS = {
  logo: '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5"/><path d="M9 12h6M9 16h6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  plus: '<path d="M12 4v16M4 12h16"/>',
  minus: '<path d="M4 12h16"/>',
  check: '<path d="M4 12.5l5 5L20 6.5"/>',
  "chevron-down": '<path d="M5 9l7 7 7-7"/>',
  "chevron-up": '<path d="M5 15l7-7 7 7"/>',
  "chevron-left": '<path d="M15 5l-7 7 7 7"/>',
  "chevron-right": '<path d="M9 5l7 7-7 7"/>',
  dots: '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
  cursor: '<path d="M5 2.5l13.5 10-6.2 1.2L8.9 20z" fill="currentColor" stroke="none"/>',
  hand: '<path d="M7 12V6.5a1.6 1.6 0 0 1 3.2 0V12m0-1.5V5a1.6 1.6 0 0 1 3.2 0v6m0-1.2V6.8a1.6 1.6 0 0 1 3.2 0V15a6 6 0 0 1-6 6h-.4a6 6 0 0 1-6-6v-3.4a1.6 1.6 0 0 1 3.2 0V13"/>',
  "text-select": '<path d="M8 4h8M12 4v16M8 20h8"/><path d="M3 7v10M21 7v10" opacity=".35"/>',
  snapshot:
    '<rect x="3" y="6.5" width="18" height="13.5" rx="2"/><circle cx="12" cy="13.2" r="3.4"/><path d="M8.4 6.5l1.5-2.5h4.2l1.5 2.5"/>',
  textbox: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 9.5h8M12 9.5v6.5"/>',
  highlight: '<path d="M15 3.5l5.5 5.5-8.5 8.5H7l-3-3z"/><path d="M4.5 21.5H12"/>',
  ink: '<path d="M12 2.5l7.5 7.5-8.5 8.5H6l-2.5-2.5z"/><circle cx="13.4" cy="8.6" r="1.4"/>',
  eraser:
    '<path d="M9.5 20.5L3.6 14.6a2 2 0 0 1 0-2.8l8.1-8.1a2 2 0 0 1 2.8 0l5.8 5.8a2 2 0 0 1 0 2.8l-7.6 8.2z"/><path d="M7.8 8.9l7.3 7.3"/>',
  export: '<path d="M12 3v12M8 6.5l4-4 4 4M4 15v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3"/>',
  sign: '<path d="M3 19.5c3.6-.4 5.5-2.6 7-6.4 1.6-4 2.7-7.6 5.2-7.6 2 0 2.6 2.4.7 4.3-2.4 2.4-5.7 1.5-8.6 3.8C5.2 15.5 4 18 3 19.5z"/><path d="M4 22h16"/>',
  edit: '<path d="M4 20h4L20.5 7.5 16.5 3.5 4 16z"/><path d="M14.5 5.5l4 4"/>',
  create: '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5"/><path d="M12 11.5v6M9 14.5h6"/>',
  combine: '<path d="M9 3h8l3 3v10H9z"/><path d="M3 8v11a2 2 0 0 0 2 2h9"/><path d="M13 8.5h4M13 12.5h4"/>',
  organize:
    '<rect x="3" y="3" width="7.2" height="7.2" rx="1"/><rect x="13.8" y="3" width="7.2" height="7.2" rx="1"/><rect x="3" y="13.8" width="7.2" height="7.2" rx="1"/><rect x="13.8" y="13.8" width="7.2" height="7.2" rx="1"/>',
  comment: '<path d="M20.5 11.6a8.3 8.3 0 0 1-8.3 8.3H8.5L3 22.5l1.6-5.1a8.3 8.3 0 1 1 15.9-5.8z"/>',
  scan: '<path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4"/><path d="M3 12h18"/>',
  protect:
    '<path d="M12 2.5l7.5 3v5.2c0 4.8-3.1 8.4-7.5 10.8-4.4-2.4-7.5-6-7.5-10.8V5.5z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
  redact:
    '<rect x="3" y="6" width="18" height="4.5" rx="1" fill="currentColor" stroke="none"/><path d="M5 14.5h7M16 14.5h3M5 18.5h5M13 18.5h6"/>',
  compress: '<path d="M4 9h5V4M20 9h-5V4M4 15h5v5M20 15h-5v5"/>',
  form: '<rect x="3" y="3.5" width="18" height="17" rx="2"/><path d="M7 9h6M7 13h10M7 17h4"/>',
  stamp: '<path d="M9 3h6l-1.2 6.2H16a3 3 0 0 1 3 3v2.3H5v-2.3a3 3 0 0 1 3-3h2.2z"/><path d="M4 18.5h16V22H4z"/>',
  certificate: '<circle cx="12" cy="9" r="5.2"/><path d="M8.6 13.2L7 22l5-3 5 3-1.6-8.8"/>',
  more: '<circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none"/>',
  pages:
    '<rect x="5" y="2.5" width="12" height="16" rx="1.2"/><path d="M19 6.5v14H9.5"/><path d="M8.5 7.5h5M8.5 11h5M8.5 14.5h3"/>',
  bookmarks: '<path d="M7 2.5h10a1 1 0 0 1 1 1V22l-6-4.2L6 22V3.5a1 1 0 0 1 1-1z"/>',
  layers: '<path d="M12 2.8l9.2 5-9.2 5-9.2-5z"/><path d="M2.8 12.4l9.2 5 9.2-5M2.8 17l9.2 5 9.2-5"/>',
  fields:
    '<rect x="3" y="4.5" width="18" height="6" rx="1.2"/><rect x="3" y="13.5" width="18" height="6" rx="1.2"/><path d="M7 7.5h4M7 16.5h7"/>',
  attachments:
    '<path d="M20 11.5l-8.6 8.6a5.2 5.2 0 0 1-7.4-7.4l9-9a3.6 3.6 0 0 1 5.1 5.1l-9 9a2 2 0 0 1-2.8-2.8l8.2-8.2"/>',
  pen: '<path d="M3 20.5c3.4-.8 5.2-2.6 6.8-6.6 1.5-3.9 2.8-8.4 5.7-8.4 2.2 0 2.8 2.6.8 4.6-2.6 2.6-6.2 1.7-9.3 4.2-2 1.7-3.1 4.2-4 6.2z"/><path d="M4 23h16"/>',
  sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7"/>',
  moon: '<path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5 8.8 8.8 0 1 0 20.5 14.6z"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.4 9a2.7 2.7 0 0 1 5.3.8c0 1.8-2.7 2.1-2.7 3.9"/><circle cx="12" cy="17.4" r="1" fill="currentColor" stroke="none"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 10.8V17"/><circle cx="12" cy="7.6" r="1" fill="currentColor" stroke="none"/>',
  discord:
    '<path d="M8.2 5.5A13 13 0 0 1 12 5a13 13 0 0 1 3.8.5c2 3 3.1 6.6 2.7 10.3a13 13 0 0 1-4 2l-.9-1.6a10 10 0 0 1-3.2 0L9.5 17.8a13 13 0 0 1-4-2C5.1 12.1 6.2 8.5 8.2 5.5z"/><circle cx="9.4" cy="11.8" r="1.1" fill="currentColor" stroke="none"/><circle cx="14.6" cy="11.8" r="1.1" fill="currentColor" stroke="none"/>',
  printer:
    '<path d="M6.5 8.5V3h11v5.5"/><rect x="3" y="8.5" width="18" height="8" rx="2"/><path d="M6.5 13.5h11V21h-11z"/>',
  save: '<path d="M4 4h12l4 4v12H4z"/><path d="M8 4v5.5h8V4M8 20v-6h8v6"/>',
  download: '<path d="M12 3v12M7 11l5 5 5-5M4 21h16"/>',
  undo: '<path d="M4 9h11a5.2 5.2 0 0 1 0 10.4H8"/><path d="M4 9l5-5M4 9l5 5"/>',
  redo: '<path d="M20 9H9a5.2 5.2 0 0 0 0 10.4h7"/><path d="M20 9l-5-5M20 9l-5 5"/>',
  trash: '<path d="M4 6h16M9.5 6V3h5v3M6 6l1 15h10l1-15"/><path d="M10 10.5v6.5M14 10.5v6.5"/>',
  rotate: '<path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3.5v6h-6"/>',
  "rotate-ccw": '<path d="M3 12a9 9 0 1 0 2.6-6.4"/><path d="M3 3.5v6h6"/>',
  insert: '<rect x="4" y="3" width="12" height="17" rx="1.2"/><path d="M8 8.5h4M10 6.5v4M18 9h3v12H9"/>',
  duplicate:
    '<rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M16 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5"/>',
  "move-left": '<path d="M20 12H4M10 6l-6 6 6 6"/>',
  "move-right": '<path d="M4 12h16M14 6l6 6-6 6"/>',
  fit: '<path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1.2" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.2" fill="currentColor" stroke="none"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  unlock: '<rect x="5" y="10.5" width="14" height="10.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 6.6-1.6"/>',
  settings:
    '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  keyboard:
    '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M9.5 10h.01M13 10h.01M16.5 10h.01M20 10h.01M6 13.5h.01M9.5 13.5h.01M13 13.5h.01M16.5 13.5h.01M20 13.5h.01M8 16.5h8"/>',
  eye: '<path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  "eye-off":
    '<path d="M3 3l18 18"/><path d="M10.6 5.2A10.6 10.6 0 0 1 12 5c6.2 0 10 7 10 7a18 18 0 0 1-3.3 4.2M6.4 6.6C3.7 8.4 2 12 2 12s3.8 7 10 7a10.9 10.9 0 0 0 4.5-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  copy: '<rect x="9" y="9" width="11.5" height="11.5" rx="1.5"/><path d="M5 15V4.5h11"/>',
  link: '<path d="M10.5 13.5a4.6 4.6 0 0 0 6.5 0l2-2a4.6 4.6 0 0 0-6.5-6.5l-1 1"/><path d="M13.5 10.5a4.6 4.6 0 0 0-6.5 0l-2 2a4.6 4.6 0 0 0 6.5 6.5l1-1"/>',
  reply: '<path d="M9.5 6.5L3 12l6.5 5.5V14c6 0 9.5 2.2 11.5 7 0-8.4-3.6-12.5-11.5-12.5z"/>',
  send: '<path d="M3 11l18-8-8 18-2.2-7.8z"/>',
  folder: '<path d="M3 6h6.2l2 2.2H21V21H3z"/>',
  file: '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5"/>',
  star: '<path d="M12 2.8l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.4l6.2-.9z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.7 2.6 2.7 15.4 0 18M12 3c-2.7 2.6-2.7 15.4 0 18"/>',
  bookmark: '<path d="M7 2.5h10a1 1 0 0 1 1 1V22l-6-4.2L6 22V3.5a1 1 0 0 1 1-1z"/>'
} as const;

export type IconName = keyof typeof ICONS;

export function icon(name: IconName, size = 16, extraClass = ""): string {
  return `<svg class="pf-icon ${extraClass}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
}
