/** A small hand-drawn icon set (24px grid, currentColor strokes). */

const ICONS: Record<string, string> = {
  "chevron-down": '<path d="M6 9l6 6 6-6"/>',
  "chevron-right": '<path d="M9 6l6 6-6 6"/>',
  "chevron-left": '<path d="M15 6l-6 6 6 6"/>',
  "chevron-up": '<path d="M6 15l6-6 6 6"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  more: '<circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
  home: '<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"/>',
  save: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v6h7V4M8 15h8v5H8z"/>',
  undo: '<path d="M8 7H5a4 4 0 0 0 0 8h3M5 11l4-4M5 11l4 4"/><path d="M10 7h5a5 5 0 0 1 5 5v5"/>',
  redo: '<path d="M16 7h3a4 4 0 0 1 0 8h-3M19 11l-4-4M19 11l-4 4"/><path d="M14 7H9a5 5 0 0 0-5 5v5"/>',
  comment: '<path d="M4 5h16v11H9l-5 4z"/>',
  share: '<path d="M12 15V4M8 8l4-4 4 4"/><path d="M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="M15.5 15.5L20 20"/>',
  "zoom-in": '<circle cx="11" cy="11" r="6"/><path d="M8 11h6M11 8v6M15.5 15.5L20 20"/>',
  "zoom-out": '<circle cx="11" cy="11" r="6"/><path d="M8 11h6M15.5 15.5L20 20"/>',
  rename: '<path d="M4 18l4-1 9-9-3-3-9 9z"/><path d="M13 6l3 3"/>',
  clipboard: '<rect x="6" y="4" width="12" height="16" rx="2"/><path d="M9 4h6v3H9z"/>',
  paste: '<path d="M9 4h6v3H9z"/><path d="M7 5H5v15h14V5h-2"/><path d="M8 11h8M8 15h5"/>',
  cut: '<circle cx="6" cy="7" r="2.2"/><circle cx="6" cy="17" r="2.2"/><path d="M8 8l11 9M8 16L19 7"/>',
  copy: '<rect x="9" y="9" width="10" height="11" rx="1"/><path d="M5 15V5h10"/>',
  "format-painter": '<path d="M5 18l3-3M8 15l6-6 3 3-6 6z"/><path d="M14 6l4 4M14 4h6v6"/>',
  font: '<path d="M6 19L12 5l6 14M8.4 14h7.2"/>',
  bold: '<path d="M8 4h5a4 4 0 0 1 0 8H8zM8 12h6a4 4 0 0 1 0 8H8z"/>',
  italic: '<path d="M10 4h8M6 20h8M14 4l-4 16"/>',
  underline: '<path d="M6 4v7a6 6 0 0 0 12 0V4M4 21h16"/>',
  strike: '<path d="M6 12h12M7 7a4 3 0 0 1 7-1M8 17c1 2 4 3 6 2"/>',
  "align-left": '<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>',
  "align-center": '<path d="M4 6h16M7 10h10M4 14h16M7 18h10"/>',
  "align-right": '<path d="M4 6h16M10 10h10M4 14h16M10 18h10"/>',
  "align-top": '<path d="M4 5h16M12 9v10M8 13l4-4 4 4"/>',
  "align-middle": '<path d="M4 12h16M12 4v5M12 15v5M9 7l3-3 3 3M9 17l3 3 3-3"/>',
  "align-bottom": '<path d="M4 19h16M12 5v10M8 11l4 4 4-4"/>',
  "wrap-text": '<path d="M4 6h16M4 12h11a3 3 0 0 1 0 6h-2M4 18h4M17 15l3 3-3 3"/>',
  merge: '<rect x="4" y="6" width="16" height="12" rx="1"/><path d="M9 12h6M12 9v6"/>',
  orientation: '<path d="M7 17V7l5 5M17 7v10"/>',
  borders: '<rect x="4" y="4" width="16" height="16"/><path d="M12 4v16M4 12h16"/>',
  fill: '<path d="M5 12l7-7 6 6-7 7z"/><path d="M4 20h16M15 5l4 4"/>',
  "font-color":
    '<path d="M6 16L12 4l6 12M8.6 12h6.8"/><rect x="4" y="18" width="16" height="2" rx="1" fill="currentColor" stroke="none"/>',
  dollar:
    '<path d="M12 3v18M16 6.5c-1-1-2.3-1.5-4-1.5-2.2 0-3.5 1.1-3.5 2.7 0 3.8 7.5 1.9 7.5 5.8 0 1.7-1.5 2.8-4 2.8-1.8 0-3.2-.6-4.2-1.6"/>',
  percent: '<circle cx="7" cy="7" r="2.2"/><circle cx="17" cy="17" r="2.2"/><path d="M18 6L6 18"/>',
  comma: '<path d="M7 14c1.5 0 3 1 3 3s-1.5 3-3 3M14 4h3v10M4 4h9"/>',
  "decimal-inc": '<path d="M4 7h3v3H4zM11 7h2M15 7h2M20 7h1M4 14h3v3H4zM11 14h2M15 14h2M20 14h1M10 19l3 3 3-3"/>',
  "decimal-dec":
    '<path d="M4 7h3v3H4zM11 7h2M15 7h2M20 7h1M4 14h3v3H4zM11 14h2M15 14h2M20 14h1"/><path d="M16 21l-3-3M10 21l3-3" transform="translate(2 -1)"/>',
  percent2: '<circle cx="7" cy="7" r="2.2"/><circle cx="17" cy="17" r="2.2"/><path d="M18 6L6 18"/>',
  conditional:
    '<rect x="4" y="5" width="16" height="4" rx="1" fill="#c0392b" stroke="none"/><rect x="4" y="10" width="16" height="4" rx="1" fill="#f1c40f" stroke="none"/><rect x="4" y="15" width="16" height="4" rx="1" fill="#27ae60" stroke="none"/>',
  table: '<rect x="4" y="5" width="16" height="14" rx="1"/><path d="M4 10h16M9 10v9"/>',
  "cell-styles":
    '<rect x="4" y="4" width="7" height="7" rx="1" fill="#0e6b5c" stroke="none"/><rect x="13" y="4" width="7" height="7" rx="1" fill="#8fbfb5" stroke="none"/><rect x="4" y="13" width="7" height="7" rx="1" fill="#f4b183" stroke="none"/><rect x="13" y="13" width="7" height="7" rx="1" fill="#d9d9d9" stroke="none"/>',
  insert: '<rect x="4" y="4" width="10" height="10" rx="1"/><path d="M18 8v10M13 13h10" transform="translate(-1 -1)"/>',
  delete: '<rect x="4" y="4" width="10" height="10" rx="1"/><path d="M13 13h10" transform="translate(-1 -1)"/>',
  format: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  autosum: '<path d="M17 5H7l5 7-5 7h10"/>',
  "sort-asc": '<path d="M7 4v16M3 16l4 4 4-4M13 6h8M13 11h6M13 16h4"/>',
  "sort-desc": '<path d="M7 20V4M3 8l4-4 4 4M13 18h8M13 13h6M13 8h4"/>',
  filter: '<path d="M4 5h16l-6 7v6l-4 2v-8z"/>',
  "clear-filter": '<path d="M4 5h16l-6 7v6l-4 2v-8z"/><path d="M17 17l4 4M21 17l-4 4"/>',
  find: '<circle cx="11" cy="11" r="6"/><path d="M15.5 15.5L20 20M8 11h6"/>',
  "fill-down": '<path d="M12 4v10M8 10l4 4 4-4"/><rect x="4" y="17" width="16" height="3" rx="1"/>',
  clear: '<path d="M4 18h8M6 15l7-7 4 4-7 7z"/><path d="M14 4l4 4"/>',
  "chart-column":
    '<path d="M4 20V4M4 20h16"/><rect x="7" y="12" width="3" height="6" fill="currentColor" stroke="none"/><rect x="12" y="8" width="3" height="10" fill="currentColor" stroke="none"/><rect x="17" y="5" width="3" height="13" fill="currentColor" stroke="none"/>',
  "chart-bar":
    '<path d="M4 4v16h16"/><rect x="6" y="6" width="10" height="3" fill="currentColor" stroke="none"/><rect x="9" y="11" width="7" height="3" fill="currentColor" stroke="none"/><rect x="6" y="16" width="4" height="3" fill="currentColor" stroke="none"/>',
  "chart-line": '<path d="M4 20V4M4 20h16"/><path d="M6 15l4-5 3 3 5-7"/>',
  "chart-pie": '<path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M12 3v9h9"/>',
  "chart-area":
    '<path d="M4 20V4M4 20h16"/><path d="M6 16l4-5 3 3 5-6v10H6z" fill="currentColor" fill-opacity="0.25"/>',
  "chart-scatter":
    '<path d="M4 20V4M4 20h16"/><circle cx="8" cy="16" r="1.4"/><circle cx="11" cy="12" r="1.4"/><circle cx="14" cy="14" r="1.4"/><circle cx="17" cy="8" r="1.4"/>',
  sparkline: '<path d="M4 16l4-6 4 4 4-7 4 3"/>',
  pivot:
    '<rect x="4" y="4" width="7" height="7"/><rect x="4" y="14" width="7" height="6"/><rect x="14" y="4" width="6" height="10"/><path d="M14 17h6M17 14v6"/>',
  picture:
    '<rect x="3" y="5" width="18" height="14" rx="1"/><circle cx="8" cy="10" r="1.6"/><path d="M4 17l5-5 4 4 3-3 4 4"/>',
  shapes: '<circle cx="8" cy="8" r="4"/><rect x="12" y="12" width="8" height="8" rx="1"/>',
  "text-box": '<rect x="4" y="5" width="16" height="14" rx="1"/><path d="M8 9h8M8 12h8M8 15h5"/>',
  symbol: '<path d="M8 6l4 12 4-12M6 18h12"/><circle cx="18" cy="6" r="1.4"/>',
  "header-footer": '<rect x="4" y="4" width="16" height="16"/><path d="M4 8h16M4 16h16"/>',
  fx: '<path d="M9 5c-2 0-2.5 1.2-2.5 3v3c0 2-1 2.5-2.5 2.5 1.5 0 2.5.6 2.5 2.5v1c0 1.8.5 3 2.5 3"/><path d="M15 8l4 9M19 8l-4 9"/>',
  "name-manager": '<rect x="4" y="6" width="10" height="5" rx="1"/><path d="M4 15h8M14 12l5 3-5 3z"/>',
  "define-name": '<path d="M4 7h9M4 12h6M4 17h9"/><path d="M15 6l4 4-4 4M19 10h-6"/>',
  "use-formula": '<path d="M6 5h8v14H6z"/><path d="M16 9h4M18 7v4"/>',
  selection:
    '<rect x="4" y="4" width="16" height="16" stroke-dasharray="3 3"/><rect x="9" y="9" width="6" height="6" fill="currentColor" stroke="none"/>',
  "trace-prec": '<circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/><path d="M9 8.5l6 6M12 7h5M7 12v5"/>',
  "trace-dep": '<circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/><path d="M9 8.5l6 6M12 17h5M17 12v5"/>',
  "remove-arrows": '<path d="M4 12h16"/><path d="M7 8l-3 4 3 4M17 8l3 4-3 4" opacity="0.3"/>',
  "show-formulas": '<path d="M4 6h16M4 12h7M4 18h10"/><path d="M15 12l3 3-3 3M18 15h-5"/>',
  "error-check": '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9l6 6M15 9l-6 6"/>',
  evaluate: '<path d="M4 6h6M4 12h6M4 18h6"/><path d="M14 7l4 4-4 4M18 11h-2"/>',
  "calc-options":
    '<rect x="5" y="4" width="14" height="16" rx="2"/><path d="M8 8h8M8 12h2M12 12h2M16 12h1M8 16h2M12 16h2M16 16h1"/>',
  calculate: '<rect x="5" y="4" width="14" height="16" rx="2"/><path d="M8 9h8M8 13h3M13 13h3M8 17h3M13 17h3"/>',
  "get-data":
    '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
  "text-columns": '<path d="M4 5h6v14H4zM14 5h6v14h-6z"/><path d="M10 12h4"/>',
  "flash-fill": '<path d="M13 3L5 14h5l-1 7 8-11h-5z"/>',
  "remove-duplicates":
    '<rect x="4" y="4" width="10" height="10" rx="1"/><rect x="10" y="10" width="10" height="10" rx="1"/><path d="M12 5l2 2M15 8l2 2" opacity="0.6"/>',
  validation: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12l3 3 5-6"/>',
  consolidate:
    '<rect x="4" y="5" width="6" height="6"/><rect x="14" y="5" width="6" height="6"/><rect x="9" y="14" width="6" height="6"/><path d="M7 11v2h10v-2"/>',
  group: '<path d="M4 6h16M4 12h10M4 18h10"/><path d="M18 15v6M15 18h6"/>',
  ungroup: '<path d="M4 6h16M4 12h10M4 18h10"/><path d="M18 15v6" opacity="0.5"/>',
  subtotal: '<path d="M4 6h16M6 12h12M8 18h8"/>',
  relationships:
    '<circle cx="7" cy="8" r="2.5"/><circle cx="17" cy="8" r="2.5"/><circle cx="12" cy="17" r="2.5"/><path d="M9 9.5l2 5M15 9.5l-2 5"/>',
  spell: '<path d="M4 18L10 5l6 13M6.4 13h7.2"/><path d="M17 8l3 8M18 13h4"/>',
  thesaurus:
    '<path d="M5 4h6a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3z"/><path d="M19 4h-3a3 3 0 0 0-3 3v13h4a3 3 0 0 1 3 3z" opacity="0.5"/>',
  "new-comment": '<path d="M4 5h16v12H9l-5 4z"/><path d="M12 8v6M9 11h6"/>',
  "delete-comment": '<path d="M4 5h16v12H9l-5 4z"/><path d="M9 8l6 6M15 8l-6 6"/>',
  "prev-comment": '<path d="M4 5h16v12H9l-5 4z"/><path d="M14 8l-3 3 3 3"/>',
  "next-comment": '<path d="M4 5h16v12H9l-5 4z"/><path d="M10 8l3 3-3 3"/>',
  protect: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  unlock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 7-2.5"/>',
  normal: '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 9h16"/>',
  "page-break": '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 14h16" stroke-dasharray="3 2"/>',
  "page-layout": '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M8 7h8M8 11h8M8 15h5"/>',
  ruler: '<rect x="3" y="8" width="18" height="8" rx="1"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/>',
  grid: '<rect x="4" y="4" width="16" height="16"/><path d="M4 9h16M4 14h16M9 4v16M14 4v16"/>',
  "formula-bar": '<rect x="3" y="6" width="18" height="5" rx="1"/><path d="M3 15h8M14 15h7M3 19h12"/>',
  headings: '<path d="M5 6h8M5 12h8M5 18h8"/><path d="M17 5v14M15 19h4"/>',
  zoom: '<circle cx="11" cy="11" r="6"/><path d="M15.5 15.5L20 20M8 11h6M11 8v6M18 4l2 2"/>',
  "new-window": '<rect x="3" y="5" width="12" height="10" rx="1"/><rect x="9" y="9" width="12" height="10" rx="1"/>',
  arrange:
    '<rect x="3" y="4" width="8" height="7" rx="1"/><rect x="13" y="4" width="8" height="7" rx="1"/><rect x="3" y="13" width="18" height="7" rx="1"/>',
  freeze: '<rect x="4" y="4" width="16" height="16"/><path d="M4 10h16M10 4v16" stroke-dasharray="3 2"/>',
  split: '<rect x="4" y="4" width="16" height="16"/><path d="M12 4v16M4 12h16" stroke-dasharray="3 2"/>',
  hide: '<path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"/><circle cx="12" cy="12" r="2.5"/><path d="M4 20L20 4"/>',
  record: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>',
  macros: '<rect x="4" y="5" width="16" height="14" rx="1"/><path d="M8 9h8M8 13h5M8 17h7"/>',
  script: '<path d="M8 5L4 12l4 7M16 5l4 7-4 7M13 4l-2 16"/>',
  run: '<path d="M7 4l13 8-13 8z"/>',
  ai: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M18 16l.9 2.6 2.6.9-2.6.9L18 23l-.9-2.6-2.6-.9 2.6-.9z"/>',
  mcp: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/><path d="M11 8h4a2 2 0 0 1 2 2v3"/>',
  "table-design": '<rect x="4" y="5" width="16" height="14" rx="1"/><path d="M4 10h16M4 15h16M9 5v14"/>',
  "chart-design":
    '<path d="M4 20V4M4 20h16"/><rect x="7" y="11" width="3" height="6" fill="currentColor" stroke="none"/><rect x="12" y="7" width="3" height="10" fill="currentColor" stroke="none"/><rect x="17" y="4" width="3" height="13" fill="currentColor" stroke="none"/>',
  switch: '<path d="M4 8h13M14 5l3 3-3 3M20 16H7M10 13l-3 3 3 3"/>',
  "add-element":
    '<path d="M4 20V4M4 20h16"/><rect x="7" y="12" width="3" height="5" fill="currentColor" stroke="none"/><rect x="12" y="8" width="3" height="9" fill="currentColor" stroke="none"/><path d="M17 4v6M14 7h6"/>',
  "format-pane": '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M14 4v16"/>',
  "chart-title": '<path d="M4 6h16M9 6v13M15 6v13"/>',
  "delete-chart":
    '<path d="M4 20V4M4 20h16"/><rect x="7" y="12" width="3" height="5" stroke-dasharray="2 2"/><rect x="12" y="8" width="3" height="9" stroke-dasharray="2 2"/><path d="M18 3l4 4M22 3l-4 4"/>',
  resize: '<path d="M4 9V4h5M20 15v5h-5M4 4l6 6M20 20l-6-6"/>',
  calculator:
    '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M12 12h2M16 12h1M8 16h2M12 16h2M16 16h1"/>',
  refresh: '<path d="M20 5v5h-5M4 19v-5h5"/><path d="M19 10a7 7 0 0 0-12-4L5 9M5 14a7 7 0 0 0 12 4l2-3"/>',
  "field-list": '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 9h16M8 13h8M8 17h5"/>',
  slicer: '<rect x="4" y="4" width="7" height="16" rx="1"/><rect x="14" y="4" width="6" height="7" rx="1"/>',
  totals: '<path d="M5 6h14M8 12h8M10 18h4"/>',
  layout: '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 10h16M10 10v10"/>',
  eye: '<path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"/><circle cx="12" cy="12" r="2.5"/>',
  "eye-off": '<path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"/><path d="M4 20L20 4"/>',
  warning: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',
  palette:
    '<path d="M12 4a8 8 0 0 0 0 16c1.5 0 2-1 1.5-2s0-2 1.5-2H18a3 3 0 0 0 3-3 9 9 0 0 0-9-9z"/><circle cx="8" cy="10" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="7.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="16" cy="9.5" r="1.2" fill="currentColor" stroke="none"/>',
  settings:
    '<circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>',
  keyboard: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.5M11 10h.5M15 10h.5M7 14h10"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
  download: '<path d="M12 4v10M8 10l4 4 4-4M5 19h14"/>',
  print: '<path d="M7 8V4h10v4"/><rect x="4" y="8" width="16" height="8" rx="1"/><path d="M7 13h10v7H7z"/>',
  copy2: '<rect x="9" y="9" width="10" height="11" rx="1"/><path d="M5 15V5h10"/>',
  "arrow-up": '<path d="M12 20V5M6 11l6-6 6 6"/>',
  "arrow-down": '<path d="M12 4v15M6 13l6 6 6-6"/>',
  "arrow-right": '<path d="M4 12h15M13 6l6 6-6 6"/>',
  dot: '<circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>'
};

export type IconName = string;

export function icon(name: IconName, size = 16, className = ""): string {
  const inner = ICONS[name] ?? ICONS.more;
  return `<svg class="gc-icon${
    className ? ` ${className}` : ""
  }" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

export function hasIcon(name: string): boolean {
  return name in ICONS;
}
